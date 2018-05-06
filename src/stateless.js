define(['./vendor/virtual-dom/index.js', './global.css'], (VirtualDom) => {
  const { h } = VirtualDom;

  function convertAttributes(attributes) {
    return Array.from(attributes).reduce((props, attr) => {
      props[attr.name] = attr.value;
      return props;
    }, {});
  }

  function cloneChildren(ele) {
    return Array.from(ele.childNodes).map((node) => {
      if (node instanceof Text) {
        return node.wholeText;
        // eslint-disable-next-line no-use-before-define
      } else if (node instanceof StatelessElement) {
        return node.tree;
      }

      const attributes = convertAttributes(node.attributes);

      return h(node.tagName, attributes, cloneChildren(node));
    });
  }

  class StatelessElement extends HTMLElement {
    constructor() {
      super();
      this.props = convertAttributes(this.attributes);
      this.rootNode = null;
      this.tree = null;
      this.cloneChildren();
      this.invokeLifeCycleHook('created');
    }

    cloneChildren() {
      this.renderChildren = cloneChildren(this);
    }

    connectedCallback() {
      this.invokeLifeCycleHook('beforeMount');
      this.mountNode();
      this.invokeLifeCycleHook('mounted');
    }

    attributeChangedCallback(name, _, value) {
      this.props[name] = value;
      this.updateElement();
    }

    updateElement() {
      this.invokeLifeCycleHook('beforeUpdate');
      this.mountNode();
      this.invokeLifeCycleHook('updated');
    }

    disconnectedCallback() {
      this.invokeLifeCycleHook('beforeDestroyed');
      this.invokeLifeCycleHook('destroyed');
    }

    invokeLifeCycleHook(name) {
      if (name in this && typeof this[name] === 'function') {
        this[name].call(this);
      }
    }

    mountNode() {
      const tree = this.render(h, this.renderChildren);
      if (Array.isArray(tree)) {
        this.mountMultiNode(tree);
      } else {
        this.mountSingleNode(tree);
      }
    }

    mountSingleNode(tree) {
      if (this.rootNode) {
        const patches = VirtualDom.diff(this.tree, tree);
        this.rootNode = VirtualDom.patch(this.rootNode, patches);
      } else {
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }
        this.rootNode = VirtualDom.create(tree);
        this.appendChild(this.rootNode);
      }
      this.tree = tree;
    }

    mountMultiNode(trees) {
      if (this.rootNode) {
        const patches = trees.map((tree, idx) => VirtualDom.diff(this.tree[idx], tree));
        this.rootNode = patches.map((patch, idx) => VirtualDom.patch(this.rootNode[idx], patch));
      } else {
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }
        this.rootNode = trees.map(tree => VirtualDom.create(tree));
        this.rootNode.forEach(node => this.appendChild(node));
      }
      this.tree = trees;
    }
  }

  return StatelessElement;
});
