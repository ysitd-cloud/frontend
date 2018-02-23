const { Environment, FileSystemLoader } = require('nunjucks');
const hypernova = require('hypernova');
const { DEBUG } = require('../env');

function render(name, component) {
  return hypernova({
    server() {
      const env = new Environment(new FileSystemLoader('view', { watch: DEBUG }));
      const template = env.getTemplate(component);
      return function renderPage(props) {
        return new Promise((resolve, reject) => {
          template.render(props, (e, content) => {
            if (e) {
              reject(e);
            } else {
              resolve(content);
            }
          });
        });
      };
    },
    client() {},
  });
}

module.exports = render;
