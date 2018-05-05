define((require, exports, module) => {
  function Individual(key, value) {
    if (key in window) {
      return window[key];
    }

    window[key] = value;

    return value;
  }

  module.exports = Individual;
});
