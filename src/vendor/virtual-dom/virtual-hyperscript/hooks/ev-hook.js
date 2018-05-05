define(['../../../ev-store/index.js'], (EvStore) => {
  function EvHook(value) {
    if (!(this instanceof EvHook)) {
      return new EvHook(value);
    }

    this.value = value;
  }

  EvHook.prototype.hook = function (node, propertyName) {
    const es = EvStore(node);
    const propName = propertyName.substr(3);

    es[propName] = this.value;
  };

  EvHook.prototype.unhook = function (node, propertyName) {
    const es = EvStore(node);
    const propName = propertyName.substr(3);

    es[propName] = undefined;
  };

  return EvHook;
});
