define((require, exports, module) => {
  const version = require('./version.js');

  function isVirtualNode(x) {
    return x && x.type === 'VirtualNode' && x.version === version;
  }

  module.exports = isVirtualNode;
});
