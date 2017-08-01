
const urlParams = new URLSearchParams(window.location.search);

const query = {};

for (const pair of urlParams.entries()) {
  const [key, value] = pair;
  query[key] = value;
}

export default query;

export function bind(store) {
  store.registerModule('url', {
    namespaced: true,
    state: {
      query,
      path: location.pathname,
      hash: location.hash,
      host: location.hostname,
    },
  });
}
