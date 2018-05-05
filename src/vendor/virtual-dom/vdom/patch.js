/* globals document */
/* eslint no-param-reassign: "off" */
define([
  '../../x-is-array/index.js',
  './create-element.js',
  './dom-index.js',
  './patch-op.js',
], (
  isArray,
  render,
  domIndex,
  patchOp,
) => {
  function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
      return rootNode;
    }

    let newNode;

    if (isArray(patchList)) {
      for (let i = 0; i < patchList.length; i += 1) {
        newNode = patchOp(patchList[i], domNode, renderOptions);

        if (domNode === rootNode) {
          rootNode = newNode;
        }
      }
    } else {
      newNode = patchOp(patchList, domNode, renderOptions);

      if (domNode === rootNode) {
        rootNode = newNode;
      }
    }

    return rootNode;
  }

  function patchIndices(patches) {
    const indices = [];

    for (const key in patches) {
      if (key !== 'a') {
        indices.push(Number(key));
      }
    }

    return indices;
  }

  function patchRecursive(rootNode, patches, renderOptions) {
    const indices = patchIndices(patches);

    if (indices.length === 0) {
      return rootNode;
    }

    const index = domIndex(rootNode, patches.a, indices);
    const { ownerDocument } = rootNode;

    if (!renderOptions.document && ownerDocument !== document) {
      renderOptions.document = ownerDocument;
    }

    for (let i = 0; i < indices.length; i += 1) {
      const nodeIndex = indices[i];
      rootNode = applyPatch(
        rootNode,
        index[nodeIndex],
        patches[nodeIndex],
        renderOptions,
      );
    }

    return rootNode;
  }

  function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {};
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
      ? renderOptions.patch
      : patchRecursive;
    renderOptions.render = renderOptions.render || render;

    return renderOptions.patch(rootNode, patches, renderOptions);
  }

  return patch;
});
