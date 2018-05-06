define(['../../stateless.js', './style.css'], (StatelessElement) => {
  class AppFrame extends StatelessElement {
    static get is() {
      return 'app-frame';
    }

    static get observedAttributes() {
      return [
        'type',
      ];
    }

    render(h, children) {
      return h('div', {
        class: 'app-frame style-scope',
      }, children);
    }
  }

  customElements.define(AppFrame.is, AppFrame);
});
