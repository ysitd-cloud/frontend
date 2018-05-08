module.exports = {
  port: 8080,
  ui: {
    port: 8081,
  },
  open: false,
  files: ['demo', 'src'],
  watch: true,
  server: {
    baseDir: ['demo', 'src'],
    routes: {
      '/jspm_packages': 'jspm_packages',
    },
  },
};
