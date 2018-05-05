// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.
define(() => {
  const noChild = {};

  // Binary search for an index in the interval [left, right]
  function indexInRange(indices, left, right) {
    if (indices.length === 0) {
      return false;
    }

    let minIndex = 0;
    let maxIndex = indices.length - 1;
    let currentIndex;
    let currentItem;

    while (minIndex <= maxIndex) {
      // eslint-disable-next-line no-bitwise
      currentIndex = ((maxIndex + minIndex) / 2) >> 0;
      currentItem = indices[currentIndex];

      if (minIndex === maxIndex) {
        return currentItem >= left && currentItem <= right;
      } else if (currentItem < left) {
        minIndex = currentIndex + 1;
      } else if (currentItem > right) {
        maxIndex = currentIndex - 1;
      } else {
        return true;
      }
    }

    return false;
  }

  function recurse(rootNode, tree, indices, nodes, rootIndex) {
    // eslint-disable-next-line no-param-reassign
    nodes = nodes || {};


    if (rootNode) {
      if (indexInRange(indices, rootIndex, rootIndex)) {
        nodes[rootIndex] = rootNode;
      }

      const vChildren = tree.children;

      if (vChildren) {
        const { childNodes } = rootNode;

        for (let i = 0; i < tree.children.length; i += 1) {
          // eslint-disable-next-line no-param-reassign
          rootIndex += 1;

          const vChild = vChildren[i] || noChild;
          const nextIndex = rootIndex + (vChild.count || 0);

          // skip recursion down the tree if there are no nodes down here
          if (indexInRange(indices, rootIndex, nextIndex)) {
            recurse(childNodes[i], vChild, indices, nodes, rootIndex);
          }

          // eslint-disable-next-line no-param-reassign
          rootIndex = nextIndex;
        }
      }
    }

    return nodes;
  }

  function ascending(a, b) {
    return a > b ? 1 : -1;
  }

  function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
      return {};
    }

    indices.sort(ascending);
    return recurse(rootNode, tree, indices, nodes, 0);
  }


  return domIndex;
});
