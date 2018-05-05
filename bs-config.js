
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
  open: false,
  port: 8080,
  ui: {
    port: 8080,
  },
  files: [
    'demo',
    'src',
  ],
  watchEvents: [
    'change',
  ],
  server: {
    baseDir: ['demo', 'src'],
  },
};
