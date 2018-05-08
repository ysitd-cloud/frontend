/* globals customElements */

define(['vue'], (Vue) => {
  class LoginView extends HTMLElement {
    static get observedAttributes() {
      return ['error', 'next'];
    }

    static get is() {
      return 'login-view';
    }

    constructor() {
      super();
      this.vm = new Vue({
        render: h => h('p'),
        data: {
          error: null,
          next: '/',
        },
      });
    }

    connectedCallback() {
      const child = document.createElement('div');
      this.appendChild(child);
      this.vm.$mount(child);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let val = newValue;
      if (newValue === null) {
        val = false;
      } else if (newValue === '' && oldValue === null) {
        val = true;
      }
      console.debug('vm.$set', name, val);
      Vue.set(this.vm, name, val);
    }

    disconnectedCallback() {
      this.vm.$destroy();
    }
  }

  customElements.define(LoginView.is, LoginView);
});
