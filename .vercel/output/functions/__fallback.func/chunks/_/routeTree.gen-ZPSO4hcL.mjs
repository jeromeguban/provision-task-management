import { RouterProvider, createFileRoute, lazyRouteComponent, createRootRouteWithContext, HeadContent, Outlet, Scripts, redirect, createRouter as createRouter$3 } from '@tanstack/react-router';
import { jsx, jsxs } from 'react/jsx-runtime';
import { defineHandlerCallback, renderRouterToStream, renderRouterToString } from '@tanstack/react-router/ssr/server';
import { createMemoryHistory } from '@tanstack/history';
import { json, mergeHeaders as mergeHeaders$1 } from '@tanstack/router-core/ssr/client';
import { isNotFound, isPlainObject, joinPaths, trimPath, processRouteTree, isRedirect, isResolvedRedirect, rootRouteId, trimPathLeft, getMatchedRoutes } from '@tanstack/router-core';
import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { AsyncLocalStorage } from 'node:async_hooks';
import { transformReadableStreamWithRouter, transformPipeableStreamWithRouter, defineHandlerCallback as defineHandlerCallback$1, createRequestHandler, attachRouterServerSsrUtils } from '@tanstack/router-core/ssr/server';
import { a as withoutTrailingSlash, b as withoutBase, d as decodePath, c as withLeadingSlash, e as parseURL, f as createRouter$2, h as toRouteMatcher, j as joinURL, i as getQuery$2, k as decode$1, _ as _crypto, s as seal, l as unseal, m as destr, n as defu, o as defaults$1 } from './nitro.mjs';
import { createServerClient } from '@supabase/ssr';
import { PrismaClient, ProjectRole } from '@prisma/client';

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

const defaults = Object.freeze({
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false,
  excludeKeys: void 0,
  excludeValues: void 0,
  replacer: void 0
});
function objectHash(object, options) {
  if (options) {
    options = { ...defaults, ...options };
  } else {
    options = defaults;
  }
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
const defaultPrototypesKeys = Object.freeze([
  "prototype",
  "__proto__",
  "constructor"
]);
function createHasher(options) {
  let buff = "";
  let context = /* @__PURE__ */ new Map();
  const write = (str) => {
    buff += str;
  };
  return {
    toString() {
      return buff;
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    },
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      if (objectLength < 10) {
        objType = "unknown:[" + objString + "]";
      } else {
        objType = objString.slice(8, objectLength - 1);
      }
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = context.get(object)) === void 0) {
        context.set(object, context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else if (!options.ignoreUnknown) {
          this.unkown(object, objType);
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        let extraKeys = [];
        if (options.respectType !== false && !isNativeFunction(object)) {
          extraKeys = defaultPrototypesKeys;
        }
        if (options.excludeKeys) {
          keys = keys.filter((key) => {
            return !options.excludeKeys(key);
          });
          extraKeys = extraKeys.filter((key) => {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    },
    array(arr, unordered) {
      unordered = unordered === void 0 ? options.unorderedArrays !== false : unordered;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry);
        for (const [key, value] of hasher.getContext()) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    },
    date(date) {
      return write("date:" + date.toJSON());
    },
    symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    unkown(value, type) {
      write(type);
      if (!value) {
        return;
      }
      write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          Array.from(value.entries()),
          true
          /* ordered */
        );
      }
    },
    error(err) {
      return write("error:" + err.toString());
    },
    boolean(bool) {
      return write("bool:" + bool);
    },
    string(string) {
      write("string:" + string.length + ":");
      write(string);
    },
    function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this.object(fn);
      }
    },
    number(number) {
      return write("number:" + number);
    },
    xml(xml) {
      return write("xml:" + xml.toString());
    },
    null() {
      return write("Null");
    },
    undefined() {
      return write("Undefined");
    },
    regexp(regex) {
      return write("regex:" + regex.toString());
    },
    uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    url(url) {
      return write("url:" + url.toString());
    },
    map(map) {
      write("map:");
      const arr = [...map];
      return this.array(arr, options.unorderedSets !== false);
    },
    set(set) {
      write("set:");
      const arr = [...set];
      return this.array(arr, options.unorderedSets !== false);
    },
    file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error(
        'Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n'
      );
    },
    domwindow() {
      return write("domwindow");
    },
    bigint(number) {
      return write("bigint:" + number.toString());
    },
    /* Node.js standard native objects */
    process() {
      return write("process");
    },
    timer() {
      return write("timer");
    },
    pipe() {
      return write("pipe");
    },
    tcp() {
      return write("tcp");
    },
    udp() {
      return write("udp");
    },
    tty() {
      return write("tty");
    },
    statwatcher() {
      return write("statwatcher");
    },
    securecontext() {
      return write("securecontext");
    },
    connection() {
      return write("connection");
    },
    zlib() {
      return write("zlib");
    },
    context() {
      return write("context");
    },
    nodescript() {
      return write("nodescript");
    },
    httpparser() {
      return write("httpparser");
    },
    dataview() {
      return write("dataview");
    },
    signal() {
      return write("signal");
    },
    fsevent() {
      return write("fsevent");
    },
    tlswrap() {
      return write("tlswrap");
    }
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc;
}

function rawHeaders(headers) {
  const rawHeaders2 = [];
  for (const key in headers) {
    if (Array.isArray(headers[key])) {
      for (const h of headers[key]) {
        rawHeaders2.push(key, h);
      }
    } else {
      rawHeaders2.push(key, headers[key]);
    }
  }
  return rawHeaders2;
}
function mergeFns(...functions) {
  return function(...args) {
    for (const fn of functions) {
      fn(...args);
    }
  };
}
function createNotImplementedError(name) {
  throw new Error(`[unenv] ${name} is not implemented yet!`);
}

let defaultMaxListeners = 10;
let EventEmitter$1 = class EventEmitter {
  __unenv__ = true;
  _events = /* @__PURE__ */ Object.create(null);
  _maxListeners;
  static get defaultMaxListeners() {
    return defaultMaxListeners;
  }
  static set defaultMaxListeners(arg) {
    if (typeof arg !== "number" || arg < 0 || Number.isNaN(arg)) {
      throw new RangeError(
        'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + "."
      );
    }
    defaultMaxListeners = arg;
  }
  setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
      throw new RangeError(
        'The value of "n" is out of range. It must be a non-negative number. Received ' + n + "."
      );
    }
    this._maxListeners = n;
    return this;
  }
  getMaxListeners() {
    return _getMaxListeners(this);
  }
  emit(type, ...args) {
    if (!this._events[type] || this._events[type].length === 0) {
      return false;
    }
    if (type === "error") {
      let er;
      if (args.length > 0) {
        er = args[0];
      }
      if (er instanceof Error) {
        throw er;
      }
      const err = new Error(
        "Unhandled error." + (er ? " (" + er.message + ")" : "")
      );
      err.context = er;
      throw err;
    }
    for (const _listener of this._events[type]) {
      (_listener.listener || _listener).apply(this, args);
    }
    return true;
  }
  addListener(type, listener) {
    return _addListener(this, type, listener, false);
  }
  on(type, listener) {
    return _addListener(this, type, listener, false);
  }
  prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  }
  once(type, listener) {
    return this.on(type, _wrapOnce(this, type, listener));
  }
  prependOnceListener(type, listener) {
    return this.prependListener(type, _wrapOnce(this, type, listener));
  }
  removeListener(type, listener) {
    return _removeListener(this, type, listener);
  }
  off(type, listener) {
    return this.removeListener(type, listener);
  }
  removeAllListeners(type) {
    return _removeAllListeners(this, type);
  }
  listeners(type) {
    return _listeners(this, type, true);
  }
  rawListeners(type) {
    return _listeners(this, type, false);
  }
  listenerCount(type) {
    return this.rawListeners(type).length;
  }
  eventNames() {
    return Object.keys(this._events);
  }
};
function _addListener(target, type, listener, prepend) {
  _checkListener(listener);
  if (target._events.newListener !== void 0) {
    target.emit("newListener", type, listener.listener || listener);
  }
  if (!target._events[type]) {
    target._events[type] = [];
  }
  if (prepend) {
    target._events[type].unshift(listener);
  } else {
    target._events[type].push(listener);
  }
  const maxListeners = _getMaxListeners(target);
  if (maxListeners > 0 && target._events[type].length > maxListeners && !target._events[type].warned) {
    target._events[type].warned = true;
    const warning = new Error(
      `[unenv] Possible EventEmitter memory leak detected. ${target._events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    warning.name = "MaxListenersExceededWarning";
    warning.emitter = target;
    warning.type = type;
    warning.count = target._events[type]?.length;
    console.warn(warning);
  }
  return target;
}
function _removeListener(target, type, listener) {
  _checkListener(listener);
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  const lenBeforeFilter = target._events[type].length;
  target._events[type] = target._events[type].filter((fn) => fn !== listener);
  if (lenBeforeFilter === target._events[type].length) {
    return target;
  }
  if (target._events.removeListener) {
    target.emit("removeListener", type, listener.listener || listener);
  }
  if (target._events[type].length === 0) {
    delete target._events[type];
  }
  return target;
}
function _removeAllListeners(target, type) {
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  if (target._events.removeListener) {
    for (const _listener of target._events[type]) {
      target.emit("removeListener", type, _listener.listener || _listener);
    }
  }
  delete target._events[type];
  return target;
}
function _wrapOnce(target, type, listener) {
  let fired = false;
  const wrapper = (...args) => {
    if (fired) {
      return;
    }
    target.removeListener(type, wrapper);
    fired = true;
    return args.length === 0 ? listener.call(target) : listener.apply(target, args);
  };
  wrapper.listener = listener;
  return wrapper;
}
function _getMaxListeners(target) {
  return target._maxListeners ?? EventEmitter$1.defaultMaxListeners;
}
function _listeners(target, type, unwrap) {
  let listeners = target._events[type];
  if (typeof listeners === "function") {
    listeners = [listeners];
  }
  return unwrap ? listeners.map((l) => l.listener || l) : listeners;
}
function _checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError(
      'The "listener" argument must be of type Function. Received type ' + typeof listener
    );
  }
}

const EventEmitter = globalThis.EventEmitter || EventEmitter$1;

class _Readable extends EventEmitter {
  __unenv__ = true;
  readableEncoding = null;
  readableEnded = true;
  readableFlowing = false;
  readableHighWaterMark = 0;
  readableLength = 0;
  readableObjectMode = false;
  readableAborted = false;
  readableDidRead = false;
  closed = false;
  errored = null;
  readable = false;
  destroyed = false;
  static from(_iterable, options) {
    return new _Readable(options);
  }
  constructor(_opts) {
    super();
  }
  _read(_size) {
  }
  read(_size) {
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  isPaused() {
    return true;
  }
  unpipe(_destination) {
    return this;
  }
  unshift(_chunk, _encoding) {
  }
  wrap(_oldStream) {
    return this;
  }
  push(_chunk, _encoding) {
    return false;
  }
  _destroy(_error, _callback) {
    this.removeAllListeners();
  }
  destroy(error) {
    this.destroyed = true;
    this._destroy(error);
    return this;
  }
  pipe(_destenition, _options) {
    return {};
  }
  compose(stream, options) {
    throw new Error("[unenv] Method not implemented.");
  }
  [Symbol.asyncDispose]() {
    this.destroy();
    return Promise.resolve();
  }
  // eslint-disable-next-line require-yield
  async *[Symbol.asyncIterator]() {
    throw createNotImplementedError("Readable.asyncIterator");
  }
  iterator(options) {
    throw createNotImplementedError("Readable.iterator");
  }
  map(fn, options) {
    throw createNotImplementedError("Readable.map");
  }
  filter(fn, options) {
    throw createNotImplementedError("Readable.filter");
  }
  forEach(fn, options) {
    throw createNotImplementedError("Readable.forEach");
  }
  reduce(fn, initialValue, options) {
    throw createNotImplementedError("Readable.reduce");
  }
  find(fn, options) {
    throw createNotImplementedError("Readable.find");
  }
  findIndex(fn, options) {
    throw createNotImplementedError("Readable.findIndex");
  }
  some(fn, options) {
    throw createNotImplementedError("Readable.some");
  }
  toArray(options) {
    throw createNotImplementedError("Readable.toArray");
  }
  every(fn, options) {
    throw createNotImplementedError("Readable.every");
  }
  flatMap(fn, options) {
    throw createNotImplementedError("Readable.flatMap");
  }
  drop(limit, options) {
    throw createNotImplementedError("Readable.drop");
  }
  take(limit, options) {
    throw createNotImplementedError("Readable.take");
  }
  asIndexedPairs(options) {
    throw createNotImplementedError("Readable.asIndexedPairs");
  }
}
const Readable = globalThis.Readable || _Readable;

class _Writable extends EventEmitter {
  __unenv__ = true;
  writable = true;
  writableEnded = false;
  writableFinished = false;
  writableHighWaterMark = 0;
  writableLength = 0;
  writableObjectMode = false;
  writableCorked = 0;
  closed = false;
  errored = null;
  writableNeedDrain = false;
  destroyed = false;
  _data;
  _encoding = "utf-8";
  constructor(_opts) {
    super();
  }
  pipe(_destenition, _options) {
    return {};
  }
  _write(chunk, encoding, callback) {
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._data === void 0) {
      this._data = chunk;
    } else {
      const a = typeof this._data === "string" ? Buffer.from(this._data, this._encoding || encoding || "utf8") : this._data;
      const b = typeof chunk === "string" ? Buffer.from(chunk, encoding || this._encoding || "utf8") : chunk;
      this._data = Buffer.concat([a, b]);
    }
    this._encoding = encoding;
    if (callback) {
      callback();
    }
  }
  _writev(_chunks, _callback) {
  }
  _destroy(_error, _callback) {
  }
  _final(_callback) {
  }
  write(chunk, arg2, arg3) {
    const encoding = typeof arg2 === "string" ? this._encoding : "utf-8";
    const cb = typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : void 0;
    this._write(chunk, encoding, cb);
    return true;
  }
  setDefaultEncoding(_encoding) {
    return this;
  }
  end(arg1, arg2, arg3) {
    const callback = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : void 0;
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return this;
    }
    const data = arg1 === callback ? void 0 : arg1;
    if (data) {
      const encoding = arg2 === callback ? void 0 : arg2;
      this.write(data, encoding, callback);
    }
    this.writableEnded = true;
    this.writableFinished = true;
    this.emit("close");
    this.emit("finish");
    return this;
  }
  cork() {
  }
  uncork() {
  }
  destroy(_error) {
    this.destroyed = true;
    delete this._data;
    this.removeAllListeners();
    return this;
  }
  compose(stream, options) {
    throw new Error("[h3] Method not implemented.");
  }
}
const Writable = globalThis.Writable || _Writable;

const __Duplex = class {
  allowHalfOpen = true;
  _destroy;
  constructor(readable = new Readable(), writable = new Writable()) {
    Object.assign(this, readable);
    Object.assign(this, writable);
    this._destroy = mergeFns(readable._destroy, writable._destroy);
  }
};
function getDuplex() {
  Object.assign(__Duplex.prototype, Readable.prototype);
  Object.assign(__Duplex.prototype, Writable.prototype);
  return __Duplex;
}
const _Duplex = /* @__PURE__ */ getDuplex();
const Duplex = globalThis.Duplex || _Duplex;

class Socket extends Duplex {
  __unenv__ = true;
  bufferSize = 0;
  bytesRead = 0;
  bytesWritten = 0;
  connecting = false;
  destroyed = false;
  pending = false;
  localAddress = "";
  localPort = 0;
  remoteAddress = "";
  remoteFamily = "";
  remotePort = 0;
  autoSelectFamilyAttemptedAddresses = [];
  readyState = "readOnly";
  constructor(_options) {
    super();
  }
  write(_buffer, _arg1, _arg2) {
    return false;
  }
  connect(_arg1, _arg2, _arg3) {
    return this;
  }
  end(_arg1, _arg2, _arg3) {
    return this;
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  setTimeout(_timeout, _callback) {
    return this;
  }
  setNoDelay(_noDelay) {
    return this;
  }
  setKeepAlive(_enable, _initialDelay) {
    return this;
  }
  address() {
    return {};
  }
  unref() {
    return this;
  }
  ref() {
    return this;
  }
  destroySoon() {
    this.destroy();
  }
  resetAndDestroy() {
    const err = new Error("ERR_SOCKET_CLOSED");
    err.code = "ERR_SOCKET_CLOSED";
    this.destroy(err);
    return this;
  }
}

class IncomingMessage extends Readable {
  __unenv__ = {};
  aborted = false;
  httpVersion = "1.1";
  httpVersionMajor = 1;
  httpVersionMinor = 1;
  complete = true;
  connection;
  socket;
  headers = {};
  trailers = {};
  method = "GET";
  url = "/";
  statusCode = 200;
  statusMessage = "";
  closed = false;
  errored = null;
  readable = false;
  constructor(socket) {
    super();
    this.socket = this.connection = socket || new Socket();
  }
  get rawHeaders() {
    return rawHeaders(this.headers);
  }
  get rawTrailers() {
    return [];
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  get headersDistinct() {
    return _distinct(this.headers);
  }
  get trailersDistinct() {
    return _distinct(this.trailers);
  }
}
function _distinct(obj) {
  const d = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      d[key] = (Array.isArray(value) ? value : [value]).filter(
        Boolean
      );
    }
  }
  return d;
}

class ServerResponse extends Writable {
  __unenv__ = true;
  statusCode = 200;
  statusMessage = "";
  upgrading = false;
  chunkedEncoding = false;
  shouldKeepAlive = false;
  useChunkedEncodingByDefault = false;
  sendDate = false;
  finished = false;
  headersSent = false;
  strictContentLength = false;
  connection = null;
  socket = null;
  req;
  _headers = {};
  constructor(req) {
    super();
    this.req = req;
  }
  assignSocket(socket) {
    socket._httpMessage = this;
    this.socket = socket;
    this.connection = socket;
    this.emit("socket", socket);
    this._flush();
  }
  _flush() {
    this.flushHeaders();
  }
  detachSocket(_socket) {
  }
  writeContinue(_callback) {
  }
  writeHead(statusCode, arg1, arg2) {
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (typeof arg1 === "string") {
      this.statusMessage = arg1;
      arg1 = void 0;
    }
    const headers = arg2 || arg1;
    if (headers) {
      if (Array.isArray(headers)) ; else {
        for (const key in headers) {
          this.setHeader(key, headers[key]);
        }
      }
    }
    this.headersSent = true;
    return this;
  }
  writeProcessing() {
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  appendHeader(name, value) {
    name = name.toLowerCase();
    const current = this._headers[name];
    const all = [
      ...Array.isArray(current) ? current : [current],
      ...Array.isArray(value) ? value : [value]
    ].filter(Boolean);
    this._headers[name] = all.length > 1 ? all : all[0];
    return this;
  }
  setHeader(name, value) {
    this._headers[name.toLowerCase()] = value;
    return this;
  }
  getHeader(name) {
    return this._headers[name.toLowerCase()];
  }
  getHeaders() {
    return this._headers;
  }
  getHeaderNames() {
    return Object.keys(this._headers);
  }
  hasHeader(name) {
    return name.toLowerCase() in this._headers;
  }
  removeHeader(name) {
    delete this._headers[name.toLowerCase()];
  }
  addTrailers(_headers) {
  }
  flushHeaders() {
  }
  writeEarlyHints(_headers, cb) {
    if (typeof cb === "function") {
      cb();
    }
  }
}

function useBase(base, handler) {
  base = withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$2(this, "statusCode", 500);
    __publicField$2(this, "fatal", false);
    __publicField$2(this, "unhandled", false);
    __publicField$2(this, "statusMessage");
    __publicField$2(this, "data");
    __publicField$2(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$2(H3Error, "__h3_error__", true);
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process$1(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process$1(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

async function validateData(data, fn) {
  try {
    const res = await fn(data);
    if (res === false) {
      throw createValidationError();
    }
    if (res === true) {
      return data;
    }
    return res ?? data;
  } catch (error) {
    throw createValidationError(error);
  }
}
function createValidationError(validateError) {
  throw createError({
    status: 400,
    statusMessage: "Validation Error",
    message: validateError?.message || "Validation Error",
    data: validateError
  });
}

function getQuery(event) {
  return getQuery$2(event.path || "");
}
function getValidatedQuery(event, validate) {
  const query = getQuery(event);
  return validateData(query, validate);
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getValidatedRouterParams(event, validate, opts = {}) {
  const routerParams = getRouterParams(event, opts);
  return validateData(routerParams, validate);
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (allowHead && event.method === "HEAD") {
    return true;
  }
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected, allowHead)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
const getHeaders = getRequestHeaders;
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  return event.web?.request || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readValidatedBody(event, validate) {
  const _body = await readBody(event, { strict: true });
  return validateData(_body, validate);
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse(body, boundary);
}
async function readFormData(event) {
  return await toWebRequest(event).formData();
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function parseCookies(event) {
  return parse$1(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions) {
  serializeOptions = { path: "/", ...serializeOptions };
  const cookieStr = serialize(name, value, serializeOptions);
  let setCookies = event.node.res.getHeader("set-cookie");
  if (!Array.isArray(setCookies)) {
    setCookies = [setCookies];
  }
  const _optionsHash = objectHash(serializeOptions);
  setCookies = setCookies.filter((cookieValue) => {
    return cookieValue && _optionsHash !== objectHash(parse$1(cookieValue));
  });
  event.node.res.setHeader("set-cookie", [...setCookies, cookieStr]);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    appendResponseHeader(event, name, value);
  }
}
const appendHeaders = appendResponseHeaders;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
const appendHeader = appendResponseHeader;
function clearResponseHeaders(event, headerNames) {
  if (headerNames && headerNames.length > 0) {
    for (const name of headerNames) {
      removeResponseHeader(event, name);
    }
  } else {
    for (const [name] of Object.entries(getResponseHeaders(event))) {
      removeResponseHeader(event, name);
    }
  }
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
const noop = () => {
};
function writeEarlyHints(event, hints, cb = noop) {
  if (!event.node.res.socket) {
    cb();
    return;
  }
  if (typeof hints === "string" || Array.isArray(hints)) {
    hints = { link: hints };
  }
  if (hints.link) {
    hints.link = Array.isArray(hints.link) ? hints.link : hints.link.split(",");
  }
  const headers = Object.entries(hints).map(
    (e) => [e[0].toLowerCase(), e[1]]
  );
  if (headers.length === 0) {
    cb();
    return;
  }
  let hint = "HTTP/1.1 103 Early Hints";
  if (hints.link) {
    hint += `\r
Link: ${hints.link.join(", ")}`;
  }
  for (const [header, value] of headers) {
    if (header === "link") {
      continue;
    }
    hint += `\r
${header}: ${value}`;
  }
  if (event.node.res.socket) {
    event.node.res.socket.write(
      `${hint}\r
\r
`,
      "utf8",
      cb
    );
  } else {
    cb();
  }
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

function resolveCorsOptions(options = {}) {
  const defaultOptions = {
    origin: "*",
    methods: "*",
    allowHeaders: "*",
    exposeHeaders: "*",
    credentials: false,
    maxAge: false,
    preflight: {
      statusCode: 204
    }
  };
  return defu(options, defaultOptions);
}
function isPreflightRequest(event) {
  const origin = getRequestHeader(event, "origin");
  const accessControlRequestMethod = getRequestHeader(
    event,
    "access-control-request-method"
  );
  return event.method === "OPTIONS" && !!origin && !!accessControlRequestMethod;
}
function isCorsOriginAllowed(origin, options) {
  const { origin: originOption } = options;
  if (!origin || !originOption || originOption === "*" || originOption === "null") {
    return true;
  }
  if (Array.isArray(originOption)) {
    return originOption.some((_origin) => {
      if (_origin instanceof RegExp) {
        return _origin.test(origin);
      }
      return origin === _origin;
    });
  }
  return originOption(origin);
}
function createOriginHeaders(event, options) {
  const { origin: originOption } = options;
  const origin = getRequestHeader(event, "origin");
  if (!origin || !originOption || originOption === "*") {
    return { "access-control-allow-origin": "*" };
  }
  if (typeof originOption === "string") {
    return { "access-control-allow-origin": originOption, vary: "origin" };
  }
  return isCorsOriginAllowed(origin, options) ? { "access-control-allow-origin": origin, vary: "origin" } : {};
}
function createMethodsHeaders(options) {
  const { methods } = options;
  if (!methods) {
    return {};
  }
  if (methods === "*") {
    return { "access-control-allow-methods": "*" };
  }
  return methods.length > 0 ? { "access-control-allow-methods": methods.join(",") } : {};
}
function createCredentialsHeaders(options) {
  const { credentials } = options;
  if (credentials) {
    return { "access-control-allow-credentials": "true" };
  }
  return {};
}
function createAllowHeaderHeaders(event, options) {
  const { allowHeaders } = options;
  if (!allowHeaders || allowHeaders === "*" || allowHeaders.length === 0) {
    const header = getRequestHeader(event, "access-control-request-headers");
    return header ? {
      "access-control-allow-headers": header,
      vary: "access-control-request-headers"
    } : {};
  }
  return {
    "access-control-allow-headers": allowHeaders.join(","),
    vary: "access-control-request-headers"
  };
}
function createExposeHeaders(options) {
  const { exposeHeaders } = options;
  if (!exposeHeaders) {
    return {};
  }
  if (exposeHeaders === "*") {
    return { "access-control-expose-headers": exposeHeaders };
  }
  return { "access-control-expose-headers": exposeHeaders.join(",") };
}
function appendCorsPreflightHeaders(event, options) {
  appendHeaders(event, createOriginHeaders(event, options));
  appendHeaders(event, createCredentialsHeaders(options));
  appendHeaders(event, createExposeHeaders(options));
  appendHeaders(event, createMethodsHeaders(options));
  appendHeaders(event, createAllowHeaderHeaders(event, options));
}
function appendCorsHeaders(event, options) {
  appendHeaders(event, createOriginHeaders(event, options));
  appendHeaders(event, createCredentialsHeaders(options));
  appendHeaders(event, createExposeHeaders(options));
}

function handleCors(event, options) {
  const _options = resolveCorsOptions(options);
  if (isPreflightRequest(event)) {
    appendCorsPreflightHeaders(event, options);
    sendNoContent(event, _options.preflight.statusCode);
    return true;
  }
  appendCorsHeaders(event, options);
  return false;
}

async function getRequestFingerprint(event, opts = {}) {
  const fingerprint = [];
  if (opts.ip !== false) {
    fingerprint.push(
      getRequestIP(event, { xForwardedFor: opts.xForwardedFor })
    );
  }
  if (opts.method === true) {
    fingerprint.push(event.method);
  }
  if (opts.path === true) {
    fingerprint.push(event.path);
  }
  if (opts.userAgent === true) {
    fingerprint.push(getRequestHeader(event, "user-agent"));
  }
  const fingerprintString = fingerprint.filter(Boolean).join("|");
  if (!fingerprintString) {
    return null;
  }
  if (opts.hash === false) {
    return fingerprintString;
  }
  const buffer = await _crypto.subtle.digest(
    opts.hash || "SHA-1",
    new TextEncoder().encode(fingerprintString)
  );
  const hash = [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hash;
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders(
    getProxyRequestHeaders(event),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name)) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

const getSessionPromise = Symbol("getSession");
const DEFAULT_NAME = "h3";
const DEFAULT_COOKIE = {
  path: "/",
  secure: true,
  httpOnly: true
};
async function useSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  await getSession(event, config);
  const sessionManager = {
    get id() {
      return event.context.sessions?.[sessionName]?.id;
    },
    get data() {
      return event.context.sessions?.[sessionName]?.data || {};
    },
    update: async (update) => {
      await updateSession(event, config, update);
      return sessionManager;
    },
    clear: () => {
      clearSession(event, config);
      return Promise.resolve(sessionManager);
    }
  };
  return sessionManager;
}
async function getSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (!event.context.sessions) {
    event.context.sessions = /* @__PURE__ */ Object.create(null);
  }
  const existingSession = event.context.sessions[sessionName];
  if (existingSession) {
    return existingSession[getSessionPromise] || existingSession;
  }
  const session = {
    id: "",
    createdAt: 0,
    data: /* @__PURE__ */ Object.create(null)
  };
  event.context.sessions[sessionName] = session;
  let sealedSession;
  if (config.sessionHeader !== false) {
    const headerName = typeof config.sessionHeader === "string" ? config.sessionHeader.toLowerCase() : `x-${sessionName.toLowerCase()}-session`;
    const headerValue = event.node.req.headers[headerName];
    if (typeof headerValue === "string") {
      sealedSession = headerValue;
    }
  }
  if (!sealedSession) {
    sealedSession = getCookie(event, sessionName);
  }
  if (sealedSession) {
    const promise = unsealSession(event, config, sealedSession).catch(() => {
    }).then((unsealed) => {
      Object.assign(session, unsealed);
      delete event.context.sessions[sessionName][getSessionPromise];
      return session;
    });
    event.context.sessions[sessionName][getSessionPromise] = promise;
    await promise;
  }
  if (!session.id) {
    session.id = config.generateId?.() ?? (config.crypto || _crypto).randomUUID();
    session.createdAt = Date.now();
    await updateSession(event, config);
  }
  return session;
}
async function updateSession(event, config, update) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  if (typeof update === "function") {
    update = update(session.data);
  }
  if (update) {
    Object.assign(session.data, update);
  }
  if (config.cookie !== false) {
    const sealed = await sealSession(event, config);
    setCookie(event, sessionName, sealed, {
      ...DEFAULT_COOKIE,
      expires: config.maxAge ? new Date(session.createdAt + config.maxAge * 1e3) : void 0,
      ...config.cookie
    });
  }
  return session;
}
async function sealSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  const sealed = await seal(config.crypto || _crypto, session, config.password, {
    ...defaults$1,
    ttl: config.maxAge ? config.maxAge * 1e3 : 0,
    ...config.seal
  });
  return sealed;
}
async function unsealSession(_event, config, sealed) {
  const unsealed = await unseal(
    config.crypto || _crypto,
    sealed,
    config.password,
    {
      ...defaults$1,
      ttl: config.maxAge ? config.maxAge * 1e3 : 0,
      ...config.seal
    }
  );
  if (config.maxAge) {
    const age = Date.now() - (unsealed.createdAt || Number.NEGATIVE_INFINITY);
    if (age > config.maxAge * 1e3) {
      throw new Error("Session expired!");
    }
  }
  return unsealed;
}
function clearSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (event.context.sessions?.[sessionName]) {
    delete event.context.sessions[sessionName];
  }
  setCookie(event, sessionName, "", {
    ...DEFAULT_COOKIE,
    ...config.cookie
  });
  return Promise.resolve();
}

async function serveStatic(event, options) {
  if (event.method !== "GET" && event.method !== "HEAD") {
    if (!options.fallthrough) {
      throw createError({
        statusMessage: "Method Not Allowed",
        statusCode: 405
      });
    }
    return false;
  }
  const originalId = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  const acceptEncodings = parseAcceptEncoding(
    getRequestHeader(event, "accept-encoding"),
    options.encodings
  );
  if (acceptEncodings.length > 1) {
    setResponseHeader(event, "vary", "accept-encoding");
  }
  let id = originalId;
  let meta;
  const _ids = idSearchPaths(
    originalId,
    acceptEncodings,
    options.indexNames || ["/index.html"]
  );
  for (const _id of _ids) {
    const _meta = await options.getMeta(_id);
    if (_meta) {
      meta = _meta;
      id = _id;
      break;
    }
  }
  if (!meta) {
    if (!options.fallthrough) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return false;
  }
  if (meta.etag && !getResponseHeader(event, "etag")) {
    setResponseHeader(event, "etag", meta.etag);
  }
  const ifNotMatch = meta.etag && getRequestHeader(event, "if-none-match") === meta.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return send(event, "");
  }
  if (meta.mtime) {
    const mtimeDate = new Date(meta.mtime);
    const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
    if (ifModifiedSinceH && new Date(ifModifiedSinceH) >= mtimeDate) {
      setResponseStatus(event, 304, "Not Modified");
      return send(event, null);
    }
    if (!getResponseHeader(event, "last-modified")) {
      setResponseHeader(event, "last-modified", mtimeDate.toUTCString());
    }
  }
  if (meta.type && !getResponseHeader(event, "content-type")) {
    setResponseHeader(event, "content-type", meta.type);
  }
  if (meta.encoding && !getResponseHeader(event, "content-encoding")) {
    setResponseHeader(event, "content-encoding", meta.encoding);
  }
  if (meta.size !== void 0 && meta.size > 0 && !getResponseHeader(event, "content-length")) {
    setResponseHeader(event, "content-length", meta.size);
  }
  if (event.method === "HEAD") {
    return send(event, null);
  }
  const contents = await options.getContents(id);
  return isStream(contents) ? sendStream(event, contents) : send(event, contents);
}
function parseAcceptEncoding(header, encodingMap) {
  if (!encodingMap || !header) {
    return [];
  }
  return String(header || "").split(",").map((e) => encodingMap[e.trim()]).filter(Boolean);
}
function idSearchPaths(id, encodings, indexNames) {
  const ids = [];
  for (const suffix of ["", ...indexNames]) {
    for (const encoding of [...encodings, ""]) {
      ids.push(`${id}${suffix}${encoding}`);
    }
  }
  return ids;
}

function defineWebSocket(hooks) {
  return hooks;
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    // Context
    __publicField(this, "node");
    // Node
    __publicField(this, "web");
    // Web
    __publicField(this, "context", {});
    // Shared
    // Request
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    // Response
    __publicField(this, "_handled", false);
    // Hooks
    __publicField(this, "_onBeforeResponseCalled");
    __publicField(this, "_onAfterResponseCalled");
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function defineRequestMiddleware(fn) {
  return fn;
}
function defineResponseMiddleware(fn) {
  return fn;
}
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function dynamicEventHandler(initial) {
  let current = initial;
  const wrapper = eventHandler((event) => {
    if (current) {
      return current(event);
    }
  });
  wrapper.set = (handler) => {
    current = handler;
  };
  return wrapper;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$2({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}

const defineNodeListener = (handler) => handler;
const defineNodeMiddleware = (middleware) => middleware;
function fromNodeMiddleware(handler) {
  if (isEventHandler(handler)) {
    return handler;
  }
  if (typeof handler !== "function") {
    throw new TypeError(
      "Invalid handler. It should be a function:",
      handler
    );
  }
  return eventHandler((event) => {
    return callNodeListener(
      handler,
      event.node.req,
      event.node.res
    );
  });
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}
function promisifyNodeListener(handler) {
  return function(req, res) {
    return callNodeListener(handler, req, res);
  };
}
function callNodeListener(handler, req, res) {
  const isMiddleware = handler.length > 2;
  return new Promise((resolve, reject) => {
    const next = (err) => {
      if (isMiddleware) {
        res.off("close", next);
        res.off("error", next);
      }
      return err ? reject(createError(err)) : resolve(void 0);
    };
    try {
      const returned = handler(req, res, next);
      if (isMiddleware && returned === void 0) {
        res.once("close", next);
        res.once("error", next);
      } else {
        resolve(returned);
      }
    } catch (error) {
      next(error);
    }
  });
}

function toPlainHandler(app) {
  const handler = (request) => {
    return _handlePlainRequest(app, request);
  };
  return handler;
}
function fromPlainHandler(handler) {
  return eventHandler(async (event) => {
    const res = await handler({
      method: event.method,
      path: event.path,
      headers: Object.fromEntries(event.headers.entries()),
      body: getRequestWebStream(event),
      context: event.context
    });
    setResponseStatus(event, res.status, res.statusText);
    for (const [key, value] of res.headers) {
      setResponseHeader(event, key, value);
    }
    return res.body;
  });
}
async function _handlePlainRequest(app, request) {
  const path = request.path;
  const method = (request.method || "GET").toUpperCase();
  const headers = new Headers(request.headers);
  const nodeReq = new IncomingMessage();
  const nodeRes = new ServerResponse(nodeReq);
  nodeReq.method = method;
  nodeReq.url = path;
  nodeReq.headers = Object.fromEntries(headers.entries());
  const event = createEvent(nodeReq, nodeRes);
  event._method = method;
  event._path = path;
  event._headers = headers;
  if (request.body) {
    event._requestBody = request.body;
  }
  if (request._eventOverrides) {
    Object.assign(event, request._eventOverrides);
  }
  if (request.context) {
    Object.assign(event.context, request.context);
  }
  try {
    await app.handler(event);
  } catch (_error) {
    const error = createError(_error);
    if (!isError(_error)) {
      error.unhandled = true;
    }
    if (app.options.onError) {
      await app.options.onError(error, event);
    }
    if (!event.handled) {
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      await sendError(event, error, !!app.options.debug);
    }
  }
  return {
    status: nodeRes.statusCode,
    statusText: nodeRes.statusMessage,
    headers: _normalizeUnenvHeaders(nodeRes._headers),
    body: nodeRes._data
  };
}
function _normalizeUnenvHeaders(input) {
  const headers = [];
  const cookies = [];
  for (const _key in input) {
    const key = _key.toLowerCase();
    if (key === "set-cookie") {
      cookies.push(
        ...splitCookiesString(input["set-cookie"])
      );
      continue;
    }
    const value = input[key];
    if (Array.isArray(value)) {
      for (const _value of value) {
        headers.push([key, _value]);
      }
    } else if (value !== void 0) {
      headers.push([key, String(value)]);
    }
  }
  if (cookies.length > 0) {
    for (const cookie of cookies) {
      headers.push(["set-cookie", cookie]);
    }
  }
  return headers;
}

function toWebHandler(app) {
  const webHandler = (request, context) => {
    return _handleWebRequest(app, request, context);
  };
  return webHandler;
}
function fromWebHandler(handler) {
  return eventHandler((event) => handler(toWebRequest(event), event.context));
}
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
async function _handleWebRequest(app, request, context) {
  const url = new URL(request.url);
  const res = await _handlePlainRequest(app, {
    _eventOverrides: {
      web: { request, url }
    },
    context,
    method: request.method,
    path: url.pathname + url.search,
    headers: request.headers,
    body: request.body
  });
  const body = nullBodyResponses.has(res.status) || request.method === "HEAD" ? null : res.body;
  return new Response(body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
}

var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
  __defProp(target, Symbol.toStringTag, { value: "Module" });
  return target;
};
function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
  request,
  router,
  responseHeaders,
  children: /* @__PURE__ */ jsx(StartServer, { router })
}));
var defaultRenderHandler = defineHandlerCallback(({ router, responseHeaders }) => renderRouterToString({
  router,
  responseHeaders,
  children: /* @__PURE__ */ jsx(StartServer, { router })
}));
var startSerializer = {
  stringify: (value) => JSON.stringify(value, function replacer(key, val) {
    const ogVal = this[key];
    const serializer = serializers.find((t) => t.stringifyCondition(ogVal));
    if (serializer) return serializer.stringify(ogVal);
    return val;
  }),
  parse: (value) => JSON.parse(value, function parser(key, val) {
    const ogVal = this[key];
    if (isPlainObject(ogVal)) {
      const serializer = serializers.find((t) => t.parseCondition(ogVal));
      if (serializer) return serializer.parse(ogVal);
    }
    return val;
  }),
  encode: (value) => {
    if (Array.isArray(value)) return value.map((v) => startSerializer.encode(v));
    if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, startSerializer.encode(v)]));
    const serializer = serializers.find((t) => t.stringifyCondition(value));
    if (serializer) return serializer.stringify(value);
    return value;
  },
  decode: (value) => {
    if (isPlainObject(value)) {
      const serializer = serializers.find((t) => t.parseCondition(value));
      if (serializer) return serializer.parse(value);
    }
    if (Array.isArray(value)) return value.map((v) => startSerializer.decode(v));
    if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, startSerializer.decode(v)]));
    return value;
  }
};
var createSerializer = (key, check, toValue, fromValue) => ({
  key,
  stringifyCondition: check,
  stringify: (value) => ({ [`$${key}`]: toValue(value) }),
  parseCondition: (value) => Object.hasOwn(value, `$${key}`),
  parse: (value) => fromValue(value[`$${key}`])
});
var serializers = [
  createSerializer("undefined", (v) => v === void 0, () => 0, () => void 0),
  createSerializer("date", (v) => v instanceof Date, (v) => v.toISOString(), (v) => new Date(v)),
  createSerializer("error", (v) => v instanceof Error, (v) => ({
    ...v,
    message: v.message,
    stack: void 0,
    cause: v.cause
  }), (v) => Object.assign(new Error(v.message), v)),
  createSerializer("formData", (v) => v instanceof FormData, (v) => {
    const entries = {};
    v.forEach((value, key) => {
      const entry = entries[key];
      if (entry !== void 0) if (Array.isArray(entry)) entry.push(value);
      else entries[key] = [entry, value];
      else entries[key] = value;
    });
    return entries;
  }, (v) => {
    const formData = new FormData();
    Object.entries(v).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((val) => formData.append(key, val));
      else formData.append(key, value);
    });
    return formData;
  }),
  createSerializer("bigint", (v) => typeof v === "bigint", (v) => v.toString(), (v) => BigInt(v)),
  createSerializer("server-function", (v) => typeof v === "function" && "functionId" in v && typeof v.functionId === "string", ({ functionId }) => ({
    functionId,
    __serverFn: true
  }), (v) => v)
];
var startStorage = new AsyncLocalStorage();
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && (opts == null ? void 0 : opts.throwIfNotFound) !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return context;
}
var globalMiddleware = [];
var getRouterInstance = () => {
  var _a;
  return (_a = getStartContext({ throwIfNotFound: false })) == null ? void 0 : _a.router;
};
function createServerFn(options, __opts) {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { middleware }));
    },
    validator: (validator) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { validator }));
    },
    type: (type) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { type }));
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      Object.assign(resolvedOptions, {
        ...extractedFn,
        extractedFn,
        serverFn
      });
      const resolvedMiddleware = [...resolvedOptions.middleware || [], serverFnBaseToMiddleware(resolvedOptions)];
      return Object.assign(async (opts) => {
        return executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...resolvedOptions,
          data: opts == null ? void 0 : opts.data,
          headers: opts == null ? void 0 : opts.headers,
          signal: opts == null ? void 0 : opts.signal,
          context: {},
          router: getRouterInstance()
        }).then((d) => {
          if (resolvedOptions.response === "full") return d;
          if (d.error) throw d.error;
          return d.result;
        });
      }, {
        ...extractedFn,
        __executeServer: async (opts_, signal) => {
          const opts = opts_ instanceof FormData ? extractFormDataContext(opts_) : opts_;
          opts.type = typeof resolvedOptions.type === "function" ? resolvedOptions.type(opts) : resolvedOptions.type;
          const ctx = {
            ...extractedFn,
            ...opts,
            signal
          };
          const run = () => executeMiddleware$1(resolvedMiddleware, "server", ctx).then((d) => ({
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
          if (ctx.type === "static") {
            let response;
            if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.getItem) response = await serverFnStaticCache.getItem(ctx);
            if (!response) {
              response = await run().then((d) => {
                return {
                  ctx: d,
                  error: null
                };
              }).catch((e) => {
                return {
                  ctx: void 0,
                  error: e
                };
              });
              if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.setItem) await serverFnStaticCache.setItem(ctx, response);
            }
            invariant(response, "No response from both server and static cache!");
            if (response.error) throw response.error;
            return response.ctx;
          }
          return run();
        }
      });
    }
  };
}
async function executeMiddleware$1(middlewares, env, opts) {
  const flattenedMiddlewares = flattenMiddlewares([...globalMiddleware, ...middlewares]);
  const next = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) return ctx;
    if (nextMiddleware.options.validator && (env === "client" ? nextMiddleware.options.validateClient : true)) ctx.data = await execValidator(nextMiddleware.options.validator, ctx.data);
    const middlewareFn = env === "client" ? nextMiddleware.options.client : nextMiddleware.options.server;
    if (middlewareFn) return applyMiddleware(middlewareFn, ctx, async (newCtx) => {
      return next(newCtx).catch((error) => {
        if (isRedirect(error) || isNotFound(error)) return {
          ...newCtx,
          error
        };
        throw error;
      });
    });
    return next(ctx);
  };
  return next({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || {}
  });
}
var serverFnStaticCache;
function setServerFnStaticCache(cache) {
  const previousCache = serverFnStaticCache;
  serverFnStaticCache = typeof cache === "function" ? cache() : cache;
  return () => {
    serverFnStaticCache = previousCache;
  };
}
function createServerFnStaticCache(serverFnStaticCache2) {
  return serverFnStaticCache2;
}
async function sha1Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
setServerFnStaticCache(() => {
  const getStaticCacheUrl = async (options, hash) => {
    return `/__tsr/staticServerFnCache/${await sha1Hash(`${options.functionId}__${hash}`)}.json`;
  };
  const jsonToFilenameSafeString = (json2) => {
    const sortedKeysReplacer = (key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().reduce((acc, curr) => {
      acc[curr] = value[curr];
      return acc;
    }, {}) : value;
    return JSON.stringify(json2 != null ? json2 : "", sortedKeysReplacer).replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
  };
  const staticClientCache = typeof document !== "undefined" ? /* @__PURE__ */ new Map() : null;
  return createServerFnStaticCache({
    getItem: async (ctx) => {
      if (typeof document === "undefined") {
        const url = await getStaticCacheUrl(ctx, jsonToFilenameSafeString(ctx.data));
        const publicUrl = "C:/laragon/www/portfolio/provision-task-management/.vercel/output/static";
        const { promises: fs } = await import('node:fs');
        const filePath = (await import('node:path')).join(publicUrl, url);
        const [cachedResult, readError] = await fs.readFile(filePath, "utf-8").then((c) => [startSerializer.parse(c), null]).catch((e) => [null, e]);
        if (readError && readError.code !== "ENOENT") throw readError;
        return cachedResult;
      }
    },
    setItem: async (ctx, response) => {
      const { promises: fs } = await import('node:fs');
      const path = await import('node:path');
      const url = await getStaticCacheUrl(ctx, jsonToFilenameSafeString(ctx.data));
      const filePath = path.join("C:/laragon/www/portfolio/provision-task-management/.vercel/output/static", url);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, startSerializer.stringify(response));
    },
    fetchItem: async (ctx) => {
      const url = await getStaticCacheUrl(ctx, jsonToFilenameSafeString(ctx.data));
      let result = staticClientCache == null ? void 0 : staticClientCache.get(url);
      if (!result) {
        result = await fetch(url, { method: "GET" }).then((r) => r.text()).then((d) => startSerializer.parse(d));
        staticClientCache == null ? void 0 : staticClientCache.set(url, result);
      }
      return result;
    }
  });
});
function extractFormDataContext(formData) {
  const serializedContext = formData.get("__TSR_CONTEXT");
  formData.delete("__TSR_CONTEXT");
  if (typeof serializedContext !== "string") return {
    context: {},
    data: formData
  };
  try {
    return {
      context: startSerializer.parse(serializedContext),
      data: formData
    };
  } catch {
    return { data: formData };
  }
}
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m) => {
      if (m.options.middleware) recurse(m.options.middleware);
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
var applyMiddleware = async (middlewareFn, ctx, nextFn) => {
  return middlewareFn({
    ...ctx,
    next: async (userCtx = {}) => {
      var _a, _b;
      return nextFn({
        ...ctx,
        ...userCtx,
        context: {
          ...ctx.context,
          ...userCtx.context
        },
        sendContext: {
          ...ctx.sendContext,
          ...(_a = userCtx.sendContext) != null ? _a : {}
        },
        headers: mergeHeaders$1(ctx.headers, userCtx.headers),
        result: userCtx.result !== void 0 ? userCtx.result : ctx.response === "raw" ? userCtx : ctx.result,
        error: (_b = userCtx.error) != null ? _b : ctx.error
      });
    }
  });
};
function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = validator["~standard"].validate(input);
    if (result instanceof Promise) throw new Error("Async validation not supported");
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) return validator.parse(input);
  if (typeof validator === "function") return validator(input);
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    _types: void 0,
    options: {
      validator: options.validator,
      validateClient: options.validateClient,
      client: async ({ next, sendContext, ...ctx }) => {
        var _a;
        const payload = {
          ...ctx,
          context: sendContext,
          type: typeof ctx.type === "function" ? ctx.type(ctx) : ctx.type
        };
        if (ctx.type === "static" && true && typeof document !== "undefined") {
          invariant(serverFnStaticCache, "serverFnStaticCache.fetchItem is not available!");
          const result = await serverFnStaticCache.fetchItem(payload);
          if (result) {
            if (result.error) throw result.error;
            return next(result.ctx);
          }
          warning(result, `No static cache item found for ${payload.functionId}__${JSON.stringify(payload.data)}, falling back to server function...`);
        }
        return next(await ((_a = options.extractedFn) == null ? void 0 : _a.call(options, payload)));
      },
      server: async ({ next, ...ctx }) => {
        var _a;
        const result = await ((_a = options.serverFn) == null ? void 0 : _a.call(options, ctx));
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
var eventStorage = new AsyncLocalStorage();
function _setContext(event, key, value) {
  event.context[key] = value;
}
function _getContext(event, key) {
  return event.context[key];
}
function defineMiddleware(options) {
  return options;
}
function defineEventHandler$1(handler) {
  return defineEventHandler((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
function eventHandler$1(handler) {
  return eventHandler((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
async function runWithEvent(event, fn) {
  return eventStorage.run(event, fn);
}
function getEvent() {
  const event = eventStorage.getStore();
  if (!event) throw new Error(`No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return event;
}
var HTTPEventSymbol = /* @__PURE__ */ Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    const event = args[0];
    if (!isEvent(event)) args.unshift(getEvent());
    else args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    return h3Function(...args);
  };
}
var readRawBody$1 = createWrapperFunction(readRawBody);
var readBody$1 = createWrapperFunction(readBody);
var getQuery$1 = createWrapperFunction(getQuery);
var isMethod$1 = createWrapperFunction(isMethod);
var isPreflightRequest$1 = createWrapperFunction(isPreflightRequest);
var getValidatedQuery$1 = createWrapperFunction(getValidatedQuery);
var getRouterParams$1 = createWrapperFunction(getRouterParams);
var getRouterParam$1 = createWrapperFunction(getRouterParam);
var getValidatedRouterParams$1 = createWrapperFunction(getValidatedRouterParams);
var assertMethod$1 = createWrapperFunction(assertMethod);
var getRequestHeaders$1 = createWrapperFunction(getRequestHeaders);
var getRequestHeader$1 = createWrapperFunction(getRequestHeader);
var getRequestURL$1 = createWrapperFunction(getRequestURL);
var getRequestHost$1 = createWrapperFunction(getRequestHost);
var getRequestProtocol$1 = createWrapperFunction(getRequestProtocol);
var getRequestIP$1 = createWrapperFunction(getRequestIP);
var send$1 = createWrapperFunction(send);
var sendNoContent$1 = createWrapperFunction(sendNoContent);
var setResponseStatus$1 = createWrapperFunction(setResponseStatus);
var getResponseStatus$1 = createWrapperFunction(getResponseStatus);
var getResponseStatusText$1 = createWrapperFunction(getResponseStatusText);
var getResponseHeaders$1 = createWrapperFunction(getResponseHeaders);
var getResponseHeader$1 = createWrapperFunction(getResponseHeader);
var setResponseHeaders$1 = createWrapperFunction(setResponseHeaders);
var setResponseHeader$1 = createWrapperFunction(setResponseHeader);
var appendResponseHeaders$1 = createWrapperFunction(appendResponseHeaders);
var appendResponseHeader$1 = createWrapperFunction(appendResponseHeader);
var defaultContentType$1 = createWrapperFunction(defaultContentType);
var sendRedirect$1 = createWrapperFunction(sendRedirect);
var sendStream$1 = createWrapperFunction(sendStream);
var writeEarlyHints$1 = createWrapperFunction(writeEarlyHints);
var sendError$1 = createWrapperFunction(sendError);
var sendProxy$1 = createWrapperFunction(sendProxy);
var proxyRequest$1 = createWrapperFunction(proxyRequest);
var fetchWithEvent$1 = createWrapperFunction(fetchWithEvent);
var getProxyRequestHeaders$1 = createWrapperFunction(getProxyRequestHeaders);
var parseCookies$2 = createWrapperFunction(parseCookies);
var getCookie$1 = createWrapperFunction(getCookie);
var setCookie$2 = createWrapperFunction(setCookie);
var deleteCookie$1 = createWrapperFunction(deleteCookie);
var useSession$1 = createWrapperFunction(useSession);
var getSession$1 = createWrapperFunction(getSession);
var updateSession$1 = createWrapperFunction(updateSession);
var sealSession$1 = createWrapperFunction(sealSession);
var unsealSession$1 = createWrapperFunction(unsealSession);
var clearSession$1 = createWrapperFunction(clearSession);
var handleCacheHeaders$1 = createWrapperFunction(handleCacheHeaders);
var handleCors$1 = createWrapperFunction(handleCors);
var appendCorsHeaders$1 = createWrapperFunction(appendCorsHeaders);
var appendCorsPreflightHeaders$1 = createWrapperFunction(appendCorsPreflightHeaders);
var sendWebResponse$1 = createWrapperFunction(sendWebResponse);
var appendHeader$1 = createWrapperFunction(appendHeader);
var appendHeaders$1 = createWrapperFunction(appendHeaders);
var setHeader$1 = createWrapperFunction(setHeader);
var setHeaders$2 = createWrapperFunction(setHeaders);
var getHeader$1 = createWrapperFunction(getHeader);
var getHeaders$1 = createWrapperFunction(getHeaders);
var getRequestFingerprint$1 = createWrapperFunction(getRequestFingerprint);
var getRequestWebStream$1 = createWrapperFunction(getRequestWebStream);
var readFormData$1 = createWrapperFunction(readFormData);
var readMultipartFormData$1 = createWrapperFunction(readMultipartFormData);
var readValidatedBody$1 = createWrapperFunction(readValidatedBody);
var removeResponseHeader$1 = createWrapperFunction(removeResponseHeader);
var getContext = createWrapperFunction(_getContext);
var setContext = createWrapperFunction(_setContext);
var clearResponseHeaders$1 = createWrapperFunction(clearResponseHeaders);
var getWebRequest = createWrapperFunction(toWebRequest);
function requestHandler(handler) {
  return handler;
}
var VIRTUAL_MODULES = {
  routeTree: "tanstack-start-route-tree:v",
  startManifest: "tanstack-start-manifest:v",
  serverFnManifest: "tanstack-start-server-fn-manifest:v"
};
async function loadVirtualModule(id) {
  switch (id) {
    case VIRTUAL_MODULES.routeTree:
      return await Promise.resolve().then(function () { return routeTree_genZPSO4hcL; });
    case VIRTUAL_MODULES.startManifest:
      return await import('./_tanstack-start-manifest_v-BE2sDCNP.mjs');
    case VIRTUAL_MODULES.serverFnManifest:
      return await import('./_tanstack-start-server-fn-manifest_v-JVR0Bj7A.mjs');
    default:
      throw new Error(`Unknown virtual module: ${id}`);
  }
}
async function getStartManifest(opts) {
  const { tsrStartManifest } = await loadVirtualModule(VIRTUAL_MODULES.startManifest);
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      suppressHydrationWarning: true,
      async: true
    },
    children: script
  });
  return {
    ...startManifest,
    routes: Object.fromEntries(Object.entries(startManifest.routes).map(([k, v]) => {
      const { preloads, assets } = v;
      return [k, {
        preloads,
        assets
      }];
    }))
  };
}
function sanitizeBase$1(base) {
  return base.replace(/^\/|\/$/g, "");
}
async function revive(root, reviver) {
  async function reviveNode(holder2, key) {
    const value = holder2[key];
    if (value && typeof value === "object") await Promise.all(Object.keys(value).map((k) => reviveNode(value, k)));
    if (reviver) holder2[key] = await reviver(key, holder2[key]);
  }
  const holder = { "": root };
  await reviveNode(holder, "");
  return holder[""];
}
async function reviveServerFns(key, value) {
  if (value && value.__serverFn === true && value.functionId) {
    const serverFn = await getServerFnById(value.functionId);
    return async (opts, signal) => {
      return (await serverFn(opts != null ? opts : {}, signal)).result;
    };
  }
  return value;
}
async function getServerFnById(serverFnId) {
  const { default: serverFnManifest } = await loadVirtualModule(VIRTUAL_MODULES.serverFnManifest);
  const serverFnInfo = serverFnManifest[serverFnId];
  if (!serverFnInfo) {
    console.info("serverFnManifest", serverFnManifest);
    throw new Error("Server function info not found for " + serverFnId);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + serverFnId);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(`Server function module export not resolved for serverFn ID: ${serverFnId}`);
  }
  return action;
}
async function parsePayload(payload) {
  const parsedPayload = startSerializer.parse(payload);
  await revive(parsedPayload, reviveServerFns);
  return parsedPayload;
}
var handleServerAction = async ({ request }) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const url = new URL(request.url, "http://localhost:3000");
  const regex = new RegExp(`${sanitizeBase$1("/_serverFn")}/([^/?#]+)`);
  const match = url.pathname.match(regex);
  const serverFnId = match ? match[1] : null;
  const search = Object.fromEntries(url.searchParams.entries());
  const isCreateServerFn = "createServerFn" in search;
  const isRaw = "raw" in search;
  if (typeof serverFnId !== "string") throw new Error("Invalid server action param for serverFnId: " + serverFnId);
  const action = await getServerFnById(serverFnId);
  const formDataContentTypes = ["multipart/form-data", "application/x-www-form-urlencoded"];
  const response = await (async () => {
    try {
      let result = await (async () => {
        if (request.headers.get("Content-Type") && formDataContentTypes.some((type) => {
          var _a;
          return (_a = request.headers.get("Content-Type")) == null ? void 0 : _a.includes(type);
        })) {
          invariant(method.toLowerCase() !== "get", "GET requests with FormData payloads are not supported");
          return await action(await request.formData(), signal);
        }
        if (method.toLowerCase() === "get") {
          let payload2 = search;
          if (isCreateServerFn) payload2 = search.payload;
          payload2 = payload2 ? await parsePayload(payload2) : payload2;
          return await action(payload2, signal);
        }
        const payload = await parsePayload(await request.text());
        if (isCreateServerFn) return await action(payload, signal);
        return await action(...payload, signal);
      })();
      if (result.result instanceof Response) return result.result;
      if (!isCreateServerFn) {
        result = result.result;
        if (result instanceof Response) return result;
      }
      if (isNotFound(result)) return isNotFoundResponse(result);
      return new Response(result !== void 0 ? startSerializer.stringify(result) : void 0, {
        status: getResponseStatus$1(getEvent()),
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      if (error instanceof Response) return error;
      if (isNotFound(error)) return isNotFoundResponse(error);
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      return new Response(startSerializer.stringify(error), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  if (isRaw) return response;
  return response;
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
function getStartResponseHeaders(opts) {
  return mergeHeaders$1(getResponseHeaders$1(), { "Content-Type": "text/html; charset=UTF-8" }, ...opts.router.state.matches.map((match) => {
    return match.headers;
  }));
}
function createStartHandler({ createRouter }) {
  let routeTreeModule = null;
  let startRoutesManifest = null;
  let processedServerRouteTree = void 0;
  return (cb) => {
    const originalFetch = globalThis.fetch;
    const startRequestResolver = async ({ request }) => {
      globalThis.fetch = async function(input, init) {
        function resolve(url2, requestOptions) {
          return startRequestResolver({ request: new Request(url2, requestOptions) });
        }
        function getOrigin() {
          return request.headers.get("Origin") || request.headers.get("Referer") || "http://localhost";
        }
        if (typeof input === "string" && input.startsWith("/")) return resolve(new URL(input, getOrigin()), init);
        else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) return resolve(new URL(input.url, getOrigin()), init);
        return originalFetch(input, init);
      };
      const url = new URL(request.url);
      const href = url.href.replace(url.origin, "");
      const APP_BASE = "/";
      const router = await createRouter();
      const history = createMemoryHistory({ initialEntries: [href] });
      const isPrerendering = process.env.TSS_PRERENDERING === "true";
      let isShell = process.env.TSS_SHELL === "true";
      if (isPrerendering && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
      router.update({
        history,
        isShell,
        isPrerendering
      });
      const response = await (async () => {
        try {
          const serverFnBase = joinPaths([
            APP_BASE,
            trimPath("/_serverFn"),
            "/"
          ]);
          if (href.startsWith(serverFnBase)) return await handleServerAction({ request });
          if (routeTreeModule === null) try {
            routeTreeModule = await loadVirtualModule(VIRTUAL_MODULES.routeTree);
            if (routeTreeModule.serverRouteTree) processedServerRouteTree = processRouteTree({
              routeTree: routeTreeModule.serverRouteTree,
              initRoute: (route, i) => {
                route.init({ originalIndex: i });
              }
            });
          } catch (e) {
            console.log(e);
          }
          const executeRouter = () => runWithStartContext({ router }, async () => {
            const splitRequestAcceptHeader = (request.headers.get("Accept") || "*/*").split(",");
            if (!["*/*", "text/html"].some((mimeType) => splitRequestAcceptHeader.some((acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)))) return json({ error: "Only HTML requests are supported here" }, { status: 500 });
            if (startRoutesManifest === null) startRoutesManifest = await getStartManifest({ basePath: APP_BASE });
            attachRouterServerSsrUtils(router, startRoutesManifest);
            await router.load();
            if (router.state.redirect) return router.state.redirect;
            await router.serverSsr.dehydrate();
            return await cb({
              request,
              router,
              responseHeaders: getStartResponseHeaders({ router })
            });
          });
          if (processedServerRouteTree) {
            const [_matchedRoutes, response2] = await handleServerRoutes({
              processedServerRouteTree,
              router,
              request,
              basePath: APP_BASE,
              executeRouter
            });
            if (response2) return response2;
          }
          return await executeRouter();
        } catch (err) {
          if (err instanceof Response) return err;
          throw err;
        }
      })();
      if (isRedirect(response)) {
        if (isResolvedRedirect(response)) {
          if (request.headers.get("x-tsr-redirect") === "manual") return json({
            ...response.options,
            isSerializedRedirect: true
          }, { headers: response.headers });
          return response;
        }
        if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(response.options)}`);
        if ([
          "params",
          "search",
          "hash"
        ].some((d) => typeof response.options[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(response.options).filter((d) => typeof response.options[d] === "function").map((d) => `"${d}"`).join(", ")}`);
        const redirect = router.resolveRedirect(response);
        if (request.headers.get("x-tsr-redirect") === "manual") return json({
          ...response.options,
          isSerializedRedirect: true
        }, { headers: response.headers });
        return redirect;
      }
      return response;
    };
    return requestHandler(startRequestResolver);
  };
}
async function handleServerRoutes(opts) {
  var _a, _b;
  const pathname = new URL(opts.request.url).pathname;
  const serverTreeResult = getMatchedRoutes({
    pathname,
    basepath: opts.basePath,
    caseSensitive: true,
    routesByPath: opts.processedServerRouteTree.routesByPath,
    routesById: opts.processedServerRouteTree.routesById,
    flatRoutes: opts.processedServerRouteTree.flatRoutes
  });
  const routeTreeResult = opts.router.getMatchedRoutes(pathname, void 0);
  let response;
  let matchedRoutes = [];
  matchedRoutes = serverTreeResult.matchedRoutes;
  if (routeTreeResult.foundRoute) {
    if (serverTreeResult.matchedRoutes.length < routeTreeResult.matchedRoutes.length) {
      const closestCommon = [...routeTreeResult.matchedRoutes].reverse().find((r) => {
        return opts.processedServerRouteTree.routesById[r.id] !== void 0;
      });
      if (closestCommon) {
        let routeId = closestCommon.id;
        matchedRoutes = [];
        do {
          const route = opts.processedServerRouteTree.routesById[routeId];
          if (!route) break;
          matchedRoutes.push(route);
          routeId = (_a = route.parentRoute) == null ? void 0 : _a.id;
        } while (routeId);
        matchedRoutes.reverse();
      }
    }
  }
  if (matchedRoutes.length) {
    const middlewares = flattenMiddlewares(matchedRoutes.flatMap((r) => r.options.middleware).filter(Boolean)).map((d) => d.options.server);
    if ((_b = serverTreeResult.foundRoute) == null ? void 0 : _b.options.methods) {
      const method = Object.keys(serverTreeResult.foundRoute.options.methods).find((method2) => method2.toLowerCase() === opts.request.method.toLowerCase());
      if (method) {
        const handler = serverTreeResult.foundRoute.options.methods[method];
        if (handler) if (typeof handler === "function") middlewares.push(handlerToMiddleware(handler));
        else {
          if (handler._options.middlewares && handler._options.middlewares.length) middlewares.push(...flattenMiddlewares(handler._options.middlewares).map((d) => d.options.server));
          if (handler._options.handler) middlewares.push(handlerToMiddleware(handler._options.handler));
        }
      }
    }
    middlewares.push(handlerToMiddleware(opts.executeRouter));
    response = (await executeMiddleware(middlewares, {
      request: opts.request,
      context: {},
      params: serverTreeResult.routeParams,
      pathname
    })).response;
  }
  return [matchedRoutes, response];
}
function handlerToMiddleware(handler) {
  return async ({ next: _next, ...rest }) => {
    const response = await handler(rest);
    if (response) return { response };
    return _next(rest);
  };
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (ctx2) => {
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx2;
    const result = await middleware({
      ...ctx2,
      next: async (nextCtx) => {
        const nextResult = await next({
          ...ctx2,
          ...nextCtx,
          context: {
            ...ctx2.context,
            ...(nextCtx == null ? void 0 : nextCtx.context) || {}
          }
        });
        return Object.assign(ctx2, handleCtxResult(nextResult));
      }
    }).catch((err) => {
      if (isSpecialResponse(err)) return { response: err };
      throw err;
    });
    return Object.assign(ctx2, handleCtxResult(result));
  };
  return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) return { response: result };
  return result;
}
function isSpecialResponse(err) {
  return isResponse(err) || isRedirect(err);
}
function isResponse(response) {
  return response instanceof Response;
}
function createServerFileRoute(_) {
  return createServerRoute();
}
function createServerRoute(__, __opts) {
  const options = __opts || {};
  const route = {
    isRoot: false,
    path: "",
    id: "",
    fullPath: "",
    to: "",
    options,
    parentRoute: void 0,
    _types: {},
    middleware: (middlewares) => createServerRoute(void 0, {
      ...options,
      middleware: middlewares
    }),
    methods: (methodsOrGetMethods) => {
      const methods = (() => {
        if (typeof methodsOrGetMethods === "function") return methodsOrGetMethods(createMethodBuilder());
        return methodsOrGetMethods;
      })();
      return createServerRoute(void 0, {
        ...__opts,
        methods
      });
    },
    update: (opts) => createServerRoute(void 0, {
      ...options,
      ...opts
    }),
    init: (opts) => {
      var _a;
      options.originalIndex = opts.originalIndex;
      const isRoot = !options.path && !options.id;
      route.parentRoute = (_a = options.getParentRoute) == null ? void 0 : _a.call(options);
      if (isRoot) route.path = rootRouteId;
      else if (!route.parentRoute) throw new Error(`Child Route instances must pass a 'getParentRoute: () => ParentRoute' option that returns a ServerRoute instance.`);
      let path = isRoot ? rootRouteId : options.path;
      if (path && path !== "/") path = trimPathLeft(path);
      const customId = options.id || path;
      let id = isRoot ? rootRouteId : joinPaths([route.parentRoute.id === rootRouteId ? "" : route.parentRoute.id, customId]);
      if (path === rootRouteId) path = "/";
      if (id !== rootRouteId) id = joinPaths(["/", id]);
      const fullPath = id === rootRouteId ? "/" : joinPaths([route.parentRoute.fullPath, path]);
      route.path = path;
      route.id = id;
      route.fullPath = fullPath;
      route.to = fullPath;
      route.isRoot = isRoot;
    },
    _addFileChildren: (children) => {
      if (Array.isArray(children)) route.children = children;
      if (typeof children === "object" && children !== null) route.children = Object.values(children);
      return route;
    },
    _addFileTypes: () => route
  };
  return route;
}
var createServerRootRoute = createServerRoute;
var createMethodBuilder = (__opts) => {
  return {
    _options: __opts || {},
    _types: {},
    middleware: (middlewares) => createMethodBuilder({
      ...__opts,
      middlewares
    }),
    handler: (handler) => createMethodBuilder({
      ...__opts,
      handler
    })
  };
};
var server_exports = /* @__PURE__ */ __exportAll({
  H3Error: () => H3Error,
  H3Event: () => H3Event,
  HEADERS: () => HEADERS,
  HTTPEventSymbol: () => HTTPEventSymbol,
  MIMES: () => MIMES,
  StartServer: () => StartServer,
  VIRTUAL_MODULES: () => VIRTUAL_MODULES,
  appendCorsHeaders: () => appendCorsHeaders$1,
  appendCorsPreflightHeaders: () => appendCorsPreflightHeaders$1,
  appendHeader: () => appendHeader$1,
  appendHeaders: () => appendHeaders$1,
  appendResponseHeader: () => appendResponseHeader$1,
  appendResponseHeaders: () => appendResponseHeaders$1,
  assertMethod: () => assertMethod$1,
  attachRouterServerSsrUtils: () => attachRouterServerSsrUtils,
  callNodeListener: () => callNodeListener,
  clearResponseHeaders: () => clearResponseHeaders$1,
  clearSession: () => clearSession$1,
  createApp: () => createApp,
  createAppEventHandler: () => createAppEventHandler,
  createError: () => createError,
  createEvent: () => createEvent,
  createRequestHandler: () => createRequestHandler,
  createRouter: () => createRouter,
  createServerFileRoute: () => createServerFileRoute,
  createServerRootRoute: () => createServerRootRoute,
  createServerRoute: () => createServerRoute,
  createStartHandler: () => createStartHandler,
  defaultContentType: () => defaultContentType$1,
  defaultRenderHandler: () => defaultRenderHandler,
  defaultStreamHandler: () => defaultStreamHandler,
  defineEventHandler: () => defineEventHandler$1,
  defineHandlerCallback: () => defineHandlerCallback$1,
  defineLazyEventHandler: () => defineLazyEventHandler,
  defineMiddleware: () => defineMiddleware,
  defineNodeListener: () => defineNodeListener,
  defineNodeMiddleware: () => defineNodeMiddleware,
  defineRequestMiddleware: () => defineRequestMiddleware,
  defineResponseMiddleware: () => defineResponseMiddleware,
  defineWebSocket: () => defineWebSocket,
  deleteCookie: () => deleteCookie$1,
  dynamicEventHandler: () => dynamicEventHandler,
  eventHandler: () => eventHandler$1,
  fetchWithEvent: () => fetchWithEvent$1,
  fromNodeMiddleware: () => fromNodeMiddleware,
  fromPlainHandler: () => fromPlainHandler,
  fromWebHandler: () => fromWebHandler,
  getContext: () => getContext,
  getCookie: () => getCookie$1,
  getEvent: () => getEvent,
  getHeader: () => getHeader$1,
  getHeaders: () => getHeaders$1,
  getProxyRequestHeaders: () => getProxyRequestHeaders$1,
  getQuery: () => getQuery$1,
  getRequestFingerprint: () => getRequestFingerprint$1,
  getRequestHeader: () => getRequestHeader$1,
  getRequestHeaders: () => getRequestHeaders$1,
  getRequestHost: () => getRequestHost$1,
  getRequestIP: () => getRequestIP$1,
  getRequestProtocol: () => getRequestProtocol$1,
  getRequestURL: () => getRequestURL$1,
  getRequestWebStream: () => getRequestWebStream$1,
  getResponseHeader: () => getResponseHeader$1,
  getResponseHeaders: () => getResponseHeaders$1,
  getResponseStatus: () => getResponseStatus$1,
  getResponseStatusText: () => getResponseStatusText$1,
  getRouterParam: () => getRouterParam$1,
  getRouterParams: () => getRouterParams$1,
  getSession: () => getSession$1,
  getValidatedQuery: () => getValidatedQuery$1,
  getValidatedRouterParams: () => getValidatedRouterParams$1,
  getWebRequest: () => getWebRequest,
  handleCacheHeaders: () => handleCacheHeaders$1,
  handleCors: () => handleCors$1,
  handleServerAction: () => handleServerAction,
  isCorsOriginAllowed: () => isCorsOriginAllowed,
  isError: () => isError,
  isEvent: () => isEvent,
  isEventHandler: () => isEventHandler,
  isMethod: () => isMethod$1,
  isPreflightRequest: () => isPreflightRequest$1,
  isStream: () => isStream,
  isWebResponse: () => isWebResponse,
  lazyEventHandler: () => lazyEventHandler,
  parseCookies: () => parseCookies$2,
  promisifyNodeListener: () => promisifyNodeListener,
  proxyRequest: () => proxyRequest$1,
  readBody: () => readBody$1,
  readFormData: () => readFormData$1,
  readMultipartFormData: () => readMultipartFormData$1,
  readRawBody: () => readRawBody$1,
  readValidatedBody: () => readValidatedBody$1,
  removeResponseHeader: () => removeResponseHeader$1,
  requestHandler: () => requestHandler,
  runWithEvent: () => runWithEvent,
  sanitizeStatusCode: () => sanitizeStatusCode,
  sanitizeStatusMessage: () => sanitizeStatusMessage,
  sealSession: () => sealSession$1,
  send: () => send$1,
  sendError: () => sendError$1,
  sendNoContent: () => sendNoContent$1,
  sendProxy: () => sendProxy$1,
  sendRedirect: () => sendRedirect$1,
  sendStream: () => sendStream$1,
  sendWebResponse: () => sendWebResponse$1,
  serveStatic: () => serveStatic,
  setContext: () => setContext,
  setCookie: () => setCookie$2,
  setHeader: () => setHeader$1,
  setHeaders: () => setHeaders$2,
  setResponseHeader: () => setResponseHeader$1,
  setResponseHeaders: () => setResponseHeaders$1,
  setResponseStatus: () => setResponseStatus$1,
  splitCookiesString: () => splitCookiesString,
  toEventHandler: () => toEventHandler,
  toNodeListener: () => toNodeListener,
  toPlainHandler: () => toPlainHandler,
  toWebHandler: () => toWebHandler,
  toWebRequest: () => toWebRequest,
  transformPipeableStreamWithRouter: () => transformPipeableStreamWithRouter,
  transformReadableStreamWithRouter: () => transformReadableStreamWithRouter,
  unsealSession: () => unsealSession$1,
  updateSession: () => updateSession$1,
  useBase: () => useBase,
  useSession: () => useSession$1,
  writeEarlyHints: () => writeEarlyHints$1
});
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
var createServerRpc = (functionId, serverBase, splitImportFn) => {
  invariant(splitImportFn, "\u{1F6A8}splitImportFn required for the server functions server runtime, but was not provided.");
  const sanitizedAppBase = sanitizeBase("/");
  const sanitizedServerBase = sanitizeBase(serverBase);
  const url = `${sanitizedAppBase ? `/${sanitizedAppBase}` : ``}/${sanitizedServerBase}/${functionId}`;
  return Object.assign(splitImportFn, {
    url,
    functionId
  });
};
function requireServerEnv(name) {
  var _a;
  const value = (_a = process.env[name]) == null ? void 0 : _a.trim();
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}
function getDatabaseUrl() {
  const databaseUrl = requireServerEnv("DATABASE_URL");
  if (databaseUrl.includes("[YOUR-PASSWORD]")) throw new Error("DATABASE_URL still contains the placeholder [YOUR-PASSWORD]. Replace it with your real database password.");
  return databaseUrl;
}
function getSupabaseServerEnv() {
  return {
    supabaseUrl: requireServerEnv("SUPABASE_URL"),
    supabaseAnonKey: requireServerEnv("SUPABASE_ANON_KEY")
  };
}
var { parseCookies: parseCookies$1, setCookie: setCookie$1, setHeaders: setHeaders$1 } = server_exports;
function getSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseServerEnv();
  return createServerClient(supabaseUrl, supabaseAnonKey, { cookies: {
    getAll() {
      const cookies = parseCookies$1();
      return Object.entries(cookies).map(([name, value]) => ({
        name,
        value
      }));
    },
    setAll(cookiesToSet, headers) {
      for (const { name, value, options } of cookiesToSet) setCookie$1(name, value, options);
      setHeaders$1(headers);
    }
  } });
}
var globalForPrisma = globalThis;
function createPrismaClient() {
  return new PrismaClient({ datasources: { db: { url: getDatabaseUrl() } } });
}
function getPrismaClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  return client;
}
var prisma = new Proxy({}, { get(_target, prop) {
  const client = getPrismaClient();
  const value = client[prop];
  return typeof value === "function" ? value.bind(client) : value;
} });

var projectRoleRank = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3
};
async function syncUserFromAuth(authUser) {
  var _a, _b, _c, _d, _e;
  const email = (_a = authUser.email) == null ? void 0 : _a.trim();
  if (!email) throw new Error("Authenticated user is missing an email address");
  const fullName = (_c = (_b = authUser.user_metadata) == null ? void 0 : _b.full_name) != null ? _c : null;
  const avatarUrl = (_e = (_d = authUser.user_metadata) == null ? void 0 : _d.avatar_url) != null ? _e : null;
  return prisma.$transaction(async (tx) => {
    const existingById = await tx.user.findUnique({ where: { id: authUser.id } });
    const existingByEmail = await tx.user.findUnique({ where: { email } });
    if (!existingById && !existingByEmail) return tx.user.create({ data: {
      id: authUser.id,
      email,
      fullName,
      avatarUrl
    } });
    if (!existingByEmail || existingByEmail.id === authUser.id) return tx.user.update({
      where: { id: authUser.id },
      data: {
        email,
        fullName,
        avatarUrl
      }
    });
    const canonicalUser = existingById != null ? existingById : await tx.user.create({ data: {
      id: authUser.id,
      email: `${authUser.id}@sync.local.invalid`,
      fullName,
      avatarUrl
    } });
    const duplicateUser = existingByEmail;
    const duplicateMemberships = await tx.projectMember.findMany({ where: { userId: duplicateUser.id } });
    const canonicalMemberships = await tx.projectMember.findMany({ where: { userId: canonicalUser.id } });
    const canonicalMembershipsByProject = new Map(canonicalMemberships.map((membership) => [membership.projectId, membership]));
    for (const membership of duplicateMemberships) {
      const canonicalMembership = canonicalMembershipsByProject.get(membership.projectId);
      if (!canonicalMembership) {
        await tx.projectMember.update({
          where: { id: membership.id },
          data: { userId: canonicalUser.id }
        });
        continue;
      }
      if (projectRoleRank[membership.role] > projectRoleRank[canonicalMembership.role]) await tx.projectMember.update({
        where: { id: canonicalMembership.id },
        data: { role: membership.role }
      });
      await tx.projectMember.delete({ where: { id: membership.id } });
    }
    await tx.project.updateMany({
      where: { ownerId: duplicateUser.id },
      data: { ownerId: canonicalUser.id }
    });
    await tx.task.updateMany({
      where: { creatorId: duplicateUser.id },
      data: { creatorId: canonicalUser.id }
    });
    await tx.task.updateMany({
      where: { assigneeId: duplicateUser.id },
      data: { assigneeId: canonicalUser.id }
    });
    await tx.taskComment.updateMany({
      where: { authorId: duplicateUser.id },
      data: { authorId: canonicalUser.id }
    });
    await tx.user.delete({ where: { id: duplicateUser.id } });
    return tx.user.update({
      where: { id: canonicalUser.id },
      data: {
        email,
        fullName,
        avatarUrl
      }
    });
  });
}
var fetchUser_createServerFn_handler = createServerRpc("src_server_auth_ts--fetchUser_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return fetchUser.__executeServer(opts, signal);
});
var fetchUser = createServerFn({ method: "GET" }).handler(fetchUser_createServerFn_handler, async () => {
  const { data: { user: authUser } } = await getSupabaseServerClient().auth.getUser();
  if (!authUser) return null;
  return await syncUserFromAuth(authUser);
});
var loginFn_createServerFn_handler = createServerRpc("src_server_auth_ts--loginFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return loginFn.__executeServer(opts, signal);
});
var loginFn = createServerFn({ method: "POST" }).validator((data) => data).handler(loginFn_createServerFn_handler, async ({ data }) => {
  const { error } = await getSupabaseServerClient().auth.signInWithPassword({
    email: data.email,
    password: data.password
  });
  if (error) return { error: error.message };
  return { error: null };
});
var signupFn_createServerFn_handler = createServerRpc("src_server_auth_ts--signupFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return signupFn.__executeServer(opts, signal);
});
var signupFn = createServerFn({ method: "POST" }).validator((data) => data).handler(signupFn_createServerFn_handler, async ({ data }) => {
  const { error } = await getSupabaseServerClient().auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { full_name: data.fullName } }
  });
  if (error) return { error: error.message };
  return { error: null };
});
var logoutFn_createServerFn_handler = createServerRpc("src_server_auth_ts--logoutFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return logoutFn.__executeServer(opts, signal);
});
var logoutFn = createServerFn({ method: "POST" }).handler(logoutFn_createServerFn_handler, async () => {
  await getSupabaseServerClient().auth.signOut();
  return { success: true };
});

var getDashboardStats_createServerFn_handler = createServerRpc("src_server_dashboard_ts--getDashboardStats_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getDashboardStats.__executeServer(opts, signal);
});
var getDashboardStats = createServerFn({ method: "GET" }).handler(getDashboardStats_createServerFn_handler, async () => {
  const { data: { user } } = await getSupabaseServerClient().auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const projectIds = (await prisma.projectMember.findMany({
    where: { userId: user.id },
    select: { projectId: true }
  })).map((m) => m.projectId);
  const [totalTasks, completedTasks, overdueTasks, recentTasks, dueSoonTasks] = await Promise.all([
    prisma.task.count({ where: { projectId: { in: projectIds } } }),
    prisma.task.count({ where: {
      projectId: { in: projectIds },
      status: "DONE"
    } }),
    prisma.task.count({ where: {
      projectId: { in: projectIds },
      status: { notIn: ["DONE", "CANCELLED"] },
      dueDate: { lt: /* @__PURE__ */ new Date() }
    } }),
    prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      include: { project: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.task.findMany({
      where: {
        projectId: { in: projectIds },
        status: { notIn: ["DONE", "CANCELLED"] },
        dueDate: {
          gte: /* @__PURE__ */ new Date(),
          lte: new Date(Date.now() + 10080 * 60 * 1e3)
        }
      },
      include: { project: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
      take: 8
    })
  ]);
  return {
    totalProjects: projectIds.length,
    totalTasks,
    completedTasks,
    overdueTasks,
    recentTasks,
    dueSoonTasks
  };
});
var $$splitComponentImporter$9 = () => import('./dashboard-BWwcVDVW.mjs');
var Route$b = createFileRoute("/_authed/dashboard")({
  loader: () => getDashboardStats(),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});

async function getAuthUser$1() {
  const { data: { user } } = await getSupabaseServerClient().auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
var getUserProjects_createServerFn_handler = createServerRpc("src_server_projects_ts--getUserProjects_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getUserProjects.__executeServer(opts, signal);
});
var getUserProjects = createServerFn({ method: "GET" }).handler(getUserProjects_createServerFn_handler, async () => {
  const authUser = await getAuthUser$1();
  return (await prisma.projectMember.findMany({
    where: { userId: authUser.id },
    include: { project: { include: { _count: { select: { tasks: true } } } } },
    orderBy: { project: { updatedAt: "desc" } }
  })).map((m) => ({
    ...m.project,
    role: m.role
  }));
});
var getProject_createServerFn_handler = createServerRpc("src_server_projects_ts--getProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getProject.__executeServer(opts, signal);
});
var getProject = createServerFn({ method: "GET" }).validator((data) => data).handler(getProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership) throw new Error("Not a member of this project");
  return {
    ...await prisma.project.findUniqueOrThrow({
      where: { id: data.projectId },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: "asc" }
        },
        _count: { select: { tasks: true } }
      }
    }),
    currentUserRole: membership.role
  };
});
var createProject_createServerFn_handler = createServerRpc("src_server_projects_ts--createProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return createProject.__executeServer(opts, signal);
});
var createProject = createServerFn({ method: "POST" }).validator((data) => data).handler(createProject_createServerFn_handler, async ({ data }) => {
  var _a, _b;
  const authUser = await getAuthUser$1();
  return await prisma.project.create({ data: {
    name: data.name,
    description: (_a = data.description) != null ? _a : null,
    color: (_b = data.color) != null ? _b : "#3b82f6",
    ownerId: authUser.id,
    members: { create: {
      userId: authUser.id,
      role: ProjectRole.OWNER
    } }
  } });
});
var updateProject_createServerFn_handler = createServerRpc("src_server_projects_ts--updateProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return updateProject.__executeServer(opts, signal);
});
var updateProject = createServerFn({ method: "POST" }).validator((data) => data).handler(updateProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  return await prisma.project.update({
    where: { id: data.projectId },
    data: {
      ...data.name !== void 0 && { name: data.name },
      ...data.description !== void 0 && { description: data.description },
      ...data.color !== void 0 && { color: data.color }
    }
  });
});
var deleteProject_createServerFn_handler = createServerRpc("src_server_projects_ts--deleteProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return deleteProject.__executeServer(opts, signal);
});
var deleteProject = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || membership.role !== "OWNER") throw new Error("Only the owner can delete a project");
  await prisma.project.delete({ where: { id: data.projectId } });
  return { success: true };
});
var addProjectMember_createServerFn_handler = createServerRpc("src_server_projects_ts--addProjectMember_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return addProjectMember.__executeServer(opts, signal);
});
var addProjectMember = createServerFn({ method: "POST" }).validator((data) => data).handler(addProjectMember_createServerFn_handler, async ({ data }) => {
  var _a;
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  const targetUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (!targetUser) return { error: "User not found with that email" };
  if (await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: targetUser.id
  } } })) return { error: "User is already a member" };
  await prisma.projectMember.create({ data: {
    projectId: data.projectId,
    userId: targetUser.id,
    role: (_a = data.role) != null ? _a : ProjectRole.MEMBER
  } });
  return { error: null };
});
var removeProjectMember_createServerFn_handler = createServerRpc("src_server_projects_ts--removeProjectMember_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return removeProjectMember.__executeServer(opts, signal);
});
var removeProjectMember = createServerFn({ method: "POST" }).validator((data) => data).handler(removeProjectMember_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  if (data.userId === authUser.id) throw new Error("Cannot remove yourself");
  await prisma.projectMember.delete({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: data.userId
  } } });
  return { success: true };
});

var $$splitComponentImporter$8 = () => import('./projects.index-CkK-jzAN.mjs');
var Route$a = createFileRoute("/_authed/projects/")({
  loader: () => getUserProjects(),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});

var $$splitComponentImporter$7 = () => import('./projects._projectId-Bnt1VQT-.mjs');
var Route$9 = createFileRoute("/_authed/projects/$projectId")({
  loader: ({ params }) => getProject({ data: { projectId: params.projectId } }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});

async function getAuthUser() {
  const { data: { user } } = await getSupabaseServerClient().auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
async function requireProjectMember(projectId, userId) {
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId,
    userId
  } } });
  if (!membership) throw new Error("Not a member of this project");
  return membership;
}
function clampIndex(index, max) {
  return Math.max(0, Math.min(index, max));
}
var getTasksByProject_createServerFn_handler = createServerRpc("src_server_tasks_ts--getTasksByProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getTasksByProject.__executeServer(opts, signal);
});
var getTasksByProject = createServerFn({ method: "GET" }).validator((data) => data).handler(getTasksByProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember(data.projectId, authUser.id);
  const where = { projectId: data.projectId };
  if (data.status) where.status = data.status;
  if (data.priority) where.priority = data.priority;
  if (data.assigneeId) where.assigneeId = data.assigneeId;
  if (data.search) where.OR = [{ title: {
    contains: data.search,
    mode: "insensitive"
  } }, { description: {
    contains: data.search,
    mode: "insensitive"
  } }];
  return prisma.task.findMany({
    where,
    include: {
      creator: true,
      assignee: true,
      _count: { select: { comments: true } }
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }]
  });
});
var getTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--getTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getTask.__executeServer(opts, signal);
});
var getTask = createServerFn({ method: "GET" }).validator((data) => data).handler(getTask_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  const task = await prisma.task.findUniqueOrThrow({
    where: { id: data.taskId },
    include: {
      creator: true,
      assignee: true,
      project: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  await requireProjectMember(task.projectId, authUser.id);
  return task;
});
var createTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--createTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return createTask.__executeServer(opts, signal);
});
var createTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createTask_createServerFn_handler, async ({ data }) => {
  var _a, _b, _c, _d, _e, _f;
  const authUser = await getAuthUser();
  await requireProjectMember(data.projectId, authUser.id);
  const maxPosition = await prisma.task.aggregate({
    where: {
      projectId: data.projectId,
      status: (_a = data.status) != null ? _a : "TODO"
    },
    _max: { position: true }
  });
  return prisma.task.create({
    data: {
      title: data.title,
      description: (_b = data.description) != null ? _b : null,
      status: (_c = data.status) != null ? _c : "TODO",
      priority: (_d = data.priority) != null ? _d : "NONE",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      position: ((_e = maxPosition._max.position) != null ? _e : -1) + 1,
      projectId: data.projectId,
      creatorId: authUser.id,
      assigneeId: (_f = data.assigneeId) != null ? _f : null
    },
    include: {
      creator: true,
      assignee: true
    }
  });
});
var updateTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--updateTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return updateTask.__executeServer(opts, signal);
});
var updateTask = createServerFn({ method: "POST" }).validator((data) => data).handler(updateTask_createServerFn_handler, async ({ data }) => {
  var _a;
  const authUser = await getAuthUser();
  const task = await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } });
  await requireProjectMember(task.projectId, authUser.id);
  const updateData = {};
  if (data.title !== void 0) updateData.title = data.title;
  if (data.description !== void 0) updateData.description = data.description;
  if (data.status !== void 0) {
    updateData.status = data.status;
    if (data.status !== task.status) updateData.position = ((_a = (await prisma.task.aggregate({
      where: {
        projectId: task.projectId,
        status: data.status
      },
      _max: { position: true }
    }))._max.position) != null ? _a : -1) + 1;
  }
  if (data.priority !== void 0) updateData.priority = data.priority;
  if (data.dueDate !== void 0) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.assigneeId !== void 0) updateData.assigneeId = data.assigneeId;
  return prisma.task.update({
    where: { id: data.taskId },
    data: updateData,
    include: {
      creator: true,
      assignee: true
    }
  });
});
var moveTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--moveTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return moveTask.__executeServer(opts, signal);
});
var moveTask = createServerFn({ method: "POST" }).validator((data) => data).handler(moveTask_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
  return prisma.$transaction(async (tx) => {
    const currentTask = await tx.task.findUniqueOrThrow({ where: { id: data.taskId } });
    const sourceWithoutCurrent = (await tx.task.findMany({
      where: {
        projectId: currentTask.projectId,
        status: currentTask.status
      },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }]
    })).filter((sourceTask) => sourceTask.id !== currentTask.id);
    if (currentTask.status === data.targetStatus) {
      const nextIndex = clampIndex(data.targetIndex, sourceWithoutCurrent.length);
      const reorderedTasks = [
        ...sourceWithoutCurrent.slice(0, nextIndex),
        currentTask,
        ...sourceWithoutCurrent.slice(nextIndex)
      ];
      await Promise.all(reorderedTasks.map((reorderedTask, index) => tx.task.update({
        where: { id: reorderedTask.id },
        data: { position: index }
      })));
    } else {
      const targetTasks = await tx.task.findMany({
        where: {
          projectId: currentTask.projectId,
          status: data.targetStatus
        },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }]
      });
      const nextIndex = clampIndex(data.targetIndex, targetTasks.length);
      const reorderedTargetTasks = [
        ...targetTasks.slice(0, nextIndex),
        currentTask,
        ...targetTasks.slice(nextIndex)
      ];
      await Promise.all([...sourceWithoutCurrent.map((sourceTask, index) => tx.task.update({
        where: { id: sourceTask.id },
        data: { position: index }
      })), ...reorderedTargetTasks.map((targetTask, index) => tx.task.update({
        where: { id: targetTask.id },
        data: targetTask.id === currentTask.id ? {
          status: data.targetStatus,
          position: index
        } : { position: index }
      }))]);
    }
    return tx.task.findUniqueOrThrow({
      where: { id: data.taskId },
      include: {
        creator: true,
        assignee: true,
        _count: { select: { comments: true } }
      }
    });
  });
});
var deleteTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--deleteTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return deleteTask.__executeServer(opts, signal);
});
var deleteTask = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteTask_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
  await prisma.task.delete({ where: { id: data.taskId } });
  return { success: true };
});
var addComment_createServerFn_handler = createServerRpc("src_server_tasks_ts--addComment_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return addComment.__executeServer(opts, signal);
});
var addComment = createServerFn({ method: "POST" }).validator((data) => data).handler(addComment_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
  return prisma.taskComment.create({
    data: {
      content: data.content,
      taskId: data.taskId,
      authorId: authUser.id
    },
    include: { author: true }
  });
});
var getProjectMembers_createServerFn_handler = createServerRpc("src_server_tasks_ts--getProjectMembers_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getProjectMembers.__executeServer(opts, signal);
});
var getProjectMembers = createServerFn({ method: "GET" }).validator((data) => data).handler(getProjectMembers_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember(data.projectId, authUser.id);
  return prisma.projectMember.findMany({
    where: { projectId: data.projectId },
    include: { user: true }
  });
});
var deleteComment_createServerFn_handler = createServerRpc("src_server_tasks_ts--deleteComment_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return deleteComment.__executeServer(opts, signal);
});
var deleteComment = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteComment_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  if ((await prisma.taskComment.findUniqueOrThrow({ where: { id: data.commentId } })).authorId !== authUser.id) throw new Error("Not authorized to delete this comment");
  await prisma.taskComment.delete({ where: { id: data.commentId } });
  return { success: true };
});
var $$splitComponentImporter$6 = () => import('./projects._projectId.index-BikboFA3.mjs');
var Route$8 = createFileRoute("/_authed/projects/$projectId/")({
  loader: ({ params }) => getTasksByProject({ data: { projectId: params.projectId } }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});

var $$splitComponentImporter$5 = () => import('./projects._projectId.settings-CXsAQwY8.mjs');
var Route$7 = createFileRoute("/_authed/projects/$projectId/settings")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });

var app_default = "/assets/app-fCCDN7CO.css";
var Route$6 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      { title: "ProVisioners TaskFlow " }
    ],
    links: [{
      rel: "stylesheet",
      href: app_default
    }, {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    }]
  }),
  beforeLoad: async () => {
    return { user: await fetchUser() };
  },
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx(HeadContent, {}), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` } })] }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Scripts, {})] })]
  });
}
var $$splitComponentImporter$4 = () => import('./signup-DvWFwobi.mjs');
var Route$5 = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: "/dashboard" });
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import('./login-Calg2pxF.mjs');
var Route$4 = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: "/dashboard" });
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import('./_authed-Csat12Dk.mjs');
var Route$3 = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    return { user: context.user };
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$2 = createFileRoute("/")({ beforeLoad: ({ context }) => {
  if (context.user) throw redirect({ to: "/dashboard" });
  throw redirect({ to: "/login" });
} });
var $$splitComponentImporter$1 = () => import('./projects-B_SxLDT2.mjs');
var Route$1 = createFileRoute("/_authed/projects")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import('./projects.new-DMXpzwa6.mjs');
var Route = createFileRoute("/_authed/projects/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SignupRoute = Route$5.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$6
});
var LoginRoute = Route$4.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$6
});
var AuthedRoute = Route$3.update({
  id: "/_authed",
  getParentRoute: () => Route$6
});
var IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
var AuthedProjectsRoute = Route$1.update({
  id: "/projects",
  path: "/projects",
  getParentRoute: () => AuthedRoute
});
var AuthedDashboardRoute = Route$b.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthedRoute
});
var AuthedProjectsIndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsNewRoute = Route.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsProjectIdRoute = Route$9.update({
  id: "/$projectId",
  path: "/$projectId",
  getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsProjectIdIndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthedProjectsProjectIdRoute
});
var AuthedProjectsProjectIdRouteChildren = {
  AuthedProjectsProjectIdSettingsRoute: Route$7.update({
    id: "/settings",
    path: "/settings",
    getParentRoute: () => AuthedProjectsProjectIdRoute
  }),
  AuthedProjectsProjectIdIndexRoute
};
var AuthedProjectsRouteChildren = {
  AuthedProjectsProjectIdRoute: AuthedProjectsProjectIdRoute._addFileChildren(AuthedProjectsProjectIdRouteChildren),
  AuthedProjectsNewRoute,
  AuthedProjectsIndexRoute
};
var AuthedRouteChildren = {
  AuthedDashboardRoute,
  AuthedProjectsRoute: AuthedProjectsRoute._addFileChildren(AuthedProjectsRouteChildren)
};
var rootRouteChildren = {
  IndexRoute,
  AuthedRoute: AuthedRoute._addFileChildren(AuthedRouteChildren),
  LoginRoute,
  SignupRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();

//#region src/router.tsx
function createRouter$1() {
	return createRouter$3({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent"
	});
}
//#endregion
//#region /~start/default-server-entry.tsx
var default_server_entry_default = createStartHandler({ createRouter: createRouter$1 })(defaultStreamHandler);
//#endregion
//#region /~start/server-entry.tsx
var server_entry_default = defineEventHandler$1(function(event) {
	return default_server_entry_default({ request: toWebRequest(event) });
});

const ssr = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: server_entry_default
});

const routeTree_genZPSO4hcL = /*#__PURE__*/Object.freeze({
  __proto__: null,
  routeTree: routeTree
});

export { prisma as A, ssr as B, Route$b as R, logoutFn as a, Route$a as b, createProject as c, Route$9 as d, Route$8 as e, getTasksByProject as f, getUserProjects as g, getTask as h, getProjectMembers as i, createTask as j, deleteTask as k, loginFn as l, moveTask as m, deleteComment as n, addComment as o, Route$7 as p, updateProject as q, addProjectMember as r, signupFn as s, getProject as t, updateTask as u, removeProjectMember as v, deleteProject as w, createServerRpc as x, createServerFn as y, getSupabaseServerClient as z };
//# sourceMappingURL=routeTree.gen-ZPSO4hcL.mjs.map
