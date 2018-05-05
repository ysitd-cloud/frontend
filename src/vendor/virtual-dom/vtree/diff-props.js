define((require, exports, module) => {
  const isObject = require('../../is-object/index.js');
  const isHook = require('../vnode/is-vhook.js');

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

  function diffProps(a, b) {
    let diff;

    for (const aKey in a) {
      if (!(aKey in b)) {
        diff = diff || {};
        diff[aKey] = undefined;
      }

      const aValue = a[aKey];
      const bValue = b[aKey];

      if (aValue === bValue) {
        // eslint-disable-next-line no-continue
        continue;
      } else if (isObject(aValue) && isObject(bValue)) {
        if (getPrototype(bValue) !== getPrototype(aValue)) {
          diff = diff || {};
          diff[aKey] = bValue;
        } else if (isHook(bValue)) {
          diff = diff || {};
          diff[aKey] = bValue;
        } else {
          const objectDiff = diffProps(aValue, bValue);
          if (objectDiff) {
            diff = diff || {};
            diff[aKey] = objectDiff;
          }
        }
      } else {
        diff = diff || {};
        diff[aKey] = bValue;
      }
    }

    for (const bKey in b) {
      if (!(bKey in a)) {
        diff = diff || {};
        diff[bKey] = b[bKey];
      }
    }

    return diff;
  }


  module.exports = diffProps;
});
