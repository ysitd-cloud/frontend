module.exports = {
  devtool: 'source-map',
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.js',
    }
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/../dist`,
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          // eslint-disable-next-line global-require
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConf,
      },
    ],
  },
};
