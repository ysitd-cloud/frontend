const { CDN_PATH } = process.env;

module.exports = {
  entry: {
    app: ['./src/app.js'],
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: `${__dirname}/../dist`,
    publicPath: CDN_PATH || '/',
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
};
