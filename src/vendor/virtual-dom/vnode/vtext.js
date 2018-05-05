define(['./version.js'], (version) => {
  function VirtualText(text) {
    this.text = String(text);
  }

  VirtualText.prototype.version = version;
  VirtualText.prototype.type = 'VirtualText';

  return VirtualText;
});
