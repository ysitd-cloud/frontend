define([
  './version.js',
  './is-vnode.js',
  './is-widget.js',
  './is-thunk.js',
  './is-vhook.js',
], (
  version,
  isVNode,
  isWidget,
  isThunk,
  isVHook,
) => {
  const noProperties = {};
  const noChildren = [];

  function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName;
    this.properties = properties || noProperties;
    this.children = children || noChildren;
    this.key = key != null ? String(key) : undefined;
    this.namespace = (typeof namespace === 'string') ? namespace : null;

    const count = (children && children.length) || 0;
    let descendants = 0;
    let hasWidgets = false;
    let hasThunks = false;
    let descendantHooks = false;
    let hooks;

    for (const propName in properties) {
      // eslint-disable-next-line no-prototype-builtins
      if (properties.hasOwnProperty(propName)) {
        const property = properties[propName];
        if (isVHook(property) && property.unhook) {
          if (!hooks) {
            hooks = {};
          }

          hooks[propName] = property;
        }
      }
    }

    for (let i = 0; i < count; i++) {
      const child = children[i];
      if (isVNode(child)) {
        descendants += child.count || 0;

        if (!hasWidgets && child.hasWidgets) {
          hasWidgets = true;
        }

        if (!hasThunks && child.hasThunks) {
          hasThunks = true;
        }

        if (!descendantHooks && (child.hooks || child.descendantHooks)) {
          descendantHooks = true;
        }
      } else if (!hasWidgets && isWidget(child)) {
        if (typeof child.destroy === 'function') {
          hasWidgets = true;
        }
      } else if (!hasThunks && isThunk(child)) {
        hasThunks = true;
      }
    }

    this.count = count + descendants;
    this.hasWidgets = hasWidgets;
    this.hasThunks = hasThunks;
    this.hooks = hooks;
    this.descendantHooks = descendantHooks;
  }

  VirtualNode.prototype.version = version;
  VirtualNode.prototype.type = 'VirtualNode';

  return VirtualNode;
});
