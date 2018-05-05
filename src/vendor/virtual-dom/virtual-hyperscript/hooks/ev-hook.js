define(() => {
  function EvHook(event, handler) {
    if (!(this instanceof EvHook)) {
      return new EvHook(event, handler);
    }

    this.event = event;
    this.handler = handler;
  }

  EvHook.prototype.hook = function (node) {
    node.addEventListener(this.event, this.handler);
  };

  EvHook.prototype.unhook = function (node) {
    node.removeListener(this.event, this.handler);
  };

  return EvHook;
});
