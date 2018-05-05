define(
  [
    './apply-properties.js',
    '../vnode/is-widget.js',
    '../vnode/vpatch.js',
    './update-widget.js',
  ],
  (applyProperties, isWidget, VPatch, updateWidget) => {
    function destroyWidget(domNode, w) {
      if (typeof w.destroy === 'function' && isWidget(w)) {
        w.destroy(domNode);
      }
    }

    function removeNode(domNode, vNode) {
      const { parentNode } = domNode;

      if (parentNode) {
        parentNode.removeChild(domNode);
      }

      destroyWidget(domNode, vNode);

      return null;
    }

    function insertNode(parentNode, vNode, renderOptions) {
      const newNode = renderOptions.render(vNode, renderOptions);

      if (parentNode) {
        parentNode.appendChild(newNode);
      }

      return parentNode;
    }

    function stringPatch(domNode, leftVNode, vText, renderOptions) {
      let newNode;

      if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text);
        newNode = domNode;
      } else {
        const { parentNode } = domNode;
        newNode = renderOptions.render(vText, renderOptions);

        if (parentNode && newNode !== domNode) {
          parentNode.replaceChild(newNode, domNode);
        }
      }

      return newNode;
    }

    function widgetPatch(domNode, leftVNode, widget, renderOptions) {
      const updating = updateWidget(leftVNode, widget);
      let newNode;

      if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode;
      } else {
        newNode = renderOptions.render(widget, renderOptions);
      }

      const { parentNode } = domNode;

      if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
      }

      if (!updating) {
        destroyWidget(domNode, leftVNode);
      }

      return newNode;
    }

    function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
      const { parentNode } = domNode;
      const newNode = renderOptions.render(vNode, renderOptions);

      if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
      }

      return newNode;
    }

    function reorderChildren(domNode, moves) {
      const { childNodes } = domNode;
      const keyMap = {};
      let node;
      let remove;
      let insert;

      for (let i = 0; i < moves.removes.length; i += 1) {
        remove = moves.removes[i];
        node = childNodes[remove.from];
        if (remove.key) {
          keyMap[remove.key] = node;
        }
        domNode.removeChild(node);
      }

      let { length } = childNodes;
      for (let j = 0; j < moves.inserts.length; j += 1) {
        insert = moves.inserts[j];
        node = keyMap[insert.key];
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length ? null : childNodes[insert.to]);
        length += 1;
      }
    }

    function replaceRoot(oldRoot, newRoot) {
      if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
      }

      return newRoot;
    }

    function applyPatch({ type, vNode, patch }, domNode, renderOptions) {
      switch (type) {
        case VPatch.REMOVE:
          return removeNode(domNode, vNode);
        case VPatch.INSERT:
          return insertNode(domNode, patch, renderOptions);
        case VPatch.VTEXT:
          return stringPatch(domNode, vNode, patch, renderOptions);
        case VPatch.WIDGET:
          return widgetPatch(domNode, vNode, patch, renderOptions);
        case VPatch.VNODE:
          return vNodePatch(domNode, vNode, patch, renderOptions);
        case VPatch.ORDER:
          reorderChildren(domNode, patch);
          return domNode;
        case VPatch.PROPS:
          applyProperties(domNode, patch, vNode.properties);
          return domNode;
        case VPatch.THUNK:
          return replaceRoot(
            domNode,
            renderOptions.patch(domNode, patch, renderOptions),
          );
        default:
          return domNode;
      }
    }

    return applyPatch;
  },
);