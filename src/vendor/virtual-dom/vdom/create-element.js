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

    const childNodes = children
      .map(child => createElement(child, opts))
      .filter(ele => !!ele);
    const slot = childNodes
      .find(child => child instanceof HTMLSlotElement || (child instanceof HTMLElement && child.querySelector('slot')));
    debugger;
    if (vnode.tagName.indexOf('-') !== -1 && slot) {
      const slotHolder = slot.parentNode;
      childNodes.forEach(childNode => slotHolder.insertBefore(childNode, slot));
      slotHolder.removeChild(slot);
    } else {
      childNodes.forEach(childNode => node.appendChild(childNode));
    }

    return node;
  }

  return createElement;
});
