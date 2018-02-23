const { Environment, FileSystemLoader } = require('nunjucks');
const hypernova = require('hypernova');
const { DEBUG } = require('../env');

function createRenderFn(template) {
  return props => new Promise((resolve, reject) => {
    template.render(props, (e, content) => {
      if (e) {
        reject(e);
      } else {
        resolve(content);
      }
    });
  });
}

function render(name, component) {
  return hypernova({
    server() {
      const env = new Environment(new FileSystemLoader('view', { watch: DEBUG }));
      const template = env.getTemplate(component);
      return createRenderFn(template);
    },
    client() {},
  });
}

module.exports = render;
