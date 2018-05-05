/* globals SystemJS */

window.define = SystemJS.amdDefine;
window.requirejs = SystemJS.amdRequire;

function configSystemJs(baseURI) {
  return {
    baseURI,
    map: {
      css: './css.js',
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
