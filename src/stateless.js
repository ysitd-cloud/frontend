define([
  './vendor/virtual-dom/index.js',
  './vendor/virtual-dom/vnode/vtext.js',
  './attribute.js',
  './global.css',
], (VirtualDom, VText, convertAttributes) => {
  const { h } = VirtualDom;

  class StatelessElement extends HTMLElement {
    constructor() {
      super();
      this.renderChildren = null;
      this.props = convertAttributes(this.attributes);
      this.rootNode = null;
      this.tree = null;
      this.cloneChildren();
      this.invokeLifeCycleHook('created');
    }

    cloneChildren() {
      if (this.renderChildren === null) {
        this.renderChildren = Array.from(this.childNodes).map(node => node.cloneNode(true));
        console.debug(this, this.childNodes, this.renderChildren);
      }
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
      this.cloneChildren();
      const tree = this.render(h, h('slot'));
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
        this.rootNode = trees.map(tree => VirtualDom.create(typeof tree === 'string' ? new VText(tree) : tree));
        this.rootNode.forEach(node => node && this.appendChild(node));
      }
      this.tree = trees;
    }
  }

  return StatelessElement;
});
