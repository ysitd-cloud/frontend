/* eslint-disable */
(function () {
  const CHAR_DOT = 46; /* . */
  const CHAR_FORWARD_SLASH = 47; /* / */

  function assertPath(path) {
    if (typeof path !== 'string') {
      throw new Error(`Invalid Argument ${path}`);
    }
  }

  function isPosixPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH;
  }

  // Resolves . and .. elements in a path with directory names
  function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
    var res = '';
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code;
    for (var i = 0; i <= path.length; ++i) {
      if (i < path.length)
        code = path.charCodeAt(i);
      else if (isPathSeparator(code))
        break;
      else
        code = CHAR_FORWARD_SLASH;

      if (isPathSeparator(code)) {
        if (lastSlash === i - 1 || dots === 1) {
          // NOOP
        } else if (lastSlash !== i - 1 && dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 ||
            res.charCodeAt(res.length - 1) !== CHAR_DOT ||
            res.charCodeAt(res.length - 2) !== CHAR_DOT) {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf(separator);
              if (lastSlashIndex !== res.length - 1) {
                if (lastSlashIndex === -1) {
                  res = '';
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                }
                lastSlash = i;
                dots = 0;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = '';
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            if (res.length > 0)
              res += `${separator}..`;
            else
              res = '..';
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0)
            res += separator + path.slice(lastSlash + 1, i);
          else
            res = path.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (code === CHAR_DOT && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }

  function _format(sep, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base ||
      ((pathObject.name || '') + (pathObject.ext || ''));
    if (!dir) {
      return base;
    }
    if (dir === pathObject.root) {
      return dir + base;
    }
    return dir + sep + base;
  }

  window.path = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
      var resolvedPath = '';
      var resolvedAbsolute = false;
      var cwd;

      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path;
        if (i >= 0)
          path = arguments[i];
        else {
          if (cwd === undefined)
            cwd = process.cwd();
          path = cwd;
        }

        assertPath(path);

        // Skip empty entries
        if (path.length === 0) {
          continue;
        }

        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      }

      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)

      // Normalize the path
      resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, '/',
        isPosixPathSeparator);

      if (resolvedAbsolute) {
        if (resolvedPath.length > 0)
          return '/' + resolvedPath;
        else
          return '/';
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return '.';
      }
    },


    normalize: function normalize(path) {
      assertPath(path);

      if (path.length === 0)
        return '.';

      const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      const trailingSeparator =
        path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;

      // Normalize the path
      path = normalizeString(path, !isAbsolute, '/', isPosixPathSeparator);

      if (path.length === 0 && !isAbsolute)
        path = '.';
      if (path.length > 0 && trailingSeparator)
        path += '/';

      if (isAbsolute)
        return '/' + path;
      return path;
    },


    isAbsolute: function isAbsolute(path) {
      assertPath(path);
      return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    },


    join: function join() {
      if (arguments.length === 0)
        return '.';
      var joined;
      for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        assertPath(arg);
        if (arg.length > 0) {
          if (joined === undefined)
            joined = arg;
          else
            joined += '/' + arg;
        }
      }
      if (joined === undefined)
        return '.';
      return window.path.normalize(joined);
    },


    relative: function relative(from, to) {
      assertPath(from);
      assertPath(to);

      if (from === to)
        return '';

      from = window.path.resolve(from);
      to = window.path.resolve(to);

      if (from === to)
        return '';

      // Trim any leading backslashes
      var fromStart = 1;
      for (; fromStart < from.length; ++fromStart) {
        if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
          break;
      }
      var fromEnd = from.length;
      var fromLen = (fromEnd - fromStart);

      // Trim any leading backslashes
      var toStart = 1;
      for (; toStart < to.length; ++toStart) {
        if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
          break;
      }
      var toEnd = to.length;
      var toLen = (toEnd - toStart);

      // Compare paths to find the longest common path from root
      var length = (fromLen < toLen ? fromLen : toLen);
      var lastCommonSep = -1;
      var i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              // We get here if `from` is the root
              // For example: from='/'; to='/foo'
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
              // We get here if `to` is the root.
              // For example: from='/foo'; to='/'
              lastCommonSep = 0;
            }
          }
          break;
        }
        var fromCode = from.charCodeAt(fromStart + i);
        var toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode)
          break;
        else if (fromCode === CHAR_FORWARD_SLASH)
          lastCommonSep = i;
      }

      var out = '';
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (out.length === 0)
            out += '..';
          else
            out += '/..';
        }
      }

      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0)
        return out + to.slice(toStart + lastCommonSep);
      else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
          ++toStart;
        return to.slice(toStart);
      }
    },


    toNamespacedPath: function toNamespacedPath(path) {
      // Non-op on posix systems
      return path;
    },

    dirname: function dirname(path) {
      assertPath(path);
      if (path.length === 0)
        return '.';
      const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      var end = -1;
      var matchedSlash = true;
      for (var i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }

      if (end === -1)
        return hasRoot ? '/' : '.';
      if (hasRoot && end === 1)
        return '//';
      return path.slice(0, end);
    },


    basename: function basename(path, ext) {
      if (ext !== undefined && typeof ext !== 'string')
        throw new Error(`Invalid Type ${ext}`);
      assertPath(path);

      var start = 0;
      var end = -1;
      var matchedSlash = true;
      var i;

      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path)
          return '';
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }

        if (start === end)
          end = firstNonSlashEnd;
        else if (end === -1)
          end = path.length;
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }

        if (end === -1)
          return '';
        return path.slice(start, end);
      }
    },


    extname: function extname(path) {
      assertPath(path);
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      var preDotState = 0;
      for (var i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }

      if (startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 &&
          startDot === end - 1 &&
          startDot === startPart + 1)) {
        return '';
      }
      return path.slice(startDot, end);
    },


    format: function format(pathObject) {
      if (pathObject === null || typeof pathObject !== 'object') {
        throw new Error(`Invalid Type ${pathObject}`);
      }
      return _format('/', pathObject);
    },


    parse: function parse(path) {
      assertPath(path);

      var ret = { root: '', dir: '', base: '', ext: '', name: '' };
      if (path.length === 0)
        return ret;
      var isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      var start;
      if (isAbsolute) {
        ret.root = '/';
        start = 1;
      } else {
        start = 0;
      }
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      var i = path.length - 1;

      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      var preDotState = 0;

      // Get non-dir info
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }

      if (startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 &&
          startDot === end - 1 &&
          startDot === startPart + 1)) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute)
            ret.base = ret.name = path.slice(1, end);
          else
            ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }

      if (startPart > 0)
        ret.dir = path.slice(0, startPart - 1);
      else if (isAbsolute)
        ret.dir = '/';

      return ret;
    },
  };
}());
