define(['../../wrap.js', './style.css'], (WrapperElement) => {
  class GridContainer extends WrapperElement {
    static get is() {
      return 'grid-container';
    }
  }

  customElements.define(GridContainer.is, GridContainer);
});
