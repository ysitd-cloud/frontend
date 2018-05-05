define((require, exports, module) => {
  function isWidget(w) {
    return w && w.type === 'Widget';
  }

  module.exports = isWidget;
});
