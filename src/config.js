/* globals SystemJS */

window.define = SystemJS.amdDefine;
window.requirejs = SystemJS.amdRequire;

function configSystemJs(baseURI) {
  return {
    baseURI,
    map: {
      css: './css.js',
      immutable: 'https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.2/immutable.min.js',
    },
    meta: {
      '*.css': {
        loader: 'css',
      },
      '*.js': {
        scriptLoad: true,
      },
    },
  };
}

window.configSystemJs = configSystemJs;
