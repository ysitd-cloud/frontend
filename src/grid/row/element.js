define(['../../wrap.js', './style.css'], (WrapperElement) => {
  class ComponentRow extends WrapperElement {
    static get is() {
      return 'component-row';
    }
  }

  customElements.define(ComponentRow.is, ComponentRow);
});
