define(['../../element.js', './style.css'], (VirtualElement) => {
  class ComponentBtn extends VirtualElement {
    static get is() {
      return 'component-btn';
    }

    static get observedAttributes() {
      return [
        'type',
      ];
    }

    render(h, children) {
      return h(
        'button',
        {
          type: this.hasAttribute('type') ? this.getAttribute('type') : 'button',
          'data-test': 'foo',
        },
        h('div', {
          'data-role': 'content',
        }, children),
      );
    }
  }

  customElements.define(ComponentBtn.is, ComponentBtn);
});
