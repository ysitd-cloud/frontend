define([
  './apply-properties.js',
  '../vnode/is-vnode.js',
  '../vnode/is-vtext.js',
  '../vnode/is-widget.js',
  '../vnode/handle-thunk.js',
], (applyProperties, isVNode, isVText, isWidget, handleThunk) => {
  function createElement(vnode, opts) {
    const doc = opts ? opts.document || document : document;
    const warn = opts ? opts.warn : null;

    // eslint-disable-next-line no-param-reassign
    vnode = handleThunk(vnode).a;

    if (isWidget(vnode)) {
      return vnode.init();
    } else if (isVText(vnode)) {
      return doc.createTextNode(vnode.text);
    } else if (!isVNode(vnode)) {
      if (warn) {
        warn('Item is not a valid virtual dom node', vnode);
      }
      return null;
    }

    const node = (vnode.namespace === null) ?
      doc.createElement(vnode.tagName) :
      doc.createElementNS(vnode.namespace, vnode.tagName);

    const props = vnode.properties;
    applyProperties(node, props);

    const { children } = vnode;

    for (let i = 0; i < children.length; i += 1) {
      const childNode = createElement(children[i], opts);
      if (childNode) {
        node.appendChild(childNode);
      }
    }

    return node;
  }

  return createElement;
});
