define(['../../wrap.js', './style.css'], (WrapperElement) => {
  class ComponentCol extends WrapperElement {
    static get is() {
      return 'component-col';
    }
  }

  customElements.define(ComponentCol.is, ComponentCol);
});
