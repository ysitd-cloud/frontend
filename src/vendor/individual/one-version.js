define((require, exports, module) => {
  const Individual = require('./index.js');

  function OneVersion(moduleName, version, defaultValue) {
    const key = `__INDIVIDUAL_ONE_VERSION_${moduleName}`;
    const enforceKey = `${key}_ENFORCE_SINGLETON`;

    const versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
      throw new Error(`Can only have one copy of ${moduleName}
      You already have version ${versionValue} installed.
      This means you cannot install version ${version}`);
    }

    return Individual(key, defaultValue);
  }

  module.exports = OneVersion;
});
