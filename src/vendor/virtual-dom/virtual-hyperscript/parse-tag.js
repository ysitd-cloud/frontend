define(['../../browser-split/index.js'], (split) => {
  const classIdSplit = /([.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
  const notClassId = /^\.|#/;

  function parseTag(tag, props) {
    if (!tag) {
      return 'DIV';
    }

    // eslint-disable-next-line no-prototype-builtins
    const noId = !(props.hasOwnProperty('id'));

    const tagParts = split(tag, classIdSplit);
    let tagName = null;

    if (notClassId.test(tagParts[1])) {
      tagName = 'DIV';
    }

    let classes;
    let part;
    let type;

    for (let i = 0; i < tagParts.length; i += 1) {
      part = tagParts[i];

      if (!part) {
        // eslint-disable-next-line no-continue
        continue;
      }

      type = part.charAt(0);

      if (!tagName) {
        tagName = part;
      } else if (type === '.') {
        classes = classes || [];
        classes.push(part.substring(1, part.length));
      } else if (type === '#' && noId) {
        props.id = part.substring(1, part.length);
      }
    }

    if (classes) {
      if (props.className) {
        classes.push(props.className);
      }

      props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
  }

  return parseTag;
});
