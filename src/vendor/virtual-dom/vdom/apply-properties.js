define(['../../is-object/index.js', '../vnode/is-vhook.js'], (isObject, isHook) => {
  function removeProperty(node, propName, propValue, previous) {
    if (previous) {
      const previousValue = previous[propName];

      if (!isHook(previousValue)) {
        if (propName === 'attributes') {
          for (const attrName in previousValue) {
            node.removeAttribute(attrName);
          }
        } else if (propName === 'style') {
          for (const i in previousValue) {
            node.style[i] = '';
          }
        } else if (typeof previousValue === 'string') {
          node[propName] = '';
        } else {
          node[propName] = null;
        }
      } else if (previousValue.unhook) {
        previousValue.unhook(node, propName, propValue);
      }
    }
  }

  function getPrototype(value) {
    if (Object.getPrototypeOf) {
      return Object.getPrototypeOf(value);
      // eslint-disable-next-line no-proto
    } else if (value.__proto__) {
      // eslint-disable-next-line no-proto
      return value.__proto__;
    } else if (value.constructor) {
      return value.constructor.prototype;
    }

    return undefined;
  }

  function patchObject(node, props, previous, propName, propValue) {
    const previousValue = previous ? previous[propName] : undefined;

    // Set attributes
    if (propName === 'attributes') {
      for (const attrName in propValue) {
        const attrValue = propValue[attrName];

        if (attrValue === undefined) {
          node.removeAttribute(attrName);
        } else {
          node.setAttribute(attrName, attrValue);
        }
      }

      return;
    }

    if (previousValue && isObject(previousValue) &&
      getPrototype(previousValue) !== getPrototype(propValue)) {
      node[propName] = propValue;
      return;
    }

    if (!isObject(node[propName])) {
      node[propName] = {};
    }

    const replacer = propName === 'style' ? '' : undefined;

    for (const k in propValue) {
      const value = propValue[k];
      node[propName][k] = (value === undefined) ? replacer : value;
    }
  }

  function applyProperties(node, props, previous) {
    for (const propName in props) {
      const propValue = props[propName];

      if (propValue === undefined) {
        removeProperty(node, propName, propValue, previous);
      } else if (isHook(propValue)) {
        removeProperty(node, propName, propValue, previous);
        if (propValue.hook) {
          propValue.hook(
            node,
            propName,
            previous ? previous[propName] : undefined,
          );
        }
      } else if (isObject(propValue)) {
        patchObject(node, props, previous, propName, propValue);
      } else {
        if (typeof propValue !== 'boolean') {
          node.setAttribute(propName, propValue);
        } else {
          node.setAttribute(propName, propName);
        }
      }
    }
  }

  return applyProperties;
});
