define((require, exports, module) => {
  const isVNode = require('./is-vnode.js');
  const isVText = require('./is-vtext.js');
  const isWidget = require('./is-widget.js');
  const isThunk = require('./is-thunk.js');

  function renderThunk(thunk, previous) {
    let renderedThunk = thunk.vnode;

    if (!renderedThunk) {
      thunk.vnode = thunk.render(previous);
      renderedThunk = thunk.vnode;
    }

    if (!(isVNode(renderedThunk) ||
      isVText(renderedThunk) ||
      isWidget(renderedThunk))) {
      throw new Error('thunk did not return a valid node');
    }

    return renderedThunk;
  }


  function handleThunk(a, b) {
    let renderedA = a;
    let renderedB = b;

    if (isThunk(b)) {
      renderedB = renderThunk(b, a);
    }

    if (isThunk(a)) {
      renderedA = renderThunk(a, null);
    }

    return {
      a: renderedA,
      b: renderedB,
    };
  }

  module.exports = handleThunk;
});
