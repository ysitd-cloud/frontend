/* eslint no-use-before-define: "off" */

define([
  '../../x-is-array/index.js',
  '../vnode/vpatch.js',
  '../vnode/is-vnode.js',
  '../vnode/is-vtext.js',
  '../vnode/is-widget.js',
  '../vnode/is-thunk.js',
  '../vnode/handle-thunk.js',
  './diff-props.js',
], (
  isArray,
  VPatch,
  isVNode,
  isVText,
  isWidget,
  isThunk,
  handleThunk,
  diffProps,
) => {
  function diff(a, b) {
    const patch = { a };
    walk(a, b, patch, 0);
    return patch;
  }

  function walk(a, b, patch, index) {
    if (a === b) {
      return;
    }

    let apply = patch[index];
    let applyClear = false;

    if (isThunk(a) || isThunk(b)) {
      thunks(a, b, patch, index);
    } else if (b == null) {
      // If a is a widget we will add a remove patch for it
      // Otherwise any child widgets/hooks must be destroyed.
      // This prevents adding two remove patches for a widget.
      if (!isWidget(a)) {
        clearState(a, patch, index);
        apply = patch[index];
      }

      apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b));
    } else if (isVNode(b)) {
      if (isVNode(a)) {
        if (a.tagName === b.tagName &&
          a.namespace === b.namespace &&
          a.key === b.key) {
          const propsPatch = diffProps(a.properties, b.properties);
          if (propsPatch) {
            apply = appendPatch(
              apply,
              new VPatch(VPatch.PROPS, a, propsPatch),
            );
          }
          apply = diffChildren(a, b, patch, apply, index);
        } else {
          apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
          applyClear = true;
        }
      } else {
        apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
        applyClear = true;
      }
    } else if (isVText(b)) {
      if (!isVText(a)) {
        apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
        applyClear = true;
      } else if (a.text !== b.text) {
        apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
      }
    } else if (isWidget(b)) {
      if (!isWidget(a)) {
        applyClear = true;
      }

      apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b));
    }

    if (apply) {
      patch[index] = apply;
    }

    if (applyClear) {
      clearState(a, patch, index);
    }
  }

  function appendPatch(apply, patch) {
    if (apply) {
      if (isArray(apply)) {
        apply.push(patch);
      } else {
        return [apply, patch];
      }

      return apply;
    }
    return patch;
  }

  function diffChildren(a, b, patch, apply, index) {
    const aChildren = a.children;
    const orderedSet = reorder(aChildren, b.children);
    const bChildren = orderedSet.children;

    const aLen = aChildren.length;
    const bLen = bChildren.length;
    const len = aLen > bLen ? aLen : bLen;

    for (let i = 0; i < len; i += 1) {
      const leftNode = aChildren[i];
      const rightNode = bChildren[i];
      // eslint-disable-next-line no-param-reassign
      index += 1;

      if (!leftNode) {
        if (rightNode) {
          // Excess nodes in b need to be added
          // eslint-disable-next-line no-param-reassign
          apply = appendPatch(
            apply,
            new VPatch(VPatch.INSERT, null, rightNode),
          );
        }
      } else {
        walk(leftNode, rightNode, patch, index);
      }

      if (isVNode(leftNode) && leftNode.count) {
        // eslint-disable-next-line no-param-reassign
        index += leftNode.count;
      }
    }

    if (orderedSet.moves) {
      // Reorder nodes last
      // eslint-disable-next-line no-param-reassign
      apply = appendPatch(apply, new VPatch(
        VPatch.ORDER,
        a,
        orderedSet.moves,
      ));
    }

    return apply;
  }

  function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index);
    destroyWidgets(vNode, patch, index);
  }

  function hasPatches(patch) {
    for (const index in patch) {
      if (index !== 'a') {
        return true;
      }
    }

    return false;
  }

  // Create a sub-patch for thunks
  function thunks(a, b, patch, index) {
    const nodes = handleThunk(a, b);
    const thunkPatch = diff(nodes.a, nodes.b);
    if (hasPatches(thunkPatch)) {
      patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch);
    }
  }


  // Patch records for all destroyed widgets must be added because we need
  // a DOM node reference for the destroy function
  function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
      if (typeof vNode.destroy === 'function') {
        patch[index] = appendPatch(
          patch[index],
          new VPatch(VPatch.REMOVE, vNode, null),
        );
      }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
      const { children } = vNode;
      const len = children.length;
      for (let i = 0; i < len; i += 1) {
        const child = children[i];
        // eslint-disable-next-line no-param-reassign
        index += 1;

        destroyWidgets(child, patch, index);

        if (isVNode(child) && child.count) {
          // eslint-disable-next-line no-param-reassign
          index += child.count;
        }
      }
    } else if (isThunk(vNode)) {
      thunks(vNode, null, patch, index);
    }
  }

  function undefinedKeys(obj) {
    const result = {};

    for (const key in obj) {
      result[key] = undefined;
    }

    return result;
  }

  // Execute hooks when two nodes are identical
  function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
      if (vNode.hooks) {
        patch[index] = appendPatch(
          patch[index],
          new VPatch(
            VPatch.PROPS,
            vNode,
            undefinedKeys(vNode.hooks),
          ),
        );
      }

      if (vNode.descendantHooks || vNode.hasThunks) {
        const { children } = vNode.children;
        const len = children.length;
        for (let i = 0; i < len; i += 1) {
          const child = children[i];
          // eslint-disable-next-line no-param-reassign
          index += 1;

          unhook(child, patch, index);

          if (isVNode(child) && child.count) {
            // eslint-disable-next-line no-param-reassign
            index += child.count;
          }
        }
      }
    } else if (isThunk(vNode)) {
      thunks(vNode, null, patch, index);
    }
  }

  function keyIndex(children) {
    const keys = {};
    const free = [];
    const { length } = children;

    for (let i = 0; i < length; i += 1) {
      const child = children[i];

      if (child.key) {
        keys[child.key] = i;
      } else {
        free.push(i);
      }
    }

    return {
      keys, // A hash of key name to index
      free, // An array of unkeyed item indices
    };
  }

  function remove(arr, index, key) {
    arr.splice(index, 1);

    return {
      from: index,
      key,
    };
  }

  // List diff, naive left to right reordering
  function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    const bChildIndex = keyIndex(bChildren);
    const bKeys = bChildIndex.keys;
    const bFree = bChildIndex.free;

    if (bFree.length === bChildren.length) {
      return {
        children: bChildren,
        moves: null,
      };
    }

    // O(N) time, O(N) memory
    const aChildIndex = keyIndex(aChildren);
    const aKeys = aChildIndex.keys;
    const aFree = aChildIndex.free;

    if (aFree.length === aChildren.length) {
      return {
        children: bChildren,
        moves: null,
      };
    }

    // O(MAX(N, M)) memory
    const newChildren = [];

    let freeIndex = 0;
    const freeCount = bFree.length;
    let deletedItems = 0;

    // Iterate through a and match a node in b
    // O(N) time,
    for (let i = 0; i < aChildren.length; i += 1) {
      const aItem = aChildren[i];
      let itemIndex;

      if (aItem.key) {
        // eslint-disable-next-line no-prototype-builtins
        if (bKeys.hasOwnProperty(aItem.key)) {
          // Match up the old keys
          itemIndex = bKeys[aItem.key];
          newChildren.push(bChildren[itemIndex]);
        } else {
          // Remove old keyed items
          itemIndex = i - deletedItems;
          deletedItems += 1;
          newChildren.push(null);
        }
      } else if (freeIndex < freeCount) {
        // Match the item in a with the next free item in b
        itemIndex = bFree[freeIndex];
        freeIndex += 1;
        newChildren.push(bChildren[itemIndex]);
      } else {
        // There are no free items in b to match with
        // the free items in a, so the extra free nodes
        // are deleted.
        itemIndex = i - deletedItems;
        deletedItems += 1;
        newChildren.push(null);
      }
    }

    const lastFreeIndex = freeIndex >= bFree.length ?
      bChildren.length :
      bFree[freeIndex];

    // Iterate through b and append any new keys
    // O(M) time
    for (let j = 0; j < bChildren.length; j += 1) {
      const newItem = bChildren[j];

      if (newItem.key) {
        // eslint-disable-next-line no-prototype-builtins
        if (!aKeys.hasOwnProperty(newItem.key)) {
          // Add any new keyed items
          // We are adding new items to the end and then sorting them
          // in place. In future we should insert new items in place.
          newChildren.push(newItem);
        }
      } else if (j >= lastFreeIndex) {
        // Add any leftover non-keyed items
        newChildren.push(newItem);
      }
    }

    const simulate = newChildren.slice();
    let simulateIndex = 0;
    const removes = [];
    const inserts = [];
    let simulateItem;

    for (let k = 0; k < bChildren.length;) {
      const wantedItem = bChildren[k];
      simulateItem = simulate[simulateIndex];

      // remove items
      while (simulateItem === null && simulate.length) {
        removes.push(remove(simulate, simulateIndex, null));
        simulateItem = simulate[simulateIndex];
      }

      if (!simulateItem || simulateItem.key !== wantedItem.key) {
        // if we need a key in this position...
        if (wantedItem.key) {
          if (simulateItem && simulateItem.key) {
            // if an insert doesn't put this key in place, it needs to move
            if (bKeys[simulateItem.key] !== k + 1) {
              removes.push(remove(simulate, simulateIndex, simulateItem.key));
              simulateItem = simulate[simulateIndex];
              // if the remove didn't put the wanted item in place, we need to insert it
              if (!simulateItem || simulateItem.key !== wantedItem.key) {
                inserts.push({ key: wantedItem.key, to: k });
              } else {
                // items are matching, so skip ahead
                simulateIndex += 1;
              }
            } else {
              inserts.push({ key: wantedItem.key, to: k });
            }
          } else {
            inserts.push({ key: wantedItem.key, to: k });
          }
          k += 1;
        } else if (simulateItem && simulateItem.key) {
          // a key in simulate has no matching wanted key, remove it
          removes.push(remove(simulate, simulateIndex, simulateItem.key));
        }
      } else {
        simulateIndex += 1;
        k += 1;
      }
    }

    // remove all the remaining nodes from simulate
    while (simulateIndex < simulate.length) {
      simulateItem = simulate[simulateIndex];
      removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
      return {
        children: newChildren,
        moves: null,
      };
    }

    return {
      children: newChildren,
      moves: {
        removes,
        inserts,
      },
    };
  }

  return diff;
});
