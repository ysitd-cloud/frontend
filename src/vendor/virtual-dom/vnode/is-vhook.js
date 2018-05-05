/* eslint-disable */
define(() => function isHook(hook) {
  return hook &&
    (typeof hook.hook === 'function' && !hook.hasOwnProperty('hook') ||
      typeof hook.unhook === 'function' && !hook.hasOwnProperty('unhook'));
});
