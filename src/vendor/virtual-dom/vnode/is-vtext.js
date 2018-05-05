define(['./version.js'], version => function isVirtualText(x) {
  return x && x.type === 'VirtualText' && x.version === version;
});
