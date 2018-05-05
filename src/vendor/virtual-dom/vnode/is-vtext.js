define((require, exports, module) => {
  const version = require('./version.js');

  function isVirtualText(x) {
    return x && x.type === 'VirtualText' && x.version === version;
  }

  module.exports = isVirtualText;
});
