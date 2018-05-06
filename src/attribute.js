define(() => function convertAttributes(attributes) {
  return Array.from(attributes).reduce((props, attr) => {
    props[attr.name] = attr.value;
    return props;
  }, {});
});
