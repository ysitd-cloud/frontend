/* eslint-disable */
define(() => function createSimpleFunctional(c, el = 'div', name) {
  name = name || c.replace(/__/g, '-');

  // TODO: remove after close
  // https://github.com/vuetifyjs/vuetify/issues/1561
  name = name.split('-')[0] === 'v' ? name : `v-${name}`;

  return {
    name,
    functional: true,

    render: (h, { data, children }) => {
      data.staticClass = (`${c} ${data.staticClass || ''}`).trim();

      return h(el, data, children);
    },
  };
});
