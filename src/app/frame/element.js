define(['../../wrap.js', './style.css'], (WrappedElement) => {
  class AppFrame extends WrappedElement {
    static get is() {
      return 'app-frame';
    }

    static get observedAttributes() {
      return [];
    }
  }

  customElements.define(AppFrame.is, AppFrame);
});
