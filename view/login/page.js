define(["vue","./element.js","../../bootstrap.js"],(e,t)=>{class n extends HTMLElement{static get observedAttributes(){return["error","next"]}static get is(){return"login-view"}constructor(){super(),this.vm=new e({render(e){return e(t,{props:{error:this.error,next:this.next}})},data:{error:null,next:"/"}})}connectedCallback(){const e=document.createElement("div");this.appendChild(e),this.vm.$mount(e)}attributeChangedCallback(t,n,r){let s=r;null===r?s=!1:""===r&&null===n&&(s=!0),console.debug("vm.$set",t,s),e.set(this.vm,t,s)}disconnectedCallback(){this.vm.$destroy()}}customElements.define(n.is,n)});
//# sourceMappingURL=page.js.map