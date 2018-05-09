/* eslint-disable */
define(() => {
  const waitSeconds = 100;

  const head = document.getElementsByTagName('head')[0];

  const isWebkit = !!window.navigator.userAgent.match(/AppleWebKit\/([^ ;]*)/);
  const webkitLoadCheck = function (link, callback) {
    setTimeout(() => {
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        if (sheet.href === link.href) { callback(); return; }
      }
      webkitLoadCheck(link, callback);
    }, 10);
  };

  const cssIsReloadable = function cssIsReloadable(links) {
    // Css loaded on the page initially should be skipped by the first
    // systemjs load, and marked for reload
    let reloadable = true;
    forEach(links, (link) => {
      if (!link.hasAttribute('data-systemjs-css')) {
        reloadable = false;
        link.setAttribute('data-systemjs-css', '');
      }
    });
    return reloadable;
  };

  const findExistingCSS = function findExistingCSS(url) {
    // Search for existing link to reload
    const links = head.getElementsByTagName('link');
    return filter(links, link => link.href === url);
  };

  const noop = function () {};

  const loadCSS = function (url, existingLinks) {
    return new Promise(((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('Unable to load CSS');
      }, waitSeconds * 1000);
      const _callback = function (error) {
        clearTimeout(timeout);
        link.onload = link.onerror = noop;
        setTimeout(() => {
          if (error) { reject(error); } else { resolve(''); }
        }, 7);
      };
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute('data-systemjs-css', '');
      if (!isWebkit) {
        link.onload = function () {
          _callback();
        };
      } else {
        webkitLoadCheck(link, _callback);
      }
      link.onerror = function (event) {
        _callback(event.error || new Error('Error loading CSS file.'));
      };
      if (existingLinks.length) { head.insertBefore(link, existingLinks[0]); } else { head.appendChild(link); }
    }))
    // Remove the old link regardless of loading outcome
      .then((result) => {
        forEach(existingLinks, (link) => { link.parentElement.removeChild(link); });
        return result;
      }, (err) => {
        forEach(existingLinks, (link) => { link.parentElement.removeChild(link); });
        throw err;
      });
  };

  const fetch = function (load) {
    // dont reload styles loaded in the head
    const links = findExistingCSS(load.address);
    if (!cssIsReloadable(links)) { return ''; }
    return loadCSS(load.address, links);
  };


  // Because IE8?
  function filter(arrayLike, func) {
    const arr = [];
    forEach(arrayLike, (item) => {
      if (func(item)) { arr.push(item); }
    });
    return arr;
  }

  // Because IE8?
  function forEach(arrayLike, func) {
    for (let i = 0; i < arrayLike.length; i++) {
      func(arrayLike[i]);
    }
  }

  return { fetch };
});
