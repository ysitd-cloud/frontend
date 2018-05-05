define(['./vendor/virtual-dom/index.js'], (VirtualDom) => {
  const { h } = VirtualDom;

  class VirtualElement extends HTMLElement {
    constructor() {
      super();
      this.rootNode = null;
      this.tree = null;
      this.cloneChildren();
      this.invokeLifeCycleHook('created');
      console.debug('construct');
    }

    cloneChildren() {
      this.renderChildren = Array.from(this.childNodes).map((node) => {
        if (node instanceof Text) {
          return node.wholeText;
        }
        return node.cloneNode();
      });
    }

    connectedCallback() {
      console.debug('connectedCallback');
      this.invokeLifeCycleHook('beforeMount');
      this.mountNode();
      this.invokeLifeCycleHook('mounted');
    }

    attributeChangedCallback() {
      console.debug('attributeChangedCallback');
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
      console.debug('mountNode');
      const tree = this.render(h, this.renderChildren);
      console.debug(tree);
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
