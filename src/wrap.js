define(() => {
  class WrapperElement extends HTMLElement {
    static get observedAttributes() {
      return [];
    }

    render(h, children) {
      return children;
    }
  }

  return WrapperElement;
});
