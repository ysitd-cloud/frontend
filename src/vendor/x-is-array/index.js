define(() => {
  const nativeIsArray = Array.isArray;
  const { toString } = Object.prototype;

  function isArray(obj) {
    return toString.call(obj) === '[object Array]';
  }

  return nativeIsArray || isArray;
});
