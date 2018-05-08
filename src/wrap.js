define(() => {
  class WrapperElement extends HTMLElement {
    static get observedAttributes() {
      return [];
    }
  }

  return WrapperElement;
});
