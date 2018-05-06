define(['../../stateless.js', './style.css'], (StatelessElement) => {
  class ComponentToolbarTitle extends StatelessElement {
    static get is() {
      return 'component-toolbar-title';
    }

    static get observedAttributes() {
      return [];
    }

    render(h, children) {
      return children;
    }
  }

  class ComponentToolbar extends StatelessElement {
    static get is() {
      return 'component-toolbar';
    }

    static get observedAttributes() {
      return [];
    }

    render(h, children) {
      return h(
        'div',
        {
          'data-role': 'content',
        },
        children,
      );
    }
  }

  customElements.define(ComponentToolbar.is, ComponentToolbar);
  customElements.define(ComponentToolbarTitle.is, ComponentToolbarTitle);
});
