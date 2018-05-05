define(['./stateless.js'], (StatelessElement) => {
  class StatefulElement extends StatelessElement {
    constructor() {
      super();
      this.state = {};
    }

    setState(newState) {
      this.state = Object.assign(this.state, newState);
      this.updateElement();
    }
  }

  return StatefulElement;
});
