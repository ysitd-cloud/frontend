define((require, exports, module) => {
  function isThunk(t) {
    return t && t.type === 'Thunk';
  }

  module.exports = isThunk;
});
