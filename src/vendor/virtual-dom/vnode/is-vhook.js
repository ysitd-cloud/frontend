/* eslint-disable */
define((require, exports, module) => {
  function isHook(hook) {
    return hook &&
      (typeof hook.hook === 'function' && !hook.hasOwnProperty('hook') ||
        typeof hook.unhook === 'function' && !hook.hasOwnProperty('unhook'));
  }

  module.exports = isHook;
});
