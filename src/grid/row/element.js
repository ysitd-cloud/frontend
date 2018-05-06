define(['../../wrap.js', './style.css'], (WrapperElement) => {
  class GridRow extends WrapperElement {
    static get is() {
      return 'grid-row';
    }
  }

  customElements.define(GridRow.is, GridRow);
});
