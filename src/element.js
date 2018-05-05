define(['./vendor/virtual-dom/index.js'], (VirtualDom) => {
  const { h } = VirtualDom;

  function cloneChildren(ele) {
    return Array.from(ele.childNodes).map((node) => {
      if (node instanceof Text) {
        return node.wholeText;
        // eslint-disable-next-line no-use-before-define
      } else if (node instanceof VirtualElement) {
        return node.tree;
      }

      const attributes = {};

      if (node.hasAttributes()) {
        Array.from(node.attributes).forEach((attr) => {
          attributes[attr.name] = attr.value;
        });
      }

      return h(node.tagName, attributes, cloneChildren(node));
    });
  }

  class VirtualElement extends HTMLElement {
    constructor() {
      super();
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

    attributeChangedCallback() {
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
  }

  return VirtualElement;
});
