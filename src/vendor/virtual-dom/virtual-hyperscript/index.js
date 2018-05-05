define(
  [
    '../../x-is-array/index.js',
    '../vnode/vnode.js',
    '../vnode/vtext.js',
    '../vnode/is-vnode.js',
    '../vnode/is-vtext.js',
    '../vnode/is-widget.js',
    '../vnode/is-vhook.js',
    '../vnode/is-thunk.js',
    './parse-tag.js',
    './hooks/soft-set-hook.js',
    './hooks/ev-hook.js',
  ],
  (
    isArray,
    VNode,
    VText,
    isVNode,
    isVText,
    isWidget,
    isHook,
    isVThunk,
    parseTag,
    softSetHook,
    evHook,
  ) => {
    const eventListenerRegex = /^on[A-Z]/;

    function isChild(x) {
      return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
    }

    function errorString(obj) {
      try {
        return JSON.stringify(obj, null, '    ');
      } catch (e) {
        return String(obj);
      }
    }

    function UnexpectedVirtualElement(data) {
      const err = new Error();

      err.type = 'virtual-hyperscript.unexpected.virtual-element';
      err.message = `Unexpected virtual child passed to h().
    Expected a VNode / Vthunk / VWidget / string but:
    got:
    ${errorString(data.foreignObject)}.
    The parent vnode is:
    ${errorString(data.parentVnode)}
  Suggested fix: change your \`h(..., [ ... ])\` callsite.`;
      err.foreignObject = data.foreignObject;
      err.parentVnode = data.parentVnode;

      return err;
    }

    function addChild(c, childNodes, tag, props) {
      if (typeof c === 'string') {
        childNodes.push(new VText(c));
      } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
      } else if (isChild(c)) {
        childNodes.push(c);
      } else if (isArray(c)) {
        for (let i = 0; i < c.length; i += 1) {
          addChild(c[i], childNodes, tag, props);
        }
      } else if (c === null || c === undefined) {
      // eslint-disable-next-line no-useless-return
        return;
      } else {
        throw UnexpectedVirtualElement({
          foreignObject: c,
          parentVnode: {
            tagName: tag,
            properties: props,
          },
        });
      }
    }

    function transformProperties(props) {
      for (const propName in props) {
      // eslint-disable-next-line no-prototype-builtins
        if (props.hasOwnProperty(propName)) {
          const value = props[propName];

          if (isHook(value)) {
          // eslint-disable-next-line no-continue
            continue;
          }

          if (eventListenerRegex.test(propName)) {
          // add ev-foo support
            props[propName] = evHook(propName.substr(2).toLowerCase(), value);
          }
        }
      }
    }

    function isChildren(x) {
      return typeof x === 'string' || isArray(x) || isChild(x);
    }

    function UnsupportedValueType(data) {
      const err = new Error();

      err.type = 'virtual-hyperscript.unsupported.value-type';
      err.message = `Unexpected value type for input passed to h().
    Expected a ${errorString(data.expected)} but got:
    ${errorString(data.received)}.
    The vnode is:\n
    ${errorString(data.Vnode)};
    Suggested fix: Cast the value passed to h() to a string using String(value).`;
      err.Vnode = data.Vnode;

      return err;
    }

    function h(tagName, properties, children) {
      const childNodes = [];
      let props;
      let namespace;
      let key;

      if (!children && isChildren(properties)) {
      // eslint-disable-next-line no-param-reassign
        children = properties;
        props = {};
      }

      props = props || properties || {};
      const tag = parseTag(tagName, props);

      // support keys
      // eslint-disable-next-line no-prototype-builtins
      if (props.hasOwnProperty('key')) {
      // eslint-disable-next-line prefer-destructuring
        key = props.key;
        props.key = undefined;
      }

      // support namespace
      // eslint-disable-next-line no-prototype-builtins
      if (props.hasOwnProperty('namespace')) {
      // eslint-disable-next-line prefer-destructuring
        namespace = props.namespace;
        props.namespace = undefined;
      }

      // fix cursor bug
      if (tag === 'INPUT' &&
      !namespace &&
      // eslint-disable-next-line no-prototype-builtins
      props.hasOwnProperty('value') &&
      props.value !== undefined &&
      !isHook(props.value)
      ) {
        if (props.value !== null && typeof props.value !== 'string') {
          throw UnsupportedValueType({
            expected: 'String',
            received: typeof props.value,
            Vnode: {
              tagName: tag,
              properties: props,
            },
          });
        }
        props.value = softSetHook(props.value);
      }

      transformProperties(props);

      if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
      }


      return new VNode(tag, props, childNodes, key, namespace);
    }

    return h;
  },
);
