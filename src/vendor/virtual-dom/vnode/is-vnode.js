define(['./version.js'], version => function isVirtualNode(x) {
  return x && x.type === 'VirtualNode' && x.version === version;
});
