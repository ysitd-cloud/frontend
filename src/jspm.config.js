/* globals System */
System.config({
  defaultJSExtensions: false,
  transpiler: false,
  meta: {
    '*.css': {
      loader: 'css.js',
    },
    '*.js': {
      scriptLoad: true,
    },
  },
  map: {
    vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.runtime.js',
    vuetify: 'https://cdnjs.cloudflare.com/ajax/libs/vuetify/1.0.17/vuetify.min.js',
  },
});
