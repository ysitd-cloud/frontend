define(['../individual/one-version.js'], (OneVersionConstraint) => {
  const MY_VERSION = '7';
  OneVersionConstraint('ev-store', MY_VERSION);

  const hashKey = `__EV_STORE_KEY@${MY_VERSION}`;

  function EvStore(elem) {
    let hash = elem[hashKey];

    if (!hash) {
      elem[hashKey] = {};
      hash = elem[hashKey];
    }

    return hash;
  }

  return EvStore;
});
