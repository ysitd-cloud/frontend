define(['../../wrap.js', './style.css'], (WrapperElement) => {
  class ComponentContainer extends WrapperElement {
    static get is() {
      return 'component-container';
    }
  }

  customElements.define(ComponentContainer.is, ComponentContainer);
});
