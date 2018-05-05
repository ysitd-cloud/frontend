define(['../vnode/is-widget.js'], (isWidget) => {
  function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
      if ('name' in a && 'name' in b) {
        return a.id === b.id;
      }
      return a.init === b.init;
    }

    return false;
  }

  return updateWidget;
});
