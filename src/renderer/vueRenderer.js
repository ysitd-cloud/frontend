const { createBundleRenderer } = require('vue-server-renderer');
const hypernova = require('hypernova');

const { serialize, load } = hypernova;

function createRenderFn(renderer, name) {
  return props => new Promise((resolve, reject) => {
    renderer.renderToString(props, (err, html) => {
      if (err) {
        reject(err);
      } else {
        const content = serialize(name, html, props);
        resolve(content);
      }
    });
  });
}

function render(name, component) {
  return hypernova({
    server() {
      const renderer = createBundleRenderer(component, {
        runInNewContext: false,
      });
      return createRenderFn(renderer, name);
    },
    client() {
      const payloads = load(name);
      if (payloads && Array.isArray(payloads)) {
        payloads.forEach((payload) => {
          const { node, data } = payload;
          Object.keys(data).forEach((key) => {
            component.$set(key, data[key]);
          });
          component.$mount(node);
        });
      }

      return component;
    },
  });
}

module.exports = render;
