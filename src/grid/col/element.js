define(['../../wrap.js', './style.css'], (WrapperElement) => {
  class GridCol extends WrapperElement {
    static get is() {
      return 'grid-col';
    }
  }

  customElements.define(GridCol.is, GridCol);
});
