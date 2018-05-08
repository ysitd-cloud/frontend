/* globals System */
System.config({
  baseURL: '/',
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    'github:*': 'jspm_packages/github/*',
    'npm:*': 'jspm_packages/npm/*',
  },

  meta: {
    '*.css': {
      loader: 'css',
    },
    '*': {
      scriptLoad: true,
    },
  },

  map: {
    css: 'github:systemjs/plugin-css@0.1.37',
    vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.runtime.js',
  },
});
