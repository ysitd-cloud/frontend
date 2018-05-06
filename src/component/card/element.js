define(['../../wrap.js', './style.css'], (WrapperElement) => {
  class ComponentCard extends WrapperElement {
    static get is() {
      return 'component-card';
    }
  }

  class ComponentCardText extends WrapperElement {
    static get is() {
      return 'component-card-text';
    }
  }

  class ComponentCardAction extends WrapperElement {
    static get is() {
      return 'component-card-action';
    }
  }

  customElements.define(ComponentCardText.is, ComponentCardText);
  customElements.define(ComponentCardAction.is, ComponentCardAction);

  customElements.define(ComponentCard.is, ComponentCard);
});
