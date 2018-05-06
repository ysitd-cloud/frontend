define(['../../stateless.js', '../../wrap.js', './style.css'], (StatelessElement, WrapperElement) => {
  class ComponentToolbarTitle extends WrapperElement {
    static get is() {
      return 'component-toolbar-title';
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

  customElements.define(ComponentToolbarTitle.is, ComponentToolbarTitle, { extends: 'div' });
  customElements.define(ComponentToolbar.is, ComponentToolbar);
});
