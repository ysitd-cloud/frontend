const hypernova = require('hypernova/server');
const { PORT, DEBUG } = require('./env');

hypernova({
  devMode: DEBUG,
  port: PORT,
  getComponent(name) {

  },
});
