define([
  './is-vnode.js',
  './is-vtext.js',
  './is-widget.js',
  './is-thunk.js',
], (isVNode, isVText, isWidget, isThunk) => {
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

  return handleThunk;
});
