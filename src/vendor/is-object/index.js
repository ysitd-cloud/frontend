define((require, exports, module) => {
  module.exports = function isObject(x) {
    return typeof x === 'object' && x !== null;
  };
});
