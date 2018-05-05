define([
  './diff.js',
  './patch.js',
  './h.js',
  './create-element.js',
  './vnode/vnode.js',
  './vnode/vtext.js',
], (
  diff,
  patch,
  h,
  create,
  VNode,
  VText,
) => ({
  diff,
  patch,
  h,
  create,
  VNode,
  VText,
}));
