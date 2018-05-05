define(() => {
  const exports = {};
  const waitSeconds = 100;
  const head = document.getElementsByTagName('head')[0];

  const isWebkit = !!window.navigator.userAgent.match(/AppleWebKit\/([^ ;]*)/);

  const webkitLoadCheck = function webkitLoadCheck(link, callback) {
    setTimeout(() => {
      for (let i = 0; i < document.styleSheets.length; i += 1) {
        const sheet = document.styleSheets[i];
        if (sheet.href === link.href) {
          callback();
          return;
        }
      }
      webkitLoadCheck(link, callback);
    }, 10);
  };

  function cssIsReloadable(links) {
    // Css loaded on the page initially should be skipped by the first
    // systemjs load, and marked for reload
    let reloadable = true;
    links.forEach((link) => {
      if (!link.hasAttribute('data-systemjs-css')) {
        reloadable = false;
        link.setAttribute('data-systemjs-css', '');
      }
    });
    return reloadable;
  }

  function findExistingCSS(url) {
    // Search for existing link to reload
    const links = Array.from(head.getElementsByTagName('link'));
    return links.filter(link => link.href === url);
  }

  const noop = function () {};

  function loadCSS(url, existingLinks) {
    return new Promise(((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Unable to load CSS'));
      }, waitSeconds * 1000);

      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute('data-systemjs-css', '');

      const callback = function callback(error) {
        clearTimeout(timeout);
        link.onerror = noop;
        link.onload = noop;
        setTimeout(() => {
          if (error) {
            reject(error);
          } else {
            resolve('');
          }
        }, 7);
      };

      if (!isWebkit) {
        link.onload = () => callback();
      } else {
        webkitLoadCheck(link, callback);
      }

      link.onerror = function (event) {
        callback(event.error || new Error('Error loading CSS file.'));
      };

      if (existingLinks.length) {
        head.insertBefore(link, existingLinks[0]);
      } else {
        head.appendChild(link);
      }
    }))
    // Remove the old link regardless of loading outcome
      .then((result) => {
        existingLinks.forEach((link) => {
          link.parentElement.removeChild(link);
        });
        return result;
      })
      .catch((err) => {
        existingLinks.forEach((link) => {
          link.parentElement.removeChild(link);
        });
        throw err;
      });
  }

  exports.fetch = function fetch(load) {
    // dont reload styles loaded in the head
    const links = findExistingCSS(load.address);
    if (!cssIsReloadable(links)) {
      return '';
    }
    return loadCSS(load.address, links);
  };

  return exports;
});
