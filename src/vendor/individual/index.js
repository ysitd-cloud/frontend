define(() => {
  function Individual(key, value) {
    if (key in window) {
      return window[key];
    }

    window[key] = value;

    return value;
  }

  return Individual;
});
