define((require, exports, module) => {
  const isWidget = require('../vnode/is-widget.js');

  function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
      if ('name' in a && 'name' in b) {
        return a.id === b.id;
      }
      return a.init === b.init;
    }

    return false;
  }

  module.exports = updateWidget;
});
