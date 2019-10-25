(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var componentOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 1096:
/*!******************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/uni-calendar/calendar.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /**
                                                                                                     * @1900-2100区间内的公历、农历互转
                                                                                                     * @charset UTF-8
                                                                                                     * @github  https://github.com/jjonline/calendar.js
                                                                                                     * @Author  Jea杨(JJonline@JJonline.Cn)
                                                                                                     * @Time    2014-7-21
                                                                                                     * @Time    2016-8-13 Fixed 2033hex、Attribution Annals
                                                                                                     * @Time    2016-9-25 Fixed lunar LeapMonth Param Bug
                                                                                                     * @Time    2017-7-24 Fixed use getTerm Func Param Error.use solar year,NOT lunar year
                                                                                                     * @Version 1.0.3
                                                                                                     * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
                                                                                                     * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
                                                                                                     */
var calendar = {

  /**
                   * 农历1900-2100的润大小信息表
                   * @Array Of Property
                   * @return Hex
                   */
  lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
  /**Add By JJonline@JJonline.Cn**/
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
  0x0d520], //2100

  /**
    * 公历每个月份的天数普通表
    * @Array Of Property
    * @return Number
    */
  solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

  /**
                                                                  * 天干地支之天干速查表
                                                                  * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
                                                                  * @return Cn string
                                                                  */
  Gan: ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"],

  /**
                                                                                                               * 天干地支之地支速查表
                                                                                                               * @Array Of Property
                                                                                                               * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
                                                                                                               * @return Cn string
                                                                                                               */
  Zhi: ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"],

  /**
                                                                                                                                   * 天干地支之地支速查表<=>生肖
                                                                                                                                   * @Array Of Property
                                                                                                                                   * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
                                                                                                                                   * @return Cn string
                                                                                                                                   */
  Animals: ["\u9F20", "\u725B", "\u864E", "\u5154", "\u9F99", "\u86C7", "\u9A6C", "\u7F8A", "\u7334", "\u9E21", "\u72D7", "\u732A"],

  /**
                                                                                                                                       * 24节气速查表
                                                                                                                                       * @Array Of Property
                                                                                                                                       * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
                                                                                                                                       * @return Cn string
                                                                                                                                       */
  solarTerm: ["\u5C0F\u5BD2", "\u5927\u5BD2", "\u7ACB\u6625", "\u96E8\u6C34", "\u60CA\u86F0", "\u6625\u5206", "\u6E05\u660E", "\u8C37\u96E8", "\u7ACB\u590F", "\u5C0F\u6EE1", "\u8292\u79CD", "\u590F\u81F3", "\u5C0F\u6691", "\u5927\u6691", "\u7ACB\u79CB", "\u5904\u6691", "\u767D\u9732", "\u79CB\u5206", "\u5BD2\u9732", "\u971C\u964D", "\u7ACB\u51AC", "\u5C0F\u96EA", "\u5927\u96EA", "\u51AC\u81F3"],

  /**
                                                                                                                                                                                                                                                                                                                                                                                                                 * 1900-2100各年的24节气日期速查表
                                                                                                                                                                                                                                                                                                                                                                                                                 * @Array Of Property
                                                                                                                                                                                                                                                                                                                                                                                                                 * @return 0x string For splice
                                                                                                                                                                                                                                                                                                                                                                                                                 */
  sTermInfo: ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
  '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
  'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
  '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
  '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
  '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
  '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
  '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
  '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
  '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'],

  /**
                                                                                                           * 数字转中文速查表
                                                                                                           * @Array Of Property
                                                                                                           * @trans ['日','一','二','三','四','五','六','七','八','九','十']
                                                                                                           * @return Cn string
                                                                                                           */
  nStr1: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341"],

  /**
                                                                                                                           * 日期转农历称呼速查表
                                                                                                                           * @Array Of Property
                                                                                                                           * @trans ['初','十','廿','卅']
                                                                                                                           * @return Cn string
                                                                                                                           */
  nStr2: ["\u521D", "\u5341", "\u5EFF", "\u5345"],

  /**
                                                     * 月份转农历称呼速查表
                                                     * @Array Of Property
                                                     * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
                                                     * @return Cn string
                                                     */
  nStr3: ["\u6B63", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u51AC", "\u814A"],

  /**
                                                                                                                                     * 返回农历y年一整年的总天数
                                                                                                                                     * @param lunar Year
                                                                                                                                     * @return Number
                                                                                                                                     * @eg:var count = calendar.lYearDays(1987) ;//count=387
                                                                                                                                     */
  lYearDays: function lYearDays(y) {
    var i,sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {sum += this.lunarInfo[y - 1900] & i ? 1 : 0;}
    return sum + this.leapDays(y);
  },

  /**
       * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
       * @param lunar Year
       * @return Number (0-12)
       * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
       */
  leapMonth: function leapMonth(y) {//闰字编码 \u95f0
    return this.lunarInfo[y - 1900] & 0xf;
  },

  /**
       * 返回农历y年闰月的天数 若该年没有闰月则返回0
       * @param lunar Year
       * @return Number (0、29、30)
       * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
       */
  leapDays: function leapDays(y) {
    if (this.leapMonth(y)) {
      return this.lunarInfo[y - 1900] & 0x10000 ? 30 : 29;
    }
    return 0;
  },

  /**
       * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
       * @param lunar Year
       * @return Number (-1、29、30)
       * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
       */
  monthDays: function monthDays(y, m) {
    if (m > 12 || m < 1) {return -1;} //月份参数从1至12，参数错误返回-1
    return this.lunarInfo[y - 1900] & 0x10000 >> m ? 30 : 29;
  },

  /**
       * 返回公历(!)y年m月的天数
       * @param solar Year
       * @return Number (-1、28、29、30、31)
       * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
       */
  solarDays: function solarDays(y, m) {
    if (m > 12 || m < 1) {return -1;} //若参数错误 返回-1
    var ms = m - 1;
    if (ms == 1) {//2月份的闰平规律测算后确认返回28或29
      return y % 4 == 0 && y % 100 != 0 || y % 400 == 0 ? 29 : 28;
    } else {
      return this.solarMonth[ms];
    }
  },

  /**
      * 农历年份转换为干支纪年
      * @param  lYear 农历年的年份数
      * @return Cn string
      */
  toGanZhiYear: function toGanZhiYear(lYear) {
    var ganKey = (lYear - 3) % 10;
    var zhiKey = (lYear - 3) % 12;
    if (ganKey == 0) ganKey = 10; //如果余数为0则为最后一个天干
    if (zhiKey == 0) zhiKey = 12; //如果余数为0则为最后一个地支
    return this.Gan[ganKey - 1] + this.Zhi[zhiKey - 1];

  },

  /**
      * 公历月、日判断所属星座
      * @param  cMonth [description]
      * @param  cDay [description]
      * @return Cn string
      */
  toAstro: function toAstro(cMonth, cDay) {
    var s = "\u9B54\u7FAF\u6C34\u74F6\u53CC\u9C7C\u767D\u7F8A\u91D1\u725B\u53CC\u5B50\u5DE8\u87F9\u72EE\u5B50\u5904\u5973\u5929\u79E4\u5929\u874E\u5C04\u624B\u9B54\u7FAF";
    var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + "\u5EA7"; //座
  },

  /**
       * 传入offset偏移量返回干支
       * @param offset 相对甲子的偏移量
       * @return Cn string
       */
  toGanZhi: function toGanZhi(offset) {
    return this.Gan[offset % 10] + this.Zhi[offset % 12];
  },

  /**
       * 传入公历(!)y年获得该年第n个节气的公历日期
       * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
       * @return day Number
       * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
       */
  getTerm: function getTerm(y, n) {
    if (y < 1900 || y > 2100) {return -1;}
    if (n < 1 || n > 24) {return -1;}
    var _table = this.sTermInfo[y - 1900];
    var _info = [
    parseInt('0x' + _table.substr(0, 5)).toString(),
    parseInt('0x' + _table.substr(5, 5)).toString(),
    parseInt('0x' + _table.substr(10, 5)).toString(),
    parseInt('0x' + _table.substr(15, 5)).toString(),
    parseInt('0x' + _table.substr(20, 5)).toString(),
    parseInt('0x' + _table.substr(25, 5)).toString()];

    var _calday = [
    _info[0].substr(0, 1),
    _info[0].substr(1, 2),
    _info[0].substr(3, 1),
    _info[0].substr(4, 2),

    _info[1].substr(0, 1),
    _info[1].substr(1, 2),
    _info[1].substr(3, 1),
    _info[1].substr(4, 2),

    _info[2].substr(0, 1),
    _info[2].substr(1, 2),
    _info[2].substr(3, 1),
    _info[2].substr(4, 2),

    _info[3].substr(0, 1),
    _info[3].substr(1, 2),
    _info[3].substr(3, 1),
    _info[3].substr(4, 2),

    _info[4].substr(0, 1),
    _info[4].substr(1, 2),
    _info[4].substr(3, 1),
    _info[4].substr(4, 2),

    _info[5].substr(0, 1),
    _info[5].substr(1, 2),
    _info[5].substr(3, 1),
    _info[5].substr(4, 2)];

    return parseInt(_calday[n - 1]);
  },

  /**
       * 传入农历数字月份返回汉语通俗表示法
       * @param lunar month
       * @return Cn string
       * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
       */
  toChinaMonth: function toChinaMonth(m) {// 月 => \u6708
    if (m > 12 || m < 1) {return -1;} //若参数错误 返回-1
    var s = this.nStr3[m - 1];
    s += "\u6708"; //加上月字
    return s;
  },

  /**
       * 传入农历日期数字返回汉字表示法
       * @param lunar day
       * @return Cn string
       * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
       */
  toChinaDay: function toChinaDay(d) {//日 => \u65e5
    var s;
    switch (d) {
      case 10:
        s = "\u521D\u5341";break;
      case 20:
        s = "\u4E8C\u5341";break;
        break;
      case 30:
        s = "\u4E09\u5341";break;
        break;
      default:
        s = this.nStr2[Math.floor(d / 10)];
        s += this.nStr1[d % 10];}

    return s;
  },

  /**
       * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
       * @param y year
       * @return Cn string
       * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
       */
  getAnimal: function getAnimal(y) {
    return this.Animals[(y - 4) % 12];
  },

  /**
       * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
       * @param y  solar year
       * @param m  solar month
       * @param d  solar day
       * @return JSON object
       * @eg:console.log(calendar.solar2lunar(1987,11,01));
       */
  solar2lunar: function solar2lunar(y, m, d) {//参数区间1900.1.31~2100.12.31
    //年份限定、上限
    if (y < 1900 || y > 2100) {
      return -1; // undefined转换为数字变为NaN
    }
    //公历传参最下限
    if (y == 1900 && m == 1 && d < 31) {
      return -1;
    }
    //未传参  获得当天
    if (!y) {
      var objDate = new Date();
    } else {
      var objDate = new Date(y, parseInt(m) - 1, d);
    }
    var i,leap = 0,temp = 0;
    //修正ymd参数
    var y = objDate.getFullYear(),
    m = objDate.getMonth() + 1,
    d = objDate.getDate();
    var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = this.lYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;i--;
    }

    //是否今天
    var isTodayObj = new Date(),
    isToday = false;
    if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
      isToday = true;
    }
    //星期几
    var nWeek = objDate.getDay(),
    cWeek = this.nStr1[nWeek];
    //数字表示周几顺应天朝周一开始的惯例
    if (nWeek == 0) {
      nWeek = 7;
    }
    //农历年
    var year = i;
    var leap = this.leapMonth(i); //闰哪个月
    var isLeap = false;

    //效验闰月
    for (i = 1; i < 13 && offset > 0; i++) {
      //闰月
      if (leap > 0 && i == leap + 1 && isLeap == false) {
        --i;
        isLeap = true;temp = this.leapDays(year); //计算农历闰月天数
      } else
      {
        temp = this.monthDays(year, i); //计算农历普通月天数
      }
      //解除闰月
      if (isLeap == true && i == leap + 1) {isLeap = false;}
      offset -= temp;
    }
    // 闰月导致数组下标重叠取反
    if (offset == 0 && leap > 0 && i == leap + 1)
    {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;--i;
      }
    }
    if (offset < 0)
    {
      offset += temp;--i;
    }
    //农历月
    var month = i;
    //农历日
    var day = offset + 1;
    //天干地支处理
    var sm = m - 1;
    var gzY = this.toGanZhiYear(year);

    // 当月的两个节气
    // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
    var firstNode = this.getTerm(y, m * 2 - 1); //返回当月「节」为几日开始
    var secondNode = this.getTerm(y, m * 2); //返回当月「节」为几日开始

    // 依据12节气修正干支月
    var gzM = this.toGanZhi((y - 1900) * 12 + m + 11);
    if (d >= firstNode) {
      gzM = this.toGanZhi((y - 1900) * 12 + m + 12);
    }

    //传入的日期的节气与否
    var isTerm = false;
    var Term = null;
    if (firstNode == d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 2];
    }
    if (secondNode == d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 1];
    }
    //日柱 当月一日与 1900/1/1 相差天数
    var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
    var gzD = this.toGanZhi(dayCyclical + d - 1);
    //该日期所属的星座
    var astro = this.toAstro(m, d);

    return { 'lYear': year, 'lMonth': month, 'lDay': day, 'Animal': this.getAnimal(year), 'IMonthCn': (isLeap ? "\u95F0" : '') + this.toChinaMonth(month), 'IDayCn': this.toChinaDay(day), 'cYear': y, 'cMonth': m, 'cDay': d, 'gzYear': gzY, 'gzMonth': gzM, 'gzDay': gzD, 'isToday': isToday, 'isLeap': isLeap, 'nWeek': nWeek, 'ncWeek': "\u661F\u671F" + cWeek, 'isTerm': isTerm, 'Term': Term, 'astro': astro };
  },

  /**
       * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
       * @param y  lunar year
       * @param m  lunar month
       * @param d  lunar day
       * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
       * @return JSON object
       * @eg:console.log(calendar.lunar2solar(1987,9,10));
       */
  lunar2solar: function lunar2solar(y, m, d, isLeapMonth) {//参数区间1900.1.31~2100.12.1
    var isLeapMonth = !!isLeapMonth;
    var leapOffset = 0;
    var leapMonth = this.leapMonth(y);
    var leapDay = this.leapDays(y);
    if (isLeapMonth && leapMonth != m) {return -1;} //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
    if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) {return -1;} //超出了最大极限值
    var day = this.monthDays(y, m);
    var _day = day;
    //bugFix 2016-9-25
    //if month is leap, _day use leapDays method
    if (isLeapMonth) {
      _day = this.leapDays(y, m);
    }
    if (y < 1900 || y > 2100 || d > _day) {return -1;} //参数合法性效验

    //计算农历的时间差
    var offset = 0;
    for (var i = 1900; i < y; i++) {
      offset += this.lYearDays(i);
    }
    var leap = 0,isAdd = false;
    for (var i = 1; i < m; i++) {
      leap = this.leapMonth(y);
      if (!isAdd) {//处理闰月
        if (leap <= i && leap > 0) {
          offset += this.leapDays(y);isAdd = true;
        }
      }
      offset += this.monthDays(y, i);
    }
    //转换闰月农历 需补充该年闰月的前一个月的时差
    if (isLeapMonth) {offset += day;}
    //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
    var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
    var calObj = new Date((offset + d - 31) * 86400000 + stmap);
    var cY = calObj.getUTCFullYear();
    var cM = calObj.getUTCMonth() + 1;
    var cD = calObj.getUTCDate();

    return this.solar2lunar(cY, cM, cD);
  } };var _default =



calendar;exports.default = _default;

/***/ }),

/***/ 1104:
/*!**********************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/uParse/src/libs/html2json.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;













var _wxDiscode = _interopRequireDefault(__webpack_require__(/*! ./wxDiscode */ 1105));
var _htmlparser = _interopRequireDefault(__webpack_require__(/*! ./htmlparser */ 1106));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                 * html2Json 改造来自: https://github.com/Jxck/html2json
                                                                                                                                                                 *
                                                                                                                                                                 *
                                                                                                                                                                 * author: Di (微信小程序开发工程师)
                                                                                                                                                                 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                                                                                 *               垂直微信小程序开发交流社区
                                                                                                                                                                 *
                                                                                                                                                                 * github地址: https://github.com/icindy/wxParse
                                                                                                                                                                 *
                                                                                                                                                                 * for: 微信小程序富文本解析
                                                                                                                                                                 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                                                                                 */function makeMap(str) {var obj = {};var items = str.split(',');for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}return obj;} // Block Elements - HTML 5
var block = makeMap('br,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video'); // Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

function removeDOCTYPE(html) {
  var isDocument = /<body.*>([^]*)<\/body>/.test(html);
  return isDocument ? RegExp.$1 : html;
}

function trimHtml(html) {
  return html.
  replace(/<!--.*?-->/gi, '').
  replace(/\/\*.*?\*\//gi, '').
  replace(/[ ]+</gi, '<').
  replace(/<script[^]*<\/script>/gi, '').
  replace(/<style[^]*<\/style>/gi, '');
}

function getScreenInfo() {
  var screen = {};
  wx.getSystemInfo({
    success: function success(res) {
      screen.width = res.windowWidth;
      screen.height = res.windowHeight;
    } });

  return screen;
}

function html2json(html, customHandler, imageProp, host) {
  // 处理字符串
  html = removeDOCTYPE(html);
  html = trimHtml(html);
  html = _wxDiscode.default.strDiscode(html);
  // 生成node节点
  var bufArray = [];
  var results = {
    nodes: [],
    imageUrls: [] };


  var screen = getScreenInfo();
  function Node(tag) {
    this.node = 'element';
    this.tag = tag;

    this.$screen = screen;
  }

  (0, _htmlparser.default)(html, {
    start: function start(tag, attrs, unary) {
      // node for this element
      var node = new Node(tag);

      if (bufArray.length !== 0) {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
      }

      if (block[tag]) {
        node.tagType = 'block';
      } else if (inline[tag]) {
        node.tagType = 'inline';
      } else if (closeSelf[tag]) {
        node.tagType = 'closeSelf';
      }

      node.attr = attrs.reduce(function (pre, attr) {var
        name = attr.name;var
        value = attr.value;
        if (name === 'class') {
          node.classStr = value;
        }
        // has multi attibutes
        // make it array of attribute
        if (name === 'style') {
          node.styleStr = value;
        }
        if (value.match(/ /)) {
          value = value.split(' ');
        }

        // if attr already exists
        // merge it
        if (pre[name]) {
          if (Array.isArray(pre[name])) {
            // already array, push to last
            pre[name].push(value);
          } else {
            // single value, make it array
            pre[name] = [pre[name], value];
          }
        } else {
          // not exist, put it
          pre[name] = value;
        }

        return pre;
      }, {});

      // 优化样式相关属性
      if (node.classStr) {
        node.classStr += " ".concat(node.tag);
      } else {
        node.classStr = node.tag;
      }
      if (node.tagType === 'inline') {
        node.classStr += ' inline';
      }

      // 对img添加额外数据
      if (node.tag === 'img') {
        var imgUrl = node.attr.src;
        imgUrl = _wxDiscode.default.urlToHttpUrl(imgUrl, imageProp.domain);
        Object.assign(node.attr, imageProp, {
          src: imgUrl || '' });

        if (imgUrl) {
          results.imageUrls.push(imgUrl);
        }
      }

      // 处理a标签属性
      if (node.tag === 'a') {
        node.attr.href = node.attr.href || '';
      }

      // 处理font标签样式属性
      if (node.tag === 'font') {
        var fontSize = [
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'xx-large',
        '-webkit-xxx-large'];

        var styleAttrs = {
          color: 'color',
          face: 'font-family',
          size: 'font-size' };

        if (!node.styleStr) node.styleStr = '';
        Object.keys(styleAttrs).forEach(function (key) {
          if (node.attr[key]) {
            var value = key === 'size' ? fontSize[node.attr[key] - 1] : node.attr[key];
            node.styleStr += "".concat(styleAttrs[key], ": ").concat(value, ";");
          }
        });
      }

      // 临时记录source资源
      if (node.tag === 'source') {
        results.source = node.attr.src;
      }

      if (customHandler.start) {
        customHandler.start(node, results);
      }

      if (unary) {
        // if this tag doesn't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var _parent = bufArray[0] || results;
        if (_parent.nodes === undefined) {
          _parent.nodes = [];
        }
        _parent.nodes.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function end(tag) {
      // merge into parent tag
      var node = bufArray.shift();
      if (node.tag !== tag) {
        console.error('invalid state: mismatch end tag');
      }

      // 当有缓存source资源时于于video补上src资源
      if (node.tag === 'video' && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }

      if (customHandler.end) {
        customHandler.end(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (!parent.nodes) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    },
    chars: function chars(text) {
      if (!text.trim()) return;

      var node = {
        node: 'text',
        text: text };


      if (customHandler.chars) {
        customHandler.chars(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    } });


  return results;
}var _default =

html2json;exports.default = _default;

/***/ }),

/***/ 1105:
/*!**********************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/uParse/src/libs/wxDiscode.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; // HTML 支持的数学符号
function strNumDiscode(str) {
  str = str.replace(/&forall;/g, '∀');
  str = str.replace(/&part;/g, '∂');
  str = str.replace(/&exist;/g, '∃');
  str = str.replace(/&empty;/g, '∅');
  str = str.replace(/&nabla;/g, '∇');
  str = str.replace(/&isin;/g, '∈');
  str = str.replace(/&notin;/g, '∉');
  str = str.replace(/&ni;/g, '∋');
  str = str.replace(/&prod;/g, '∏');
  str = str.replace(/&sum;/g, '∑');
  str = str.replace(/&minus;/g, '−');
  str = str.replace(/&lowast;/g, '∗');
  str = str.replace(/&radic;/g, '√');
  str = str.replace(/&prop;/g, '∝');
  str = str.replace(/&infin;/g, '∞');
  str = str.replace(/&ang;/g, '∠');
  str = str.replace(/&and;/g, '∧');
  str = str.replace(/&or;/g, '∨');
  str = str.replace(/&cap;/g, '∩');
  str = str.replace(/&cup;/g, '∪');
  str = str.replace(/&int;/g, '∫');
  str = str.replace(/&there4;/g, '∴');
  str = str.replace(/&sim;/g, '∼');
  str = str.replace(/&cong;/g, '≅');
  str = str.replace(/&asymp;/g, '≈');
  str = str.replace(/&ne;/g, '≠');
  str = str.replace(/&le;/g, '≤');
  str = str.replace(/&ge;/g, '≥');
  str = str.replace(/&sub;/g, '⊂');
  str = str.replace(/&sup;/g, '⊃');
  str = str.replace(/&nsub;/g, '⊄');
  str = str.replace(/&sube;/g, '⊆');
  str = str.replace(/&supe;/g, '⊇');
  str = str.replace(/&oplus;/g, '⊕');
  str = str.replace(/&otimes;/g, '⊗');
  str = str.replace(/&perp;/g, '⊥');
  str = str.replace(/&sdot;/g, '⋅');
  return str;
}

// HTML 支持的希腊字母
function strGreeceDiscode(str) {
  str = str.replace(/&Alpha;/g, 'Α');
  str = str.replace(/&Beta;/g, 'Β');
  str = str.replace(/&Gamma;/g, 'Γ');
  str = str.replace(/&Delta;/g, 'Δ');
  str = str.replace(/&Epsilon;/g, 'Ε');
  str = str.replace(/&Zeta;/g, 'Ζ');
  str = str.replace(/&Eta;/g, 'Η');
  str = str.replace(/&Theta;/g, 'Θ');
  str = str.replace(/&Iota;/g, 'Ι');
  str = str.replace(/&Kappa;/g, 'Κ');
  str = str.replace(/&Lambda;/g, 'Λ');
  str = str.replace(/&Mu;/g, 'Μ');
  str = str.replace(/&Nu;/g, 'Ν');
  str = str.replace(/&Xi;/g, 'Ν');
  str = str.replace(/&Omicron;/g, 'Ο');
  str = str.replace(/&Pi;/g, 'Π');
  str = str.replace(/&Rho;/g, 'Ρ');
  str = str.replace(/&Sigma;/g, 'Σ');
  str = str.replace(/&Tau;/g, 'Τ');
  str = str.replace(/&Upsilon;/g, 'Υ');
  str = str.replace(/&Phi;/g, 'Φ');
  str = str.replace(/&Chi;/g, 'Χ');
  str = str.replace(/&Psi;/g, 'Ψ');
  str = str.replace(/&Omega;/g, 'Ω');

  str = str.replace(/&alpha;/g, 'α');
  str = str.replace(/&beta;/g, 'β');
  str = str.replace(/&gamma;/g, 'γ');
  str = str.replace(/&delta;/g, 'δ');
  str = str.replace(/&epsilon;/g, 'ε');
  str = str.replace(/&zeta;/g, 'ζ');
  str = str.replace(/&eta;/g, 'η');
  str = str.replace(/&theta;/g, 'θ');
  str = str.replace(/&iota;/g, 'ι');
  str = str.replace(/&kappa;/g, 'κ');
  str = str.replace(/&lambda;/g, 'λ');
  str = str.replace(/&mu;/g, 'μ');
  str = str.replace(/&nu;/g, 'ν');
  str = str.replace(/&xi;/g, 'ξ');
  str = str.replace(/&omicron;/g, 'ο');
  str = str.replace(/&pi;/g, 'π');
  str = str.replace(/&rho;/g, 'ρ');
  str = str.replace(/&sigmaf;/g, 'ς');
  str = str.replace(/&sigma;/g, 'σ');
  str = str.replace(/&tau;/g, 'τ');
  str = str.replace(/&upsilon;/g, 'υ');
  str = str.replace(/&phi;/g, 'φ');
  str = str.replace(/&chi;/g, 'χ');
  str = str.replace(/&psi;/g, 'ψ');
  str = str.replace(/&omega;/g, 'ω');
  str = str.replace(/&thetasym;/g, 'ϑ');
  str = str.replace(/&upsih;/g, 'ϒ');
  str = str.replace(/&piv;/g, 'ϖ');
  str = str.replace(/&middot;/g, '·');
  return str;
}

function strcharacterDiscode(str) {
  // 加入常用解析
  str = str.replace(/&nbsp;/g, ' ');
  str = str.replace(/&ensp;/g, ' ');
  str = str.replace(/&emsp;/g, '　');
  str = str.replace(/&quot;/g, "'");
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&#8226;/g, '•');

  return str;
}

// HTML 支持的其他实体
function strOtherDiscode(str) {
  str = str.replace(/&OElig;/g, 'Œ');
  str = str.replace(/&oelig;/g, 'œ');
  str = str.replace(/&Scaron;/g, 'Š');
  str = str.replace(/&scaron;/g, 'š');
  str = str.replace(/&Yuml;/g, 'Ÿ');
  str = str.replace(/&fnof;/g, 'ƒ');
  str = str.replace(/&circ;/g, 'ˆ');
  str = str.replace(/&tilde;/g, '˜');
  str = str.replace(/&ensp;/g, '');
  str = str.replace(/&emsp;/g, '');
  str = str.replace(/&thinsp;/g, '');
  str = str.replace(/&zwnj;/g, '');
  str = str.replace(/&zwj;/g, '');
  str = str.replace(/&lrm;/g, '');
  str = str.replace(/&rlm;/g, '');
  str = str.replace(/&ndash;/g, '–');
  str = str.replace(/&mdash;/g, '—');
  str = str.replace(/&lsquo;/g, '‘');
  str = str.replace(/&rsquo;/g, '’');
  str = str.replace(/&sbquo;/g, '‚');
  str = str.replace(/&ldquo;/g, '“');
  str = str.replace(/&rdquo;/g, '”');
  str = str.replace(/&bdquo;/g, '„');
  str = str.replace(/&dagger;/g, '†');
  str = str.replace(/&Dagger;/g, '‡');
  str = str.replace(/&bull;/g, '•');
  str = str.replace(/&hellip;/g, '…');
  str = str.replace(/&permil;/g, '‰');
  str = str.replace(/&prime;/g, '′');
  str = str.replace(/&Prime;/g, '″');
  str = str.replace(/&lsaquo;/g, '‹');
  str = str.replace(/&rsaquo;/g, '›');
  str = str.replace(/&oline;/g, '‾');
  str = str.replace(/&euro;/g, '€');
  str = str.replace(/&trade;/g, '™');

  str = str.replace(/&larr;/g, '←');
  str = str.replace(/&uarr;/g, '↑');
  str = str.replace(/&rarr;/g, '→');
  str = str.replace(/&darr;/g, '↓');
  str = str.replace(/&harr;/g, '↔');
  str = str.replace(/&crarr;/g, '↵');
  str = str.replace(/&lceil;/g, '⌈');
  str = str.replace(/&rceil;/g, '⌉');

  str = str.replace(/&lfloor;/g, '⌊');
  str = str.replace(/&rfloor;/g, '⌋');
  str = str.replace(/&loz;/g, '◊');
  str = str.replace(/&spades;/g, '♠');
  str = str.replace(/&clubs;/g, '♣');
  str = str.replace(/&hearts;/g, '♥');

  str = str.replace(/&diams;/g, '♦');
  str = str.replace(/&#39;/g, "'");
  return str;
}

function strDiscode(str) {
  str = strNumDiscode(str);
  str = strGreeceDiscode(str);
  str = strcharacterDiscode(str);
  str = strOtherDiscode(str);
  return str;
}

function urlToHttpUrl(url, domain) {
  if (/^\/\//.test(url)) {
    return "https:".concat(url);
  } else if (/^\//.test(url)) {
    return "https://".concat(domain).concat(url);
  }
  return url;
}var _default =

{
  strDiscode: strDiscode,
  urlToHttpUrl: urlToHttpUrl };exports.default = _default;

/***/ }),

/***/ 1106:
/*!***********************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/uParse/src/libs/htmlparser.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /**
                                                                                                      *
                                                                                                      * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
                                                                                                      *
                                                                                                      * author: Di (微信小程序开发工程师)
                                                                                                      * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                      *               垂直微信小程序开发交流社区
                                                                                                      *
                                                                                                      * github地址: https://github.com/icindy/wxParse
                                                                                                      *
                                                                                                      * for: 微信小程序富文本解析
                                                                                                      * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                      */
// Regular Expressions for parsing tags and attributes

var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z0-9_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var attr = /([a-zA-Z0-9_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}
  return obj;
}

// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
var block = makeMap('address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

function HTMLParser(html, handler) {
  var index;
  var chars;
  var match;
  var last = html;
  var stack = [];

  stack.last = function () {return stack[stack.length - 1];};

  function parseEndTag(tag, tagName) {
    // If no tag name is provided, clean shop
    var pos;
    if (!tagName) {
      pos = 0;
    } else {
      // Find the closest opened tag of the same type
      tagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos -= 1) {
        if (stack[pos] === tagName) break;
      }
    }
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i -= 1) {
        if (handler.end) handler.end(stack[i]);
      }

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();

    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }

    if (closeSelf[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName);
    }

    unary = empty[tagName] || !!unary;

    if (!unary) stack.push(tagName);

    if (handler.start) {
      var attrs = [];

      rest.replace(attr, function genAttr(matches, name) {
        var value = arguments[2] || arguments[3] || arguments[4] || (fillAttrs[name] ? name : '');

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
        });
      });

      if (handler.start) {
        handler.start(tagName, attrs, unary);
      }
    }
  }

  while (html) {
    chars = true;

    if (html.indexOf('</') === 0) {
      match = html.match(endTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(endTag, parseEndTag);
        chars = false;
      }

      // start tag
    } else if (html.indexOf('<') === 0) {
      match = html.match(startTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(startTag, parseStartTag);
        chars = false;
      }
    }

    if (chars) {
      index = html.indexOf('<');
      var text = '';
      while (index === 0) {
        text += '<';
        html = html.substring(1);
        index = html.indexOf('<');
      }
      text += index < 0 ? html : html.substring(0, index);
      html = index < 0 ? '' : html.substring(index);

      if (handler.chars) handler.chars(text);
    }

    if (html === last) throw new Error("Parse Error: ".concat(html));
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();
}var _default =

HTMLParser;exports.default = _default;

/***/ }),

/***/ 1119:
/*!**********************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/qrcode/qrcode.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function qrPolynomial(r, t) {if ("undefined" == typeof r.length) throw new Error(r.length + "/" + t);var e = function () {for (var e = 0; e < r.length && 0 == r[e];) {e += 1;}for (var n = new Array(r.length - e + t), o = 0; o < r.length - e; o += 1) {n[o] = r[o + e];}return n;}(),n = {};return n.getAt = function (r) {return e[r];}, n.getLength = function () {return e.length;}, n.multiply = function (r) {for (var t = new Array(n.getLength() + r.getLength() - 1), e = 0; e < n.getLength(); e += 1) {for (var o = 0; o < r.getLength(); o += 1) {t[e + o] ^= QRMath.gexp(QRMath.glog(n.getAt(e)) + QRMath.glog(r.getAt(o)));}}return qrPolynomial(t, 0);}, n.mod = function (r) {if (n.getLength() - r.getLength() < 0) return n;for (var t = QRMath.glog(n.getAt(0)) - QRMath.glog(r.getAt(0)), e = new Array(n.getLength()), o = 0; o < n.getLength(); o += 1) {e[o] = n.getAt(o);}for (var o = 0; o < r.getLength(); o += 1) {e[o] ^= QRMath.gexp(QRMath.glog(r.getAt(o)) + t);}return qrPolynomial(e, 0).mod(r);}, n;}var qrcode = function qrcode(r, t) {var e = 236,n = 17,o = r,a = QRErrorCorrectLevel[t],i = null,u = 0,f = null,c = new Array(),g = {},l = function l(r, t) {u = 4 * o + 17, i = function (r) {for (var t = new Array(r), e = 0; e < r; e += 1) {t[e] = new Array(r);for (var n = 0; n < r; n += 1) {t[e][n] = null;}}return t;}(u), h(0, 0), h(u - 7, 0), h(0, u - 7), d(), s(), y(r, t), o >= 7 && w(r), null == f && (f = p(o, a, c)), M(f, t);},h = function h(r, t) {for (var e = -1; e <= 7; e += 1) {if (!(r + e <= -1 || u <= r + e)) for (var n = -1; n <= 7; n += 1) {t + n <= -1 || u <= t + n || (0 <= e && e <= 6 && (0 == n || 6 == n) || 0 <= n && n <= 6 && (0 == e || 6 == e) || 2 <= e && e <= 4 && 2 <= n && n <= 4 ? i[r + e][t + n] = !0 : i[r + e][t + n] = !1);}}},v = function v() {for (var r = 0, t = 0, e = 0; e < 8; e += 1) {l(!0, e);var n = QRUtil.getLostPoint(g);(0 == e || r > n) && (r = n, t = e);}return t;},s = function s() {for (var r = 8; r < u - 8; r += 1) {null == i[r][6] && (i[r][6] = r % 2 == 0);}for (var t = 8; t < u - 8; t += 1) {null == i[6][t] && (i[6][t] = t % 2 == 0);}},d = function d() {for (var r = QRUtil.getPatternPosition(o), t = 0; t < r.length; t += 1) {for (var e = 0; e < r.length; e += 1) {var n = r[t],a = r[e];if (null == i[n][a]) for (var u = -2; u <= 2; u += 1) {for (var f = -2; f <= 2; f += 1) {u == -2 || 2 == u || f == -2 || 2 == f || 0 == u && 0 == f ? i[n + u][a + f] = !0 : i[n + u][a + f] = !1;}}}}},w = function w(r) {for (var t = QRUtil.getBCHTypeNumber(o), e = 0; e < 18; e += 1) {var n = !r && 1 == (t >> e & 1);i[Math.floor(e / 3)][e % 3 + u - 8 - 3] = n;}for (var e = 0; e < 18; e += 1) {var n = !r && 1 == (t >> e & 1);i[e % 3 + u - 8 - 3][Math.floor(e / 3)] = n;}},y = function y(r, t) {for (var e = a << 3 | t, n = QRUtil.getBCHTypeInfo(e), o = 0; o < 15; o += 1) {var f = !r && 1 == (n >> o & 1);o < 6 ? i[o][8] = f : o < 8 ? i[o + 1][8] = f : i[u - 15 + o][8] = f;}for (var o = 0; o < 15; o += 1) {var f = !r && 1 == (n >> o & 1);o < 8 ? i[8][u - o - 1] = f : o < 9 ? i[8][15 - o - 1 + 1] = f : i[8][15 - o - 1] = f;}i[u - 8][8] = !r;},M = function M(r, t) {for (var e = -1, n = u - 1, o = 7, a = 0, f = QRUtil.getMaskFunction(t), c = u - 1; c > 0; c -= 2) {for (6 == c && (c -= 1);;) {for (var g = 0; g < 2; g += 1) {if (null == i[n][c - g]) {var l = !1;a < r.length && (l = 1 == (r[a] >>> o & 1));var h = f(n, c - g);h && (l = !l), i[n][c - g] = l, o -= 1, o == -1 && (a += 1, o = 7);}}if (n += e, n < 0 || u <= n) {n -= e, e = -e;break;}}}},B = function B(r, t) {for (var e = 0, n = 0, o = 0, a = new Array(t.length), i = new Array(t.length), u = 0; u < t.length; u += 1) {var f = t[u].dataCount,c = t[u].totalCount - f;n = Math.max(n, f), o = Math.max(o, c), a[u] = new Array(f);for (var g = 0; g < a[u].length; g += 1) {a[u][g] = 255 & r.getBuffer()[g + e];}e += f;var l = QRUtil.getErrorCorrectPolynomial(c),h = qrPolynomial(a[u], l.getLength() - 1),v = h.mod(l);i[u] = new Array(l.getLength() - 1);for (var g = 0; g < i[u].length; g += 1) {var s = g + v.getLength() - i[u].length;i[u][g] = s >= 0 ? v.getAt(s) : 0;}}for (var d = 0, g = 0; g < t.length; g += 1) {d += t[g].totalCount;}for (var w = new Array(d), y = 0, g = 0; g < n; g += 1) {for (var u = 0; u < t.length; u += 1) {g < a[u].length && (w[y] = a[u][g], y += 1);}}for (var g = 0; g < o; g += 1) {for (var u = 0; u < t.length; u += 1) {g < i[u].length && (w[y] = i[u][g], y += 1);}}return w;},p = function p(r, t, o) {for (var a = QRRSBlock.getRSBlocks(r, t), i = qrBitBuffer(), u = 0; u < o.length; u += 1) {var f = o[u];i.put(f.getMode(), 4), i.put(f.getLength(), QRUtil.getLengthInBits(f.getMode(), r)), f.write(i);}for (var c = 0, u = 0; u < a.length; u += 1) {c += a[u].dataCount;}if (i.getLengthInBits() > 8 * c) throw new Error("code length overflow. (" + i.getLengthInBits() + ">" + 8 * c + ")");for (i.getLengthInBits() + 4 <= 8 * c && i.put(0, 4); i.getLengthInBits() % 8 != 0;) {i.putBit(!1);}for (;;) {if (i.getLengthInBits() >= 8 * c) break;if (i.put(e, 8), i.getLengthInBits() >= 8 * c) break;i.put(n, 8);}return B(i, a);};return g.addData = function (r) {var t = qr8BitByte(r);c.push(t), f = null;}, g.isDark = function (r, t) {if (r < 0 || u <= r || t < 0 || u <= t) throw new Error(r + "," + t);return i[r][t];}, g.getModuleCount = function () {return u;}, g.make = function () {l(!1, v());}, g.createTableTag = function (r, t) {r = r || 2, t = "undefined" == typeof t ? 4 * r : t;var e = "";e += '<table style="', e += " border-width: 0upx; border-style: none;", e += " border-collapse: collapse;", e += " padding: 0upx; margin: " + t + "upx;", e += '">', e += "<tbody>";for (var n = 0; n < g.getModuleCount(); n += 1) {e += "<tr>";for (var o = 0; o < g.getModuleCount(); o += 1) {e += '<td style="', e += " border-width: 0upx; border-style: none;", e += " border-collapse: collapse;", e += " padding: 0upx; margin: 0upx;", e += " width: " + r + "upx;", e += " height: " + r + "upx;", e += " background-color: ", e += g.isDark(n, o) ? "#000000" : "#ffffff", e += ";", e += '"/>';}e += "</tr>";}return e += "</tbody>", e += "</table>";}, g.createImgTag = function (r, t, e) {r = r || 2, t = "undefined" == typeof t ? 4 * r : t;var n = t,o = g.getModuleCount() * r + t;return createImgTag(e, e, function (t, e) {if (n <= t && t < o && n <= e && e < o) {var a = Math.floor((t - n) / r),i = Math.floor((e - n) / r);return g.isDark(i, a) ? 0 : 1;}return 1;});}, g;};qrcode.stringToBytes = function (r) {for (var t = new Array(), e = 0; e < r.length; e += 1) {var n = r.charCodeAt(e);t.push(255 & n);}return t;}, qrcode.createStringToBytes = function (r, t) {var e = function () {for (var e = base64DecodeInputStream(r), n = function n() {var r = e.read();if (r == -1) throw new Error();return r;}, o = 0, a = {};;) {var i = e.read();if (i == -1) break;var u = n(),f = n(),c = n(),g = String.fromCharCode(i << 8 | u),l = f << 8 | c;a[g] = l, o += 1;}if (o != t) throw new Error(o + " != " + t);return a;}(),n = "?".charCodeAt(0);return function (r) {for (var t = new Array(), o = 0; o < r.length; o += 1) {var a = r.charCodeAt(o);if (a < 128) t.push(a);else {var i = e[r.charAt(o)];"number" == typeof i ? (255 & i) == i ? t.push(i) : (t.push(i >>> 8), t.push(255 & i)) : t.push(n);}}return t;};};var QRMode = { MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8 },QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 },QRMaskPattern = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 },QRUtil = function () {var r = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],t = 1335,e = 7973,n = 21522,o = {},a = function a(r) {for (var t = 0; 0 != r;) {t += 1, r >>>= 1;}return t;};return o.getBCHTypeInfo = function (r) {for (var e = r << 10; a(e) - a(t) >= 0;) {e ^= t << a(e) - a(t);}return (r << 10 | e) ^ n;}, o.getBCHTypeNumber = function (r) {for (var t = r << 12; a(t) - a(e) >= 0;) {t ^= e << a(t) - a(e);}return r << 12 | t;}, o.getPatternPosition = function (t) {return r[t - 1];}, o.getMaskFunction = function (r) {switch (r) {case QRMaskPattern.PATTERN000:return function (r, t) {return (r + t) % 2 == 0;};case QRMaskPattern.PATTERN001:return function (r, t) {return r % 2 == 0;};case QRMaskPattern.PATTERN010:return function (r, t) {return t % 3 == 0;};case QRMaskPattern.PATTERN011:return function (r, t) {return (r + t) % 3 == 0;};case QRMaskPattern.PATTERN100:return function (r, t) {return (Math.floor(r / 2) + Math.floor(t / 3)) % 2 == 0;};case QRMaskPattern.PATTERN101:return function (r, t) {return r * t % 2 + r * t % 3 == 0;};case QRMaskPattern.PATTERN110:return function (r, t) {return (r * t % 2 + r * t % 3) % 2 == 0;};case QRMaskPattern.PATTERN111:return function (r, t) {return (r * t % 3 + (r + t) % 2) % 2 == 0;};default:throw new Error("bad maskPattern:" + r);}}, o.getErrorCorrectPolynomial = function (r) {for (var t = qrPolynomial([1], 0), e = 0; e < r; e += 1) {t = t.multiply(qrPolynomial([1, QRMath.gexp(e)], 0));}return t;}, o.getLengthInBits = function (r, t) {if (1 <= t && t < 10) switch (r) {case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:return 8;case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:" + r);} else if (t < 27) switch (r) {case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:" + r);} else {if (!(t < 41)) throw new Error("type:" + t);switch (r) {case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:" + r);}}}, o.getLostPoint = function (r) {for (var t = r.getModuleCount(), e = 0, n = 0; n < t; n += 1) {for (var o = 0; o < t; o += 1) {for (var a = 0, i = r.isDark(n, o), u = -1; u <= 1; u += 1) {if (!(n + u < 0 || t <= n + u)) for (var f = -1; f <= 1; f += 1) {o + f < 0 || t <= o + f || 0 == u && 0 == f || i == r.isDark(n + u, o + f) && (a += 1);}}a > 5 && (e += 3 + a - 5);}}for (var n = 0; n < t - 1; n += 1) {for (var o = 0; o < t - 1; o += 1) {var c = 0;r.isDark(n, o) && (c += 1), r.isDark(n + 1, o) && (c += 1), r.isDark(n, o + 1) && (c += 1), r.isDark(n + 1, o + 1) && (c += 1), 0 != c && 4 != c || (e += 3);}}for (var n = 0; n < t; n += 1) {for (var o = 0; o < t - 6; o += 1) {r.isDark(n, o) && !r.isDark(n, o + 1) && r.isDark(n, o + 2) && r.isDark(n, o + 3) && r.isDark(n, o + 4) && !r.isDark(n, o + 5) && r.isDark(n, o + 6) && (e += 40);}}for (var o = 0; o < t; o += 1) {for (var n = 0; n < t - 6; n += 1) {r.isDark(n, o) && !r.isDark(n + 1, o) && r.isDark(n + 2, o) && r.isDark(n + 3, o) && r.isDark(n + 4, o) && !r.isDark(n + 5, o) && r.isDark(n + 6, o) && (e += 40);}}for (var g = 0, o = 0; o < t; o += 1) {for (var n = 0; n < t; n += 1) {r.isDark(n, o) && (g += 1);}}var l = Math.abs(100 * g / t / t - 50) / 5;return e += 10 * l;}, o;}(),QRMath = function () {for (var r = new Array(256), t = new Array(256), e = 0; e < 8; e += 1) {r[e] = 1 << e;}for (var e = 8; e < 256; e += 1) {r[e] = r[e - 4] ^ r[e - 5] ^ r[e - 6] ^ r[e - 8];}for (var e = 0; e < 255; e += 1) {t[r[e]] = e;}var n = {};return n.glog = function (r) {if (r < 1) throw new Error("glog(" + r + ")");return t[r];}, n.gexp = function (t) {for (; t < 0;) {t += 255;}for (; t >= 256;) {t -= 255;}return r[t];}, n;}(),QRRSBlock = function () {var r = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],t = function t(r, _t) {var e = {};return e.totalCount = r, e.dataCount = _t, e;},e = {},n = function n(t, e) {switch (e) {case QRErrorCorrectLevel.L:return r[4 * (t - 1) + 0];case QRErrorCorrectLevel.M:return r[4 * (t - 1) + 1];case QRErrorCorrectLevel.Q:return r[4 * (t - 1) + 2];case QRErrorCorrectLevel.H:return r[4 * (t - 1) + 3];default:return;}};return e.getRSBlocks = function (r, e) {var o = n(r, e);if ("undefined" == typeof o) throw new Error("bad rs block [url=home.php?mod=space&uid=5302]@[/url] typeNumber:" + r + "/errorCorrectLevel:" + e);for (var a = o.length / 3, i = new Array(), u = 0; u < a; u += 1) {for (var f = o[3 * u + 0], c = o[3 * u + 1], g = o[3 * u + 2], l = 0; l < f; l += 1) {i.push(t(c, g));}}return i;}, e;}(),qrBitBuffer = function qrBitBuffer() {var r = new Array(),t = 0,e = {};return e.getBuffer = function () {return r;}, e.getAt = function (t) {var e = Math.floor(t / 8);return 1 == (r[e] >>> 7 - t % 8 & 1);}, e.put = function (r, t) {for (var n = 0; n < t; n += 1) {e.putBit(1 == (r >>> t - n - 1 & 1));}}, e.getLengthInBits = function () {return t;}, e.putBit = function (e) {var n = Math.floor(t / 8);r.length <= n && r.push(0), e && (r[n] |= 128 >>> t % 8), t += 1;}, e;},qr8BitByte = function qr8BitByte(r) {for (var t = QRMode.MODE_8BIT_BYTE, e = r, n = [], o = {}, a = 0, i = e.length; a < i; a++) {var u = [],f = e.charCodeAt(a);f > 65536 ? (u[0] = 240 | (1835008 & f) >>> 18, u[1] = 128 | (258048 & f) >>> 12, u[2] = 128 | (4032 & f) >>> 6, u[3] = 128 | 63 & f) : f > 2048 ? (u[0] = 224 | (61440 & f) >>> 12, u[1] = 128 | (4032 & f) >>> 6, u[2] = 128 | 63 & f) : f > 128 ? (u[0] = 192 | (1984 & f) >>> 6, u[1] = 128 | 63 & f) : u[0] = f, n.push(u);}n = Array.prototype.concat.apply([], n), n.length != e.length && (n.unshift(191), n.unshift(187), n.unshift(239));var c = n;return o.getMode = function () {return t;}, o.getLength = function (r) {return c.length;}, o.write = function (r) {for (var t = 0; t < c.length; t += 1) {r.put(c[t], 8);}}, o;},byteArrayOutputStream = function byteArrayOutputStream() {var r = new Array(),t = {};return t.writeByte = function (t) {r.push(255 & t);}, t.writeShort = function (r) {t.writeByte(r), t.writeByte(r >>> 8);}, t.writeBytes = function (r, e, n) {e = e || 0, n = n || r.length;for (var o = 0; o < n; o += 1) {t.writeByte(r[o + e]);}}, t.writeString = function (r) {for (var e = 0; e < r.length; e += 1) {t.writeByte(r.charCodeAt(e));}}, t.toByteArray = function () {return r;}, t.toString = function () {var t = "";t += "[";for (var e = 0; e < r.length; e += 1) {e > 0 && (t += ","), t += r[e];}return t += "]";}, t;},base64EncodeOutputStream = function base64EncodeOutputStream() {var r = 0,t = 0,e = 0,n = "",o = {},a = function a(r) {n += String.fromCharCode(i(63 & r));},i = function i(r) {if (r < 0) ;else {if (r < 26) return 65 + r;if (r < 52) return 97 + (r - 26);if (r < 62) return 48 + (r - 52);if (62 == r) return 43;if (63 == r) return 47;}throw new Error("n:" + r);};return o.writeByte = function (n) {for (r = r << 8 | 255 & n, t += 8, e += 1; t >= 6;) {a(r >>> t - 6), t -= 6;}}, o.flush = function () {if (t > 0 && (a(r << 6 - t), r = 0, t = 0), e % 3 != 0) for (var o = 3 - e % 3, i = 0; i < o; i += 1) {n += "=";}}, o.toString = function () {return n;}, o;},base64DecodeInputStream = function base64DecodeInputStream(r) {var t = r,e = 0,n = 0,o = 0,a = {};a.read = function () {for (; o < 8;) {if (e >= t.length) {if (0 == o) return -1;throw new Error("unexpected end of file./" + o);}var r = t.charAt(e);if (e += 1, "=" == r) return o = 0, -1;r.match(/^\s$/) || (n = n << 6 | i(r.charCodeAt(0)), o += 6);}var a = n >>> o - 8 & 255;return o -= 8, a;};var i = function i(r) {if (65 <= r && r <= 90) return r - 65;if (97 <= r && r <= 122) return r - 97 + 26;if (48 <= r && r <= 57) return r - 48 + 52;if (43 == r) return 62;if (47 == r) return 63;throw new Error("c:" + r);};return a;},gifImage = function gifImage(r, t) {var e = r,n = t,o = new Array(r * t),a = {};a.setPixel = function (r, t, n) {o[t * e + r] = n;}, a.write = function (r) {r.writeString("GIF87a"), r.writeShort(e), r.writeShort(n), r.writeByte(128), r.writeByte(0), r.writeByte(0), r.writeByte(0), r.writeByte(0), r.writeByte(0), r.writeByte(255), r.writeByte(255), r.writeByte(255), r.writeString(","), r.writeShort(0), r.writeShort(0), r.writeShort(e), r.writeShort(n), r.writeByte(0);var t = 2,o = u(t);r.writeByte(t);for (var a = 0; o.length - a > 255;) {r.writeByte(255), r.writeBytes(o, a, 255), a += 255;}r.writeByte(o.length - a), r.writeBytes(o, a, o.length - a), r.writeByte(0), r.writeString(";");};var i = function i(r) {var t = r,e = 0,n = 0,o = {};return o.write = function (r, o) {if (r >>> o != 0) throw new Error("length over");for (; e + o >= 8;) {t.writeByte(255 & (r << e | n)), o -= 8 - e, r >>>= 8 - e, n = 0, e = 0;}n |= r << e, e += o;}, o.flush = function () {e > 0 && t.writeByte(n);}, o;},u = function u(r) {for (var t = 1 << r, e = (1 << r) + 1, n = r + 1, a = f(), u = 0; u < t; u += 1) {a.add(String.fromCharCode(u));}a.add(String.fromCharCode(t)), a.add(String.fromCharCode(e));var c = byteArrayOutputStream(),g = i(c);g.write(t, n);var l = 0,h = String.fromCharCode(o[l]);for (l += 1; l < o.length;) {var v = String.fromCharCode(o[l]);l += 1, a.contains(h + v) ? h += v : (g.write(a.indexOf(h), n), a.size() < 4095 && (a.size() == 1 << n && (n += 1), a.add(h + v)), h = v);}return g.write(a.indexOf(h), n), g.write(e, n), g.flush(), c.toByteArray();},f = function f() {var r = {},t = 0,e = {};return e.add = function (n) {if (e.contains(n)) throw new Error("dup key:" + n);r[n] = t, t += 1;}, e.size = function () {return t;}, e.indexOf = function (t) {return r[t];}, e.contains = function (t) {return "undefined" != typeof r[t];}, e;};return a;},createImgTag = function createImgTag(r, t, e, n) {for (var o = gifImage(r, t), a = 0; a < t; a += 1) {for (var i = 0; i < r; i += 1) {o.setPixel(i, a, e(i, a));}}var u = byteArrayOutputStream();o.write(u);for (var f = base64EncodeOutputStream(), c = u.toByteArray(), g = 0; g < c.length; g += 1) {f.writeByte(c[g]);}f.flush();var l = "";return l += "data:image/gif;base64,", l += f;},createQrCodeImg = function createQrCodeImg(r, t) {t = t || {};var e,n = t.typeNumber || 4,o = t.errorCorrectLevel || "M",a = t.size || 500;try {e = qrcode(n, o || "M"), e.addData(r), e.make();} catch (t) {if (n >= 40) throw new Error("Text too long to encode");return gen(r, { size: a, errorCorrectLevel: o, typeNumber: n + 1 });}var i = parseInt(a / e.getModuleCount()),u = parseInt((a - e.getModuleCount() * i) / 2);return e.createImgTag(i, u, a);};module.exports = { createQrCodeImg: createQrCodeImg };

/***/ }),

/***/ 1127:
/*!************************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/mpvue-echarts/src/wx-canvas.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var WxCanvas = /*#__PURE__*/function () {
  function WxCanvas(ctx, canvasId) {_classCallCheck(this, WxCanvas);
    this.ctx = ctx;
    this.canvasId = canvasId;
    this.chart = null;

    WxCanvas.initStyle(ctx);
    this.initEvent();
  }_createClass(WxCanvas, [{ key: "getContext", value: function getContext(

    contextType) {
      return contextType === '2d' ? this.ctx : null;
    } }, { key: "setChart", value: function setChart(

    chart) {
      this.chart = chart;
    } }, { key: "attachEvent", value: function attachEvent()

    {
      // noop
    } }, { key: "detachEvent", value: function detachEvent()

    {
      // noop
    } }, { key: "initEvent", value: function initEvent()





















    {var _this = this;
      this.event = {};
      var eventNames = [{
        wxName: 'touchStart',
        ecName: 'mousedown' },
      {
        wxName: 'touchMove',
        ecName: 'mousemove' },
      {
        wxName: 'touchEnd',
        ecName: 'mouseup' },
      {
        wxName: 'touchEnd',
        ecName: 'click' }];


      eventNames.forEach(function (name) {
        _this.event[name.wxName] = function (e) {
          var touch = e.mp.touches[0];
          _this.chart._zr.handler.dispatch(name.ecName, {
            zrX: name.wxName === 'tap' ? touch.clientX : touch.x,
            zrY: name.wxName === 'tap' ? touch.clientY : touch.y });

        };
      });
    } }], [{ key: "initStyle", value: function initStyle(ctx) {var _arguments = arguments;var styles = ['fillStyle', 'strokeStyle', 'globalAlpha', 'textAlign', 'textBaseAlign', 'shadow', 'lineWidth', 'lineCap', 'lineJoin', 'lineDash', 'miterLimit', 'fontSize'];styles.forEach(function (style) {Object.defineProperty(ctx, style, { set: function set(value) {if (style !== 'fillStyle' && style !== 'strokeStyle' || value !== 'none' && value !== null) {ctx["set".concat(style.charAt(0).toUpperCase()).concat(style.slice(1))](value);}} });});ctx.createRadialGradient = function () {return ctx.createCircularGradient(_arguments);};} }]);return WxCanvas;}();exports.default = WxCanvas;

/***/ }),

/***/ 1135:
/*!*************************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/mpvueGestureLock/gestureLock.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var GestureLock = /*#__PURE__*/function () {

  function GestureLock(containerWidth, cycleRadius) {_classCallCheck(this, GestureLock);
    this.containerWidth = containerWidth; // 容器宽度
    this.cycleRadius = cycleRadius; // 圆的半径

    this.circleArray = []; // 全部圆的对象数组
    this.checkPoints = []; // 选中的圆的对象数组
    this.lineArray = []; // 已激活锁之间的线段数组
    this.lastCheckPoint = 0; // 最后一个激活的锁
    this.offsetX = 0; // 容器的 X 偏移
    this.offsetY = 0; // 容器的 Y 偏移
    this.activeLine = {}; // 最后一个激活的锁与当前位置之间的线段

    this.windowWidth = wx.getSystemInfoSync().windowWidth; // 窗口大小(用于rpx 和 px 转换)

    this.initCircleArray();
  }

  // 初始化 画布上的 9个圆
  _createClass(GestureLock, [{ key: "initCircleArray", value: function initCircleArray() {
      var cycleMargin = (this.containerWidth - 6 * this.cycleRadius) / 6;
      var count = 0;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          count++;
          this.circleArray.push({
            count: count,
            x: this.rpxTopx((cycleMargin + this.cycleRadius) * (j * 2 + 1)),
            y: this.rpxTopx((cycleMargin + this.cycleRadius) * (i * 2 + 1)),
            radius: this.rpxTopx(this.cycleRadius),
            check: false,
            style: {
              left: (cycleMargin + this.cycleRadius) * (j * 2 + 1) - this.cycleRadius + 'rpx',
              top: (cycleMargin + this.cycleRadius) * (i * 2 + 1) - this.cycleRadius + 'rpx',
              width: this.cycleRadius * 2 + 'rpx' } });


        }
      }
    } }, { key: "onTouchStart", value: function onTouchStart(

    e) {
      this.setOffset(e);
      this.checkTouch({
        x: e.touches[0].pageX - this.offsetX,
        y: e.touches[0].pageY - this.offsetY });

    } }, { key: "onTouchMove", value: function onTouchMove(

    e) {
      this.moveDraw(e);
    } }, { key: "onTouchEnd", value: function onTouchEnd(

    e) {
      var checkPoints = this.checkPoints;
      this.reset();
      return checkPoints;
    }

    // 初始化 偏移量
  }, { key: "setOffset", value: function setOffset(e) {
      this.offsetX = e.currentTarget.offsetLeft;
      this.offsetY = e.currentTarget.offsetTop;
    }

    // 检测当时 触摸位置是否位于 锁上
  }, { key: "checkTouch", value: function checkTouch(_ref)


    {var x = _ref.x,y = _ref.y;
      for (var i = 0; i < this.circleArray.length; i++) {
        var point = this.circleArray[i];
        if (this.isPointInCycle(x, y, point.x, point.y, point.radius)) {
          if (!point.check) {
            this.checkPoints.push(point.count);
            if (this.lastCheckPoint != 0) {
              // 已激活锁之间的线段
              var line = this.drawLine(this.lastCheckPoint, point);
              this.lineArray.push(line);
            }
            this.lastCheckPoint = point;
          }
          point.check = true;
          return;
        }
      }
    }

    // 画线 - 返回 样式 对象
  }, { key: "drawLine", value: function drawLine(start, end) {
      var width = this.getPointDis(start.x, start.y, end.x, end.y);
      var rotate = this.getAngle(start, end);

      return {
        activeLeft: start.x + 'px',
        activeTop: start.y + 'px',
        activeWidth: width + 'px',
        activeRotate: rotate + 'deg' };


    }

    // 获取 画线的 角度
  }, { key: "getAngle", value: function getAngle(start, end) {
      var diff_x = end.x - start.x,
      diff_y = end.y - start.y;
      if (diff_x >= 0) {
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
      } else {
        return 180 + 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
      }
    }

    // 判断 当前点是否位于 锁内
  }, { key: "isPointInCycle", value: function isPointInCycle(x, y, circleX, circleY, radius) {
      return this.getPointDis(x, y, circleX, circleY) < radius ? true : false;
    }

    // 获取两点之间距离
  }, { key: "getPointDis", value: function getPointDis(ax, ay, bx, by) {
      return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
    }

    // 移动 绘制
  }, { key: "moveDraw", value: function moveDraw(e) {
      // 画经过的圆
      var x = e.touches[0].pageX - this.offsetX;
      var y = e.touches[0].pageY - this.offsetY;
      this.checkTouch({
        x: x,
        y: y });


      // 画 最后一个激活的锁与当前位置之间的线段
      this.activeLine = this.drawLine(this.lastCheckPoint, {
        x: x,
        y: y });

    }

    // 使 画布 恢复初始状态
  }, { key: "reset", value: function reset() {
      this.circleArray.forEach(function (item) {
        item.check = false;
      });
      this.checkPoints = [];
      this.lineArray = [];
      this.activeLine = {};
      this.lastCheckPoint = 0;
    }


    // 获取 最后一个激活的锁与当前位置之间的线段
  }, { key: "getActiveLine", value: function getActiveLine() {
      return this.activeLine;
    }

    // 获取 圆对象数组
  }, { key: "getCycleArray", value: function getCycleArray() {
      return this.circleArray;
    }

    // 获取 已激活锁之间的线段
  }, { key: "getLineArray", value: function getLineArray() {
      return this.lineArray;
    }

    // 将 RPX 转换成 PX
  }, { key: "rpxTopx", value: function rpxTopx(rpx) {
      return rpx / 750 * this.windowWidth;
    } }]);return GestureLock;}();var _default =


GestureLock;exports.default = _default;

/***/ }),

/***/ 1150:
/*!********************************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/mpvue-citypicker/city-data/province.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var provinceData = [{
  "label": "北京市",
  "value": "11" },

{
  "label": "天津市",
  "value": "12" },

{
  "label": "河北省",
  "value": "13" },

{
  "label": "山西省",
  "value": "14" },

{
  "label": "内蒙古自治区",
  "value": "15" },

{
  "label": "辽宁省",
  "value": "21" },

{
  "label": "吉林省",
  "value": "22" },

{
  "label": "黑龙江省",
  "value": "23" },

{
  "label": "上海市",
  "value": "31" },

{
  "label": "江苏省",
  "value": "32" },

{
  "label": "浙江省",
  "value": "33" },

{
  "label": "安徽省",
  "value": "34" },

{
  "label": "福建省",
  "value": "35" },

{
  "label": "江西省",
  "value": "36" },

{
  "label": "山东省",
  "value": "37" },

{
  "label": "河南省",
  "value": "41" },

{
  "label": "湖北省",
  "value": "42" },

{
  "label": "湖南省",
  "value": "43" },

{
  "label": "广东省",
  "value": "44" },

{
  "label": "广西壮族自治区",
  "value": "45" },

{
  "label": "海南省",
  "value": "46" },

{
  "label": "重庆市",
  "value": "50" },

{
  "label": "四川省",
  "value": "51" },

{
  "label": "贵州省",
  "value": "52" },

{
  "label": "云南省",
  "value": "53" },

{
  "label": "西藏自治区",
  "value": "54" },

{
  "label": "陕西省",
  "value": "61" },

{
  "label": "甘肃省",
  "value": "62" },

{
  "label": "青海省",
  "value": "63" },

{
  "label": "宁夏回族自治区",
  "value": "64" },

{
  "label": "新疆维吾尔自治区",
  "value": "65" },

{
  "label": "台湾",
  "value": "66" },

{
  "label": "香港",
  "value": "67" },

{
  "label": "澳门",
  "value": "68" }];var _default =


provinceData;exports.default = _default;

/***/ }),

/***/ 1151:
/*!****************************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/mpvue-citypicker/city-data/city.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var cityData = [
[{
  "label": "市辖区",
  "value": "1101" }],

[{
  "label": "市辖区",
  "value": "1201" }],

[{
  "label": "石家庄市",
  "value": "1301" },

{
  "label": "唐山市",
  "value": "1302" },

{
  "label": "秦皇岛市",
  "value": "1303" },

{
  "label": "邯郸市",
  "value": "1304" },

{
  "label": "邢台市",
  "value": "1305" },

{
  "label": "保定市",
  "value": "1306" },

{
  "label": "张家口市",
  "value": "1307" },

{
  "label": "承德市",
  "value": "1308" },

{
  "label": "沧州市",
  "value": "1309" },

{
  "label": "廊坊市",
  "value": "1310" },

{
  "label": "衡水市",
  "value": "1311" }],


[{
  "label": "太原市",
  "value": "1401" },

{
  "label": "大同市",
  "value": "1402" },

{
  "label": "阳泉市",
  "value": "1403" },

{
  "label": "长治市",
  "value": "1404" },

{
  "label": "晋城市",
  "value": "1405" },

{
  "label": "朔州市",
  "value": "1406" },

{
  "label": "晋中市",
  "value": "1407" },

{
  "label": "运城市",
  "value": "1408" },

{
  "label": "忻州市",
  "value": "1409" },

{
  "label": "临汾市",
  "value": "1410" },

{
  "label": "吕梁市",
  "value": "1411" }],


[{
  "label": "呼和浩特市",
  "value": "1501" },

{
  "label": "包头市",
  "value": "1502" },

{
  "label": "乌海市",
  "value": "1503" },

{
  "label": "赤峰市",
  "value": "1504" },

{
  "label": "通辽市",
  "value": "1505" },

{
  "label": "鄂尔多斯市",
  "value": "1506" },

{
  "label": "呼伦贝尔市",
  "value": "1507" },

{
  "label": "巴彦淖尔市",
  "value": "1508" },

{
  "label": "乌兰察布市",
  "value": "1509" },

{
  "label": "兴安盟",
  "value": "1522" },

{
  "label": "锡林郭勒盟",
  "value": "1525" },

{
  "label": "阿拉善盟",
  "value": "1529" }],


[{
  "label": "沈阳市",
  "value": "2101" },

{
  "label": "大连市",
  "value": "2102" },

{
  "label": "鞍山市",
  "value": "2103" },

{
  "label": "抚顺市",
  "value": "2104" },

{
  "label": "本溪市",
  "value": "2105" },

{
  "label": "丹东市",
  "value": "2106" },

{
  "label": "锦州市",
  "value": "2107" },

{
  "label": "营口市",
  "value": "2108" },

{
  "label": "阜新市",
  "value": "2109" },

{
  "label": "辽阳市",
  "value": "2110" },

{
  "label": "盘锦市",
  "value": "2111" },

{
  "label": "铁岭市",
  "value": "2112" },

{
  "label": "朝阳市",
  "value": "2113" },

{
  "label": "葫芦岛市",
  "value": "2114" }],


[{
  "label": "长春市",
  "value": "2201" },

{
  "label": "吉林市",
  "value": "2202" },

{
  "label": "四平市",
  "value": "2203" },

{
  "label": "辽源市",
  "value": "2204" },

{
  "label": "通化市",
  "value": "2205" },

{
  "label": "白山市",
  "value": "2206" },

{
  "label": "松原市",
  "value": "2207" },

{
  "label": "白城市",
  "value": "2208" },

{
  "label": "延边朝鲜族自治州",
  "value": "2224" }],


[{
  "label": "哈尔滨市",
  "value": "2301" },

{
  "label": "齐齐哈尔市",
  "value": "2302" },

{
  "label": "鸡西市",
  "value": "2303" },

{
  "label": "鹤岗市",
  "value": "2304" },

{
  "label": "双鸭山市",
  "value": "2305" },

{
  "label": "大庆市",
  "value": "2306" },

{
  "label": "伊春市",
  "value": "2307" },

{
  "label": "佳木斯市",
  "value": "2308" },

{
  "label": "七台河市",
  "value": "2309" },

{
  "label": "牡丹江市",
  "value": "2310" },

{
  "label": "黑河市",
  "value": "2311" },

{
  "label": "绥化市",
  "value": "2312" },

{
  "label": "大兴安岭地区",
  "value": "2327" }],


[{
  "label": "市辖区",
  "value": "3101" }],

[{
  "label": "南京市",
  "value": "3201" },

{
  "label": "无锡市",
  "value": "3202" },

{
  "label": "徐州市",
  "value": "3203" },

{
  "label": "常州市",
  "value": "3204" },

{
  "label": "苏州市",
  "value": "3205" },

{
  "label": "南通市",
  "value": "3206" },

{
  "label": "连云港市",
  "value": "3207" },

{
  "label": "淮安市",
  "value": "3208" },

{
  "label": "盐城市",
  "value": "3209" },

{
  "label": "扬州市",
  "value": "3210" },

{
  "label": "镇江市",
  "value": "3211" },

{
  "label": "泰州市",
  "value": "3212" },

{
  "label": "宿迁市",
  "value": "3213" }],


[{
  "label": "杭州市",
  "value": "3301" },

{
  "label": "宁波市",
  "value": "3302" },

{
  "label": "温州市",
  "value": "3303" },

{
  "label": "嘉兴市",
  "value": "3304" },

{
  "label": "湖州市",
  "value": "3305" },

{
  "label": "绍兴市",
  "value": "3306" },

{
  "label": "金华市",
  "value": "3307" },

{
  "label": "衢州市",
  "value": "3308" },

{
  "label": "舟山市",
  "value": "3309" },

{
  "label": "台州市",
  "value": "3310" },

{
  "label": "丽水市",
  "value": "3311" }],


[{
  "label": "合肥市",
  "value": "3401" },

{
  "label": "芜湖市",
  "value": "3402" },

{
  "label": "蚌埠市",
  "value": "3403" },

{
  "label": "淮南市",
  "value": "3404" },

{
  "label": "马鞍山市",
  "value": "3405" },

{
  "label": "淮北市",
  "value": "3406" },

{
  "label": "铜陵市",
  "value": "3407" },

{
  "label": "安庆市",
  "value": "3408" },

{
  "label": "黄山市",
  "value": "3410" },

{
  "label": "滁州市",
  "value": "3411" },

{
  "label": "阜阳市",
  "value": "3412" },

{
  "label": "宿州市",
  "value": "3413" },

{
  "label": "六安市",
  "value": "3415" },

{
  "label": "亳州市",
  "value": "3416" },

{
  "label": "池州市",
  "value": "3417" },

{
  "label": "宣城市",
  "value": "3418" }],


[{
  "label": "福州市",
  "value": "3501" },

{
  "label": "厦门市",
  "value": "3502" },

{
  "label": "莆田市",
  "value": "3503" },

{
  "label": "三明市",
  "value": "3504" },

{
  "label": "泉州市",
  "value": "3505" },

{
  "label": "漳州市",
  "value": "3506" },

{
  "label": "南平市",
  "value": "3507" },

{
  "label": "龙岩市",
  "value": "3508" },

{
  "label": "宁德市",
  "value": "3509" }],


[{
  "label": "南昌市",
  "value": "3601" },

{
  "label": "景德镇市",
  "value": "3602" },

{
  "label": "萍乡市",
  "value": "3603" },

{
  "label": "九江市",
  "value": "3604" },

{
  "label": "新余市",
  "value": "3605" },

{
  "label": "鹰潭市",
  "value": "3606" },

{
  "label": "赣州市",
  "value": "3607" },

{
  "label": "吉安市",
  "value": "3608" },

{
  "label": "宜春市",
  "value": "3609" },

{
  "label": "抚州市",
  "value": "3610" },

{
  "label": "上饶市",
  "value": "3611" }],


[{
  "label": "济南市",
  "value": "3701" },

{
  "label": "青岛市",
  "value": "3702" },

{
  "label": "淄博市",
  "value": "3703" },

{
  "label": "枣庄市",
  "value": "3704" },

{
  "label": "东营市",
  "value": "3705" },

{
  "label": "烟台市",
  "value": "3706" },

{
  "label": "潍坊市",
  "value": "3707" },

{
  "label": "济宁市",
  "value": "3708" },

{
  "label": "泰安市",
  "value": "3709" },

{
  "label": "威海市",
  "value": "3710" },

{
  "label": "日照市",
  "value": "3711" },

{
  "label": "莱芜市",
  "value": "3712" },

{
  "label": "临沂市",
  "value": "3713" },

{
  "label": "德州市",
  "value": "3714" },

{
  "label": "聊城市",
  "value": "3715" },

{
  "label": "滨州市",
  "value": "3716" },

{
  "label": "菏泽市",
  "value": "3717" }],


[{
  "label": "郑州市",
  "value": "4101" },

{
  "label": "开封市",
  "value": "4102" },

{
  "label": "洛阳市",
  "value": "4103" },

{
  "label": "平顶山市",
  "value": "4104" },

{
  "label": "安阳市",
  "value": "4105" },

{
  "label": "鹤壁市",
  "value": "4106" },

{
  "label": "新乡市",
  "value": "4107" },

{
  "label": "焦作市",
  "value": "4108" },

{
  "label": "濮阳市",
  "value": "4109" },

{
  "label": "许昌市",
  "value": "4110" },

{
  "label": "漯河市",
  "value": "4111" },

{
  "label": "三门峡市",
  "value": "4112" },

{
  "label": "南阳市",
  "value": "4113" },

{
  "label": "商丘市",
  "value": "4114" },

{
  "label": "信阳市",
  "value": "4115" },

{
  "label": "周口市",
  "value": "4116" },

{
  "label": "驻马店市",
  "value": "4117" },

{
  "label": "省直辖县级行政区划",
  "value": "4190" }],


[{
  "label": "武汉市",
  "value": "4201" },

{
  "label": "黄石市",
  "value": "4202" },

{
  "label": "十堰市",
  "value": "4203" },

{
  "label": "宜昌市",
  "value": "4205" },

{
  "label": "襄阳市",
  "value": "4206" },

{
  "label": "鄂州市",
  "value": "4207" },

{
  "label": "荆门市",
  "value": "4208" },

{
  "label": "孝感市",
  "value": "4209" },

{
  "label": "荆州市",
  "value": "4210" },

{
  "label": "黄冈市",
  "value": "4211" },

{
  "label": "咸宁市",
  "value": "4212" },

{
  "label": "随州市",
  "value": "4213" },

{
  "label": "恩施土家族苗族自治州",
  "value": "4228" },

{
  "label": "省直辖县级行政区划",
  "value": "4290" }],


[{
  "label": "长沙市",
  "value": "4301" },

{
  "label": "株洲市",
  "value": "4302" },

{
  "label": "湘潭市",
  "value": "4303" },

{
  "label": "衡阳市",
  "value": "4304" },

{
  "label": "邵阳市",
  "value": "4305" },

{
  "label": "岳阳市",
  "value": "4306" },

{
  "label": "常德市",
  "value": "4307" },

{
  "label": "张家界市",
  "value": "4308" },

{
  "label": "益阳市",
  "value": "4309" },

{
  "label": "郴州市",
  "value": "4310" },

{
  "label": "永州市",
  "value": "4311" },

{
  "label": "怀化市",
  "value": "4312" },

{
  "label": "娄底市",
  "value": "4313" },

{
  "label": "湘西土家族苗族自治州",
  "value": "4331" }],


[{
  "label": "广州市",
  "value": "4401" },

{
  "label": "韶关市",
  "value": "4402" },

{
  "label": "深圳市",
  "value": "4403" },

{
  "label": "珠海市",
  "value": "4404" },

{
  "label": "汕头市",
  "value": "4405" },

{
  "label": "佛山市",
  "value": "4406" },

{
  "label": "江门市",
  "value": "4407" },

{
  "label": "湛江市",
  "value": "4408" },

{
  "label": "茂名市",
  "value": "4409" },

{
  "label": "肇庆市",
  "value": "4412" },

{
  "label": "惠州市",
  "value": "4413" },

{
  "label": "梅州市",
  "value": "4414" },

{
  "label": "汕尾市",
  "value": "4415" },

{
  "label": "河源市",
  "value": "4416" },

{
  "label": "阳江市",
  "value": "4417" },

{
  "label": "清远市",
  "value": "4418" },

{
  "label": "东莞市",
  "value": "4419" },

{
  "label": "中山市",
  "value": "4420" },

{
  "label": "潮州市",
  "value": "4451" },

{
  "label": "揭阳市",
  "value": "4452" },

{
  "label": "云浮市",
  "value": "4453" }],


[{
  "label": "南宁市",
  "value": "4501" },

{
  "label": "柳州市",
  "value": "4502" },

{
  "label": "桂林市",
  "value": "4503" },

{
  "label": "梧州市",
  "value": "4504" },

{
  "label": "北海市",
  "value": "4505" },

{
  "label": "防城港市",
  "value": "4506" },

{
  "label": "钦州市",
  "value": "4507" },

{
  "label": "贵港市",
  "value": "4508" },

{
  "label": "玉林市",
  "value": "4509" },

{
  "label": "百色市",
  "value": "4510" },

{
  "label": "贺州市",
  "value": "4511" },

{
  "label": "河池市",
  "value": "4512" },

{
  "label": "来宾市",
  "value": "4513" },

{
  "label": "崇左市",
  "value": "4514" }],


[{
  "label": "海口市",
  "value": "4601" },

{
  "label": "三亚市",
  "value": "4602" },

{
  "label": "三沙市",
  "value": "4603" },

{
  "label": "儋州市",
  "value": "4604" },

{
  "label": "省直辖县级行政区划",
  "value": "4690" }],


[{
  "label": "市辖区",
  "value": "5001" },

{
  "label": "县",
  "value": "5002" }],


[{
  "label": "成都市",
  "value": "5101" },

{
  "label": "自贡市",
  "value": "5103" },

{
  "label": "攀枝花市",
  "value": "5104" },

{
  "label": "泸州市",
  "value": "5105" },

{
  "label": "德阳市",
  "value": "5106" },

{
  "label": "绵阳市",
  "value": "5107" },

{
  "label": "广元市",
  "value": "5108" },

{
  "label": "遂宁市",
  "value": "5109" },

{
  "label": "内江市",
  "value": "5110" },

{
  "label": "乐山市",
  "value": "5111" },

{
  "label": "南充市",
  "value": "5113" },

{
  "label": "眉山市",
  "value": "5114" },

{
  "label": "宜宾市",
  "value": "5115" },

{
  "label": "广安市",
  "value": "5116" },

{
  "label": "达州市",
  "value": "5117" },

{
  "label": "雅安市",
  "value": "5118" },

{
  "label": "巴中市",
  "value": "5119" },

{
  "label": "资阳市",
  "value": "5120" },

{
  "label": "阿坝藏族羌族自治州",
  "value": "5132" },

{
  "label": "甘孜藏族自治州",
  "value": "5133" },

{
  "label": "凉山彝族自治州",
  "value": "5134" }],


[{
  "label": "贵阳市",
  "value": "5201" },

{
  "label": "六盘水市",
  "value": "5202" },

{
  "label": "遵义市",
  "value": "5203" },

{
  "label": "安顺市",
  "value": "5204" },

{
  "label": "毕节市",
  "value": "5205" },

{
  "label": "铜仁市",
  "value": "5206" },

{
  "label": "黔西南布依族苗族自治州",
  "value": "5223" },

{
  "label": "黔东南苗族侗族自治州",
  "value": "5226" },

{
  "label": "黔南布依族苗族自治州",
  "value": "5227" }],


[{
  "label": "昆明市",
  "value": "5301" },

{
  "label": "曲靖市",
  "value": "5303" },

{
  "label": "玉溪市",
  "value": "5304" },

{
  "label": "保山市",
  "value": "5305" },

{
  "label": "昭通市",
  "value": "5306" },

{
  "label": "丽江市",
  "value": "5307" },

{
  "label": "普洱市",
  "value": "5308" },

{
  "label": "临沧市",
  "value": "5309" },

{
  "label": "楚雄彝族自治州",
  "value": "5323" },

{
  "label": "红河哈尼族彝族自治州",
  "value": "5325" },

{
  "label": "文山壮族苗族自治州",
  "value": "5326" },

{
  "label": "西双版纳傣族自治州",
  "value": "5328" },

{
  "label": "大理白族自治州",
  "value": "5329" },

{
  "label": "德宏傣族景颇族自治州",
  "value": "5331" },

{
  "label": "怒江傈僳族自治州",
  "value": "5333" },

{
  "label": "迪庆藏族自治州",
  "value": "5334" }],


[{
  "label": "拉萨市",
  "value": "5401" },

{
  "label": "日喀则市",
  "value": "5402" },

{
  "label": "昌都市",
  "value": "5403" },

{
  "label": "林芝市",
  "value": "5404" },

{
  "label": "山南市",
  "value": "5405" },

{
  "label": "那曲地区",
  "value": "5424" },

{
  "label": "阿里地区",
  "value": "5425" }],


[{
  "label": "西安市",
  "value": "6101" },

{
  "label": "铜川市",
  "value": "6102" },

{
  "label": "宝鸡市",
  "value": "6103" },

{
  "label": "咸阳市",
  "value": "6104" },

{
  "label": "渭南市",
  "value": "6105" },

{
  "label": "延安市",
  "value": "6106" },

{
  "label": "汉中市",
  "value": "6107" },

{
  "label": "榆林市",
  "value": "6108" },

{
  "label": "安康市",
  "value": "6109" },

{
  "label": "商洛市",
  "value": "6110" }],


[{
  "label": "兰州市",
  "value": "6201" },

{
  "label": "嘉峪关市",
  "value": "6202" },

{
  "label": "金昌市",
  "value": "6203" },

{
  "label": "白银市",
  "value": "6204" },

{
  "label": "天水市",
  "value": "6205" },

{
  "label": "武威市",
  "value": "6206" },

{
  "label": "张掖市",
  "value": "6207" },

{
  "label": "平凉市",
  "value": "6208" },

{
  "label": "酒泉市",
  "value": "6209" },

{
  "label": "庆阳市",
  "value": "6210" },

{
  "label": "定西市",
  "value": "6211" },

{
  "label": "陇南市",
  "value": "6212" },

{
  "label": "临夏回族自治州",
  "value": "6229" },

{
  "label": "甘南藏族自治州",
  "value": "6230" }],


[{
  "label": "西宁市",
  "value": "6301" },

{
  "label": "海东市",
  "value": "6302" },

{
  "label": "海北藏族自治州",
  "value": "6322" },

{
  "label": "黄南藏族自治州",
  "value": "6323" },

{
  "label": "海南藏族自治州",
  "value": "6325" },

{
  "label": "果洛藏族自治州",
  "value": "6326" },

{
  "label": "玉树藏族自治州",
  "value": "6327" },

{
  "label": "海西蒙古族藏族自治州",
  "value": "6328" }],


[{
  "label": "银川市",
  "value": "6401" },

{
  "label": "石嘴山市",
  "value": "6402" },

{
  "label": "吴忠市",
  "value": "6403" },

{
  "label": "固原市",
  "value": "6404" },

{
  "label": "中卫市",
  "value": "6405" }],


[{
  "label": "乌鲁木齐市",
  "value": "6501" },

{
  "label": "克拉玛依市",
  "value": "6502" },

{
  "label": "吐鲁番市",
  "value": "6504" },

{
  "label": "哈密市",
  "value": "6505" },

{
  "label": "昌吉回族自治州",
  "value": "6523" },

{
  "label": "博尔塔拉蒙古自治州",
  "value": "6527" },

{
  "label": "巴音郭楞蒙古自治州",
  "value": "6528" },

{
  "label": "阿克苏地区",
  "value": "6529" },

{
  "label": "克孜勒苏柯尔克孜自治州",
  "value": "6530" },

{
  "label": "喀什地区",
  "value": "6531" },

{
  "label": "和田地区",
  "value": "6532" },

{
  "label": "伊犁哈萨克自治州",
  "value": "6540" },

{
  "label": "塔城地区",
  "value": "6542" },

{
  "label": "阿勒泰地区",
  "value": "6543" },

{
  "label": "自治区直辖县级行政区划",
  "value": "6590" }],


[{
  "label": "台北",
  "value": "6601" },

{
  "label": "高雄",
  "value": "6602" },

{
  "label": "基隆",
  "value": "6603" },

{
  "label": "台中",
  "value": "6604" },

{
  "label": "台南",
  "value": "6605" },

{
  "label": "新竹",
  "value": "6606" },

{
  "label": "嘉义",
  "value": "6607" },

{
  "label": "宜兰",
  "value": "6608" },

{
  "label": "桃园",
  "value": "6609" },

{
  "label": "苗栗",
  "value": "6610" },

{
  "label": "彰化",
  "value": "6611" },

{
  "label": "南投",
  "value": "6612" },

{
  "label": "云林",
  "value": "6613" },

{
  "label": "屏东",
  "value": "6614" },

{
  "label": "台东",
  "value": "6615" },

{
  "label": "花莲",
  "value": "6616" },

{
  "label": "澎湖",
  "value": "6617" }],


[{
  "label": "香港岛",
  "value": "6701" },

{
  "label": "九龙",
  "value": "6702" },

{
  "label": "新界",
  "value": "6703" }],


[{
  "label": "澳门半岛",
  "value": "6801" },

{
  "label": "氹仔岛",
  "value": "6802" },

{
  "label": "路环岛",
  "value": "6803" },

{
  "label": "路氹城",
  "value": "6804" }]];var _default =



cityData;exports.default = _default;

/***/ }),

/***/ 1152:
/*!****************************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/mpvue-citypicker/city-data/area.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var areaData = [
[
[{
  "label": "东城区",
  "value": "110101" },

{
  "label": "西城区",
  "value": "110102" },

{
  "label": "朝阳区",
  "value": "110105" },

{
  "label": "丰台区",
  "value": "110106" },

{
  "label": "石景山区",
  "value": "110107" },

{
  "label": "海淀区",
  "value": "110108" },

{
  "label": "门头沟区",
  "value": "110109" },

{
  "label": "房山区",
  "value": "110111" },

{
  "label": "通州区",
  "value": "110112" },

{
  "label": "顺义区",
  "value": "110113" },

{
  "label": "昌平区",
  "value": "110114" },

{
  "label": "大兴区",
  "value": "110115" },

{
  "label": "怀柔区",
  "value": "110116" },

{
  "label": "平谷区",
  "value": "110117" },

{
  "label": "密云区",
  "value": "110118" },

{
  "label": "延庆区",
  "value": "110119" }]],



[
[{
  "label": "和平区",
  "value": "120101" },

{
  "label": "河东区",
  "value": "120102" },

{
  "label": "河西区",
  "value": "120103" },

{
  "label": "南开区",
  "value": "120104" },

{
  "label": "河北区",
  "value": "120105" },

{
  "label": "红桥区",
  "value": "120106" },

{
  "label": "东丽区",
  "value": "120110" },

{
  "label": "西青区",
  "value": "120111" },

{
  "label": "津南区",
  "value": "120112" },

{
  "label": "北辰区",
  "value": "120113" },

{
  "label": "武清区",
  "value": "120114" },

{
  "label": "宝坻区",
  "value": "120115" },

{
  "label": "滨海新区",
  "value": "120116" },

{
  "label": "宁河区",
  "value": "120117" },

{
  "label": "静海区",
  "value": "120118" },

{
  "label": "蓟州区",
  "value": "120119" }]],



[
[{
  "label": "长安区",
  "value": "130102" },

{
  "label": "桥西区",
  "value": "130104" },

{
  "label": "新华区",
  "value": "130105" },

{
  "label": "井陉矿区",
  "value": "130107" },

{
  "label": "裕华区",
  "value": "130108" },

{
  "label": "藁城区",
  "value": "130109" },

{
  "label": "鹿泉区",
  "value": "130110" },

{
  "label": "栾城区",
  "value": "130111" },

{
  "label": "井陉县",
  "value": "130121" },

{
  "label": "正定县",
  "value": "130123" },

{
  "label": "行唐县",
  "value": "130125" },

{
  "label": "灵寿县",
  "value": "130126" },

{
  "label": "高邑县",
  "value": "130127" },

{
  "label": "深泽县",
  "value": "130128" },

{
  "label": "赞皇县",
  "value": "130129" },

{
  "label": "无极县",
  "value": "130130" },

{
  "label": "平山县",
  "value": "130131" },

{
  "label": "元氏县",
  "value": "130132" },

{
  "label": "赵县",
  "value": "130133" },

{
  "label": "石家庄高新技术产业开发区",
  "value": "130171" },

{
  "label": "石家庄循环化工园区",
  "value": "130172" },

{
  "label": "辛集市",
  "value": "130181" },

{
  "label": "晋州市",
  "value": "130183" },

{
  "label": "新乐市",
  "value": "130184" }],


[{
  "label": "路南区",
  "value": "130202" },

{
  "label": "路北区",
  "value": "130203" },

{
  "label": "古冶区",
  "value": "130204" },

{
  "label": "开平区",
  "value": "130205" },

{
  "label": "丰南区",
  "value": "130207" },

{
  "label": "丰润区",
  "value": "130208" },

{
  "label": "曹妃甸区",
  "value": "130209" },

{
  "label": "滦县",
  "value": "130223" },

{
  "label": "滦南县",
  "value": "130224" },

{
  "label": "乐亭县",
  "value": "130225" },

{
  "label": "迁西县",
  "value": "130227" },

{
  "label": "玉田县",
  "value": "130229" },

{
  "label": "唐山市芦台经济技术开发区",
  "value": "130271" },

{
  "label": "唐山市汉沽管理区",
  "value": "130272" },

{
  "label": "唐山高新技术产业开发区",
  "value": "130273" },

{
  "label": "河北唐山海港经济开发区",
  "value": "130274" },

{
  "label": "遵化市",
  "value": "130281" },

{
  "label": "迁安市",
  "value": "130283" }],


[{
  "label": "海港区",
  "value": "130302" },

{
  "label": "山海关区",
  "value": "130303" },

{
  "label": "北戴河区",
  "value": "130304" },

{
  "label": "抚宁区",
  "value": "130306" },

{
  "label": "青龙满族自治县",
  "value": "130321" },

{
  "label": "昌黎县",
  "value": "130322" },

{
  "label": "卢龙县",
  "value": "130324" },

{
  "label": "秦皇岛市经济技术开发区",
  "value": "130371" },

{
  "label": "北戴河新区",
  "value": "130372" }],


[{
  "label": "邯山区",
  "value": "130402" },

{
  "label": "丛台区",
  "value": "130403" },

{
  "label": "复兴区",
  "value": "130404" },

{
  "label": "峰峰矿区",
  "value": "130406" },

{
  "label": "肥乡区",
  "value": "130407" },

{
  "label": "永年区",
  "value": "130408" },

{
  "label": "临漳县",
  "value": "130423" },

{
  "label": "成安县",
  "value": "130424" },

{
  "label": "大名县",
  "value": "130425" },

{
  "label": "涉县",
  "value": "130426" },

{
  "label": "磁县",
  "value": "130427" },

{
  "label": "邱县",
  "value": "130430" },

{
  "label": "鸡泽县",
  "value": "130431" },

{
  "label": "广平县",
  "value": "130432" },

{
  "label": "馆陶县",
  "value": "130433" },

{
  "label": "魏县",
  "value": "130434" },

{
  "label": "曲周县",
  "value": "130435" },

{
  "label": "邯郸经济技术开发区",
  "value": "130471" },

{
  "label": "邯郸冀南新区",
  "value": "130473" },

{
  "label": "武安市",
  "value": "130481" }],


[{
  "label": "桥东区",
  "value": "130502" },

{
  "label": "桥西区",
  "value": "130503" },

{
  "label": "邢台县",
  "value": "130521" },

{
  "label": "临城县",
  "value": "130522" },

{
  "label": "内丘县",
  "value": "130523" },

{
  "label": "柏乡县",
  "value": "130524" },

{
  "label": "隆尧县",
  "value": "130525" },

{
  "label": "任县",
  "value": "130526" },

{
  "label": "南和县",
  "value": "130527" },

{
  "label": "宁晋县",
  "value": "130528" },

{
  "label": "巨鹿县",
  "value": "130529" },

{
  "label": "新河县",
  "value": "130530" },

{
  "label": "广宗县",
  "value": "130531" },

{
  "label": "平乡县",
  "value": "130532" },

{
  "label": "威县",
  "value": "130533" },

{
  "label": "清河县",
  "value": "130534" },

{
  "label": "临西县",
  "value": "130535" },

{
  "label": "河北邢台经济开发区",
  "value": "130571" },

{
  "label": "南宫市",
  "value": "130581" },

{
  "label": "沙河市",
  "value": "130582" }],


[{
  "label": "竞秀区",
  "value": "130602" },

{
  "label": "莲池区",
  "value": "130606" },

{
  "label": "满城区",
  "value": "130607" },

{
  "label": "清苑区",
  "value": "130608" },

{
  "label": "徐水区",
  "value": "130609" },

{
  "label": "涞水县",
  "value": "130623" },

{
  "label": "阜平县",
  "value": "130624" },

{
  "label": "定兴县",
  "value": "130626" },

{
  "label": "唐县",
  "value": "130627" },

{
  "label": "高阳县",
  "value": "130628" },

{
  "label": "容城县",
  "value": "130629" },

{
  "label": "涞源县",
  "value": "130630" },

{
  "label": "望都县",
  "value": "130631" },

{
  "label": "安新县",
  "value": "130632" },

{
  "label": "易县",
  "value": "130633" },

{
  "label": "曲阳县",
  "value": "130634" },

{
  "label": "蠡县",
  "value": "130635" },

{
  "label": "顺平县",
  "value": "130636" },

{
  "label": "博野县",
  "value": "130637" },

{
  "label": "雄县",
  "value": "130638" },

{
  "label": "保定高新技术产业开发区",
  "value": "130671" },

{
  "label": "保定白沟新城",
  "value": "130672" },

{
  "label": "涿州市",
  "value": "130681" },

{
  "label": "定州市",
  "value": "130682" },

{
  "label": "安国市",
  "value": "130683" },

{
  "label": "高碑店市",
  "value": "130684" }],


[{
  "label": "桥东区",
  "value": "130702" },

{
  "label": "桥西区",
  "value": "130703" },

{
  "label": "宣化区",
  "value": "130705" },

{
  "label": "下花园区",
  "value": "130706" },

{
  "label": "万全区",
  "value": "130708" },

{
  "label": "崇礼区",
  "value": "130709" },

{
  "label": "张北县",
  "value": "130722" },

{
  "label": "康保县",
  "value": "130723" },

{
  "label": "沽源县",
  "value": "130724" },

{
  "label": "尚义县",
  "value": "130725" },

{
  "label": "蔚县",
  "value": "130726" },

{
  "label": "阳原县",
  "value": "130727" },

{
  "label": "怀安县",
  "value": "130728" },

{
  "label": "怀来县",
  "value": "130730" },

{
  "label": "涿鹿县",
  "value": "130731" },

{
  "label": "赤城县",
  "value": "130732" },

{
  "label": "张家口市高新技术产业开发区",
  "value": "130771" },

{
  "label": "张家口市察北管理区",
  "value": "130772" },

{
  "label": "张家口市塞北管理区",
  "value": "130773" }],


[{
  "label": "双桥区",
  "value": "130802" },

{
  "label": "双滦区",
  "value": "130803" },

{
  "label": "鹰手营子矿区",
  "value": "130804" },

{
  "label": "承德县",
  "value": "130821" },

{
  "label": "兴隆县",
  "value": "130822" },

{
  "label": "滦平县",
  "value": "130824" },

{
  "label": "隆化县",
  "value": "130825" },

{
  "label": "丰宁满族自治县",
  "value": "130826" },

{
  "label": "宽城满族自治县",
  "value": "130827" },

{
  "label": "围场满族蒙古族自治县",
  "value": "130828" },

{
  "label": "承德高新技术产业开发区",
  "value": "130871" },

{
  "label": "平泉市",
  "value": "130881" }],


[{
  "label": "新华区",
  "value": "130902" },

{
  "label": "运河区",
  "value": "130903" },

{
  "label": "沧县",
  "value": "130921" },

{
  "label": "青县",
  "value": "130922" },

{
  "label": "东光县",
  "value": "130923" },

{
  "label": "海兴县",
  "value": "130924" },

{
  "label": "盐山县",
  "value": "130925" },

{
  "label": "肃宁县",
  "value": "130926" },

{
  "label": "南皮县",
  "value": "130927" },

{
  "label": "吴桥县",
  "value": "130928" },

{
  "label": "献县",
  "value": "130929" },

{
  "label": "孟村回族自治县",
  "value": "130930" },

{
  "label": "河北沧州经济开发区",
  "value": "130971" },

{
  "label": "沧州高新技术产业开发区",
  "value": "130972" },

{
  "label": "沧州渤海新区",
  "value": "130973" },

{
  "label": "泊头市",
  "value": "130981" },

{
  "label": "任丘市",
  "value": "130982" },

{
  "label": "黄骅市",
  "value": "130983" },

{
  "label": "河间市",
  "value": "130984" }],


[{
  "label": "安次区",
  "value": "131002" },

{
  "label": "广阳区",
  "value": "131003" },

{
  "label": "固安县",
  "value": "131022" },

{
  "label": "永清县",
  "value": "131023" },

{
  "label": "香河县",
  "value": "131024" },

{
  "label": "大城县",
  "value": "131025" },

{
  "label": "文安县",
  "value": "131026" },

{
  "label": "大厂回族自治县",
  "value": "131028" },

{
  "label": "廊坊经济技术开发区",
  "value": "131071" },

{
  "label": "霸州市",
  "value": "131081" },

{
  "label": "三河市",
  "value": "131082" }],


[{
  "label": "桃城区",
  "value": "131102" },

{
  "label": "冀州区",
  "value": "131103" },

{
  "label": "枣强县",
  "value": "131121" },

{
  "label": "武邑县",
  "value": "131122" },

{
  "label": "武强县",
  "value": "131123" },

{
  "label": "饶阳县",
  "value": "131124" },

{
  "label": "安平县",
  "value": "131125" },

{
  "label": "故城县",
  "value": "131126" },

{
  "label": "景县",
  "value": "131127" },

{
  "label": "阜城县",
  "value": "131128" },

{
  "label": "河北衡水经济开发区",
  "value": "131171" },

{
  "label": "衡水滨湖新区",
  "value": "131172" },

{
  "label": "深州市",
  "value": "131182" }]],



[
[{
  "label": "小店区",
  "value": "140105" },

{
  "label": "迎泽区",
  "value": "140106" },

{
  "label": "杏花岭区",
  "value": "140107" },

{
  "label": "尖草坪区",
  "value": "140108" },

{
  "label": "万柏林区",
  "value": "140109" },

{
  "label": "晋源区",
  "value": "140110" },

{
  "label": "清徐县",
  "value": "140121" },

{
  "label": "阳曲县",
  "value": "140122" },

{
  "label": "娄烦县",
  "value": "140123" },

{
  "label": "山西转型综合改革示范区",
  "value": "140171" },

{
  "label": "古交市",
  "value": "140181" }],


[{
  "label": "城区",
  "value": "140202" },

{
  "label": "矿区",
  "value": "140203" },

{
  "label": "南郊区",
  "value": "140211" },

{
  "label": "新荣区",
  "value": "140212" },

{
  "label": "阳高县",
  "value": "140221" },

{
  "label": "天镇县",
  "value": "140222" },

{
  "label": "广灵县",
  "value": "140223" },

{
  "label": "灵丘县",
  "value": "140224" },

{
  "label": "浑源县",
  "value": "140225" },

{
  "label": "左云县",
  "value": "140226" },

{
  "label": "大同县",
  "value": "140227" },

{
  "label": "山西大同经济开发区",
  "value": "140271" }],


[{
  "label": "城区",
  "value": "140302" },

{
  "label": "矿区",
  "value": "140303" },

{
  "label": "郊区",
  "value": "140311" },

{
  "label": "平定县",
  "value": "140321" },

{
  "label": "盂县",
  "value": "140322" },

{
  "label": "山西阳泉经济开发区",
  "value": "140371" }],


[{
  "label": "城区",
  "value": "140402" },

{
  "label": "郊区",
  "value": "140411" },

{
  "label": "长治县",
  "value": "140421" },

{
  "label": "襄垣县",
  "value": "140423" },

{
  "label": "屯留县",
  "value": "140424" },

{
  "label": "平顺县",
  "value": "140425" },

{
  "label": "黎城县",
  "value": "140426" },

{
  "label": "壶关县",
  "value": "140427" },

{
  "label": "长子县",
  "value": "140428" },

{
  "label": "武乡县",
  "value": "140429" },

{
  "label": "沁县",
  "value": "140430" },

{
  "label": "沁源县",
  "value": "140431" },

{
  "label": "山西长治高新技术产业园区",
  "value": "140471" },

{
  "label": "潞城市",
  "value": "140481" }],


[{
  "label": "城区",
  "value": "140502" },

{
  "label": "沁水县",
  "value": "140521" },

{
  "label": "阳城县",
  "value": "140522" },

{
  "label": "陵川县",
  "value": "140524" },

{
  "label": "泽州县",
  "value": "140525" },

{
  "label": "高平市",
  "value": "140581" }],


[{
  "label": "朔城区",
  "value": "140602" },

{
  "label": "平鲁区",
  "value": "140603" },

{
  "label": "山阴县",
  "value": "140621" },

{
  "label": "应县",
  "value": "140622" },

{
  "label": "右玉县",
  "value": "140623" },

{
  "label": "怀仁县",
  "value": "140624" },

{
  "label": "山西朔州经济开发区",
  "value": "140671" }],


[{
  "label": "榆次区",
  "value": "140702" },

{
  "label": "榆社县",
  "value": "140721" },

{
  "label": "左权县",
  "value": "140722" },

{
  "label": "和顺县",
  "value": "140723" },

{
  "label": "昔阳县",
  "value": "140724" },

{
  "label": "寿阳县",
  "value": "140725" },

{
  "label": "太谷县",
  "value": "140726" },

{
  "label": "祁县",
  "value": "140727" },

{
  "label": "平遥县",
  "value": "140728" },

{
  "label": "灵石县",
  "value": "140729" },

{
  "label": "介休市",
  "value": "140781" }],


[{
  "label": "盐湖区",
  "value": "140802" },

{
  "label": "临猗县",
  "value": "140821" },

{
  "label": "万荣县",
  "value": "140822" },

{
  "label": "闻喜县",
  "value": "140823" },

{
  "label": "稷山县",
  "value": "140824" },

{
  "label": "新绛县",
  "value": "140825" },

{
  "label": "绛县",
  "value": "140826" },

{
  "label": "垣曲县",
  "value": "140827" },

{
  "label": "夏县",
  "value": "140828" },

{
  "label": "平陆县",
  "value": "140829" },

{
  "label": "芮城县",
  "value": "140830" },

{
  "label": "永济市",
  "value": "140881" },

{
  "label": "河津市",
  "value": "140882" }],


[{
  "label": "忻府区",
  "value": "140902" },

{
  "label": "定襄县",
  "value": "140921" },

{
  "label": "五台县",
  "value": "140922" },

{
  "label": "代县",
  "value": "140923" },

{
  "label": "繁峙县",
  "value": "140924" },

{
  "label": "宁武县",
  "value": "140925" },

{
  "label": "静乐县",
  "value": "140926" },

{
  "label": "神池县",
  "value": "140927" },

{
  "label": "五寨县",
  "value": "140928" },

{
  "label": "岢岚县",
  "value": "140929" },

{
  "label": "河曲县",
  "value": "140930" },

{
  "label": "保德县",
  "value": "140931" },

{
  "label": "偏关县",
  "value": "140932" },

{
  "label": "五台山风景名胜区",
  "value": "140971" },

{
  "label": "原平市",
  "value": "140981" }],


[{
  "label": "尧都区",
  "value": "141002" },

{
  "label": "曲沃县",
  "value": "141021" },

{
  "label": "翼城县",
  "value": "141022" },

{
  "label": "襄汾县",
  "value": "141023" },

{
  "label": "洪洞县",
  "value": "141024" },

{
  "label": "古县",
  "value": "141025" },

{
  "label": "安泽县",
  "value": "141026" },

{
  "label": "浮山县",
  "value": "141027" },

{
  "label": "吉县",
  "value": "141028" },

{
  "label": "乡宁县",
  "value": "141029" },

{
  "label": "大宁县",
  "value": "141030" },

{
  "label": "隰县",
  "value": "141031" },

{
  "label": "永和县",
  "value": "141032" },

{
  "label": "蒲县",
  "value": "141033" },

{
  "label": "汾西县",
  "value": "141034" },

{
  "label": "侯马市",
  "value": "141081" },

{
  "label": "霍州市",
  "value": "141082" }],


[{
  "label": "离石区",
  "value": "141102" },

{
  "label": "文水县",
  "value": "141121" },

{
  "label": "交城县",
  "value": "141122" },

{
  "label": "兴县",
  "value": "141123" },

{
  "label": "临县",
  "value": "141124" },

{
  "label": "柳林县",
  "value": "141125" },

{
  "label": "石楼县",
  "value": "141126" },

{
  "label": "岚县",
  "value": "141127" },

{
  "label": "方山县",
  "value": "141128" },

{
  "label": "中阳县",
  "value": "141129" },

{
  "label": "交口县",
  "value": "141130" },

{
  "label": "孝义市",
  "value": "141181" },

{
  "label": "汾阳市",
  "value": "141182" }]],



[
[{
  "label": "新城区",
  "value": "150102" },

{
  "label": "回民区",
  "value": "150103" },

{
  "label": "玉泉区",
  "value": "150104" },

{
  "label": "赛罕区",
  "value": "150105" },

{
  "label": "土默特左旗",
  "value": "150121" },

{
  "label": "托克托县",
  "value": "150122" },

{
  "label": "和林格尔县",
  "value": "150123" },

{
  "label": "清水河县",
  "value": "150124" },

{
  "label": "武川县",
  "value": "150125" },

{
  "label": "呼和浩特金海工业园区",
  "value": "150171" },

{
  "label": "呼和浩特经济技术开发区",
  "value": "150172" }],


[{
  "label": "东河区",
  "value": "150202" },

{
  "label": "昆都仑区",
  "value": "150203" },

{
  "label": "青山区",
  "value": "150204" },

{
  "label": "石拐区",
  "value": "150205" },

{
  "label": "白云鄂博矿区",
  "value": "150206" },

{
  "label": "九原区",
  "value": "150207" },

{
  "label": "土默特右旗",
  "value": "150221" },

{
  "label": "固阳县",
  "value": "150222" },

{
  "label": "达尔罕茂明安联合旗",
  "value": "150223" },

{
  "label": "包头稀土高新技术产业开发区",
  "value": "150271" }],


[{
  "label": "海勃湾区",
  "value": "150302" },

{
  "label": "海南区",
  "value": "150303" },

{
  "label": "乌达区",
  "value": "150304" }],


[{
  "label": "红山区",
  "value": "150402" },

{
  "label": "元宝山区",
  "value": "150403" },

{
  "label": "松山区",
  "value": "150404" },

{
  "label": "阿鲁科尔沁旗",
  "value": "150421" },

{
  "label": "巴林左旗",
  "value": "150422" },

{
  "label": "巴林右旗",
  "value": "150423" },

{
  "label": "林西县",
  "value": "150424" },

{
  "label": "克什克腾旗",
  "value": "150425" },

{
  "label": "翁牛特旗",
  "value": "150426" },

{
  "label": "喀喇沁旗",
  "value": "150428" },

{
  "label": "宁城县",
  "value": "150429" },

{
  "label": "敖汉旗",
  "value": "150430" }],


[{
  "label": "科尔沁区",
  "value": "150502" },

{
  "label": "科尔沁左翼中旗",
  "value": "150521" },

{
  "label": "科尔沁左翼后旗",
  "value": "150522" },

{
  "label": "开鲁县",
  "value": "150523" },

{
  "label": "库伦旗",
  "value": "150524" },

{
  "label": "奈曼旗",
  "value": "150525" },

{
  "label": "扎鲁特旗",
  "value": "150526" },

{
  "label": "通辽经济技术开发区",
  "value": "150571" },

{
  "label": "霍林郭勒市",
  "value": "150581" }],


[{
  "label": "东胜区",
  "value": "150602" },

{
  "label": "康巴什区",
  "value": "150603" },

{
  "label": "达拉特旗",
  "value": "150621" },

{
  "label": "准格尔旗",
  "value": "150622" },

{
  "label": "鄂托克前旗",
  "value": "150623" },

{
  "label": "鄂托克旗",
  "value": "150624" },

{
  "label": "杭锦旗",
  "value": "150625" },

{
  "label": "乌审旗",
  "value": "150626" },

{
  "label": "伊金霍洛旗",
  "value": "150627" }],


[{
  "label": "海拉尔区",
  "value": "150702" },

{
  "label": "扎赉诺尔区",
  "value": "150703" },

{
  "label": "阿荣旗",
  "value": "150721" },

{
  "label": "莫力达瓦达斡尔族自治旗",
  "value": "150722" },

{
  "label": "鄂伦春自治旗",
  "value": "150723" },

{
  "label": "鄂温克族自治旗",
  "value": "150724" },

{
  "label": "陈巴尔虎旗",
  "value": "150725" },

{
  "label": "新巴尔虎左旗",
  "value": "150726" },

{
  "label": "新巴尔虎右旗",
  "value": "150727" },

{
  "label": "满洲里市",
  "value": "150781" },

{
  "label": "牙克石市",
  "value": "150782" },

{
  "label": "扎兰屯市",
  "value": "150783" },

{
  "label": "额尔古纳市",
  "value": "150784" },

{
  "label": "根河市",
  "value": "150785" }],


[{
  "label": "临河区",
  "value": "150802" },

{
  "label": "五原县",
  "value": "150821" },

{
  "label": "磴口县",
  "value": "150822" },

{
  "label": "乌拉特前旗",
  "value": "150823" },

{
  "label": "乌拉特中旗",
  "value": "150824" },

{
  "label": "乌拉特后旗",
  "value": "150825" },

{
  "label": "杭锦后旗",
  "value": "150826" }],


[{
  "label": "集宁区",
  "value": "150902" },

{
  "label": "卓资县",
  "value": "150921" },

{
  "label": "化德县",
  "value": "150922" },

{
  "label": "商都县",
  "value": "150923" },

{
  "label": "兴和县",
  "value": "150924" },

{
  "label": "凉城县",
  "value": "150925" },

{
  "label": "察哈尔右翼前旗",
  "value": "150926" },

{
  "label": "察哈尔右翼中旗",
  "value": "150927" },

{
  "label": "察哈尔右翼后旗",
  "value": "150928" },

{
  "label": "四子王旗",
  "value": "150929" },

{
  "label": "丰镇市",
  "value": "150981" }],


[{
  "label": "乌兰浩特市",
  "value": "152201" },

{
  "label": "阿尔山市",
  "value": "152202" },

{
  "label": "科尔沁右翼前旗",
  "value": "152221" },

{
  "label": "科尔沁右翼中旗",
  "value": "152222" },

{
  "label": "扎赉特旗",
  "value": "152223" },

{
  "label": "突泉县",
  "value": "152224" }],


[{
  "label": "二连浩特市",
  "value": "152501" },

{
  "label": "锡林浩特市",
  "value": "152502" },

{
  "label": "阿巴嘎旗",
  "value": "152522" },

{
  "label": "苏尼特左旗",
  "value": "152523" },

{
  "label": "苏尼特右旗",
  "value": "152524" },

{
  "label": "东乌珠穆沁旗",
  "value": "152525" },

{
  "label": "西乌珠穆沁旗",
  "value": "152526" },

{
  "label": "太仆寺旗",
  "value": "152527" },

{
  "label": "镶黄旗",
  "value": "152528" },

{
  "label": "正镶白旗",
  "value": "152529" },

{
  "label": "正蓝旗",
  "value": "152530" },

{
  "label": "多伦县",
  "value": "152531" },

{
  "label": "乌拉盖管委会",
  "value": "152571" }],


[{
  "label": "阿拉善左旗",
  "value": "152921" },

{
  "label": "阿拉善右旗",
  "value": "152922" },

{
  "label": "额济纳旗",
  "value": "152923" },

{
  "label": "内蒙古阿拉善经济开发区",
  "value": "152971" }]],



[
[{
  "label": "和平区",
  "value": "210102" },

{
  "label": "沈河区",
  "value": "210103" },

{
  "label": "大东区",
  "value": "210104" },

{
  "label": "皇姑区",
  "value": "210105" },

{
  "label": "铁西区",
  "value": "210106" },

{
  "label": "苏家屯区",
  "value": "210111" },

{
  "label": "浑南区",
  "value": "210112" },

{
  "label": "沈北新区",
  "value": "210113" },

{
  "label": "于洪区",
  "value": "210114" },

{
  "label": "辽中区",
  "value": "210115" },

{
  "label": "康平县",
  "value": "210123" },

{
  "label": "法库县",
  "value": "210124" },

{
  "label": "新民市",
  "value": "210181" }],


[{
  "label": "中山区",
  "value": "210202" },

{
  "label": "西岗区",
  "value": "210203" },

{
  "label": "沙河口区",
  "value": "210204" },

{
  "label": "甘井子区",
  "value": "210211" },

{
  "label": "旅顺口区",
  "value": "210212" },

{
  "label": "金州区",
  "value": "210213" },

{
  "label": "普兰店区",
  "value": "210214" },

{
  "label": "长海县",
  "value": "210224" },

{
  "label": "瓦房店市",
  "value": "210281" },

{
  "label": "庄河市",
  "value": "210283" }],


[{
  "label": "铁东区",
  "value": "210302" },

{
  "label": "铁西区",
  "value": "210303" },

{
  "label": "立山区",
  "value": "210304" },

{
  "label": "千山区",
  "value": "210311" },

{
  "label": "台安县",
  "value": "210321" },

{
  "label": "岫岩满族自治县",
  "value": "210323" },

{
  "label": "海城市",
  "value": "210381" }],


[{
  "label": "新抚区",
  "value": "210402" },

{
  "label": "东洲区",
  "value": "210403" },

{
  "label": "望花区",
  "value": "210404" },

{
  "label": "顺城区",
  "value": "210411" },

{
  "label": "抚顺县",
  "value": "210421" },

{
  "label": "新宾满族自治县",
  "value": "210422" },

{
  "label": "清原满族自治县",
  "value": "210423" }],


[{
  "label": "平山区",
  "value": "210502" },

{
  "label": "溪湖区",
  "value": "210503" },

{
  "label": "明山区",
  "value": "210504" },

{
  "label": "南芬区",
  "value": "210505" },

{
  "label": "本溪满族自治县",
  "value": "210521" },

{
  "label": "桓仁满族自治县",
  "value": "210522" }],


[{
  "label": "元宝区",
  "value": "210602" },

{
  "label": "振兴区",
  "value": "210603" },

{
  "label": "振安区",
  "value": "210604" },

{
  "label": "宽甸满族自治县",
  "value": "210624" },

{
  "label": "东港市",
  "value": "210681" },

{
  "label": "凤城市",
  "value": "210682" }],


[{
  "label": "古塔区",
  "value": "210702" },

{
  "label": "凌河区",
  "value": "210703" },

{
  "label": "太和区",
  "value": "210711" },

{
  "label": "黑山县",
  "value": "210726" },

{
  "label": "义县",
  "value": "210727" },

{
  "label": "凌海市",
  "value": "210781" },

{
  "label": "北镇市",
  "value": "210782" }],


[{
  "label": "站前区",
  "value": "210802" },

{
  "label": "西市区",
  "value": "210803" },

{
  "label": "鲅鱼圈区",
  "value": "210804" },

{
  "label": "老边区",
  "value": "210811" },

{
  "label": "盖州市",
  "value": "210881" },

{
  "label": "大石桥市",
  "value": "210882" }],


[{
  "label": "海州区",
  "value": "210902" },

{
  "label": "新邱区",
  "value": "210903" },

{
  "label": "太平区",
  "value": "210904" },

{
  "label": "清河门区",
  "value": "210905" },

{
  "label": "细河区",
  "value": "210911" },

{
  "label": "阜新蒙古族自治县",
  "value": "210921" },

{
  "label": "彰武县",
  "value": "210922" }],


[{
  "label": "白塔区",
  "value": "211002" },

{
  "label": "文圣区",
  "value": "211003" },

{
  "label": "宏伟区",
  "value": "211004" },

{
  "label": "弓长岭区",
  "value": "211005" },

{
  "label": "太子河区",
  "value": "211011" },

{
  "label": "辽阳县",
  "value": "211021" },

{
  "label": "灯塔市",
  "value": "211081" }],


[{
  "label": "双台子区",
  "value": "211102" },

{
  "label": "兴隆台区",
  "value": "211103" },

{
  "label": "大洼区",
  "value": "211104" },

{
  "label": "盘山县",
  "value": "211122" }],


[{
  "label": "银州区",
  "value": "211202" },

{
  "label": "清河区",
  "value": "211204" },

{
  "label": "铁岭县",
  "value": "211221" },

{
  "label": "西丰县",
  "value": "211223" },

{
  "label": "昌图县",
  "value": "211224" },

{
  "label": "调兵山市",
  "value": "211281" },

{
  "label": "开原市",
  "value": "211282" }],


[{
  "label": "双塔区",
  "value": "211302" },

{
  "label": "龙城区",
  "value": "211303" },

{
  "label": "朝阳县",
  "value": "211321" },

{
  "label": "建平县",
  "value": "211322" },

{
  "label": "喀喇沁左翼蒙古族自治县",
  "value": "211324" },

{
  "label": "北票市",
  "value": "211381" },

{
  "label": "凌源市",
  "value": "211382" }],


[{
  "label": "连山区",
  "value": "211402" },

{
  "label": "龙港区",
  "value": "211403" },

{
  "label": "南票区",
  "value": "211404" },

{
  "label": "绥中县",
  "value": "211421" },

{
  "label": "建昌县",
  "value": "211422" },

{
  "label": "兴城市",
  "value": "211481" }]],



[
[{
  "label": "南关区",
  "value": "220102" },

{
  "label": "宽城区",
  "value": "220103" },

{
  "label": "朝阳区",
  "value": "220104" },

{
  "label": "二道区",
  "value": "220105" },

{
  "label": "绿园区",
  "value": "220106" },

{
  "label": "双阳区",
  "value": "220112" },

{
  "label": "九台区",
  "value": "220113" },

{
  "label": "农安县",
  "value": "220122" },

{
  "label": "长春经济技术开发区",
  "value": "220171" },

{
  "label": "长春净月高新技术产业开发区",
  "value": "220172" },

{
  "label": "长春高新技术产业开发区",
  "value": "220173" },

{
  "label": "长春汽车经济技术开发区",
  "value": "220174" },

{
  "label": "榆树市",
  "value": "220182" },

{
  "label": "德惠市",
  "value": "220183" }],


[{
  "label": "昌邑区",
  "value": "220202" },

{
  "label": "龙潭区",
  "value": "220203" },

{
  "label": "船营区",
  "value": "220204" },

{
  "label": "丰满区",
  "value": "220211" },

{
  "label": "永吉县",
  "value": "220221" },

{
  "label": "吉林经济开发区",
  "value": "220271" },

{
  "label": "吉林高新技术产业开发区",
  "value": "220272" },

{
  "label": "吉林中国新加坡食品区",
  "value": "220273" },

{
  "label": "蛟河市",
  "value": "220281" },

{
  "label": "桦甸市",
  "value": "220282" },

{
  "label": "舒兰市",
  "value": "220283" },

{
  "label": "磐石市",
  "value": "220284" }],


[{
  "label": "铁西区",
  "value": "220302" },

{
  "label": "铁东区",
  "value": "220303" },

{
  "label": "梨树县",
  "value": "220322" },

{
  "label": "伊通满族自治县",
  "value": "220323" },

{
  "label": "公主岭市",
  "value": "220381" },

{
  "label": "双辽市",
  "value": "220382" }],


[{
  "label": "龙山区",
  "value": "220402" },

{
  "label": "西安区",
  "value": "220403" },

{
  "label": "东丰县",
  "value": "220421" },

{
  "label": "东辽县",
  "value": "220422" }],


[{
  "label": "东昌区",
  "value": "220502" },

{
  "label": "二道江区",
  "value": "220503" },

{
  "label": "通化县",
  "value": "220521" },

{
  "label": "辉南县",
  "value": "220523" },

{
  "label": "柳河县",
  "value": "220524" },

{
  "label": "梅河口市",
  "value": "220581" },

{
  "label": "集安市",
  "value": "220582" }],


[{
  "label": "浑江区",
  "value": "220602" },

{
  "label": "江源区",
  "value": "220605" },

{
  "label": "抚松县",
  "value": "220621" },

{
  "label": "靖宇县",
  "value": "220622" },

{
  "label": "长白朝鲜族自治县",
  "value": "220623" },

{
  "label": "临江市",
  "value": "220681" }],


[{
  "label": "宁江区",
  "value": "220702" },

{
  "label": "前郭尔罗斯蒙古族自治县",
  "value": "220721" },

{
  "label": "长岭县",
  "value": "220722" },

{
  "label": "乾安县",
  "value": "220723" },

{
  "label": "吉林松原经济开发区",
  "value": "220771" },

{
  "label": "扶余市",
  "value": "220781" }],


[{
  "label": "洮北区",
  "value": "220802" },

{
  "label": "镇赉县",
  "value": "220821" },

{
  "label": "通榆县",
  "value": "220822" },

{
  "label": "吉林白城经济开发区",
  "value": "220871" },

{
  "label": "洮南市",
  "value": "220881" },

{
  "label": "大安市",
  "value": "220882" }],


[{
  "label": "延吉市",
  "value": "222401" },

{
  "label": "图们市",
  "value": "222402" },

{
  "label": "敦化市",
  "value": "222403" },

{
  "label": "珲春市",
  "value": "222404" },

{
  "label": "龙井市",
  "value": "222405" },

{
  "label": "和龙市",
  "value": "222406" },

{
  "label": "汪清县",
  "value": "222424" },

{
  "label": "安图县",
  "value": "222426" }]],



[
[{
  "label": "道里区",
  "value": "230102" },

{
  "label": "南岗区",
  "value": "230103" },

{
  "label": "道外区",
  "value": "230104" },

{
  "label": "平房区",
  "value": "230108" },

{
  "label": "松北区",
  "value": "230109" },

{
  "label": "香坊区",
  "value": "230110" },

{
  "label": "呼兰区",
  "value": "230111" },

{
  "label": "阿城区",
  "value": "230112" },

{
  "label": "双城区",
  "value": "230113" },

{
  "label": "依兰县",
  "value": "230123" },

{
  "label": "方正县",
  "value": "230124" },

{
  "label": "宾县",
  "value": "230125" },

{
  "label": "巴彦县",
  "value": "230126" },

{
  "label": "木兰县",
  "value": "230127" },

{
  "label": "通河县",
  "value": "230128" },

{
  "label": "延寿县",
  "value": "230129" },

{
  "label": "尚志市",
  "value": "230183" },

{
  "label": "五常市",
  "value": "230184" }],


[{
  "label": "龙沙区",
  "value": "230202" },

{
  "label": "建华区",
  "value": "230203" },

{
  "label": "铁锋区",
  "value": "230204" },

{
  "label": "昂昂溪区",
  "value": "230205" },

{
  "label": "富拉尔基区",
  "value": "230206" },

{
  "label": "碾子山区",
  "value": "230207" },

{
  "label": "梅里斯达斡尔族区",
  "value": "230208" },

{
  "label": "龙江县",
  "value": "230221" },

{
  "label": "依安县",
  "value": "230223" },

{
  "label": "泰来县",
  "value": "230224" },

{
  "label": "甘南县",
  "value": "230225" },

{
  "label": "富裕县",
  "value": "230227" },

{
  "label": "克山县",
  "value": "230229" },

{
  "label": "克东县",
  "value": "230230" },

{
  "label": "拜泉县",
  "value": "230231" },

{
  "label": "讷河市",
  "value": "230281" }],


[{
  "label": "鸡冠区",
  "value": "230302" },

{
  "label": "恒山区",
  "value": "230303" },

{
  "label": "滴道区",
  "value": "230304" },

{
  "label": "梨树区",
  "value": "230305" },

{
  "label": "城子河区",
  "value": "230306" },

{
  "label": "麻山区",
  "value": "230307" },

{
  "label": "鸡东县",
  "value": "230321" },

{
  "label": "虎林市",
  "value": "230381" },

{
  "label": "密山市",
  "value": "230382" }],


[{
  "label": "向阳区",
  "value": "230402" },

{
  "label": "工农区",
  "value": "230403" },

{
  "label": "南山区",
  "value": "230404" },

{
  "label": "兴安区",
  "value": "230405" },

{
  "label": "东山区",
  "value": "230406" },

{
  "label": "兴山区",
  "value": "230407" },

{
  "label": "萝北县",
  "value": "230421" },

{
  "label": "绥滨县",
  "value": "230422" }],


[{
  "label": "尖山区",
  "value": "230502" },

{
  "label": "岭东区",
  "value": "230503" },

{
  "label": "四方台区",
  "value": "230505" },

{
  "label": "宝山区",
  "value": "230506" },

{
  "label": "集贤县",
  "value": "230521" },

{
  "label": "友谊县",
  "value": "230522" },

{
  "label": "宝清县",
  "value": "230523" },

{
  "label": "饶河县",
  "value": "230524" }],


[{
  "label": "萨尔图区",
  "value": "230602" },

{
  "label": "龙凤区",
  "value": "230603" },

{
  "label": "让胡路区",
  "value": "230604" },

{
  "label": "红岗区",
  "value": "230605" },

{
  "label": "大同区",
  "value": "230606" },

{
  "label": "肇州县",
  "value": "230621" },

{
  "label": "肇源县",
  "value": "230622" },

{
  "label": "林甸县",
  "value": "230623" },

{
  "label": "杜尔伯特蒙古族自治县",
  "value": "230624" },

{
  "label": "大庆高新技术产业开发区",
  "value": "230671" }],


[{
  "label": "伊春区",
  "value": "230702" },

{
  "label": "南岔区",
  "value": "230703" },

{
  "label": "友好区",
  "value": "230704" },

{
  "label": "西林区",
  "value": "230705" },

{
  "label": "翠峦区",
  "value": "230706" },

{
  "label": "新青区",
  "value": "230707" },

{
  "label": "美溪区",
  "value": "230708" },

{
  "label": "金山屯区",
  "value": "230709" },

{
  "label": "五营区",
  "value": "230710" },

{
  "label": "乌马河区",
  "value": "230711" },

{
  "label": "汤旺河区",
  "value": "230712" },

{
  "label": "带岭区",
  "value": "230713" },

{
  "label": "乌伊岭区",
  "value": "230714" },

{
  "label": "红星区",
  "value": "230715" },

{
  "label": "上甘岭区",
  "value": "230716" },

{
  "label": "嘉荫县",
  "value": "230722" },

{
  "label": "铁力市",
  "value": "230781" }],


[{
  "label": "向阳区",
  "value": "230803" },

{
  "label": "前进区",
  "value": "230804" },

{
  "label": "东风区",
  "value": "230805" },

{
  "label": "郊区",
  "value": "230811" },

{
  "label": "桦南县",
  "value": "230822" },

{
  "label": "桦川县",
  "value": "230826" },

{
  "label": "汤原县",
  "value": "230828" },

{
  "label": "同江市",
  "value": "230881" },

{
  "label": "富锦市",
  "value": "230882" },

{
  "label": "抚远市",
  "value": "230883" }],


[{
  "label": "新兴区",
  "value": "230902" },

{
  "label": "桃山区",
  "value": "230903" },

{
  "label": "茄子河区",
  "value": "230904" },

{
  "label": "勃利县",
  "value": "230921" }],


[{
  "label": "东安区",
  "value": "231002" },

{
  "label": "阳明区",
  "value": "231003" },

{
  "label": "爱民区",
  "value": "231004" },

{
  "label": "西安区",
  "value": "231005" },

{
  "label": "林口县",
  "value": "231025" },

{
  "label": "牡丹江经济技术开发区",
  "value": "231071" },

{
  "label": "绥芬河市",
  "value": "231081" },

{
  "label": "海林市",
  "value": "231083" },

{
  "label": "宁安市",
  "value": "231084" },

{
  "label": "穆棱市",
  "value": "231085" },

{
  "label": "东宁市",
  "value": "231086" }],


[{
  "label": "爱辉区",
  "value": "231102" },

{
  "label": "嫩江县",
  "value": "231121" },

{
  "label": "逊克县",
  "value": "231123" },

{
  "label": "孙吴县",
  "value": "231124" },

{
  "label": "北安市",
  "value": "231181" },

{
  "label": "五大连池市",
  "value": "231182" }],


[{
  "label": "北林区",
  "value": "231202" },

{
  "label": "望奎县",
  "value": "231221" },

{
  "label": "兰西县",
  "value": "231222" },

{
  "label": "青冈县",
  "value": "231223" },

{
  "label": "庆安县",
  "value": "231224" },

{
  "label": "明水县",
  "value": "231225" },

{
  "label": "绥棱县",
  "value": "231226" },

{
  "label": "安达市",
  "value": "231281" },

{
  "label": "肇东市",
  "value": "231282" },

{
  "label": "海伦市",
  "value": "231283" }],


[{
  "label": "加格达奇区",
  "value": "232701" },

{
  "label": "松岭区",
  "value": "232702" },

{
  "label": "新林区",
  "value": "232703" },

{
  "label": "呼中区",
  "value": "232704" },

{
  "label": "呼玛县",
  "value": "232721" },

{
  "label": "塔河县",
  "value": "232722" },

{
  "label": "漠河县",
  "value": "232723" }]],



[
[{
  "label": "黄浦区",
  "value": "310101" },

{
  "label": "徐汇区",
  "value": "310104" },

{
  "label": "长宁区",
  "value": "310105" },

{
  "label": "静安区",
  "value": "310106" },

{
  "label": "普陀区",
  "value": "310107" },

{
  "label": "虹口区",
  "value": "310109" },

{
  "label": "杨浦区",
  "value": "310110" },

{
  "label": "闵行区",
  "value": "310112" },

{
  "label": "宝山区",
  "value": "310113" },

{
  "label": "嘉定区",
  "value": "310114" },

{
  "label": "浦东新区",
  "value": "310115" },

{
  "label": "金山区",
  "value": "310116" },

{
  "label": "松江区",
  "value": "310117" },

{
  "label": "青浦区",
  "value": "310118" },

{
  "label": "奉贤区",
  "value": "310120" },

{
  "label": "崇明区",
  "value": "310151" }]],



[
[{
  "label": "玄武区",
  "value": "320102" },

{
  "label": "秦淮区",
  "value": "320104" },

{
  "label": "建邺区",
  "value": "320105" },

{
  "label": "鼓楼区",
  "value": "320106" },

{
  "label": "浦口区",
  "value": "320111" },

{
  "label": "栖霞区",
  "value": "320113" },

{
  "label": "雨花台区",
  "value": "320114" },

{
  "label": "江宁区",
  "value": "320115" },

{
  "label": "六合区",
  "value": "320116" },

{
  "label": "溧水区",
  "value": "320117" },

{
  "label": "高淳区",
  "value": "320118" }],


[{
  "label": "锡山区",
  "value": "320205" },

{
  "label": "惠山区",
  "value": "320206" },

{
  "label": "滨湖区",
  "value": "320211" },

{
  "label": "梁溪区",
  "value": "320213" },

{
  "label": "新吴区",
  "value": "320214" },

{
  "label": "江阴市",
  "value": "320281" },

{
  "label": "宜兴市",
  "value": "320282" }],


[{
  "label": "鼓楼区",
  "value": "320302" },

{
  "label": "云龙区",
  "value": "320303" },

{
  "label": "贾汪区",
  "value": "320305" },

{
  "label": "泉山区",
  "value": "320311" },

{
  "label": "铜山区",
  "value": "320312" },

{
  "label": "丰县",
  "value": "320321" },

{
  "label": "沛县",
  "value": "320322" },

{
  "label": "睢宁县",
  "value": "320324" },

{
  "label": "徐州经济技术开发区",
  "value": "320371" },

{
  "label": "新沂市",
  "value": "320381" },

{
  "label": "邳州市",
  "value": "320382" }],


[{
  "label": "天宁区",
  "value": "320402" },

{
  "label": "钟楼区",
  "value": "320404" },

{
  "label": "新北区",
  "value": "320411" },

{
  "label": "武进区",
  "value": "320412" },

{
  "label": "金坛区",
  "value": "320413" },

{
  "label": "溧阳市",
  "value": "320481" }],


[{
  "label": "虎丘区",
  "value": "320505" },

{
  "label": "吴中区",
  "value": "320506" },

{
  "label": "相城区",
  "value": "320507" },

{
  "label": "姑苏区",
  "value": "320508" },

{
  "label": "吴江区",
  "value": "320509" },

{
  "label": "苏州工业园区",
  "value": "320571" },

{
  "label": "常熟市",
  "value": "320581" },

{
  "label": "张家港市",
  "value": "320582" },

{
  "label": "昆山市",
  "value": "320583" },

{
  "label": "太仓市",
  "value": "320585" }],


[{
  "label": "崇川区",
  "value": "320602" },

{
  "label": "港闸区",
  "value": "320611" },

{
  "label": "通州区",
  "value": "320612" },

{
  "label": "海安县",
  "value": "320621" },

{
  "label": "如东县",
  "value": "320623" },

{
  "label": "南通经济技术开发区",
  "value": "320671" },

{
  "label": "启东市",
  "value": "320681" },

{
  "label": "如皋市",
  "value": "320682" },

{
  "label": "海门市",
  "value": "320684" }],


[{
  "label": "连云区",
  "value": "320703" },

{
  "label": "海州区",
  "value": "320706" },

{
  "label": "赣榆区",
  "value": "320707" },

{
  "label": "东海县",
  "value": "320722" },

{
  "label": "灌云县",
  "value": "320723" },

{
  "label": "灌南县",
  "value": "320724" },

{
  "label": "连云港经济技术开发区",
  "value": "320771" },

{
  "label": "连云港高新技术产业开发区",
  "value": "320772" }],


[{
  "label": "淮安区",
  "value": "320803" },

{
  "label": "淮阴区",
  "value": "320804" },

{
  "label": "清江浦区",
  "value": "320812" },

{
  "label": "洪泽区",
  "value": "320813" },

{
  "label": "涟水县",
  "value": "320826" },

{
  "label": "盱眙县",
  "value": "320830" },

{
  "label": "金湖县",
  "value": "320831" },

{
  "label": "淮安经济技术开发区",
  "value": "320871" }],


[{
  "label": "亭湖区",
  "value": "320902" },

{
  "label": "盐都区",
  "value": "320903" },

{
  "label": "大丰区",
  "value": "320904" },

{
  "label": "响水县",
  "value": "320921" },

{
  "label": "滨海县",
  "value": "320922" },

{
  "label": "阜宁县",
  "value": "320923" },

{
  "label": "射阳县",
  "value": "320924" },

{
  "label": "建湖县",
  "value": "320925" },

{
  "label": "盐城经济技术开发区",
  "value": "320971" },

{
  "label": "东台市",
  "value": "320981" }],


[{
  "label": "广陵区",
  "value": "321002" },

{
  "label": "邗江区",
  "value": "321003" },

{
  "label": "江都区",
  "value": "321012" },

{
  "label": "宝应县",
  "value": "321023" },

{
  "label": "扬州经济技术开发区",
  "value": "321071" },

{
  "label": "仪征市",
  "value": "321081" },

{
  "label": "高邮市",
  "value": "321084" }],


[{
  "label": "京口区",
  "value": "321102" },

{
  "label": "润州区",
  "value": "321111" },

{
  "label": "丹徒区",
  "value": "321112" },

{
  "label": "镇江新区",
  "value": "321171" },

{
  "label": "丹阳市",
  "value": "321181" },

{
  "label": "扬中市",
  "value": "321182" },

{
  "label": "句容市",
  "value": "321183" }],


[{
  "label": "海陵区",
  "value": "321202" },

{
  "label": "高港区",
  "value": "321203" },

{
  "label": "姜堰区",
  "value": "321204" },

{
  "label": "泰州医药高新技术产业开发区",
  "value": "321271" },

{
  "label": "兴化市",
  "value": "321281" },

{
  "label": "靖江市",
  "value": "321282" },

{
  "label": "泰兴市",
  "value": "321283" }],


[{
  "label": "宿城区",
  "value": "321302" },

{
  "label": "宿豫区",
  "value": "321311" },

{
  "label": "沭阳县",
  "value": "321322" },

{
  "label": "泗阳县",
  "value": "321323" },

{
  "label": "泗洪县",
  "value": "321324" },

{
  "label": "宿迁经济技术开发区",
  "value": "321371" }]],



[
[{
  "label": "上城区",
  "value": "330102" },

{
  "label": "下城区",
  "value": "330103" },

{
  "label": "江干区",
  "value": "330104" },

{
  "label": "拱墅区",
  "value": "330105" },

{
  "label": "西湖区",
  "value": "330106" },

{
  "label": "滨江区",
  "value": "330108" },

{
  "label": "萧山区",
  "value": "330109" },

{
  "label": "余杭区",
  "value": "330110" },

{
  "label": "富阳区",
  "value": "330111" },

{
  "label": "临安区",
  "value": "330112" },

{
  "label": "桐庐县",
  "value": "330122" },

{
  "label": "淳安县",
  "value": "330127" },

{
  "label": "建德市",
  "value": "330182" }],


[{
  "label": "海曙区",
  "value": "330203" },

{
  "label": "江北区",
  "value": "330205" },

{
  "label": "北仑区",
  "value": "330206" },

{
  "label": "镇海区",
  "value": "330211" },

{
  "label": "鄞州区",
  "value": "330212" },

{
  "label": "奉化区",
  "value": "330213" },

{
  "label": "象山县",
  "value": "330225" },

{
  "label": "宁海县",
  "value": "330226" },

{
  "label": "余姚市",
  "value": "330281" },

{
  "label": "慈溪市",
  "value": "330282" }],


[{
  "label": "鹿城区",
  "value": "330302" },

{
  "label": "龙湾区",
  "value": "330303" },

{
  "label": "瓯海区",
  "value": "330304" },

{
  "label": "洞头区",
  "value": "330305" },

{
  "label": "永嘉县",
  "value": "330324" },

{
  "label": "平阳县",
  "value": "330326" },

{
  "label": "苍南县",
  "value": "330327" },

{
  "label": "文成县",
  "value": "330328" },

{
  "label": "泰顺县",
  "value": "330329" },

{
  "label": "温州经济技术开发区",
  "value": "330371" },

{
  "label": "瑞安市",
  "value": "330381" },

{
  "label": "乐清市",
  "value": "330382" }],


[{
  "label": "南湖区",
  "value": "330402" },

{
  "label": "秀洲区",
  "value": "330411" },

{
  "label": "嘉善县",
  "value": "330421" },

{
  "label": "海盐县",
  "value": "330424" },

{
  "label": "海宁市",
  "value": "330481" },

{
  "label": "平湖市",
  "value": "330482" },

{
  "label": "桐乡市",
  "value": "330483" }],


[{
  "label": "吴兴区",
  "value": "330502" },

{
  "label": "南浔区",
  "value": "330503" },

{
  "label": "德清县",
  "value": "330521" },

{
  "label": "长兴县",
  "value": "330522" },

{
  "label": "安吉县",
  "value": "330523" }],


[{
  "label": "越城区",
  "value": "330602" },

{
  "label": "柯桥区",
  "value": "330603" },

{
  "label": "上虞区",
  "value": "330604" },

{
  "label": "新昌县",
  "value": "330624" },

{
  "label": "诸暨市",
  "value": "330681" },

{
  "label": "嵊州市",
  "value": "330683" }],


[{
  "label": "婺城区",
  "value": "330702" },

{
  "label": "金东区",
  "value": "330703" },

{
  "label": "武义县",
  "value": "330723" },

{
  "label": "浦江县",
  "value": "330726" },

{
  "label": "磐安县",
  "value": "330727" },

{
  "label": "兰溪市",
  "value": "330781" },

{
  "label": "义乌市",
  "value": "330782" },

{
  "label": "东阳市",
  "value": "330783" },

{
  "label": "永康市",
  "value": "330784" }],


[{
  "label": "柯城区",
  "value": "330802" },

{
  "label": "衢江区",
  "value": "330803" },

{
  "label": "常山县",
  "value": "330822" },

{
  "label": "开化县",
  "value": "330824" },

{
  "label": "龙游县",
  "value": "330825" },

{
  "label": "江山市",
  "value": "330881" }],


[{
  "label": "定海区",
  "value": "330902" },

{
  "label": "普陀区",
  "value": "330903" },

{
  "label": "岱山县",
  "value": "330921" },

{
  "label": "嵊泗县",
  "value": "330922" }],


[{
  "label": "椒江区",
  "value": "331002" },

{
  "label": "黄岩区",
  "value": "331003" },

{
  "label": "路桥区",
  "value": "331004" },

{
  "label": "三门县",
  "value": "331022" },

{
  "label": "天台县",
  "value": "331023" },

{
  "label": "仙居县",
  "value": "331024" },

{
  "label": "温岭市",
  "value": "331081" },

{
  "label": "临海市",
  "value": "331082" },

{
  "label": "玉环市",
  "value": "331083" }],


[{
  "label": "莲都区",
  "value": "331102" },

{
  "label": "青田县",
  "value": "331121" },

{
  "label": "缙云县",
  "value": "331122" },

{
  "label": "遂昌县",
  "value": "331123" },

{
  "label": "松阳县",
  "value": "331124" },

{
  "label": "云和县",
  "value": "331125" },

{
  "label": "庆元县",
  "value": "331126" },

{
  "label": "景宁畲族自治县",
  "value": "331127" },

{
  "label": "龙泉市",
  "value": "331181" }]],



[
[{
  "label": "瑶海区",
  "value": "340102" },

{
  "label": "庐阳区",
  "value": "340103" },

{
  "label": "蜀山区",
  "value": "340104" },

{
  "label": "包河区",
  "value": "340111" },

{
  "label": "长丰县",
  "value": "340121" },

{
  "label": "肥东县",
  "value": "340122" },

{
  "label": "肥西县",
  "value": "340123" },

{
  "label": "庐江县",
  "value": "340124" },

{
  "label": "合肥高新技术产业开发区",
  "value": "340171" },

{
  "label": "合肥经济技术开发区",
  "value": "340172" },

{
  "label": "合肥新站高新技术产业开发区",
  "value": "340173" },

{
  "label": "巢湖市",
  "value": "340181" }],


[{
  "label": "镜湖区",
  "value": "340202" },

{
  "label": "弋江区",
  "value": "340203" },

{
  "label": "鸠江区",
  "value": "340207" },

{
  "label": "三山区",
  "value": "340208" },

{
  "label": "芜湖县",
  "value": "340221" },

{
  "label": "繁昌县",
  "value": "340222" },

{
  "label": "南陵县",
  "value": "340223" },

{
  "label": "无为县",
  "value": "340225" },

{
  "label": "芜湖经济技术开发区",
  "value": "340271" },

{
  "label": "安徽芜湖长江大桥经济开发区",
  "value": "340272" }],


[{
  "label": "龙子湖区",
  "value": "340302" },

{
  "label": "蚌山区",
  "value": "340303" },

{
  "label": "禹会区",
  "value": "340304" },

{
  "label": "淮上区",
  "value": "340311" },

{
  "label": "怀远县",
  "value": "340321" },

{
  "label": "五河县",
  "value": "340322" },

{
  "label": "固镇县",
  "value": "340323" },

{
  "label": "蚌埠市高新技术开发区",
  "value": "340371" },

{
  "label": "蚌埠市经济开发区",
  "value": "340372" }],


[{
  "label": "大通区",
  "value": "340402" },

{
  "label": "田家庵区",
  "value": "340403" },

{
  "label": "谢家集区",
  "value": "340404" },

{
  "label": "八公山区",
  "value": "340405" },

{
  "label": "潘集区",
  "value": "340406" },

{
  "label": "凤台县",
  "value": "340421" },

{
  "label": "寿县",
  "value": "340422" }],


[{
  "label": "花山区",
  "value": "340503" },

{
  "label": "雨山区",
  "value": "340504" },

{
  "label": "博望区",
  "value": "340506" },

{
  "label": "当涂县",
  "value": "340521" },

{
  "label": "含山县",
  "value": "340522" },

{
  "label": "和县",
  "value": "340523" }],


[{
  "label": "杜集区",
  "value": "340602" },

{
  "label": "相山区",
  "value": "340603" },

{
  "label": "烈山区",
  "value": "340604" },

{
  "label": "濉溪县",
  "value": "340621" }],


[{
  "label": "铜官区",
  "value": "340705" },

{
  "label": "义安区",
  "value": "340706" },

{
  "label": "郊区",
  "value": "340711" },

{
  "label": "枞阳县",
  "value": "340722" }],


[{
  "label": "迎江区",
  "value": "340802" },

{
  "label": "大观区",
  "value": "340803" },

{
  "label": "宜秀区",
  "value": "340811" },

{
  "label": "怀宁县",
  "value": "340822" },

{
  "label": "潜山县",
  "value": "340824" },

{
  "label": "太湖县",
  "value": "340825" },

{
  "label": "宿松县",
  "value": "340826" },

{
  "label": "望江县",
  "value": "340827" },

{
  "label": "岳西县",
  "value": "340828" },

{
  "label": "安徽安庆经济开发区",
  "value": "340871" },

{
  "label": "桐城市",
  "value": "340881" }],


[{
  "label": "屯溪区",
  "value": "341002" },

{
  "label": "黄山区",
  "value": "341003" },

{
  "label": "徽州区",
  "value": "341004" },

{
  "label": "歙县",
  "value": "341021" },

{
  "label": "休宁县",
  "value": "341022" },

{
  "label": "黟县",
  "value": "341023" },

{
  "label": "祁门县",
  "value": "341024" }],


[{
  "label": "琅琊区",
  "value": "341102" },

{
  "label": "南谯区",
  "value": "341103" },

{
  "label": "来安县",
  "value": "341122" },

{
  "label": "全椒县",
  "value": "341124" },

{
  "label": "定远县",
  "value": "341125" },

{
  "label": "凤阳县",
  "value": "341126" },

{
  "label": "苏滁现代产业园",
  "value": "341171" },

{
  "label": "滁州经济技术开发区",
  "value": "341172" },

{
  "label": "天长市",
  "value": "341181" },

{
  "label": "明光市",
  "value": "341182" }],


[{
  "label": "颍州区",
  "value": "341202" },

{
  "label": "颍东区",
  "value": "341203" },

{
  "label": "颍泉区",
  "value": "341204" },

{
  "label": "临泉县",
  "value": "341221" },

{
  "label": "太和县",
  "value": "341222" },

{
  "label": "阜南县",
  "value": "341225" },

{
  "label": "颍上县",
  "value": "341226" },

{
  "label": "阜阳合肥现代产业园区",
  "value": "341271" },

{
  "label": "阜阳经济技术开发区",
  "value": "341272" },

{
  "label": "界首市",
  "value": "341282" }],


[{
  "label": "埇桥区",
  "value": "341302" },

{
  "label": "砀山县",
  "value": "341321" },

{
  "label": "萧县",
  "value": "341322" },

{
  "label": "灵璧县",
  "value": "341323" },

{
  "label": "泗县",
  "value": "341324" },

{
  "label": "宿州马鞍山现代产业园区",
  "value": "341371" },

{
  "label": "宿州经济技术开发区",
  "value": "341372" }],


[{
  "label": "金安区",
  "value": "341502" },

{
  "label": "裕安区",
  "value": "341503" },

{
  "label": "叶集区",
  "value": "341504" },

{
  "label": "霍邱县",
  "value": "341522" },

{
  "label": "舒城县",
  "value": "341523" },

{
  "label": "金寨县",
  "value": "341524" },

{
  "label": "霍山县",
  "value": "341525" }],


[{
  "label": "谯城区",
  "value": "341602" },

{
  "label": "涡阳县",
  "value": "341621" },

{
  "label": "蒙城县",
  "value": "341622" },

{
  "label": "利辛县",
  "value": "341623" }],


[{
  "label": "贵池区",
  "value": "341702" },

{
  "label": "东至县",
  "value": "341721" },

{
  "label": "石台县",
  "value": "341722" },

{
  "label": "青阳县",
  "value": "341723" }],


[{
  "label": "宣州区",
  "value": "341802" },

{
  "label": "郎溪县",
  "value": "341821" },

{
  "label": "广德县",
  "value": "341822" },

{
  "label": "泾县",
  "value": "341823" },

{
  "label": "绩溪县",
  "value": "341824" },

{
  "label": "旌德县",
  "value": "341825" },

{
  "label": "宣城市经济开发区",
  "value": "341871" },

{
  "label": "宁国市",
  "value": "341881" }]],



[
[{
  "label": "鼓楼区",
  "value": "350102" },

{
  "label": "台江区",
  "value": "350103" },

{
  "label": "仓山区",
  "value": "350104" },

{
  "label": "马尾区",
  "value": "350105" },

{
  "label": "晋安区",
  "value": "350111" },

{
  "label": "闽侯县",
  "value": "350121" },

{
  "label": "连江县",
  "value": "350122" },

{
  "label": "罗源县",
  "value": "350123" },

{
  "label": "闽清县",
  "value": "350124" },

{
  "label": "永泰县",
  "value": "350125" },

{
  "label": "平潭县",
  "value": "350128" },

{
  "label": "福清市",
  "value": "350181" },

{
  "label": "长乐市",
  "value": "350182" }],


[{
  "label": "思明区",
  "value": "350203" },

{
  "label": "海沧区",
  "value": "350205" },

{
  "label": "湖里区",
  "value": "350206" },

{
  "label": "集美区",
  "value": "350211" },

{
  "label": "同安区",
  "value": "350212" },

{
  "label": "翔安区",
  "value": "350213" }],


[{
  "label": "城厢区",
  "value": "350302" },

{
  "label": "涵江区",
  "value": "350303" },

{
  "label": "荔城区",
  "value": "350304" },

{
  "label": "秀屿区",
  "value": "350305" },

{
  "label": "仙游县",
  "value": "350322" }],


[{
  "label": "梅列区",
  "value": "350402" },

{
  "label": "三元区",
  "value": "350403" },

{
  "label": "明溪县",
  "value": "350421" },

{
  "label": "清流县",
  "value": "350423" },

{
  "label": "宁化县",
  "value": "350424" },

{
  "label": "大田县",
  "value": "350425" },

{
  "label": "尤溪县",
  "value": "350426" },

{
  "label": "沙县",
  "value": "350427" },

{
  "label": "将乐县",
  "value": "350428" },

{
  "label": "泰宁县",
  "value": "350429" },

{
  "label": "建宁县",
  "value": "350430" },

{
  "label": "永安市",
  "value": "350481" }],


[{
  "label": "鲤城区",
  "value": "350502" },

{
  "label": "丰泽区",
  "value": "350503" },

{
  "label": "洛江区",
  "value": "350504" },

{
  "label": "泉港区",
  "value": "350505" },

{
  "label": "惠安县",
  "value": "350521" },

{
  "label": "安溪县",
  "value": "350524" },

{
  "label": "永春县",
  "value": "350525" },

{
  "label": "德化县",
  "value": "350526" },

{
  "label": "金门县",
  "value": "350527" },

{
  "label": "石狮市",
  "value": "350581" },

{
  "label": "晋江市",
  "value": "350582" },

{
  "label": "南安市",
  "value": "350583" }],


[{
  "label": "芗城区",
  "value": "350602" },

{
  "label": "龙文区",
  "value": "350603" },

{
  "label": "云霄县",
  "value": "350622" },

{
  "label": "漳浦县",
  "value": "350623" },

{
  "label": "诏安县",
  "value": "350624" },

{
  "label": "长泰县",
  "value": "350625" },

{
  "label": "东山县",
  "value": "350626" },

{
  "label": "南靖县",
  "value": "350627" },

{
  "label": "平和县",
  "value": "350628" },

{
  "label": "华安县",
  "value": "350629" },

{
  "label": "龙海市",
  "value": "350681" }],


[{
  "label": "延平区",
  "value": "350702" },

{
  "label": "建阳区",
  "value": "350703" },

{
  "label": "顺昌县",
  "value": "350721" },

{
  "label": "浦城县",
  "value": "350722" },

{
  "label": "光泽县",
  "value": "350723" },

{
  "label": "松溪县",
  "value": "350724" },

{
  "label": "政和县",
  "value": "350725" },

{
  "label": "邵武市",
  "value": "350781" },

{
  "label": "武夷山市",
  "value": "350782" },

{
  "label": "建瓯市",
  "value": "350783" }],


[{
  "label": "新罗区",
  "value": "350802" },

{
  "label": "永定区",
  "value": "350803" },

{
  "label": "长汀县",
  "value": "350821" },

{
  "label": "上杭县",
  "value": "350823" },

{
  "label": "武平县",
  "value": "350824" },

{
  "label": "连城县",
  "value": "350825" },

{
  "label": "漳平市",
  "value": "350881" }],


[{
  "label": "蕉城区",
  "value": "350902" },

{
  "label": "霞浦县",
  "value": "350921" },

{
  "label": "古田县",
  "value": "350922" },

{
  "label": "屏南县",
  "value": "350923" },

{
  "label": "寿宁县",
  "value": "350924" },

{
  "label": "周宁县",
  "value": "350925" },

{
  "label": "柘荣县",
  "value": "350926" },

{
  "label": "福安市",
  "value": "350981" },

{
  "label": "福鼎市",
  "value": "350982" }]],



[
[{
  "label": "东湖区",
  "value": "360102" },

{
  "label": "西湖区",
  "value": "360103" },

{
  "label": "青云谱区",
  "value": "360104" },

{
  "label": "湾里区",
  "value": "360105" },

{
  "label": "青山湖区",
  "value": "360111" },

{
  "label": "新建区",
  "value": "360112" },

{
  "label": "南昌县",
  "value": "360121" },

{
  "label": "安义县",
  "value": "360123" },

{
  "label": "进贤县",
  "value": "360124" }],


[{
  "label": "昌江区",
  "value": "360202" },

{
  "label": "珠山区",
  "value": "360203" },

{
  "label": "浮梁县",
  "value": "360222" },

{
  "label": "乐平市",
  "value": "360281" }],


[{
  "label": "安源区",
  "value": "360302" },

{
  "label": "湘东区",
  "value": "360313" },

{
  "label": "莲花县",
  "value": "360321" },

{
  "label": "上栗县",
  "value": "360322" },

{
  "label": "芦溪县",
  "value": "360323" }],


[{
  "label": "濂溪区",
  "value": "360402" },

{
  "label": "浔阳区",
  "value": "360403" },

{
  "label": "柴桑区",
  "value": "360404" },

{
  "label": "武宁县",
  "value": "360423" },

{
  "label": "修水县",
  "value": "360424" },

{
  "label": "永修县",
  "value": "360425" },

{
  "label": "德安县",
  "value": "360426" },

{
  "label": "都昌县",
  "value": "360428" },

{
  "label": "湖口县",
  "value": "360429" },

{
  "label": "彭泽县",
  "value": "360430" },

{
  "label": "瑞昌市",
  "value": "360481" },

{
  "label": "共青城市",
  "value": "360482" },

{
  "label": "庐山市",
  "value": "360483" }],


[{
  "label": "渝水区",
  "value": "360502" },

{
  "label": "分宜县",
  "value": "360521" }],


[{
  "label": "月湖区",
  "value": "360602" },

{
  "label": "余江县",
  "value": "360622" },

{
  "label": "贵溪市",
  "value": "360681" }],


[{
  "label": "章贡区",
  "value": "360702" },

{
  "label": "南康区",
  "value": "360703" },

{
  "label": "赣县区",
  "value": "360704" },

{
  "label": "信丰县",
  "value": "360722" },

{
  "label": "大余县",
  "value": "360723" },

{
  "label": "上犹县",
  "value": "360724" },

{
  "label": "崇义县",
  "value": "360725" },

{
  "label": "安远县",
  "value": "360726" },

{
  "label": "龙南县",
  "value": "360727" },

{
  "label": "定南县",
  "value": "360728" },

{
  "label": "全南县",
  "value": "360729" },

{
  "label": "宁都县",
  "value": "360730" },

{
  "label": "于都县",
  "value": "360731" },

{
  "label": "兴国县",
  "value": "360732" },

{
  "label": "会昌县",
  "value": "360733" },

{
  "label": "寻乌县",
  "value": "360734" },

{
  "label": "石城县",
  "value": "360735" },

{
  "label": "瑞金市",
  "value": "360781" }],


[{
  "label": "吉州区",
  "value": "360802" },

{
  "label": "青原区",
  "value": "360803" },

{
  "label": "吉安县",
  "value": "360821" },

{
  "label": "吉水县",
  "value": "360822" },

{
  "label": "峡江县",
  "value": "360823" },

{
  "label": "新干县",
  "value": "360824" },

{
  "label": "永丰县",
  "value": "360825" },

{
  "label": "泰和县",
  "value": "360826" },

{
  "label": "遂川县",
  "value": "360827" },

{
  "label": "万安县",
  "value": "360828" },

{
  "label": "安福县",
  "value": "360829" },

{
  "label": "永新县",
  "value": "360830" },

{
  "label": "井冈山市",
  "value": "360881" }],


[{
  "label": "袁州区",
  "value": "360902" },

{
  "label": "奉新县",
  "value": "360921" },

{
  "label": "万载县",
  "value": "360922" },

{
  "label": "上高县",
  "value": "360923" },

{
  "label": "宜丰县",
  "value": "360924" },

{
  "label": "靖安县",
  "value": "360925" },

{
  "label": "铜鼓县",
  "value": "360926" },

{
  "label": "丰城市",
  "value": "360981" },

{
  "label": "樟树市",
  "value": "360982" },

{
  "label": "高安市",
  "value": "360983" }],


[{
  "label": "临川区",
  "value": "361002" },

{
  "label": "东乡区",
  "value": "361003" },

{
  "label": "南城县",
  "value": "361021" },

{
  "label": "黎川县",
  "value": "361022" },

{
  "label": "南丰县",
  "value": "361023" },

{
  "label": "崇仁县",
  "value": "361024" },

{
  "label": "乐安县",
  "value": "361025" },

{
  "label": "宜黄县",
  "value": "361026" },

{
  "label": "金溪县",
  "value": "361027" },

{
  "label": "资溪县",
  "value": "361028" },

{
  "label": "广昌县",
  "value": "361030" }],


[{
  "label": "信州区",
  "value": "361102" },

{
  "label": "广丰区",
  "value": "361103" },

{
  "label": "上饶县",
  "value": "361121" },

{
  "label": "玉山县",
  "value": "361123" },

{
  "label": "铅山县",
  "value": "361124" },

{
  "label": "横峰县",
  "value": "361125" },

{
  "label": "弋阳县",
  "value": "361126" },

{
  "label": "余干县",
  "value": "361127" },

{
  "label": "鄱阳县",
  "value": "361128" },

{
  "label": "万年县",
  "value": "361129" },

{
  "label": "婺源县",
  "value": "361130" },

{
  "label": "德兴市",
  "value": "361181" }]],



[
[{
  "label": "历下区",
  "value": "370102" },

{
  "label": "市中区",
  "value": "370103" },

{
  "label": "槐荫区",
  "value": "370104" },

{
  "label": "天桥区",
  "value": "370105" },

{
  "label": "历城区",
  "value": "370112" },

{
  "label": "长清区",
  "value": "370113" },

{
  "label": "章丘区",
  "value": "370114" },

{
  "label": "平阴县",
  "value": "370124" },

{
  "label": "济阳县",
  "value": "370125" },

{
  "label": "商河县",
  "value": "370126" },

{
  "label": "济南高新技术产业开发区",
  "value": "370171" }],


[{
  "label": "市南区",
  "value": "370202" },

{
  "label": "市北区",
  "value": "370203" },

{
  "label": "黄岛区",
  "value": "370211" },

{
  "label": "崂山区",
  "value": "370212" },

{
  "label": "李沧区",
  "value": "370213" },

{
  "label": "城阳区",
  "value": "370214" },

{
  "label": "即墨区",
  "value": "370215" },

{
  "label": "青岛高新技术产业开发区",
  "value": "370271" },

{
  "label": "胶州市",
  "value": "370281" },

{
  "label": "平度市",
  "value": "370283" },

{
  "label": "莱西市",
  "value": "370285" }],


[{
  "label": "淄川区",
  "value": "370302" },

{
  "label": "张店区",
  "value": "370303" },

{
  "label": "博山区",
  "value": "370304" },

{
  "label": "临淄区",
  "value": "370305" },

{
  "label": "周村区",
  "value": "370306" },

{
  "label": "桓台县",
  "value": "370321" },

{
  "label": "高青县",
  "value": "370322" },

{
  "label": "沂源县",
  "value": "370323" }],


[{
  "label": "市中区",
  "value": "370402" },

{
  "label": "薛城区",
  "value": "370403" },

{
  "label": "峄城区",
  "value": "370404" },

{
  "label": "台儿庄区",
  "value": "370405" },

{
  "label": "山亭区",
  "value": "370406" },

{
  "label": "滕州市",
  "value": "370481" }],


[{
  "label": "东营区",
  "value": "370502" },

{
  "label": "河口区",
  "value": "370503" },

{
  "label": "垦利区",
  "value": "370505" },

{
  "label": "利津县",
  "value": "370522" },

{
  "label": "广饶县",
  "value": "370523" },

{
  "label": "东营经济技术开发区",
  "value": "370571" },

{
  "label": "东营港经济开发区",
  "value": "370572" }],


[{
  "label": "芝罘区",
  "value": "370602" },

{
  "label": "福山区",
  "value": "370611" },

{
  "label": "牟平区",
  "value": "370612" },

{
  "label": "莱山区",
  "value": "370613" },

{
  "label": "长岛县",
  "value": "370634" },

{
  "label": "烟台高新技术产业开发区",
  "value": "370671" },

{
  "label": "烟台经济技术开发区",
  "value": "370672" },

{
  "label": "龙口市",
  "value": "370681" },

{
  "label": "莱阳市",
  "value": "370682" },

{
  "label": "莱州市",
  "value": "370683" },

{
  "label": "蓬莱市",
  "value": "370684" },

{
  "label": "招远市",
  "value": "370685" },

{
  "label": "栖霞市",
  "value": "370686" },

{
  "label": "海阳市",
  "value": "370687" }],


[{
  "label": "潍城区",
  "value": "370702" },

{
  "label": "寒亭区",
  "value": "370703" },

{
  "label": "坊子区",
  "value": "370704" },

{
  "label": "奎文区",
  "value": "370705" },

{
  "label": "临朐县",
  "value": "370724" },

{
  "label": "昌乐县",
  "value": "370725" },

{
  "label": "潍坊滨海经济技术开发区",
  "value": "370772" },

{
  "label": "青州市",
  "value": "370781" },

{
  "label": "诸城市",
  "value": "370782" },

{
  "label": "寿光市",
  "value": "370783" },

{
  "label": "安丘市",
  "value": "370784" },

{
  "label": "高密市",
  "value": "370785" },

{
  "label": "昌邑市",
  "value": "370786" }],


[{
  "label": "任城区",
  "value": "370811" },

{
  "label": "兖州区",
  "value": "370812" },

{
  "label": "微山县",
  "value": "370826" },

{
  "label": "鱼台县",
  "value": "370827" },

{
  "label": "金乡县",
  "value": "370828" },

{
  "label": "嘉祥县",
  "value": "370829" },

{
  "label": "汶上县",
  "value": "370830" },

{
  "label": "泗水县",
  "value": "370831" },

{
  "label": "梁山县",
  "value": "370832" },

{
  "label": "济宁高新技术产业开发区",
  "value": "370871" },

{
  "label": "曲阜市",
  "value": "370881" },

{
  "label": "邹城市",
  "value": "370883" }],


[{
  "label": "泰山区",
  "value": "370902" },

{
  "label": "岱岳区",
  "value": "370911" },

{
  "label": "宁阳县",
  "value": "370921" },

{
  "label": "东平县",
  "value": "370923" },

{
  "label": "新泰市",
  "value": "370982" },

{
  "label": "肥城市",
  "value": "370983" }],


[{
  "label": "环翠区",
  "value": "371002" },

{
  "label": "文登区",
  "value": "371003" },

{
  "label": "威海火炬高技术产业开发区",
  "value": "371071" },

{
  "label": "威海经济技术开发区",
  "value": "371072" },

{
  "label": "威海临港经济技术开发区",
  "value": "371073" },

{
  "label": "荣成市",
  "value": "371082" },

{
  "label": "乳山市",
  "value": "371083" }],


[{
  "label": "东港区",
  "value": "371102" },

{
  "label": "岚山区",
  "value": "371103" },

{
  "label": "五莲县",
  "value": "371121" },

{
  "label": "莒县",
  "value": "371122" },

{
  "label": "日照经济技术开发区",
  "value": "371171" },

{
  "label": "日照国际海洋城",
  "value": "371172" }],


[{
  "label": "莱城区",
  "value": "371202" },

{
  "label": "钢城区",
  "value": "371203" }],


[{
  "label": "兰山区",
  "value": "371302" },

{
  "label": "罗庄区",
  "value": "371311" },

{
  "label": "河东区",
  "value": "371312" },

{
  "label": "沂南县",
  "value": "371321" },

{
  "label": "郯城县",
  "value": "371322" },

{
  "label": "沂水县",
  "value": "371323" },

{
  "label": "兰陵县",
  "value": "371324" },

{
  "label": "费县",
  "value": "371325" },

{
  "label": "平邑县",
  "value": "371326" },

{
  "label": "莒南县",
  "value": "371327" },

{
  "label": "蒙阴县",
  "value": "371328" },

{
  "label": "临沭县",
  "value": "371329" },

{
  "label": "临沂高新技术产业开发区",
  "value": "371371" },

{
  "label": "临沂经济技术开发区",
  "value": "371372" },

{
  "label": "临沂临港经济开发区",
  "value": "371373" }],


[{
  "label": "德城区",
  "value": "371402" },

{
  "label": "陵城区",
  "value": "371403" },

{
  "label": "宁津县",
  "value": "371422" },

{
  "label": "庆云县",
  "value": "371423" },

{
  "label": "临邑县",
  "value": "371424" },

{
  "label": "齐河县",
  "value": "371425" },

{
  "label": "平原县",
  "value": "371426" },

{
  "label": "夏津县",
  "value": "371427" },

{
  "label": "武城县",
  "value": "371428" },

{
  "label": "德州经济技术开发区",
  "value": "371471" },

{
  "label": "德州运河经济开发区",
  "value": "371472" },

{
  "label": "乐陵市",
  "value": "371481" },

{
  "label": "禹城市",
  "value": "371482" }],


[{
  "label": "东昌府区",
  "value": "371502" },

{
  "label": "阳谷县",
  "value": "371521" },

{
  "label": "莘县",
  "value": "371522" },

{
  "label": "茌平县",
  "value": "371523" },

{
  "label": "东阿县",
  "value": "371524" },

{
  "label": "冠县",
  "value": "371525" },

{
  "label": "高唐县",
  "value": "371526" },

{
  "label": "临清市",
  "value": "371581" }],


[{
  "label": "滨城区",
  "value": "371602" },

{
  "label": "沾化区",
  "value": "371603" },

{
  "label": "惠民县",
  "value": "371621" },

{
  "label": "阳信县",
  "value": "371622" },

{
  "label": "无棣县",
  "value": "371623" },

{
  "label": "博兴县",
  "value": "371625" },

{
  "label": "邹平县",
  "value": "371626" }],


[{
  "label": "牡丹区",
  "value": "371702" },

{
  "label": "定陶区",
  "value": "371703" },

{
  "label": "曹县",
  "value": "371721" },

{
  "label": "单县",
  "value": "371722" },

{
  "label": "成武县",
  "value": "371723" },

{
  "label": "巨野县",
  "value": "371724" },

{
  "label": "郓城县",
  "value": "371725" },

{
  "label": "鄄城县",
  "value": "371726" },

{
  "label": "东明县",
  "value": "371728" },

{
  "label": "菏泽经济技术开发区",
  "value": "371771" },

{
  "label": "菏泽高新技术开发区",
  "value": "371772" }]],



[
[{
  "label": "中原区",
  "value": "410102" },

{
  "label": "二七区",
  "value": "410103" },

{
  "label": "管城回族区",
  "value": "410104" },

{
  "label": "金水区",
  "value": "410105" },

{
  "label": "上街区",
  "value": "410106" },

{
  "label": "惠济区",
  "value": "410108" },

{
  "label": "中牟县",
  "value": "410122" },

{
  "label": "郑州经济技术开发区",
  "value": "410171" },

{
  "label": "郑州高新技术产业开发区",
  "value": "410172" },

{
  "label": "郑州航空港经济综合实验区",
  "value": "410173" },

{
  "label": "巩义市",
  "value": "410181" },

{
  "label": "荥阳市",
  "value": "410182" },

{
  "label": "新密市",
  "value": "410183" },

{
  "label": "新郑市",
  "value": "410184" },

{
  "label": "登封市",
  "value": "410185" }],


[{
  "label": "龙亭区",
  "value": "410202" },

{
  "label": "顺河回族区",
  "value": "410203" },

{
  "label": "鼓楼区",
  "value": "410204" },

{
  "label": "禹王台区",
  "value": "410205" },

{
  "label": "祥符区",
  "value": "410212" },

{
  "label": "杞县",
  "value": "410221" },

{
  "label": "通许县",
  "value": "410222" },

{
  "label": "尉氏县",
  "value": "410223" },

{
  "label": "兰考县",
  "value": "410225" }],


[{
  "label": "老城区",
  "value": "410302" },

{
  "label": "西工区",
  "value": "410303" },

{
  "label": "瀍河回族区",
  "value": "410304" },

{
  "label": "涧西区",
  "value": "410305" },

{
  "label": "吉利区",
  "value": "410306" },

{
  "label": "洛龙区",
  "value": "410311" },

{
  "label": "孟津县",
  "value": "410322" },

{
  "label": "新安县",
  "value": "410323" },

{
  "label": "栾川县",
  "value": "410324" },

{
  "label": "嵩县",
  "value": "410325" },

{
  "label": "汝阳县",
  "value": "410326" },

{
  "label": "宜阳县",
  "value": "410327" },

{
  "label": "洛宁县",
  "value": "410328" },

{
  "label": "伊川县",
  "value": "410329" },

{
  "label": "洛阳高新技术产业开发区",
  "value": "410371" },

{
  "label": "偃师市",
  "value": "410381" }],


[{
  "label": "新华区",
  "value": "410402" },

{
  "label": "卫东区",
  "value": "410403" },

{
  "label": "石龙区",
  "value": "410404" },

{
  "label": "湛河区",
  "value": "410411" },

{
  "label": "宝丰县",
  "value": "410421" },

{
  "label": "叶县",
  "value": "410422" },

{
  "label": "鲁山县",
  "value": "410423" },

{
  "label": "郏县",
  "value": "410425" },

{
  "label": "平顶山高新技术产业开发区",
  "value": "410471" },

{
  "label": "平顶山市新城区",
  "value": "410472" },

{
  "label": "舞钢市",
  "value": "410481" },

{
  "label": "汝州市",
  "value": "410482" }],


[{
  "label": "文峰区",
  "value": "410502" },

{
  "label": "北关区",
  "value": "410503" },

{
  "label": "殷都区",
  "value": "410505" },

{
  "label": "龙安区",
  "value": "410506" },

{
  "label": "安阳县",
  "value": "410522" },

{
  "label": "汤阴县",
  "value": "410523" },

{
  "label": "滑县",
  "value": "410526" },

{
  "label": "内黄县",
  "value": "410527" },

{
  "label": "安阳高新技术产业开发区",
  "value": "410571" },

{
  "label": "林州市",
  "value": "410581" }],


[{
  "label": "鹤山区",
  "value": "410602" },

{
  "label": "山城区",
  "value": "410603" },

{
  "label": "淇滨区",
  "value": "410611" },

{
  "label": "浚县",
  "value": "410621" },

{
  "label": "淇县",
  "value": "410622" },

{
  "label": "鹤壁经济技术开发区",
  "value": "410671" }],


[{
  "label": "红旗区",
  "value": "410702" },

{
  "label": "卫滨区",
  "value": "410703" },

{
  "label": "凤泉区",
  "value": "410704" },

{
  "label": "牧野区",
  "value": "410711" },

{
  "label": "新乡县",
  "value": "410721" },

{
  "label": "获嘉县",
  "value": "410724" },

{
  "label": "原阳县",
  "value": "410725" },

{
  "label": "延津县",
  "value": "410726" },

{
  "label": "封丘县",
  "value": "410727" },

{
  "label": "长垣县",
  "value": "410728" },

{
  "label": "新乡高新技术产业开发区",
  "value": "410771" },

{
  "label": "新乡经济技术开发区",
  "value": "410772" },

{
  "label": "新乡市平原城乡一体化示范区",
  "value": "410773" },

{
  "label": "卫辉市",
  "value": "410781" },

{
  "label": "辉县市",
  "value": "410782" }],


[{
  "label": "解放区",
  "value": "410802" },

{
  "label": "中站区",
  "value": "410803" },

{
  "label": "马村区",
  "value": "410804" },

{
  "label": "山阳区",
  "value": "410811" },

{
  "label": "修武县",
  "value": "410821" },

{
  "label": "博爱县",
  "value": "410822" },

{
  "label": "武陟县",
  "value": "410823" },

{
  "label": "温县",
  "value": "410825" },

{
  "label": "焦作城乡一体化示范区",
  "value": "410871" },

{
  "label": "沁阳市",
  "value": "410882" },

{
  "label": "孟州市",
  "value": "410883" }],


[{
  "label": "华龙区",
  "value": "410902" },

{
  "label": "清丰县",
  "value": "410922" },

{
  "label": "南乐县",
  "value": "410923" },

{
  "label": "范县",
  "value": "410926" },

{
  "label": "台前县",
  "value": "410927" },

{
  "label": "濮阳县",
  "value": "410928" },

{
  "label": "河南濮阳工业园区",
  "value": "410971" },

{
  "label": "濮阳经济技术开发区",
  "value": "410972" }],


[{
  "label": "魏都区",
  "value": "411002" },

{
  "label": "建安区",
  "value": "411003" },

{
  "label": "鄢陵县",
  "value": "411024" },

{
  "label": "襄城县",
  "value": "411025" },

{
  "label": "许昌经济技术开发区",
  "value": "411071" },

{
  "label": "禹州市",
  "value": "411081" },

{
  "label": "长葛市",
  "value": "411082" }],


[{
  "label": "源汇区",
  "value": "411102" },

{
  "label": "郾城区",
  "value": "411103" },

{
  "label": "召陵区",
  "value": "411104" },

{
  "label": "舞阳县",
  "value": "411121" },

{
  "label": "临颍县",
  "value": "411122" },

{
  "label": "漯河经济技术开发区",
  "value": "411171" }],


[{
  "label": "湖滨区",
  "value": "411202" },

{
  "label": "陕州区",
  "value": "411203" },

{
  "label": "渑池县",
  "value": "411221" },

{
  "label": "卢氏县",
  "value": "411224" },

{
  "label": "河南三门峡经济开发区",
  "value": "411271" },

{
  "label": "义马市",
  "value": "411281" },

{
  "label": "灵宝市",
  "value": "411282" }],


[{
  "label": "宛城区",
  "value": "411302" },

{
  "label": "卧龙区",
  "value": "411303" },

{
  "label": "南召县",
  "value": "411321" },

{
  "label": "方城县",
  "value": "411322" },

{
  "label": "西峡县",
  "value": "411323" },

{
  "label": "镇平县",
  "value": "411324" },

{
  "label": "内乡县",
  "value": "411325" },

{
  "label": "淅川县",
  "value": "411326" },

{
  "label": "社旗县",
  "value": "411327" },

{
  "label": "唐河县",
  "value": "411328" },

{
  "label": "新野县",
  "value": "411329" },

{
  "label": "桐柏县",
  "value": "411330" },

{
  "label": "南阳高新技术产业开发区",
  "value": "411371" },

{
  "label": "南阳市城乡一体化示范区",
  "value": "411372" },

{
  "label": "邓州市",
  "value": "411381" }],


[{
  "label": "梁园区",
  "value": "411402" },

{
  "label": "睢阳区",
  "value": "411403" },

{
  "label": "民权县",
  "value": "411421" },

{
  "label": "睢县",
  "value": "411422" },

{
  "label": "宁陵县",
  "value": "411423" },

{
  "label": "柘城县",
  "value": "411424" },

{
  "label": "虞城县",
  "value": "411425" },

{
  "label": "夏邑县",
  "value": "411426" },

{
  "label": "豫东综合物流产业聚集区",
  "value": "411471" },

{
  "label": "河南商丘经济开发区",
  "value": "411472" },

{
  "label": "永城市",
  "value": "411481" }],


[{
  "label": "浉河区",
  "value": "411502" },

{
  "label": "平桥区",
  "value": "411503" },

{
  "label": "罗山县",
  "value": "411521" },

{
  "label": "光山县",
  "value": "411522" },

{
  "label": "新县",
  "value": "411523" },

{
  "label": "商城县",
  "value": "411524" },

{
  "label": "固始县",
  "value": "411525" },

{
  "label": "潢川县",
  "value": "411526" },

{
  "label": "淮滨县",
  "value": "411527" },

{
  "label": "息县",
  "value": "411528" },

{
  "label": "信阳高新技术产业开发区",
  "value": "411571" }],


[{
  "label": "川汇区",
  "value": "411602" },

{
  "label": "扶沟县",
  "value": "411621" },

{
  "label": "西华县",
  "value": "411622" },

{
  "label": "商水县",
  "value": "411623" },

{
  "label": "沈丘县",
  "value": "411624" },

{
  "label": "郸城县",
  "value": "411625" },

{
  "label": "淮阳县",
  "value": "411626" },

{
  "label": "太康县",
  "value": "411627" },

{
  "label": "鹿邑县",
  "value": "411628" },

{
  "label": "河南周口经济开发区",
  "value": "411671" },

{
  "label": "项城市",
  "value": "411681" }],


[{
  "label": "驿城区",
  "value": "411702" },

{
  "label": "西平县",
  "value": "411721" },

{
  "label": "上蔡县",
  "value": "411722" },

{
  "label": "平舆县",
  "value": "411723" },

{
  "label": "正阳县",
  "value": "411724" },

{
  "label": "确山县",
  "value": "411725" },

{
  "label": "泌阳县",
  "value": "411726" },

{
  "label": "汝南县",
  "value": "411727" },

{
  "label": "遂平县",
  "value": "411728" },

{
  "label": "新蔡县",
  "value": "411729" },

{
  "label": "河南驻马店经济开发区",
  "value": "411771" }],


[{
  "label": "济源市",
  "value": "419001" }]],


[
[{
  "label": "江岸区",
  "value": "420102" },

{
  "label": "江汉区",
  "value": "420103" },

{
  "label": "硚口区",
  "value": "420104" },

{
  "label": "汉阳区",
  "value": "420105" },

{
  "label": "武昌区",
  "value": "420106" },

{
  "label": "青山区",
  "value": "420107" },

{
  "label": "洪山区",
  "value": "420111" },

{
  "label": "东西湖区",
  "value": "420112" },

{
  "label": "汉南区",
  "value": "420113" },

{
  "label": "蔡甸区",
  "value": "420114" },

{
  "label": "江夏区",
  "value": "420115" },

{
  "label": "黄陂区",
  "value": "420116" },

{
  "label": "新洲区",
  "value": "420117" }],


[{
  "label": "黄石港区",
  "value": "420202" },

{
  "label": "西塞山区",
  "value": "420203" },

{
  "label": "下陆区",
  "value": "420204" },

{
  "label": "铁山区",
  "value": "420205" },

{
  "label": "阳新县",
  "value": "420222" },

{
  "label": "大冶市",
  "value": "420281" }],


[{
  "label": "茅箭区",
  "value": "420302" },

{
  "label": "张湾区",
  "value": "420303" },

{
  "label": "郧阳区",
  "value": "420304" },

{
  "label": "郧西县",
  "value": "420322" },

{
  "label": "竹山县",
  "value": "420323" },

{
  "label": "竹溪县",
  "value": "420324" },

{
  "label": "房县",
  "value": "420325" },

{
  "label": "丹江口市",
  "value": "420381" }],


[{
  "label": "西陵区",
  "value": "420502" },

{
  "label": "伍家岗区",
  "value": "420503" },

{
  "label": "点军区",
  "value": "420504" },

{
  "label": "猇亭区",
  "value": "420505" },

{
  "label": "夷陵区",
  "value": "420506" },

{
  "label": "远安县",
  "value": "420525" },

{
  "label": "兴山县",
  "value": "420526" },

{
  "label": "秭归县",
  "value": "420527" },

{
  "label": "长阳土家族自治县",
  "value": "420528" },

{
  "label": "五峰土家族自治县",
  "value": "420529" },

{
  "label": "宜都市",
  "value": "420581" },

{
  "label": "当阳市",
  "value": "420582" },

{
  "label": "枝江市",
  "value": "420583" }],


[{
  "label": "襄城区",
  "value": "420602" },

{
  "label": "樊城区",
  "value": "420606" },

{
  "label": "襄州区",
  "value": "420607" },

{
  "label": "南漳县",
  "value": "420624" },

{
  "label": "谷城县",
  "value": "420625" },

{
  "label": "保康县",
  "value": "420626" },

{
  "label": "老河口市",
  "value": "420682" },

{
  "label": "枣阳市",
  "value": "420683" },

{
  "label": "宜城市",
  "value": "420684" }],


[{
  "label": "梁子湖区",
  "value": "420702" },

{
  "label": "华容区",
  "value": "420703" },

{
  "label": "鄂城区",
  "value": "420704" }],


[{
  "label": "东宝区",
  "value": "420802" },

{
  "label": "掇刀区",
  "value": "420804" },

{
  "label": "京山县",
  "value": "420821" },

{
  "label": "沙洋县",
  "value": "420822" },

{
  "label": "钟祥市",
  "value": "420881" }],


[{
  "label": "孝南区",
  "value": "420902" },

{
  "label": "孝昌县",
  "value": "420921" },

{
  "label": "大悟县",
  "value": "420922" },

{
  "label": "云梦县",
  "value": "420923" },

{
  "label": "应城市",
  "value": "420981" },

{
  "label": "安陆市",
  "value": "420982" },

{
  "label": "汉川市",
  "value": "420984" }],


[{
  "label": "沙市区",
  "value": "421002" },

{
  "label": "荆州区",
  "value": "421003" },

{
  "label": "公安县",
  "value": "421022" },

{
  "label": "监利县",
  "value": "421023" },

{
  "label": "江陵县",
  "value": "421024" },

{
  "label": "荆州经济技术开发区",
  "value": "421071" },

{
  "label": "石首市",
  "value": "421081" },

{
  "label": "洪湖市",
  "value": "421083" },

{
  "label": "松滋市",
  "value": "421087" }],


[{
  "label": "黄州区",
  "value": "421102" },

{
  "label": "团风县",
  "value": "421121" },

{
  "label": "红安县",
  "value": "421122" },

{
  "label": "罗田县",
  "value": "421123" },

{
  "label": "英山县",
  "value": "421124" },

{
  "label": "浠水县",
  "value": "421125" },

{
  "label": "蕲春县",
  "value": "421126" },

{
  "label": "黄梅县",
  "value": "421127" },

{
  "label": "龙感湖管理区",
  "value": "421171" },

{
  "label": "麻城市",
  "value": "421181" },

{
  "label": "武穴市",
  "value": "421182" }],


[{
  "label": "咸安区",
  "value": "421202" },

{
  "label": "嘉鱼县",
  "value": "421221" },

{
  "label": "通城县",
  "value": "421222" },

{
  "label": "崇阳县",
  "value": "421223" },

{
  "label": "通山县",
  "value": "421224" },

{
  "label": "赤壁市",
  "value": "421281" }],


[{
  "label": "曾都区",
  "value": "421303" },

{
  "label": "随县",
  "value": "421321" },

{
  "label": "广水市",
  "value": "421381" }],


[{
  "label": "恩施市",
  "value": "422801" },

{
  "label": "利川市",
  "value": "422802" },

{
  "label": "建始县",
  "value": "422822" },

{
  "label": "巴东县",
  "value": "422823" },

{
  "label": "宣恩县",
  "value": "422825" },

{
  "label": "咸丰县",
  "value": "422826" },

{
  "label": "来凤县",
  "value": "422827" },

{
  "label": "鹤峰县",
  "value": "422828" }],


[{
  "label": "仙桃市",
  "value": "429004" },

{
  "label": "潜江市",
  "value": "429005" },

{
  "label": "天门市",
  "value": "429006" },

{
  "label": "神农架林区",
  "value": "429021" }]],



[
[{
  "label": "芙蓉区",
  "value": "430102" },

{
  "label": "天心区",
  "value": "430103" },

{
  "label": "岳麓区",
  "value": "430104" },

{
  "label": "开福区",
  "value": "430105" },

{
  "label": "雨花区",
  "value": "430111" },

{
  "label": "望城区",
  "value": "430112" },

{
  "label": "长沙县",
  "value": "430121" },

{
  "label": "浏阳市",
  "value": "430181" },

{
  "label": "宁乡市",
  "value": "430182" }],


[{
  "label": "荷塘区",
  "value": "430202" },

{
  "label": "芦淞区",
  "value": "430203" },

{
  "label": "石峰区",
  "value": "430204" },

{
  "label": "天元区",
  "value": "430211" },

{
  "label": "株洲县",
  "value": "430221" },

{
  "label": "攸县",
  "value": "430223" },

{
  "label": "茶陵县",
  "value": "430224" },

{
  "label": "炎陵县",
  "value": "430225" },

{
  "label": "云龙示范区",
  "value": "430271" },

{
  "label": "醴陵市",
  "value": "430281" }],


[{
  "label": "雨湖区",
  "value": "430302" },

{
  "label": "岳塘区",
  "value": "430304" },

{
  "label": "湘潭县",
  "value": "430321" },

{
  "label": "湖南湘潭高新技术产业园区",
  "value": "430371" },

{
  "label": "湘潭昭山示范区",
  "value": "430372" },

{
  "label": "湘潭九华示范区",
  "value": "430373" },

{
  "label": "湘乡市",
  "value": "430381" },

{
  "label": "韶山市",
  "value": "430382" }],


[{
  "label": "珠晖区",
  "value": "430405" },

{
  "label": "雁峰区",
  "value": "430406" },

{
  "label": "石鼓区",
  "value": "430407" },

{
  "label": "蒸湘区",
  "value": "430408" },

{
  "label": "南岳区",
  "value": "430412" },

{
  "label": "衡阳县",
  "value": "430421" },

{
  "label": "衡南县",
  "value": "430422" },

{
  "label": "衡山县",
  "value": "430423" },

{
  "label": "衡东县",
  "value": "430424" },

{
  "label": "祁东县",
  "value": "430426" },

{
  "label": "衡阳综合保税区",
  "value": "430471" },

{
  "label": "湖南衡阳高新技术产业园区",
  "value": "430472" },

{
  "label": "湖南衡阳松木经济开发区",
  "value": "430473" },

{
  "label": "耒阳市",
  "value": "430481" },

{
  "label": "常宁市",
  "value": "430482" }],


[{
  "label": "双清区",
  "value": "430502" },

{
  "label": "大祥区",
  "value": "430503" },

{
  "label": "北塔区",
  "value": "430511" },

{
  "label": "邵东县",
  "value": "430521" },

{
  "label": "新邵县",
  "value": "430522" },

{
  "label": "邵阳县",
  "value": "430523" },

{
  "label": "隆回县",
  "value": "430524" },

{
  "label": "洞口县",
  "value": "430525" },

{
  "label": "绥宁县",
  "value": "430527" },

{
  "label": "新宁县",
  "value": "430528" },

{
  "label": "城步苗族自治县",
  "value": "430529" },

{
  "label": "武冈市",
  "value": "430581" }],


[{
  "label": "岳阳楼区",
  "value": "430602" },

{
  "label": "云溪区",
  "value": "430603" },

{
  "label": "君山区",
  "value": "430611" },

{
  "label": "岳阳县",
  "value": "430621" },

{
  "label": "华容县",
  "value": "430623" },

{
  "label": "湘阴县",
  "value": "430624" },

{
  "label": "平江县",
  "value": "430626" },

{
  "label": "岳阳市屈原管理区",
  "value": "430671" },

{
  "label": "汨罗市",
  "value": "430681" },

{
  "label": "临湘市",
  "value": "430682" }],


[{
  "label": "武陵区",
  "value": "430702" },

{
  "label": "鼎城区",
  "value": "430703" },

{
  "label": "安乡县",
  "value": "430721" },

{
  "label": "汉寿县",
  "value": "430722" },

{
  "label": "澧县",
  "value": "430723" },

{
  "label": "临澧县",
  "value": "430724" },

{
  "label": "桃源县",
  "value": "430725" },

{
  "label": "石门县",
  "value": "430726" },

{
  "label": "常德市西洞庭管理区",
  "value": "430771" },

{
  "label": "津市市",
  "value": "430781" }],


[{
  "label": "永定区",
  "value": "430802" },

{
  "label": "武陵源区",
  "value": "430811" },

{
  "label": "慈利县",
  "value": "430821" },

{
  "label": "桑植县",
  "value": "430822" }],


[{
  "label": "资阳区",
  "value": "430902" },

{
  "label": "赫山区",
  "value": "430903" },

{
  "label": "南县",
  "value": "430921" },

{
  "label": "桃江县",
  "value": "430922" },

{
  "label": "安化县",
  "value": "430923" },

{
  "label": "益阳市大通湖管理区",
  "value": "430971" },

{
  "label": "湖南益阳高新技术产业园区",
  "value": "430972" },

{
  "label": "沅江市",
  "value": "430981" }],


[{
  "label": "北湖区",
  "value": "431002" },

{
  "label": "苏仙区",
  "value": "431003" },

{
  "label": "桂阳县",
  "value": "431021" },

{
  "label": "宜章县",
  "value": "431022" },

{
  "label": "永兴县",
  "value": "431023" },

{
  "label": "嘉禾县",
  "value": "431024" },

{
  "label": "临武县",
  "value": "431025" },

{
  "label": "汝城县",
  "value": "431026" },

{
  "label": "桂东县",
  "value": "431027" },

{
  "label": "安仁县",
  "value": "431028" },

{
  "label": "资兴市",
  "value": "431081" }],


[{
  "label": "零陵区",
  "value": "431102" },

{
  "label": "冷水滩区",
  "value": "431103" },

{
  "label": "祁阳县",
  "value": "431121" },

{
  "label": "东安县",
  "value": "431122" },

{
  "label": "双牌县",
  "value": "431123" },

{
  "label": "道县",
  "value": "431124" },

{
  "label": "江永县",
  "value": "431125" },

{
  "label": "宁远县",
  "value": "431126" },

{
  "label": "蓝山县",
  "value": "431127" },

{
  "label": "新田县",
  "value": "431128" },

{
  "label": "江华瑶族自治县",
  "value": "431129" },

{
  "label": "永州经济技术开发区",
  "value": "431171" },

{
  "label": "永州市金洞管理区",
  "value": "431172" },

{
  "label": "永州市回龙圩管理区",
  "value": "431173" }],


[{
  "label": "鹤城区",
  "value": "431202" },

{
  "label": "中方县",
  "value": "431221" },

{
  "label": "沅陵县",
  "value": "431222" },

{
  "label": "辰溪县",
  "value": "431223" },

{
  "label": "溆浦县",
  "value": "431224" },

{
  "label": "会同县",
  "value": "431225" },

{
  "label": "麻阳苗族自治县",
  "value": "431226" },

{
  "label": "新晃侗族自治县",
  "value": "431227" },

{
  "label": "芷江侗族自治县",
  "value": "431228" },

{
  "label": "靖州苗族侗族自治县",
  "value": "431229" },

{
  "label": "通道侗族自治县",
  "value": "431230" },

{
  "label": "怀化市洪江管理区",
  "value": "431271" },

{
  "label": "洪江市",
  "value": "431281" }],


[{
  "label": "娄星区",
  "value": "431302" },

{
  "label": "双峰县",
  "value": "431321" },

{
  "label": "新化县",
  "value": "431322" },

{
  "label": "冷水江市",
  "value": "431381" },

{
  "label": "涟源市",
  "value": "431382" }],


[{
  "label": "吉首市",
  "value": "433101" },

{
  "label": "泸溪县",
  "value": "433122" },

{
  "label": "凤凰县",
  "value": "433123" },

{
  "label": "花垣县",
  "value": "433124" },

{
  "label": "保靖县",
  "value": "433125" },

{
  "label": "古丈县",
  "value": "433126" },

{
  "label": "永顺县",
  "value": "433127" },

{
  "label": "龙山县",
  "value": "433130" },

{
  "label": "湖南吉首经济开发区",
  "value": "433172" },

{
  "label": "湖南永顺经济开发区",
  "value": "433173" }]],



[
[{
  "label": "荔湾区",
  "value": "440103" },

{
  "label": "越秀区",
  "value": "440104" },

{
  "label": "海珠区",
  "value": "440105" },

{
  "label": "天河区",
  "value": "440106" },

{
  "label": "白云区",
  "value": "440111" },

{
  "label": "黄埔区",
  "value": "440112" },

{
  "label": "番禺区",
  "value": "440113" },

{
  "label": "花都区",
  "value": "440114" },

{
  "label": "南沙区",
  "value": "440115" },

{
  "label": "从化区",
  "value": "440117" },

{
  "label": "增城区",
  "value": "440118" }],


[{
  "label": "武江区",
  "value": "440203" },

{
  "label": "浈江区",
  "value": "440204" },

{
  "label": "曲江区",
  "value": "440205" },

{
  "label": "始兴县",
  "value": "440222" },

{
  "label": "仁化县",
  "value": "440224" },

{
  "label": "翁源县",
  "value": "440229" },

{
  "label": "乳源瑶族自治县",
  "value": "440232" },

{
  "label": "新丰县",
  "value": "440233" },

{
  "label": "乐昌市",
  "value": "440281" },

{
  "label": "南雄市",
  "value": "440282" }],


[{
  "label": "罗湖区",
  "value": "440303" },

{
  "label": "福田区",
  "value": "440304" },

{
  "label": "南山区",
  "value": "440305" },

{
  "label": "宝安区",
  "value": "440306" },

{
  "label": "龙岗区",
  "value": "440307" },

{
  "label": "盐田区",
  "value": "440308" },

{
  "label": "龙华区",
  "value": "440309" },

{
  "label": "坪山区",
  "value": "440310" }],


[{
  "label": "香洲区",
  "value": "440402" },

{
  "label": "斗门区",
  "value": "440403" },

{
  "label": "金湾区",
  "value": "440404" }],


[{
  "label": "龙湖区",
  "value": "440507" },

{
  "label": "金平区",
  "value": "440511" },

{
  "label": "濠江区",
  "value": "440512" },

{
  "label": "潮阳区",
  "value": "440513" },

{
  "label": "潮南区",
  "value": "440514" },

{
  "label": "澄海区",
  "value": "440515" },

{
  "label": "南澳县",
  "value": "440523" }],


[{
  "label": "禅城区",
  "value": "440604" },

{
  "label": "南海区",
  "value": "440605" },

{
  "label": "顺德区",
  "value": "440606" },

{
  "label": "三水区",
  "value": "440607" },

{
  "label": "高明区",
  "value": "440608" }],


[{
  "label": "蓬江区",
  "value": "440703" },

{
  "label": "江海区",
  "value": "440704" },

{
  "label": "新会区",
  "value": "440705" },

{
  "label": "台山市",
  "value": "440781" },

{
  "label": "开平市",
  "value": "440783" },

{
  "label": "鹤山市",
  "value": "440784" },

{
  "label": "恩平市",
  "value": "440785" }],


[{
  "label": "赤坎区",
  "value": "440802" },

{
  "label": "霞山区",
  "value": "440803" },

{
  "label": "坡头区",
  "value": "440804" },

{
  "label": "麻章区",
  "value": "440811" },

{
  "label": "遂溪县",
  "value": "440823" },

{
  "label": "徐闻县",
  "value": "440825" },

{
  "label": "廉江市",
  "value": "440881" },

{
  "label": "雷州市",
  "value": "440882" },

{
  "label": "吴川市",
  "value": "440883" }],


[{
  "label": "茂南区",
  "value": "440902" },

{
  "label": "电白区",
  "value": "440904" },

{
  "label": "高州市",
  "value": "440981" },

{
  "label": "化州市",
  "value": "440982" },

{
  "label": "信宜市",
  "value": "440983" }],


[{
  "label": "端州区",
  "value": "441202" },

{
  "label": "鼎湖区",
  "value": "441203" },

{
  "label": "高要区",
  "value": "441204" },

{
  "label": "广宁县",
  "value": "441223" },

{
  "label": "怀集县",
  "value": "441224" },

{
  "label": "封开县",
  "value": "441225" },

{
  "label": "德庆县",
  "value": "441226" },

{
  "label": "四会市",
  "value": "441284" }],


[{
  "label": "惠城区",
  "value": "441302" },

{
  "label": "惠阳区",
  "value": "441303" },

{
  "label": "博罗县",
  "value": "441322" },

{
  "label": "惠东县",
  "value": "441323" },

{
  "label": "龙门县",
  "value": "441324" }],


[{
  "label": "梅江区",
  "value": "441402" },

{
  "label": "梅县区",
  "value": "441403" },

{
  "label": "大埔县",
  "value": "441422" },

{
  "label": "丰顺县",
  "value": "441423" },

{
  "label": "五华县",
  "value": "441424" },

{
  "label": "平远县",
  "value": "441426" },

{
  "label": "蕉岭县",
  "value": "441427" },

{
  "label": "兴宁市",
  "value": "441481" }],


[{
  "label": "城区",
  "value": "441502" },

{
  "label": "海丰县",
  "value": "441521" },

{
  "label": "陆河县",
  "value": "441523" },

{
  "label": "陆丰市",
  "value": "441581" }],


[{
  "label": "源城区",
  "value": "441602" },

{
  "label": "紫金县",
  "value": "441621" },

{
  "label": "龙川县",
  "value": "441622" },

{
  "label": "连平县",
  "value": "441623" },

{
  "label": "和平县",
  "value": "441624" },

{
  "label": "东源县",
  "value": "441625" }],


[{
  "label": "江城区",
  "value": "441702" },

{
  "label": "阳东区",
  "value": "441704" },

{
  "label": "阳西县",
  "value": "441721" },

{
  "label": "阳春市",
  "value": "441781" }],


[{
  "label": "清城区",
  "value": "441802" },

{
  "label": "清新区",
  "value": "441803" },

{
  "label": "佛冈县",
  "value": "441821" },

{
  "label": "阳山县",
  "value": "441823" },

{
  "label": "连山壮族瑶族自治县",
  "value": "441825" },

{
  "label": "连南瑶族自治县",
  "value": "441826" },

{
  "label": "英德市",
  "value": "441881" },

{
  "label": "连州市",
  "value": "441882" }],


[{
  "label": "东莞市",
  "value": "441900" }],

[{
  "label": "中山市",
  "value": "442000" }],

[{
  "label": "湘桥区",
  "value": "445102" },

{
  "label": "潮安区",
  "value": "445103" },

{
  "label": "饶平县",
  "value": "445122" }],


[{
  "label": "榕城区",
  "value": "445202" },

{
  "label": "揭东区",
  "value": "445203" },

{
  "label": "揭西县",
  "value": "445222" },

{
  "label": "惠来县",
  "value": "445224" },

{
  "label": "普宁市",
  "value": "445281" }],


[{
  "label": "云城区",
  "value": "445302" },

{
  "label": "云安区",
  "value": "445303" },

{
  "label": "新兴县",
  "value": "445321" },

{
  "label": "郁南县",
  "value": "445322" },

{
  "label": "罗定市",
  "value": "445381" }]],



[
[{
  "label": "兴宁区",
  "value": "450102" },

{
  "label": "青秀区",
  "value": "450103" },

{
  "label": "江南区",
  "value": "450105" },

{
  "label": "西乡塘区",
  "value": "450107" },

{
  "label": "良庆区",
  "value": "450108" },

{
  "label": "邕宁区",
  "value": "450109" },

{
  "label": "武鸣区",
  "value": "450110" },

{
  "label": "隆安县",
  "value": "450123" },

{
  "label": "马山县",
  "value": "450124" },

{
  "label": "上林县",
  "value": "450125" },

{
  "label": "宾阳县",
  "value": "450126" },

{
  "label": "横县",
  "value": "450127" }],


[{
  "label": "城中区",
  "value": "450202" },

{
  "label": "鱼峰区",
  "value": "450203" },

{
  "label": "柳南区",
  "value": "450204" },

{
  "label": "柳北区",
  "value": "450205" },

{
  "label": "柳江区",
  "value": "450206" },

{
  "label": "柳城县",
  "value": "450222" },

{
  "label": "鹿寨县",
  "value": "450223" },

{
  "label": "融安县",
  "value": "450224" },

{
  "label": "融水苗族自治县",
  "value": "450225" },

{
  "label": "三江侗族自治县",
  "value": "450226" }],


[{
  "label": "秀峰区",
  "value": "450302" },

{
  "label": "叠彩区",
  "value": "450303" },

{
  "label": "象山区",
  "value": "450304" },

{
  "label": "七星区",
  "value": "450305" },

{
  "label": "雁山区",
  "value": "450311" },

{
  "label": "临桂区",
  "value": "450312" },

{
  "label": "阳朔县",
  "value": "450321" },

{
  "label": "灵川县",
  "value": "450323" },

{
  "label": "全州县",
  "value": "450324" },

{
  "label": "兴安县",
  "value": "450325" },

{
  "label": "永福县",
  "value": "450326" },

{
  "label": "灌阳县",
  "value": "450327" },

{
  "label": "龙胜各族自治县",
  "value": "450328" },

{
  "label": "资源县",
  "value": "450329" },

{
  "label": "平乐县",
  "value": "450330" },

{
  "label": "荔浦县",
  "value": "450331" },

{
  "label": "恭城瑶族自治县",
  "value": "450332" }],


[{
  "label": "万秀区",
  "value": "450403" },

{
  "label": "长洲区",
  "value": "450405" },

{
  "label": "龙圩区",
  "value": "450406" },

{
  "label": "苍梧县",
  "value": "450421" },

{
  "label": "藤县",
  "value": "450422" },

{
  "label": "蒙山县",
  "value": "450423" },

{
  "label": "岑溪市",
  "value": "450481" }],


[{
  "label": "海城区",
  "value": "450502" },

{
  "label": "银海区",
  "value": "450503" },

{
  "label": "铁山港区",
  "value": "450512" },

{
  "label": "合浦县",
  "value": "450521" }],


[{
  "label": "港口区",
  "value": "450602" },

{
  "label": "防城区",
  "value": "450603" },

{
  "label": "上思县",
  "value": "450621" },

{
  "label": "东兴市",
  "value": "450681" }],


[{
  "label": "钦南区",
  "value": "450702" },

{
  "label": "钦北区",
  "value": "450703" },

{
  "label": "灵山县",
  "value": "450721" },

{
  "label": "浦北县",
  "value": "450722" }],


[{
  "label": "港北区",
  "value": "450802" },

{
  "label": "港南区",
  "value": "450803" },

{
  "label": "覃塘区",
  "value": "450804" },

{
  "label": "平南县",
  "value": "450821" },

{
  "label": "桂平市",
  "value": "450881" }],


[{
  "label": "玉州区",
  "value": "450902" },

{
  "label": "福绵区",
  "value": "450903" },

{
  "label": "容县",
  "value": "450921" },

{
  "label": "陆川县",
  "value": "450922" },

{
  "label": "博白县",
  "value": "450923" },

{
  "label": "兴业县",
  "value": "450924" },

{
  "label": "北流市",
  "value": "450981" }],


[{
  "label": "右江区",
  "value": "451002" },

{
  "label": "田阳县",
  "value": "451021" },

{
  "label": "田东县",
  "value": "451022" },

{
  "label": "平果县",
  "value": "451023" },

{
  "label": "德保县",
  "value": "451024" },

{
  "label": "那坡县",
  "value": "451026" },

{
  "label": "凌云县",
  "value": "451027" },

{
  "label": "乐业县",
  "value": "451028" },

{
  "label": "田林县",
  "value": "451029" },

{
  "label": "西林县",
  "value": "451030" },

{
  "label": "隆林各族自治县",
  "value": "451031" },

{
  "label": "靖西市",
  "value": "451081" }],


[{
  "label": "八步区",
  "value": "451102" },

{
  "label": "平桂区",
  "value": "451103" },

{
  "label": "昭平县",
  "value": "451121" },

{
  "label": "钟山县",
  "value": "451122" },

{
  "label": "富川瑶族自治县",
  "value": "451123" }],


[{
  "label": "金城江区",
  "value": "451202" },

{
  "label": "宜州区",
  "value": "451203" },

{
  "label": "南丹县",
  "value": "451221" },

{
  "label": "天峨县",
  "value": "451222" },

{
  "label": "凤山县",
  "value": "451223" },

{
  "label": "东兰县",
  "value": "451224" },

{
  "label": "罗城仫佬族自治县",
  "value": "451225" },

{
  "label": "环江毛南族自治县",
  "value": "451226" },

{
  "label": "巴马瑶族自治县",
  "value": "451227" },

{
  "label": "都安瑶族自治县",
  "value": "451228" },

{
  "label": "大化瑶族自治县",
  "value": "451229" }],


[{
  "label": "兴宾区",
  "value": "451302" },

{
  "label": "忻城县",
  "value": "451321" },

{
  "label": "象州县",
  "value": "451322" },

{
  "label": "武宣县",
  "value": "451323" },

{
  "label": "金秀瑶族自治县",
  "value": "451324" },

{
  "label": "合山市",
  "value": "451381" }],


[{
  "label": "江州区",
  "value": "451402" },

{
  "label": "扶绥县",
  "value": "451421" },

{
  "label": "宁明县",
  "value": "451422" },

{
  "label": "龙州县",
  "value": "451423" },

{
  "label": "大新县",
  "value": "451424" },

{
  "label": "天等县",
  "value": "451425" },

{
  "label": "凭祥市",
  "value": "451481" }]],



[
[{
  "label": "秀英区",
  "value": "460105" },

{
  "label": "龙华区",
  "value": "460106" },

{
  "label": "琼山区",
  "value": "460107" },

{
  "label": "美兰区",
  "value": "460108" }],


[{
  "label": "海棠区",
  "value": "460202" },

{
  "label": "吉阳区",
  "value": "460203" },

{
  "label": "天涯区",
  "value": "460204" },

{
  "label": "崖州区",
  "value": "460205" }],


[{
  "label": "西沙群岛",
  "value": "460321" },

{
  "label": "南沙群岛",
  "value": "460322" },

{
  "label": "中沙群岛的岛礁及其海域",
  "value": "460323" }],


[{
  "label": "儋州市",
  "value": "460400" }],

[{
  "label": "五指山市",
  "value": "469001" },

{
  "label": "琼海市",
  "value": "469002" },

{
  "label": "文昌市",
  "value": "469005" },

{
  "label": "万宁市",
  "value": "469006" },

{
  "label": "东方市",
  "value": "469007" },

{
  "label": "定安县",
  "value": "469021" },

{
  "label": "屯昌县",
  "value": "469022" },

{
  "label": "澄迈县",
  "value": "469023" },

{
  "label": "临高县",
  "value": "469024" },

{
  "label": "白沙黎族自治县",
  "value": "469025" },

{
  "label": "昌江黎族自治县",
  "value": "469026" },

{
  "label": "乐东黎族自治县",
  "value": "469027" },

{
  "label": "陵水黎族自治县",
  "value": "469028" },

{
  "label": "保亭黎族苗族自治县",
  "value": "469029" },

{
  "label": "琼中黎族苗族自治县",
  "value": "469030" }]],



[
[{
  "label": "万州区",
  "value": "500101" },

{
  "label": "涪陵区",
  "value": "500102" },

{
  "label": "渝中区",
  "value": "500103" },

{
  "label": "大渡口区",
  "value": "500104" },

{
  "label": "江北区",
  "value": "500105" },

{
  "label": "沙坪坝区",
  "value": "500106" },

{
  "label": "九龙坡区",
  "value": "500107" },

{
  "label": "南岸区",
  "value": "500108" },

{
  "label": "北碚区",
  "value": "500109" },

{
  "label": "綦江区",
  "value": "500110" },

{
  "label": "大足区",
  "value": "500111" },

{
  "label": "渝北区",
  "value": "500112" },

{
  "label": "巴南区",
  "value": "500113" },

{
  "label": "黔江区",
  "value": "500114" },

{
  "label": "长寿区",
  "value": "500115" },

{
  "label": "江津区",
  "value": "500116" },

{
  "label": "合川区",
  "value": "500117" },

{
  "label": "永川区",
  "value": "500118" },

{
  "label": "南川区",
  "value": "500119" },

{
  "label": "璧山区",
  "value": "500120" },

{
  "label": "铜梁区",
  "value": "500151" },

{
  "label": "潼南区",
  "value": "500152" },

{
  "label": "荣昌区",
  "value": "500153" },

{
  "label": "开州区",
  "value": "500154" },

{
  "label": "梁平区",
  "value": "500155" },

{
  "label": "武隆区",
  "value": "500156" }],


[{
  "label": "城口县",
  "value": "500229" },

{
  "label": "丰都县",
  "value": "500230" },

{
  "label": "垫江县",
  "value": "500231" },

{
  "label": "忠县",
  "value": "500233" },

{
  "label": "云阳县",
  "value": "500235" },

{
  "label": "奉节县",
  "value": "500236" },

{
  "label": "巫山县",
  "value": "500237" },

{
  "label": "巫溪县",
  "value": "500238" },

{
  "label": "石柱土家族自治县",
  "value": "500240" },

{
  "label": "秀山土家族苗族自治县",
  "value": "500241" },

{
  "label": "酉阳土家族苗族自治县",
  "value": "500242" },

{
  "label": "彭水苗族土家族自治县",
  "value": "500243" }]],



[
[{
  "label": "锦江区",
  "value": "510104" },

{
  "label": "青羊区",
  "value": "510105" },

{
  "label": "金牛区",
  "value": "510106" },

{
  "label": "武侯区",
  "value": "510107" },

{
  "label": "成华区",
  "value": "510108" },

{
  "label": "龙泉驿区",
  "value": "510112" },

{
  "label": "青白江区",
  "value": "510113" },

{
  "label": "新都区",
  "value": "510114" },

{
  "label": "温江区",
  "value": "510115" },

{
  "label": "双流区",
  "value": "510116" },

{
  "label": "郫都区",
  "value": "510117" },

{
  "label": "金堂县",
  "value": "510121" },

{
  "label": "大邑县",
  "value": "510129" },

{
  "label": "蒲江县",
  "value": "510131" },

{
  "label": "新津县",
  "value": "510132" },

{
  "label": "都江堰市",
  "value": "510181" },

{
  "label": "彭州市",
  "value": "510182" },

{
  "label": "邛崃市",
  "value": "510183" },

{
  "label": "崇州市",
  "value": "510184" },

{
  "label": "简阳市",
  "value": "510185" }],


[{
  "label": "自流井区",
  "value": "510302" },

{
  "label": "贡井区",
  "value": "510303" },

{
  "label": "大安区",
  "value": "510304" },

{
  "label": "沿滩区",
  "value": "510311" },

{
  "label": "荣县",
  "value": "510321" },

{
  "label": "富顺县",
  "value": "510322" }],


[{
  "label": "东区",
  "value": "510402" },

{
  "label": "西区",
  "value": "510403" },

{
  "label": "仁和区",
  "value": "510411" },

{
  "label": "米易县",
  "value": "510421" },

{
  "label": "盐边县",
  "value": "510422" }],


[{
  "label": "江阳区",
  "value": "510502" },

{
  "label": "纳溪区",
  "value": "510503" },

{
  "label": "龙马潭区",
  "value": "510504" },

{
  "label": "泸县",
  "value": "510521" },

{
  "label": "合江县",
  "value": "510522" },

{
  "label": "叙永县",
  "value": "510524" },

{
  "label": "古蔺县",
  "value": "510525" }],


[{
  "label": "旌阳区",
  "value": "510603" },

{
  "label": "罗江区",
  "value": "510604" },

{
  "label": "中江县",
  "value": "510623" },

{
  "label": "广汉市",
  "value": "510681" },

{
  "label": "什邡市",
  "value": "510682" },

{
  "label": "绵竹市",
  "value": "510683" }],


[{
  "label": "涪城区",
  "value": "510703" },

{
  "label": "游仙区",
  "value": "510704" },

{
  "label": "安州区",
  "value": "510705" },

{
  "label": "三台县",
  "value": "510722" },

{
  "label": "盐亭县",
  "value": "510723" },

{
  "label": "梓潼县",
  "value": "510725" },

{
  "label": "北川羌族自治县",
  "value": "510726" },

{
  "label": "平武县",
  "value": "510727" },

{
  "label": "江油市",
  "value": "510781" }],


[{
  "label": "利州区",
  "value": "510802" },

{
  "label": "昭化区",
  "value": "510811" },

{
  "label": "朝天区",
  "value": "510812" },

{
  "label": "旺苍县",
  "value": "510821" },

{
  "label": "青川县",
  "value": "510822" },

{
  "label": "剑阁县",
  "value": "510823" },

{
  "label": "苍溪县",
  "value": "510824" }],


[{
  "label": "船山区",
  "value": "510903" },

{
  "label": "安居区",
  "value": "510904" },

{
  "label": "蓬溪县",
  "value": "510921" },

{
  "label": "射洪县",
  "value": "510922" },

{
  "label": "大英县",
  "value": "510923" }],


[{
  "label": "市中区",
  "value": "511002" },

{
  "label": "东兴区",
  "value": "511011" },

{
  "label": "威远县",
  "value": "511024" },

{
  "label": "资中县",
  "value": "511025" },

{
  "label": "内江经济开发区",
  "value": "511071" },

{
  "label": "隆昌市",
  "value": "511083" }],


[{
  "label": "市中区",
  "value": "511102" },

{
  "label": "沙湾区",
  "value": "511111" },

{
  "label": "五通桥区",
  "value": "511112" },

{
  "label": "金口河区",
  "value": "511113" },

{
  "label": "犍为县",
  "value": "511123" },

{
  "label": "井研县",
  "value": "511124" },

{
  "label": "夹江县",
  "value": "511126" },

{
  "label": "沐川县",
  "value": "511129" },

{
  "label": "峨边彝族自治县",
  "value": "511132" },

{
  "label": "马边彝族自治县",
  "value": "511133" },

{
  "label": "峨眉山市",
  "value": "511181" }],


[{
  "label": "顺庆区",
  "value": "511302" },

{
  "label": "高坪区",
  "value": "511303" },

{
  "label": "嘉陵区",
  "value": "511304" },

{
  "label": "南部县",
  "value": "511321" },

{
  "label": "营山县",
  "value": "511322" },

{
  "label": "蓬安县",
  "value": "511323" },

{
  "label": "仪陇县",
  "value": "511324" },

{
  "label": "西充县",
  "value": "511325" },

{
  "label": "阆中市",
  "value": "511381" }],


[{
  "label": "东坡区",
  "value": "511402" },

{
  "label": "彭山区",
  "value": "511403" },

{
  "label": "仁寿县",
  "value": "511421" },

{
  "label": "洪雅县",
  "value": "511423" },

{
  "label": "丹棱县",
  "value": "511424" },

{
  "label": "青神县",
  "value": "511425" }],


[{
  "label": "翠屏区",
  "value": "511502" },

{
  "label": "南溪区",
  "value": "511503" },

{
  "label": "宜宾县",
  "value": "511521" },

{
  "label": "江安县",
  "value": "511523" },

{
  "label": "长宁县",
  "value": "511524" },

{
  "label": "高县",
  "value": "511525" },

{
  "label": "珙县",
  "value": "511526" },

{
  "label": "筠连县",
  "value": "511527" },

{
  "label": "兴文县",
  "value": "511528" },

{
  "label": "屏山县",
  "value": "511529" }],


[{
  "label": "广安区",
  "value": "511602" },

{
  "label": "前锋区",
  "value": "511603" },

{
  "label": "岳池县",
  "value": "511621" },

{
  "label": "武胜县",
  "value": "511622" },

{
  "label": "邻水县",
  "value": "511623" },

{
  "label": "华蓥市",
  "value": "511681" }],


[{
  "label": "通川区",
  "value": "511702" },

{
  "label": "达川区",
  "value": "511703" },

{
  "label": "宣汉县",
  "value": "511722" },

{
  "label": "开江县",
  "value": "511723" },

{
  "label": "大竹县",
  "value": "511724" },

{
  "label": "渠县",
  "value": "511725" },

{
  "label": "达州经济开发区",
  "value": "511771" },

{
  "label": "万源市",
  "value": "511781" }],


[{
  "label": "雨城区",
  "value": "511802" },

{
  "label": "名山区",
  "value": "511803" },

{
  "label": "荥经县",
  "value": "511822" },

{
  "label": "汉源县",
  "value": "511823" },

{
  "label": "石棉县",
  "value": "511824" },

{
  "label": "天全县",
  "value": "511825" },

{
  "label": "芦山县",
  "value": "511826" },

{
  "label": "宝兴县",
  "value": "511827" }],


[{
  "label": "巴州区",
  "value": "511902" },

{
  "label": "恩阳区",
  "value": "511903" },

{
  "label": "通江县",
  "value": "511921" },

{
  "label": "南江县",
  "value": "511922" },

{
  "label": "平昌县",
  "value": "511923" },

{
  "label": "巴中经济开发区",
  "value": "511971" }],


[{
  "label": "雁江区",
  "value": "512002" },

{
  "label": "安岳县",
  "value": "512021" },

{
  "label": "乐至县",
  "value": "512022" }],


[{
  "label": "马尔康市",
  "value": "513201" },

{
  "label": "汶川县",
  "value": "513221" },

{
  "label": "理县",
  "value": "513222" },

{
  "label": "茂县",
  "value": "513223" },

{
  "label": "松潘县",
  "value": "513224" },

{
  "label": "九寨沟县",
  "value": "513225" },

{
  "label": "金川县",
  "value": "513226" },

{
  "label": "小金县",
  "value": "513227" },

{
  "label": "黑水县",
  "value": "513228" },

{
  "label": "壤塘县",
  "value": "513230" },

{
  "label": "阿坝县",
  "value": "513231" },

{
  "label": "若尔盖县",
  "value": "513232" },

{
  "label": "红原县",
  "value": "513233" }],


[{
  "label": "康定市",
  "value": "513301" },

{
  "label": "泸定县",
  "value": "513322" },

{
  "label": "丹巴县",
  "value": "513323" },

{
  "label": "九龙县",
  "value": "513324" },

{
  "label": "雅江县",
  "value": "513325" },

{
  "label": "道孚县",
  "value": "513326" },

{
  "label": "炉霍县",
  "value": "513327" },

{
  "label": "甘孜县",
  "value": "513328" },

{
  "label": "新龙县",
  "value": "513329" },

{
  "label": "德格县",
  "value": "513330" },

{
  "label": "白玉县",
  "value": "513331" },

{
  "label": "石渠县",
  "value": "513332" },

{
  "label": "色达县",
  "value": "513333" },

{
  "label": "理塘县",
  "value": "513334" },

{
  "label": "巴塘县",
  "value": "513335" },

{
  "label": "乡城县",
  "value": "513336" },

{
  "label": "稻城县",
  "value": "513337" },

{
  "label": "得荣县",
  "value": "513338" }],


[{
  "label": "西昌市",
  "value": "513401" },

{
  "label": "木里藏族自治县",
  "value": "513422" },

{
  "label": "盐源县",
  "value": "513423" },

{
  "label": "德昌县",
  "value": "513424" },

{
  "label": "会理县",
  "value": "513425" },

{
  "label": "会东县",
  "value": "513426" },

{
  "label": "宁南县",
  "value": "513427" },

{
  "label": "普格县",
  "value": "513428" },

{
  "label": "布拖县",
  "value": "513429" },

{
  "label": "金阳县",
  "value": "513430" },

{
  "label": "昭觉县",
  "value": "513431" },

{
  "label": "喜德县",
  "value": "513432" },

{
  "label": "冕宁县",
  "value": "513433" },

{
  "label": "越西县",
  "value": "513434" },

{
  "label": "甘洛县",
  "value": "513435" },

{
  "label": "美姑县",
  "value": "513436" },

{
  "label": "雷波县",
  "value": "513437" }]],



[
[{
  "label": "南明区",
  "value": "520102" },

{
  "label": "云岩区",
  "value": "520103" },

{
  "label": "花溪区",
  "value": "520111" },

{
  "label": "乌当区",
  "value": "520112" },

{
  "label": "白云区",
  "value": "520113" },

{
  "label": "观山湖区",
  "value": "520115" },

{
  "label": "开阳县",
  "value": "520121" },

{
  "label": "息烽县",
  "value": "520122" },

{
  "label": "修文县",
  "value": "520123" },

{
  "label": "清镇市",
  "value": "520181" }],


[{
  "label": "钟山区",
  "value": "520201" },

{
  "label": "六枝特区",
  "value": "520203" },

{
  "label": "水城县",
  "value": "520221" },

{
  "label": "盘州市",
  "value": "520281" }],


[{
  "label": "红花岗区",
  "value": "520302" },

{
  "label": "汇川区",
  "value": "520303" },

{
  "label": "播州区",
  "value": "520304" },

{
  "label": "桐梓县",
  "value": "520322" },

{
  "label": "绥阳县",
  "value": "520323" },

{
  "label": "正安县",
  "value": "520324" },

{
  "label": "道真仡佬族苗族自治县",
  "value": "520325" },

{
  "label": "务川仡佬族苗族自治县",
  "value": "520326" },

{
  "label": "凤冈县",
  "value": "520327" },

{
  "label": "湄潭县",
  "value": "520328" },

{
  "label": "余庆县",
  "value": "520329" },

{
  "label": "习水县",
  "value": "520330" },

{
  "label": "赤水市",
  "value": "520381" },

{
  "label": "仁怀市",
  "value": "520382" }],


[{
  "label": "西秀区",
  "value": "520402" },

{
  "label": "平坝区",
  "value": "520403" },

{
  "label": "普定县",
  "value": "520422" },

{
  "label": "镇宁布依族苗族自治县",
  "value": "520423" },

{
  "label": "关岭布依族苗族自治县",
  "value": "520424" },

{
  "label": "紫云苗族布依族自治县",
  "value": "520425" }],


[{
  "label": "七星关区",
  "value": "520502" },

{
  "label": "大方县",
  "value": "520521" },

{
  "label": "黔西县",
  "value": "520522" },

{
  "label": "金沙县",
  "value": "520523" },

{
  "label": "织金县",
  "value": "520524" },

{
  "label": "纳雍县",
  "value": "520525" },

{
  "label": "威宁彝族回族苗族自治县",
  "value": "520526" },

{
  "label": "赫章县",
  "value": "520527" }],


[{
  "label": "碧江区",
  "value": "520602" },

{
  "label": "万山区",
  "value": "520603" },

{
  "label": "江口县",
  "value": "520621" },

{
  "label": "玉屏侗族自治县",
  "value": "520622" },

{
  "label": "石阡县",
  "value": "520623" },

{
  "label": "思南县",
  "value": "520624" },

{
  "label": "印江土家族苗族自治县",
  "value": "520625" },

{
  "label": "德江县",
  "value": "520626" },

{
  "label": "沿河土家族自治县",
  "value": "520627" },

{
  "label": "松桃苗族自治县",
  "value": "520628" }],


[{
  "label": "兴义市",
  "value": "522301" },

{
  "label": "兴仁县",
  "value": "522322" },

{
  "label": "普安县",
  "value": "522323" },

{
  "label": "晴隆县",
  "value": "522324" },

{
  "label": "贞丰县",
  "value": "522325" },

{
  "label": "望谟县",
  "value": "522326" },

{
  "label": "册亨县",
  "value": "522327" },

{
  "label": "安龙县",
  "value": "522328" }],


[{
  "label": "凯里市",
  "value": "522601" },

{
  "label": "黄平县",
  "value": "522622" },

{
  "label": "施秉县",
  "value": "522623" },

{
  "label": "三穗县",
  "value": "522624" },

{
  "label": "镇远县",
  "value": "522625" },

{
  "label": "岑巩县",
  "value": "522626" },

{
  "label": "天柱县",
  "value": "522627" },

{
  "label": "锦屏县",
  "value": "522628" },

{
  "label": "剑河县",
  "value": "522629" },

{
  "label": "台江县",
  "value": "522630" },

{
  "label": "黎平县",
  "value": "522631" },

{
  "label": "榕江县",
  "value": "522632" },

{
  "label": "从江县",
  "value": "522633" },

{
  "label": "雷山县",
  "value": "522634" },

{
  "label": "麻江县",
  "value": "522635" },

{
  "label": "丹寨县",
  "value": "522636" }],


[{
  "label": "都匀市",
  "value": "522701" },

{
  "label": "福泉市",
  "value": "522702" },

{
  "label": "荔波县",
  "value": "522722" },

{
  "label": "贵定县",
  "value": "522723" },

{
  "label": "瓮安县",
  "value": "522725" },

{
  "label": "独山县",
  "value": "522726" },

{
  "label": "平塘县",
  "value": "522727" },

{
  "label": "罗甸县",
  "value": "522728" },

{
  "label": "长顺县",
  "value": "522729" },

{
  "label": "龙里县",
  "value": "522730" },

{
  "label": "惠水县",
  "value": "522731" },

{
  "label": "三都水族自治县",
  "value": "522732" }]],



[
[{
  "label": "五华区",
  "value": "530102" },

{
  "label": "盘龙区",
  "value": "530103" },

{
  "label": "官渡区",
  "value": "530111" },

{
  "label": "西山区",
  "value": "530112" },

{
  "label": "东川区",
  "value": "530113" },

{
  "label": "呈贡区",
  "value": "530114" },

{
  "label": "晋宁区",
  "value": "530115" },

{
  "label": "富民县",
  "value": "530124" },

{
  "label": "宜良县",
  "value": "530125" },

{
  "label": "石林彝族自治县",
  "value": "530126" },

{
  "label": "嵩明县",
  "value": "530127" },

{
  "label": "禄劝彝族苗族自治县",
  "value": "530128" },

{
  "label": "寻甸回族彝族自治县",
  "value": "530129" },

{
  "label": "安宁市",
  "value": "530181" }],


[{
  "label": "麒麟区",
  "value": "530302" },

{
  "label": "沾益区",
  "value": "530303" },

{
  "label": "马龙县",
  "value": "530321" },

{
  "label": "陆良县",
  "value": "530322" },

{
  "label": "师宗县",
  "value": "530323" },

{
  "label": "罗平县",
  "value": "530324" },

{
  "label": "富源县",
  "value": "530325" },

{
  "label": "会泽县",
  "value": "530326" },

{
  "label": "宣威市",
  "value": "530381" }],


[{
  "label": "红塔区",
  "value": "530402" },

{
  "label": "江川区",
  "value": "530403" },

{
  "label": "澄江县",
  "value": "530422" },

{
  "label": "通海县",
  "value": "530423" },

{
  "label": "华宁县",
  "value": "530424" },

{
  "label": "易门县",
  "value": "530425" },

{
  "label": "峨山彝族自治县",
  "value": "530426" },

{
  "label": "新平彝族傣族自治县",
  "value": "530427" },

{
  "label": "元江哈尼族彝族傣族自治县",
  "value": "530428" }],


[{
  "label": "隆阳区",
  "value": "530502" },

{
  "label": "施甸县",
  "value": "530521" },

{
  "label": "龙陵县",
  "value": "530523" },

{
  "label": "昌宁县",
  "value": "530524" },

{
  "label": "腾冲市",
  "value": "530581" }],


[{
  "label": "昭阳区",
  "value": "530602" },

{
  "label": "鲁甸县",
  "value": "530621" },

{
  "label": "巧家县",
  "value": "530622" },

{
  "label": "盐津县",
  "value": "530623" },

{
  "label": "大关县",
  "value": "530624" },

{
  "label": "永善县",
  "value": "530625" },

{
  "label": "绥江县",
  "value": "530626" },

{
  "label": "镇雄县",
  "value": "530627" },

{
  "label": "彝良县",
  "value": "530628" },

{
  "label": "威信县",
  "value": "530629" },

{
  "label": "水富县",
  "value": "530630" }],


[{
  "label": "古城区",
  "value": "530702" },

{
  "label": "玉龙纳西族自治县",
  "value": "530721" },

{
  "label": "永胜县",
  "value": "530722" },

{
  "label": "华坪县",
  "value": "530723" },

{
  "label": "宁蒗彝族自治县",
  "value": "530724" }],


[{
  "label": "思茅区",
  "value": "530802" },

{
  "label": "宁洱哈尼族彝族自治县",
  "value": "530821" },

{
  "label": "墨江哈尼族自治县",
  "value": "530822" },

{
  "label": "景东彝族自治县",
  "value": "530823" },

{
  "label": "景谷傣族彝族自治县",
  "value": "530824" },

{
  "label": "镇沅彝族哈尼族拉祜族自治县",
  "value": "530825" },

{
  "label": "江城哈尼族彝族自治县",
  "value": "530826" },

{
  "label": "孟连傣族拉祜族佤族自治县",
  "value": "530827" },

{
  "label": "澜沧拉祜族自治县",
  "value": "530828" },

{
  "label": "西盟佤族自治县",
  "value": "530829" }],


[{
  "label": "临翔区",
  "value": "530902" },

{
  "label": "凤庆县",
  "value": "530921" },

{
  "label": "云县",
  "value": "530922" },

{
  "label": "永德县",
  "value": "530923" },

{
  "label": "镇康县",
  "value": "530924" },

{
  "label": "双江拉祜族佤族布朗族傣族自治县",
  "value": "530925" },

{
  "label": "耿马傣族佤族自治县",
  "value": "530926" },

{
  "label": "沧源佤族自治县",
  "value": "530927" }],


[{
  "label": "楚雄市",
  "value": "532301" },

{
  "label": "双柏县",
  "value": "532322" },

{
  "label": "牟定县",
  "value": "532323" },

{
  "label": "南华县",
  "value": "532324" },

{
  "label": "姚安县",
  "value": "532325" },

{
  "label": "大姚县",
  "value": "532326" },

{
  "label": "永仁县",
  "value": "532327" },

{
  "label": "元谋县",
  "value": "532328" },

{
  "label": "武定县",
  "value": "532329" },

{
  "label": "禄丰县",
  "value": "532331" }],


[{
  "label": "个旧市",
  "value": "532501" },

{
  "label": "开远市",
  "value": "532502" },

{
  "label": "蒙自市",
  "value": "532503" },

{
  "label": "弥勒市",
  "value": "532504" },

{
  "label": "屏边苗族自治县",
  "value": "532523" },

{
  "label": "建水县",
  "value": "532524" },

{
  "label": "石屏县",
  "value": "532525" },

{
  "label": "泸西县",
  "value": "532527" },

{
  "label": "元阳县",
  "value": "532528" },

{
  "label": "红河县",
  "value": "532529" },

{
  "label": "金平苗族瑶族傣族自治县",
  "value": "532530" },

{
  "label": "绿春县",
  "value": "532531" },

{
  "label": "河口瑶族自治县",
  "value": "532532" }],


[{
  "label": "文山市",
  "value": "532601" },

{
  "label": "砚山县",
  "value": "532622" },

{
  "label": "西畴县",
  "value": "532623" },

{
  "label": "麻栗坡县",
  "value": "532624" },

{
  "label": "马关县",
  "value": "532625" },

{
  "label": "丘北县",
  "value": "532626" },

{
  "label": "广南县",
  "value": "532627" },

{
  "label": "富宁县",
  "value": "532628" }],


[{
  "label": "景洪市",
  "value": "532801" },

{
  "label": "勐海县",
  "value": "532822" },

{
  "label": "勐腊县",
  "value": "532823" }],


[{
  "label": "大理市",
  "value": "532901" },

{
  "label": "漾濞彝族自治县",
  "value": "532922" },

{
  "label": "祥云县",
  "value": "532923" },

{
  "label": "宾川县",
  "value": "532924" },

{
  "label": "弥渡县",
  "value": "532925" },

{
  "label": "南涧彝族自治县",
  "value": "532926" },

{
  "label": "巍山彝族回族自治县",
  "value": "532927" },

{
  "label": "永平县",
  "value": "532928" },

{
  "label": "云龙县",
  "value": "532929" },

{
  "label": "洱源县",
  "value": "532930" },

{
  "label": "剑川县",
  "value": "532931" },

{
  "label": "鹤庆县",
  "value": "532932" }],


[{
  "label": "瑞丽市",
  "value": "533102" },

{
  "label": "芒市",
  "value": "533103" },

{
  "label": "梁河县",
  "value": "533122" },

{
  "label": "盈江县",
  "value": "533123" },

{
  "label": "陇川县",
  "value": "533124" }],


[{
  "label": "泸水市",
  "value": "533301" },

{
  "label": "福贡县",
  "value": "533323" },

{
  "label": "贡山独龙族怒族自治县",
  "value": "533324" },

{
  "label": "兰坪白族普米族自治县",
  "value": "533325" }],


[{
  "label": "香格里拉市",
  "value": "533401" },

{
  "label": "德钦县",
  "value": "533422" },

{
  "label": "维西傈僳族自治县",
  "value": "533423" }]],



[
[{
  "label": "城关区",
  "value": "540102" },

{
  "label": "堆龙德庆区",
  "value": "540103" },

{
  "label": "林周县",
  "value": "540121" },

{
  "label": "当雄县",
  "value": "540122" },

{
  "label": "尼木县",
  "value": "540123" },

{
  "label": "曲水县",
  "value": "540124" },

{
  "label": "达孜县",
  "value": "540126" },

{
  "label": "墨竹工卡县",
  "value": "540127" },

{
  "label": "格尔木藏青工业园区",
  "value": "540171" },

{
  "label": "拉萨经济技术开发区",
  "value": "540172" },

{
  "label": "西藏文化旅游创意园区",
  "value": "540173" },

{
  "label": "达孜工业园区",
  "value": "540174" }],


[{
  "label": "桑珠孜区",
  "value": "540202" },

{
  "label": "南木林县",
  "value": "540221" },

{
  "label": "江孜县",
  "value": "540222" },

{
  "label": "定日县",
  "value": "540223" },

{
  "label": "萨迦县",
  "value": "540224" },

{
  "label": "拉孜县",
  "value": "540225" },

{
  "label": "昂仁县",
  "value": "540226" },

{
  "label": "谢通门县",
  "value": "540227" },

{
  "label": "白朗县",
  "value": "540228" },

{
  "label": "仁布县",
  "value": "540229" },

{
  "label": "康马县",
  "value": "540230" },

{
  "label": "定结县",
  "value": "540231" },

{
  "label": "仲巴县",
  "value": "540232" },

{
  "label": "亚东县",
  "value": "540233" },

{
  "label": "吉隆县",
  "value": "540234" },

{
  "label": "聂拉木县",
  "value": "540235" },

{
  "label": "萨嘎县",
  "value": "540236" },

{
  "label": "岗巴县",
  "value": "540237" }],


[{
  "label": "卡若区",
  "value": "540302" },

{
  "label": "江达县",
  "value": "540321" },

{
  "label": "贡觉县",
  "value": "540322" },

{
  "label": "类乌齐县",
  "value": "540323" },

{
  "label": "丁青县",
  "value": "540324" },

{
  "label": "察雅县",
  "value": "540325" },

{
  "label": "八宿县",
  "value": "540326" },

{
  "label": "左贡县",
  "value": "540327" },

{
  "label": "芒康县",
  "value": "540328" },

{
  "label": "洛隆县",
  "value": "540329" },

{
  "label": "边坝县",
  "value": "540330" }],


[{
  "label": "巴宜区",
  "value": "540402" },

{
  "label": "工布江达县",
  "value": "540421" },

{
  "label": "米林县",
  "value": "540422" },

{
  "label": "墨脱县",
  "value": "540423" },

{
  "label": "波密县",
  "value": "540424" },

{
  "label": "察隅县",
  "value": "540425" },

{
  "label": "朗县",
  "value": "540426" }],


[{
  "label": "乃东区",
  "value": "540502" },

{
  "label": "扎囊县",
  "value": "540521" },

{
  "label": "贡嘎县",
  "value": "540522" },

{
  "label": "桑日县",
  "value": "540523" },

{
  "label": "琼结县",
  "value": "540524" },

{
  "label": "曲松县",
  "value": "540525" },

{
  "label": "措美县",
  "value": "540526" },

{
  "label": "洛扎县",
  "value": "540527" },

{
  "label": "加查县",
  "value": "540528" },

{
  "label": "隆子县",
  "value": "540529" },

{
  "label": "错那县",
  "value": "540530" },

{
  "label": "浪卡子县",
  "value": "540531" }],


[{
  "label": "那曲县",
  "value": "542421" },

{
  "label": "嘉黎县",
  "value": "542422" },

{
  "label": "比如县",
  "value": "542423" },

{
  "label": "聂荣县",
  "value": "542424" },

{
  "label": "安多县",
  "value": "542425" },

{
  "label": "申扎县",
  "value": "542426" },

{
  "label": "索县",
  "value": "542427" },

{
  "label": "班戈县",
  "value": "542428" },

{
  "label": "巴青县",
  "value": "542429" },

{
  "label": "尼玛县",
  "value": "542430" },

{
  "label": "双湖县",
  "value": "542431" }],


[{
  "label": "普兰县",
  "value": "542521" },

{
  "label": "札达县",
  "value": "542522" },

{
  "label": "噶尔县",
  "value": "542523" },

{
  "label": "日土县",
  "value": "542524" },

{
  "label": "革吉县",
  "value": "542525" },

{
  "label": "改则县",
  "value": "542526" },

{
  "label": "措勤县",
  "value": "542527" }]],



[
[{
  "label": "新城区",
  "value": "610102" },

{
  "label": "碑林区",
  "value": "610103" },

{
  "label": "莲湖区",
  "value": "610104" },

{
  "label": "灞桥区",
  "value": "610111" },

{
  "label": "未央区",
  "value": "610112" },

{
  "label": "雁塔区",
  "value": "610113" },

{
  "label": "阎良区",
  "value": "610114" },

{
  "label": "临潼区",
  "value": "610115" },

{
  "label": "长安区",
  "value": "610116" },

{
  "label": "高陵区",
  "value": "610117" },

{
  "label": "鄠邑区",
  "value": "610118" },

{
  "label": "蓝田县",
  "value": "610122" },

{
  "label": "周至县",
  "value": "610124" }],


[{
  "label": "王益区",
  "value": "610202" },

{
  "label": "印台区",
  "value": "610203" },

{
  "label": "耀州区",
  "value": "610204" },

{
  "label": "宜君县",
  "value": "610222" }],


[{
  "label": "渭滨区",
  "value": "610302" },

{
  "label": "金台区",
  "value": "610303" },

{
  "label": "陈仓区",
  "value": "610304" },

{
  "label": "凤翔县",
  "value": "610322" },

{
  "label": "岐山县",
  "value": "610323" },

{
  "label": "扶风县",
  "value": "610324" },

{
  "label": "眉县",
  "value": "610326" },

{
  "label": "陇县",
  "value": "610327" },

{
  "label": "千阳县",
  "value": "610328" },

{
  "label": "麟游县",
  "value": "610329" },

{
  "label": "凤县",
  "value": "610330" },

{
  "label": "太白县",
  "value": "610331" }],


[{
  "label": "秦都区",
  "value": "610402" },

{
  "label": "杨陵区",
  "value": "610403" },

{
  "label": "渭城区",
  "value": "610404" },

{
  "label": "三原县",
  "value": "610422" },

{
  "label": "泾阳县",
  "value": "610423" },

{
  "label": "乾县",
  "value": "610424" },

{
  "label": "礼泉县",
  "value": "610425" },

{
  "label": "永寿县",
  "value": "610426" },

{
  "label": "彬县",
  "value": "610427" },

{
  "label": "长武县",
  "value": "610428" },

{
  "label": "旬邑县",
  "value": "610429" },

{
  "label": "淳化县",
  "value": "610430" },

{
  "label": "武功县",
  "value": "610431" },

{
  "label": "兴平市",
  "value": "610481" }],


[{
  "label": "临渭区",
  "value": "610502" },

{
  "label": "华州区",
  "value": "610503" },

{
  "label": "潼关县",
  "value": "610522" },

{
  "label": "大荔县",
  "value": "610523" },

{
  "label": "合阳县",
  "value": "610524" },

{
  "label": "澄城县",
  "value": "610525" },

{
  "label": "蒲城县",
  "value": "610526" },

{
  "label": "白水县",
  "value": "610527" },

{
  "label": "富平县",
  "value": "610528" },

{
  "label": "韩城市",
  "value": "610581" },

{
  "label": "华阴市",
  "value": "610582" }],


[{
  "label": "宝塔区",
  "value": "610602" },

{
  "label": "安塞区",
  "value": "610603" },

{
  "label": "延长县",
  "value": "610621" },

{
  "label": "延川县",
  "value": "610622" },

{
  "label": "子长县",
  "value": "610623" },

{
  "label": "志丹县",
  "value": "610625" },

{
  "label": "吴起县",
  "value": "610626" },

{
  "label": "甘泉县",
  "value": "610627" },

{
  "label": "富县",
  "value": "610628" },

{
  "label": "洛川县",
  "value": "610629" },

{
  "label": "宜川县",
  "value": "610630" },

{
  "label": "黄龙县",
  "value": "610631" },

{
  "label": "黄陵县",
  "value": "610632" }],


[{
  "label": "汉台区",
  "value": "610702" },

{
  "label": "南郑区",
  "value": "610703" },

{
  "label": "城固县",
  "value": "610722" },

{
  "label": "洋县",
  "value": "610723" },

{
  "label": "西乡县",
  "value": "610724" },

{
  "label": "勉县",
  "value": "610725" },

{
  "label": "宁强县",
  "value": "610726" },

{
  "label": "略阳县",
  "value": "610727" },

{
  "label": "镇巴县",
  "value": "610728" },

{
  "label": "留坝县",
  "value": "610729" },

{
  "label": "佛坪县",
  "value": "610730" }],


[{
  "label": "榆阳区",
  "value": "610802" },

{
  "label": "横山区",
  "value": "610803" },

{
  "label": "府谷县",
  "value": "610822" },

{
  "label": "靖边县",
  "value": "610824" },

{
  "label": "定边县",
  "value": "610825" },

{
  "label": "绥德县",
  "value": "610826" },

{
  "label": "米脂县",
  "value": "610827" },

{
  "label": "佳县",
  "value": "610828" },

{
  "label": "吴堡县",
  "value": "610829" },

{
  "label": "清涧县",
  "value": "610830" },

{
  "label": "子洲县",
  "value": "610831" },

{
  "label": "神木市",
  "value": "610881" }],


[{
  "label": "汉滨区",
  "value": "610902" },

{
  "label": "汉阴县",
  "value": "610921" },

{
  "label": "石泉县",
  "value": "610922" },

{
  "label": "宁陕县",
  "value": "610923" },

{
  "label": "紫阳县",
  "value": "610924" },

{
  "label": "岚皋县",
  "value": "610925" },

{
  "label": "平利县",
  "value": "610926" },

{
  "label": "镇坪县",
  "value": "610927" },

{
  "label": "旬阳县",
  "value": "610928" },

{
  "label": "白河县",
  "value": "610929" }],


[{
  "label": "商州区",
  "value": "611002" },

{
  "label": "洛南县",
  "value": "611021" },

{
  "label": "丹凤县",
  "value": "611022" },

{
  "label": "商南县",
  "value": "611023" },

{
  "label": "山阳县",
  "value": "611024" },

{
  "label": "镇安县",
  "value": "611025" },

{
  "label": "柞水县",
  "value": "611026" }]],



[
[{
  "label": "城关区",
  "value": "620102" },

{
  "label": "七里河区",
  "value": "620103" },

{
  "label": "西固区",
  "value": "620104" },

{
  "label": "安宁区",
  "value": "620105" },

{
  "label": "红古区",
  "value": "620111" },

{
  "label": "永登县",
  "value": "620121" },

{
  "label": "皋兰县",
  "value": "620122" },

{
  "label": "榆中县",
  "value": "620123" },

{
  "label": "兰州新区",
  "value": "620171" }],


[{
  "label": "嘉峪关市",
  "value": "620201" }],

[{
  "label": "金川区",
  "value": "620302" },

{
  "label": "永昌县",
  "value": "620321" }],


[{
  "label": "白银区",
  "value": "620402" },

{
  "label": "平川区",
  "value": "620403" },

{
  "label": "靖远县",
  "value": "620421" },

{
  "label": "会宁县",
  "value": "620422" },

{
  "label": "景泰县",
  "value": "620423" }],


[{
  "label": "秦州区",
  "value": "620502" },

{
  "label": "麦积区",
  "value": "620503" },

{
  "label": "清水县",
  "value": "620521" },

{
  "label": "秦安县",
  "value": "620522" },

{
  "label": "甘谷县",
  "value": "620523" },

{
  "label": "武山县",
  "value": "620524" },

{
  "label": "张家川回族自治县",
  "value": "620525" }],


[{
  "label": "凉州区",
  "value": "620602" },

{
  "label": "民勤县",
  "value": "620621" },

{
  "label": "古浪县",
  "value": "620622" },

{
  "label": "天祝藏族自治县",
  "value": "620623" }],


[{
  "label": "甘州区",
  "value": "620702" },

{
  "label": "肃南裕固族自治县",
  "value": "620721" },

{
  "label": "民乐县",
  "value": "620722" },

{
  "label": "临泽县",
  "value": "620723" },

{
  "label": "高台县",
  "value": "620724" },

{
  "label": "山丹县",
  "value": "620725" }],


[{
  "label": "崆峒区",
  "value": "620802" },

{
  "label": "泾川县",
  "value": "620821" },

{
  "label": "灵台县",
  "value": "620822" },

{
  "label": "崇信县",
  "value": "620823" },

{
  "label": "华亭县",
  "value": "620824" },

{
  "label": "庄浪县",
  "value": "620825" },

{
  "label": "静宁县",
  "value": "620826" },

{
  "label": "平凉工业园区",
  "value": "620871" }],


[{
  "label": "肃州区",
  "value": "620902" },

{
  "label": "金塔县",
  "value": "620921" },

{
  "label": "瓜州县",
  "value": "620922" },

{
  "label": "肃北蒙古族自治县",
  "value": "620923" },

{
  "label": "阿克塞哈萨克族自治县",
  "value": "620924" },

{
  "label": "玉门市",
  "value": "620981" },

{
  "label": "敦煌市",
  "value": "620982" }],


[{
  "label": "西峰区",
  "value": "621002" },

{
  "label": "庆城县",
  "value": "621021" },

{
  "label": "环县",
  "value": "621022" },

{
  "label": "华池县",
  "value": "621023" },

{
  "label": "合水县",
  "value": "621024" },

{
  "label": "正宁县",
  "value": "621025" },

{
  "label": "宁县",
  "value": "621026" },

{
  "label": "镇原县",
  "value": "621027" }],


[{
  "label": "安定区",
  "value": "621102" },

{
  "label": "通渭县",
  "value": "621121" },

{
  "label": "陇西县",
  "value": "621122" },

{
  "label": "渭源县",
  "value": "621123" },

{
  "label": "临洮县",
  "value": "621124" },

{
  "label": "漳县",
  "value": "621125" },

{
  "label": "岷县",
  "value": "621126" }],


[{
  "label": "武都区",
  "value": "621202" },

{
  "label": "成县",
  "value": "621221" },

{
  "label": "文县",
  "value": "621222" },

{
  "label": "宕昌县",
  "value": "621223" },

{
  "label": "康县",
  "value": "621224" },

{
  "label": "西和县",
  "value": "621225" },

{
  "label": "礼县",
  "value": "621226" },

{
  "label": "徽县",
  "value": "621227" },

{
  "label": "两当县",
  "value": "621228" }],


[{
  "label": "临夏市",
  "value": "622901" },

{
  "label": "临夏县",
  "value": "622921" },

{
  "label": "康乐县",
  "value": "622922" },

{
  "label": "永靖县",
  "value": "622923" },

{
  "label": "广河县",
  "value": "622924" },

{
  "label": "和政县",
  "value": "622925" },

{
  "label": "东乡族自治县",
  "value": "622926" },

{
  "label": "积石山保安族东乡族撒拉族自治县",
  "value": "622927" }],


[{
  "label": "合作市",
  "value": "623001" },

{
  "label": "临潭县",
  "value": "623021" },

{
  "label": "卓尼县",
  "value": "623022" },

{
  "label": "舟曲县",
  "value": "623023" },

{
  "label": "迭部县",
  "value": "623024" },

{
  "label": "玛曲县",
  "value": "623025" },

{
  "label": "碌曲县",
  "value": "623026" },

{
  "label": "夏河县",
  "value": "623027" }]],



[
[{
  "label": "城东区",
  "value": "630102" },

{
  "label": "城中区",
  "value": "630103" },

{
  "label": "城西区",
  "value": "630104" },

{
  "label": "城北区",
  "value": "630105" },

{
  "label": "大通回族土族自治县",
  "value": "630121" },

{
  "label": "湟中县",
  "value": "630122" },

{
  "label": "湟源县",
  "value": "630123" }],


[{
  "label": "乐都区",
  "value": "630202" },

{
  "label": "平安区",
  "value": "630203" },

{
  "label": "民和回族土族自治县",
  "value": "630222" },

{
  "label": "互助土族自治县",
  "value": "630223" },

{
  "label": "化隆回族自治县",
  "value": "630224" },

{
  "label": "循化撒拉族自治县",
  "value": "630225" }],


[{
  "label": "门源回族自治县",
  "value": "632221" },

{
  "label": "祁连县",
  "value": "632222" },

{
  "label": "海晏县",
  "value": "632223" },

{
  "label": "刚察县",
  "value": "632224" }],


[{
  "label": "同仁县",
  "value": "632321" },

{
  "label": "尖扎县",
  "value": "632322" },

{
  "label": "泽库县",
  "value": "632323" },

{
  "label": "河南蒙古族自治县",
  "value": "632324" }],


[{
  "label": "共和县",
  "value": "632521" },

{
  "label": "同德县",
  "value": "632522" },

{
  "label": "贵德县",
  "value": "632523" },

{
  "label": "兴海县",
  "value": "632524" },

{
  "label": "贵南县",
  "value": "632525" }],


[{
  "label": "玛沁县",
  "value": "632621" },

{
  "label": "班玛县",
  "value": "632622" },

{
  "label": "甘德县",
  "value": "632623" },

{
  "label": "达日县",
  "value": "632624" },

{
  "label": "久治县",
  "value": "632625" },

{
  "label": "玛多县",
  "value": "632626" }],


[{
  "label": "玉树市",
  "value": "632701" },

{
  "label": "杂多县",
  "value": "632722" },

{
  "label": "称多县",
  "value": "632723" },

{
  "label": "治多县",
  "value": "632724" },

{
  "label": "囊谦县",
  "value": "632725" },

{
  "label": "曲麻莱县",
  "value": "632726" }],


[{
  "label": "格尔木市",
  "value": "632801" },

{
  "label": "德令哈市",
  "value": "632802" },

{
  "label": "乌兰县",
  "value": "632821" },

{
  "label": "都兰县",
  "value": "632822" },

{
  "label": "天峻县",
  "value": "632823" },

{
  "label": "大柴旦行政委员会",
  "value": "632857" },

{
  "label": "冷湖行政委员会",
  "value": "632858" },

{
  "label": "茫崖行政委员会",
  "value": "632859" }]],



[
[{
  "label": "兴庆区",
  "value": "640104" },

{
  "label": "西夏区",
  "value": "640105" },

{
  "label": "金凤区",
  "value": "640106" },

{
  "label": "永宁县",
  "value": "640121" },

{
  "label": "贺兰县",
  "value": "640122" },

{
  "label": "灵武市",
  "value": "640181" }],


[{
  "label": "大武口区",
  "value": "640202" },

{
  "label": "惠农区",
  "value": "640205" },

{
  "label": "平罗县",
  "value": "640221" }],


[{
  "label": "利通区",
  "value": "640302" },

{
  "label": "红寺堡区",
  "value": "640303" },

{
  "label": "盐池县",
  "value": "640323" },

{
  "label": "同心县",
  "value": "640324" },

{
  "label": "青铜峡市",
  "value": "640381" }],


[{
  "label": "原州区",
  "value": "640402" },

{
  "label": "西吉县",
  "value": "640422" },

{
  "label": "隆德县",
  "value": "640423" },

{
  "label": "泾源县",
  "value": "640424" },

{
  "label": "彭阳县",
  "value": "640425" }],


[{
  "label": "沙坡头区",
  "value": "640502" },

{
  "label": "中宁县",
  "value": "640521" },

{
  "label": "海原县",
  "value": "640522" }]],



[
[{
  "label": "天山区",
  "value": "650102" },

{
  "label": "沙依巴克区",
  "value": "650103" },

{
  "label": "新市区",
  "value": "650104" },

{
  "label": "水磨沟区",
  "value": "650105" },

{
  "label": "头屯河区",
  "value": "650106" },

{
  "label": "达坂城区",
  "value": "650107" },

{
  "label": "米东区",
  "value": "650109" },

{
  "label": "乌鲁木齐县",
  "value": "650121" },

{
  "label": "乌鲁木齐经济技术开发区",
  "value": "650171" },

{
  "label": "乌鲁木齐高新技术产业开发区",
  "value": "650172" }],


[{
  "label": "独山子区",
  "value": "650202" },

{
  "label": "克拉玛依区",
  "value": "650203" },

{
  "label": "白碱滩区",
  "value": "650204" },

{
  "label": "乌尔禾区",
  "value": "650205" }],


[{
  "label": "高昌区",
  "value": "650402" },

{
  "label": "鄯善县",
  "value": "650421" },

{
  "label": "托克逊县",
  "value": "650422" }],


[{
  "label": "伊州区",
  "value": "650502" },

{
  "label": "巴里坤哈萨克自治县",
  "value": "650521" },

{
  "label": "伊吾县",
  "value": "650522" }],


[{
  "label": "昌吉市",
  "value": "652301" },

{
  "label": "阜康市",
  "value": "652302" },

{
  "label": "呼图壁县",
  "value": "652323" },

{
  "label": "玛纳斯县",
  "value": "652324" },

{
  "label": "奇台县",
  "value": "652325" },

{
  "label": "吉木萨尔县",
  "value": "652327" },

{
  "label": "木垒哈萨克自治县",
  "value": "652328" }],


[{
  "label": "博乐市",
  "value": "652701" },

{
  "label": "阿拉山口市",
  "value": "652702" },

{
  "label": "精河县",
  "value": "652722" },

{
  "label": "温泉县",
  "value": "652723" }],


[{
  "label": "库尔勒市",
  "value": "652801" },

{
  "label": "轮台县",
  "value": "652822" },

{
  "label": "尉犁县",
  "value": "652823" },

{
  "label": "若羌县",
  "value": "652824" },

{
  "label": "且末县",
  "value": "652825" },

{
  "label": "焉耆回族自治县",
  "value": "652826" },

{
  "label": "和静县",
  "value": "652827" },

{
  "label": "和硕县",
  "value": "652828" },

{
  "label": "博湖县",
  "value": "652829" },

{
  "label": "库尔勒经济技术开发区",
  "value": "652871" }],


[{
  "label": "阿克苏市",
  "value": "652901" },

{
  "label": "温宿县",
  "value": "652922" },

{
  "label": "库车县",
  "value": "652923" },

{
  "label": "沙雅县",
  "value": "652924" },

{
  "label": "新和县",
  "value": "652925" },

{
  "label": "拜城县",
  "value": "652926" },

{
  "label": "乌什县",
  "value": "652927" },

{
  "label": "阿瓦提县",
  "value": "652928" },

{
  "label": "柯坪县",
  "value": "652929" }],


[{
  "label": "阿图什市",
  "value": "653001" },

{
  "label": "阿克陶县",
  "value": "653022" },

{
  "label": "阿合奇县",
  "value": "653023" },

{
  "label": "乌恰县",
  "value": "653024" }],


[{
  "label": "喀什市",
  "value": "653101" },

{
  "label": "疏附县",
  "value": "653121" },

{
  "label": "疏勒县",
  "value": "653122" },

{
  "label": "英吉沙县",
  "value": "653123" },

{
  "label": "泽普县",
  "value": "653124" },

{
  "label": "莎车县",
  "value": "653125" },

{
  "label": "叶城县",
  "value": "653126" },

{
  "label": "麦盖提县",
  "value": "653127" },

{
  "label": "岳普湖县",
  "value": "653128" },

{
  "label": "伽师县",
  "value": "653129" },

{
  "label": "巴楚县",
  "value": "653130" },

{
  "label": "塔什库尔干塔吉克自治县",
  "value": "653131" }],


[{
  "label": "和田市",
  "value": "653201" },

{
  "label": "和田县",
  "value": "653221" },

{
  "label": "墨玉县",
  "value": "653222" },

{
  "label": "皮山县",
  "value": "653223" },

{
  "label": "洛浦县",
  "value": "653224" },

{
  "label": "策勒县",
  "value": "653225" },

{
  "label": "于田县",
  "value": "653226" },

{
  "label": "民丰县",
  "value": "653227" }],


[{
  "label": "伊宁市",
  "value": "654002" },

{
  "label": "奎屯市",
  "value": "654003" },

{
  "label": "霍尔果斯市",
  "value": "654004" },

{
  "label": "伊宁县",
  "value": "654021" },

{
  "label": "察布查尔锡伯自治县",
  "value": "654022" },

{
  "label": "霍城县",
  "value": "654023" },

{
  "label": "巩留县",
  "value": "654024" },

{
  "label": "新源县",
  "value": "654025" },

{
  "label": "昭苏县",
  "value": "654026" },

{
  "label": "特克斯县",
  "value": "654027" },

{
  "label": "尼勒克县",
  "value": "654028" }],


[{
  "label": "塔城市",
  "value": "654201" },

{
  "label": "乌苏市",
  "value": "654202" },

{
  "label": "额敏县",
  "value": "654221" },

{
  "label": "沙湾县",
  "value": "654223" },

{
  "label": "托里县",
  "value": "654224" },

{
  "label": "裕民县",
  "value": "654225" },

{
  "label": "和布克赛尔蒙古自治县",
  "value": "654226" }],


[{
  "label": "阿勒泰市",
  "value": "654301" },

{
  "label": "布尔津县",
  "value": "654321" },

{
  "label": "富蕴县",
  "value": "654322" },

{
  "label": "福海县",
  "value": "654323" },

{
  "label": "哈巴河县",
  "value": "654324" },

{
  "label": "青河县",
  "value": "654325" },

{
  "label": "吉木乃县",
  "value": "654326" }],


[{
  "label": "石河子市",
  "value": "659001" },

{
  "label": "阿拉尔市",
  "value": "659002" },

{
  "label": "图木舒克市",
  "value": "659003" },

{
  "label": "五家渠市",
  "value": "659004" },

{
  "label": "铁门关市",
  "value": "659006" }]],



[
[{
  "label": "台北",
  "value": "660101" }],

[{
  "label": "高雄",
  "value": "660201" }],

[{
  "label": "基隆",
  "value": "660301" }],

[{
  "label": "台中",
  "value": "660401" }],

[{
  "label": "台南",
  "value": "660501" }],

[{
  "label": "新竹",
  "value": "660601" }],

[{
  "label": "嘉义",
  "value": "660701" }],

[{
  "label": "宜兰",
  "value": "660801" }],

[{
  "label": "桃园",
  "value": "660901" }],

[{
  "label": "苗栗",
  "value": "661001" }],

[{
  "label": "彰化",
  "value": "661101" }],

[{
  "label": "南投",
  "value": "661201" }],

[{
  "label": "云林",
  "value": "661301" }],

[{
  "label": "屏东",
  "value": "661401" }],

[{
  "label": "台东",
  "value": "661501" }],

[{
  "label": "花莲",
  "value": "661601" }],

[{
  "label": "澎湖",
  "value": "661701" }]],


[
[{
  "label": "香港岛",
  "value": "670101" }],

[{
  "label": "九龙",
  "value": "670201" }],

[{
  "label": "新界",
  "value": "670301" }]],


[
[{
  "label": "澳门半岛",
  "value": "680101" }],

[{
  "label": "氹仔岛",
  "value": "680201" }],

[{
  "label": "路环岛",
  "value": "680301" }],

[{
  "label": "路氹城",
  "value": "680401" }]]];var _default =



areaData;exports.default = _default;

/***/ }),

/***/ 14:
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 15:
/*!*********************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/store/index.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _regenerator = _interopRequireDefault(__webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ 16));var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 19));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    hasLogin: false,
    loginProvider: "",
    openid: null },

  mutations: {
    login: function login(state, provider) {
      state.hasLogin = true;
      state.loginProvider = provider;
    },
    logout: function logout(state) {
      state.hasLogin = false;
      state.openid = null;
    },
    setOpenid: function setOpenid(state, openid) {
      state.openid = openid;
    } },

  actions: {
    // lazy loading openid
    getUserOpenId: function () {var _getUserOpenId = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref) {var commit, state;return _regenerator.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                commit = _ref.commit,
                state = _ref.state;_context.next = 3;return (

                  new Promise(function (resolve, reject) {
                    if (state.openid) {
                      resolve(state.openid);
                    } else {
                      uni.login({
                        success: function success(data) {
                          commit('login');
                          setTimeout(function () {//模拟异步请求服务器获取 openid
                            var openid = '123456789';
                            console.log('uni.request mock openid[' + openid + ']');
                            commit('setOpenid', openid);
                            resolve(openid);
                          }, 1000);
                        },
                        fail: function fail(err) {
                          console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err);
                          reject(err);
                        } });

                    }
                  }));case 3:return _context.abrupt("return", _context.sent);case 4:case "end":return _context.stop();}}}, _callee, this);}));function getUserOpenId(_x) {return _getUserOpenId.apply(this, arguments);}return getUserOpenId;}() } });var _default =




store;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 16:
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 17);


/***/ }),

/***/ 17:
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 18);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 18:
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),

/***/ 19:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/*!*****************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/pages.json ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 478:
/*!*********************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/common/util.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }

  var hour = parseInt(time / 3600);
  time = time % 3600;
  var minute = parseInt(time / 60);
  time = time % 60;
  var second = time;

  return [hour, minute, second].map(function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }).join(':');
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
  }

  longitude = longitude.toFixed(2);
  latitude = latitude.toFixed(2);

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.') };

}
var dateUtils = {
  UNITS: {
    '年': 31557600000,
    '月': 2629800000,
    '天': 86400000,
    '小时': 3600000,
    '分钟': 60000,
    '秒': 1000 },

  humanize: function humanize(milliseconds) {
    var humanize = '';
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },
  format: function format(dateStr) {
    var date = this.parse(dateStr);
    var diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    var _format = function _format(number) {
      return number < 10 ? '0' + number : number;
    };
    return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
    _format(date.getHours()) + ':' + _format(date.getMinutes());
  },
  parse: function parse(str) {//将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  } };


module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  dateUtils: dateUtils };

/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-23620191019001","_inBundle":false,"_integrity":"sha512-gBpkjEOQ/LhTnXBVi266PoTNT5VJtbYoEVy+gZ8/LN9/jKEWeWndd2Lu7vn7hmUySVM5K5UV/Bd5LEVkgXB8mA==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-23620191019001.tgz","_shasum":"5c006b903ae7bc407c8b1786de249ffbf72da996","_spec":"@dcloudio/uni-stat@next","_where":"/Users/fxy/Documents/DCloud/HbuilderX-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"bc995d4b43b68e7fe7914ae6b2112117d36e63a8","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-23620191019001"};

/***/ }),

/***/ 7:
/*!**********************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/pages.json?{"type":"style"} ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "启动页" }, "pages/index/guide": { "navigationBarTitleText": "" }, "pages/tabBar/component/component": { "navigationBarTitleText": "内置组件" }, "pages/tabBar/API/API": { "navigationBarTitleText": "接口" }, "pages/tabBar/template/template": { "navigationBarTitleText": "模版" }, "pages/tabBar/extUI/extUI": { "navigationBarTitleText": "扩展组件" }, "pages/component/view/view": { "navigationBarTitleText": "view" }, "pages/component/scroll-view/scroll-view": { "navigationBarTitleText": "scroll-view" }, "pages/component/swiper/swiper": { "navigationBarTitleText": "swiper" }, "pages/component/cover-view/cover-view": { "navigationBarTitleText": "cover-view" }, "pages/component/movable-view/movable-view": { "navigationBarTitleText": "movable-view" }, "pages/component/text/text": { "navigationBarTitleText": "text" }, "pages/component/rich-text/rich-text": { "navigationBarTitleText": "rich-text" }, "pages/component/progress/progress": { "navigationBarTitleText": "progress" }, "pages/component/button/button": { "navigationBarTitleText": "button" }, "pages/component/checkbox/checkbox": { "navigationBarTitleText": "checkbox" }, "pages/component/form/form": { "navigationBarTitleText": "form" }, "pages/component/input/input": { "navigationBarTitleText": "input" }, "pages/component/label/label": { "navigationBarTitleText": "label" }, "pages/component/picker/picker": { "navigationBarTitleText": "picker" }, "pages/component/picker-view/picker-view": { "navigationBarTitleText": "picker-view" }, "pages/component/radio/radio": { "navigationBarTitleText": "radio" }, "pages/component/slider/slider": { "navigationBarTitleText": "slider" }, "pages/component/switch/switch": { "navigationBarTitleText": "switch" }, "pages/component/textarea/textarea": { "navigationBarTitleText": "textarea" }, "pages/component/navigator/navigator": { "navigationBarTitleText": "navigator" }, "pages/component/navigator/navigate/navigate": { "navigationBarTitleText": "navigatePage" }, "pages/component/navigator/redirect/redirect": { "navigationBarTitleText": "redirectPage" }, "pages/component/image/image": { "navigationBarTitleText": "image" }, "pages/component/video/video": { "navigationBarTitleText": "video" }, "pages/component/audio/audio": { "navigationBarTitleText": "audio" }, "pages/component/map/map": { "navigationBarTitleText": "map" }, "pages/component/canvas/canvas": { "navigationBarTitleText": "canvas" }, "pages/component/web-view/web-view": { "navigationBarTitleText": "web-view" }, "pages/API/login/login": { "navigationBarTitleText": "授权登录" }, "pages/API/get-user-info/get-user-info": { "navigationBarTitleText": "获取用户信息" }, "pages/API/request-payment/request-payment": { "navigationBarTitleText": "发起支付" }, "pages/API/share/share": { "navigationBarTitleText": "分享" }, "pages/API/set-navigation-bar-title/set-navigation-bar-title": { "navigationBarTitleText": "设置界面标题" }, "pages/API/show-loading/show-loading": { "navigationBarTitleText": "加载提示框" }, "pages/API/navigator/navigator": { "navigationBarTitleText": "页面跳转" }, "pages/API/navigator/new-page/new-page": { "navigationBarTitleText": "新页面" }, "pages/API/pull-down-refresh/pull-down-refresh": { "navigationBarTitleText": "下拉刷新", "enablePullDownRefresh": true }, "pages/API/animation/animation": { "navigationBarTitleText": "创建动画" }, "pages/API/get-node-info/get-node-info": { "navigationBarTitleText": "节点信息" }, "pages/API/intersection-observer/intersection-observer": { "navigationBarTitleText": "节点布局相交状态" }, "pages/API/canvas/canvas": { "navigationBarTitleText": "创建绘画" }, "pages/API/action-sheet/action-sheet": { "navigationBarTitleText": "操作菜单" }, "pages/API/modal/modal": { "navigationBarTitleText": "模态弹窗" }, "pages/API/toast/toast": { "navigationBarTitleText": "消息提示框" }, "pages/API/get-network-type/get-network-type": { "navigationBarTitleText": "获取手机网络状态" }, "pages/API/get-system-info/get-system-info": { "navigationBarTitleText": "获取手机系统信息" }, "pages/API/add-phone-contact/add-phone-contact": { "navigationBarTitleText": "添加手机联系人" }, "pages/API/on-accelerometer-change/on-accelerometer-change": { "navigationBarTitleText": "监听加速度计数据" }, "pages/API/on-compass-change/on-compass-change": { "navigationBarTitleText": "监听罗盘数据" }, "pages/API/make-phone-call/make-phone-call": { "navigationBarTitleText": "打电话" }, "pages/API/scan-code/scan-code": { "navigationBarTitleText": "扫码" }, "pages/API/clipboard/clipboard": { "navigationBarTitleText": "剪贴板" }, "pages/API/request/request": { "navigationBarTitleText": "网络请求" }, "pages/API/upload-file/upload-file": { "navigationBarTitleText": "上传文件" }, "pages/API/download-file/download-file": { "navigationBarTitleText": "下载文件" }, "pages/API/image/image": { "navigationBarTitleText": "图片" }, "pages/API/voice/voice": { "navigationBarTitleText": "录音" }, "pages/API/background-audio/background-audio": { "navigationBarTitleText": "背景音频" }, "pages/API/video/video": { "navigationBarTitleText": "视频" }, "pages/API/file/file": { "navigationBarTitleText": "文件" }, "pages/API/get-location/get-location": { "navigationBarTitleText": "获取位置" }, "pages/API/open-location/open-location": { "navigationBarTitleText": "查看位置" }, "pages/API/choose-location/choose-location": { "navigationBarTitleText": "使用地图选择位置" }, "pages/API/storage/storage": { "navigationBarTitleText": "数据存储" }, "pages/API/brightness/brightness": { "navigationBarTitleText": "屏幕亮度" }, "pages/API/save-media/save-media": { "navigationBarTitleText": "保存媒体到本地" }, "pages/API/bluetooth/bluetooth": { "navigationBarTitleText": "蓝牙" }, "pages/API/vibrate/vibrate": { "navigationBarTitleText": "震动" }, "pages/extUI/badge/badge": { "navigationBarTitleText": "Badge 数字角标" }, "pages/extUI/count-down/count-down": { "navigationBarTitleText": "CountDown 倒计时" }, "pages/extUI/drawer/drawer": { "navigationBarTitleText": "Drawer 抽屉" }, "pages/extUI/icon/icon": { "navigationBarTitleText": "Icon 图标" }, "pages/extUI/load-more/load-more": { "navigationBarTitleText": "LoadMore 加载更多" }, "pages/extUI/nav-bar/nav-bar": { "navigationBarTitleText": "NavBar 导航栏" }, "pages/extUI/number-box/number-box": { "navigationBarTitleText": "NumberBox 数字输入框" }, "pages/extUI/popup/popup": { "navigationBarTitleText": "Popup 弹出层" }, "pages/extUI/segmented-control/segmented-control": { "navigationBarTitleText": "SegmentedControl 分段器" }, "pages/extUI/tag/tag": { "navigationBarTitleText": "Tag 标签" }, "pages/extUI/list/list": { "navigationBarTitleText": "List 列表" }, "pages/extUI/card/card": { "navigationBarTitleText": "Card 卡片" }, "pages/extUI/collapse/collapse": { "navigationBarTitleText": "Collapse 折叠面板" }, "pages/extUI/pagination/pagination": { "navigationBarTitleText": "Pagination 分页器" }, "pages/extUI/grid/grid": { "navigationBarTitleText": "Grid 宫格" }, "pages/extUI/rate/rate": { "navigationBarTitleText": "Rate 评分" }, "pages/extUI/steps/steps": { "navigationBarTitleText": "Steps 步骤条" }, "pages/extUI/notice-bar/notice-bar": { "navigationBarTitleText": "NoticeBar 通告栏" }, "pages/extUI/swipe-action/swipe-action": { "navigationBarTitleText": "SwipeAction 滑动操作", "disableScroll": true }, "pages/extUI/calendar/calendar": { "navigationBarTitleText": "calendar 日历" }, "pages/template/product-list/product-list": { "navigationBarTitleText": "商品列表", "enablePullDownRefresh": true, "onReachBottomDistance": 20 }, "pages/template/uparse-md/uparse-md": { "navigationBarTitleText": "富文本渲染示例-markdown" }, "pages/template/uparse-html/uparse-html": { "navigationBarTitleText": "富文本渲染示例-html" }, "pages/template/md-editor/md-editor": { "navigationBarTitleText": "md富文本编辑器" }, "pages/template/qrcode/qrcode": { "navigationBarTitleText": "二维码生成" }, "pages/template/crop/crop": { "navigationBarTitleText": "图片裁剪" }, "pages/template/echarts/echarts": { "navigationBarTitleText": "ECharts图表" }, "pages/template/gesture-lock/gesture-lock": { "navigationBarTitleText": "手势图案锁屏" }, "pages/template/nav-default/nav-default": { "navigationBarTitleText": "默认导航栏" }, "pages/template/mpvue-picker/mpvue-picker": { "navigationBarTitleText": "多列选择picker" }, "pages/template/left-category/left-category": { "navigationBarTitleText": "侧边分类导航" }, "pages/template/list-triplex-row/list-triplex-row": { "navigationBarTitleText": "三行列表" }, "pages/template/list2detail-list/list2detail-list": { "navigationBarTitleText": "列表到详情示例", "enablePullDownRefresh": true }, "pages/template/list2detail-detail/list2detail-detail": { "navigationBarTitleText": "详情" }, "pages/template/tabbar/tabbar": { "navigationBarTitleText": "可拖动顶部选项卡" }, "pages/template/tabbar/detail/detail": { "navigationBarTitleText": "详情页面" }, "pages/template/media-list/media-list": { "navigationBarTitleText": "图文列表" }, "pages/template/index-list/index-list": { "navigationBarTitleText": "索引列表index-list", "disableScroll": true }, "pages/template/lazy-load/lazy-load": { "navigationBarTitleText": "懒加载" }, "pages/template/lazy-load-custom/lazy-load-custom": { "navigationBarTitleText": "懒加载" }, "pages/template/scheme/scheme": { "navigationBarTitleText": "打开外部应用" }, "pages/template/im-chat/im-chat": { "navigationBarTitleText": "聊天窗口chat" }, "pages/template/scrollmsg/scrollmsg": { "navigationBarTitleText": "滚动公告" }, "pages/template/comments/comments": { "navigationBarTitleText": "评论界面" }, "pages/template/timeline/timeline": { "navigationBarTitleText": "时间轴 timeline" }, "pages/template/fab/fab": { "navigationBarTitleText": "悬浮按钮 fab" }, "pages/template/datachecker/datachecker": { "navigationBarTitleText": "表单校验" } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "Hello uniapp", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),

/***/ 739:
/*!*********************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/marked/index.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__(/*! ./lib/marked */ 740);

/***/ }),

/***/ 740:
/*!**************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/marked/lib/marked.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) { /**
               * marked - a markdown parser
               * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
               * https://github.com/markedjs/marked
               */

;(function (root) {
  'use strict';

  /**
                 * Block-Level Grammar
                 */

  var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: noop,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
    nptable: noop,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    table: noop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
    text: /^[^\n]+/ };


  block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
  block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block.def = edit(block.def).
  replace('label', block._label).
  replace('title', block._title).
  getRegex();

  block.bullet = /(?:[*+-]|\d+\.)/;
  block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
  block.item = edit(block.item, 'gm').
  replace(/bull/g, block.bullet).
  getRegex();

  block.list = edit(block.list).
  replace(/bull/g, block.bullet).
  replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').
  replace('def', '\\n+(?=' + block.def.source + ')').
  getRegex();

  block._tag = 'address|article|aside|base|basefont|blockquote|body|caption' +
  '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' +
  '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' +
  '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' +
  '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' +
  '|track|ul';
  block._comment = /<!--(?!-?>)[\s\S]*?-->/;
  block.html = edit(block.html, 'i').
  replace('comment', block._comment).
  replace('tag', block._tag).
  replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).
  getRegex();

  block.paragraph = edit(block.paragraph).
  replace('hr', block.hr).
  replace('heading', block.heading).
  replace('lheading', block.lheading).
  replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

  block.blockquote = edit(block.blockquote).
  replace('paragraph', block.paragraph).
  getRegex();

  /**
               * Normal Block Grammar
               */

  block.normal = merge({}, block);

  /**
                                    * GFM Block Grammar
                                    */

  block.gfm = merge({}, block.normal, {
    fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
    paragraph: /^/,
    heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/ });


  block.gfm.paragraph = edit(block.paragraph).
  replace('(?!', '(?!' +
  block.gfm.fences.source.replace('\\1', '\\2') + '|' +
  block.list.source.replace('\\1', '\\3') + '|').
  getRegex();

  /**
               * GFM + Tables Block Grammar
               */

  block.tables = merge({}, block.gfm, {
    nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
    table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/ });


  /**
                                                                                        * Pedantic grammar
                                                                                        */

  block.pedantic = merge({}, block.normal, {
    html: edit(
    '^ *(?:comment *(?:\\n|\\s*$)' +
    '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').
    replace('comment', block._comment).
    replace(/tag/g, '(?!(?:' +
    'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' +
    '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' +
    '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').
    getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/ });


  /**
                                                                                  * Block Lexer
                                                                                  */

  function Lexer(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || marked.defaults;
    this.rules = block.normal;

    if (this.options.pedantic) {
      this.rules = block.pedantic;
    } else if (this.options.gfm) {
      if (this.options.tables) {
        this.rules = block.tables;
      } else {
        this.rules = block.gfm;
      }
    }
  }

  /**
     * Expose Block Rules
     */

  Lexer.rules = block;

  /**
                        * Static Lex Method
                        */

  Lexer.lex = function (src, options) {
    var lexer = new Lexer(options);
    return lexer.lex(src);
  };

  /**
      * Preprocessing
      */

  Lexer.prototype.lex = function (src) {
    src = src.
    replace(/\r\n|\r/g, '\n').
    replace(/\t/g, '    ').
    replace(/\u00a0/g, ' ').
    replace(/\u2424/g, '\n');

    return this.token(src, true);
  };

  /**
      * Lexing
      */

  Lexer.prototype.token = function (src, top) {
    src = src.replace(/^ +$/gm, '');
    var next,
    loose,
    cap,
    bull,
    b,
    item,
    listStart,
    listItems,
    t,
    space,
    i,
    tag,
    l,
    isordered,
    istask,
    ischecked;

    while (src) {
      // newline
      if (cap = this.rules.newline.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[0].length > 1) {
          this.tokens.push({
            type: 'space' });

        }
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        cap = cap[0].replace(/^ {4}/gm, '');
        this.tokens.push({
          type: 'code',
          text: !this.options.pedantic ?
          rtrim(cap, '\n') :
          cap });

        continue;
      }

      // fences (gfm)
      if (cap = this.rules.fences.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'code',
          lang: cap[2],
          text: cap[3] || '' });

        continue;
      }

      // heading
      if (cap = this.rules.heading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[1].length,
          text: cap[2] });

        continue;
      }

      // table no leading pipe (gfm)
      if (top && (cap = this.rules.nptable.exec(src))) {
        item = {
          type: 'table',
          header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [] };


        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);

          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }

          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells(item.cells[i], item.header.length);
          }

          this.tokens.push(item);

          continue;
        }
      }

      // hr
      if (cap = this.rules.hr.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'hr' });

        continue;
      }

      // blockquote
      if (cap = this.rules.blockquote.exec(src)) {
        src = src.substring(cap[0].length);

        this.tokens.push({
          type: 'blockquote_start' });


        cap = cap[0].replace(/^ *> ?/gm, '');

        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        this.token(cap, top);

        this.tokens.push({
          type: 'blockquote_end' });


        continue;
      }

      // list
      if (cap = this.rules.list.exec(src)) {
        src = src.substring(cap[0].length);
        bull = cap[2];
        isordered = bull.length > 1;

        listStart = {
          type: 'list_start',
          ordered: isordered,
          start: isordered ? +bull : '',
          loose: false };


        this.tokens.push(listStart);

        // Get each top-level item.
        cap = cap[0].match(this.rules.item);

        listItems = [];
        next = false;
        l = cap.length;
        i = 0;

        for (; i < l; i++) {
          item = cap[i];

          // Remove the list item's bullet
          // so it is seen as the next token.
          space = item.length;
          item = item.replace(/^ *([*+-]|\d+\.) +/, '');

          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length;
            item = !this.options.pedantic ?
            item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') :
            item.replace(/^ {1,4}/gm, '');
          }

          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (this.options.smartLists && i !== l - 1) {
            b = block.bullet.exec(cap[i + 1])[0];
            if (bull !== b && !(bull.length > 1 && b.length > 1)) {
              src = cap.slice(i + 1).join('\n') + src;
              i = l - 1;
            }
          }

          // Determine whether item is loose or not.
          // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          // for discount behavior.
          loose = next || /\n\n(?!\s*$)/.test(item);
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === '\n';
            if (!loose) loose = next;
          }

          if (loose) {
            listStart.loose = true;
          }

          // Check for task list items
          istask = /^\[[ xX]\] /.test(item);
          ischecked = undefined;
          if (istask) {
            ischecked = item[1] !== ' ';
            item = item.replace(/^\[[ xX]\] +/, '');
          }

          t = {
            type: 'list_item_start',
            task: istask,
            checked: ischecked,
            loose: loose };


          listItems.push(t);
          this.tokens.push(t);

          // Recurse.
          this.token(item, false);

          this.tokens.push({
            type: 'list_item_end' });

        }

        if (listStart.loose) {
          l = listItems.length;
          i = 0;
          for (; i < l; i++) {
            listItems[i].loose = true;
          }
        }

        this.tokens.push({
          type: 'list_end' });


        continue;
      }

      // html
      if (cap = this.rules.html.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: this.options.sanitize ?
          'paragraph' :
          'html',
          pre: !this.options.sanitizer && (
          cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
          text: cap[0] });

        continue;
      }

      // def
      if (top && (cap = this.rules.def.exec(src))) {
        src = src.substring(cap[0].length);
        if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
        tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
        if (!this.tokens.links[tag]) {
          this.tokens.links[tag] = {
            href: cap[2],
            title: cap[3] };

        }
        continue;
      }

      // table (gfm)
      if (top && (cap = this.rules.table.exec(src))) {
        item = {
          type: 'table',
          header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/(?: *\| *)?\n$/, '').split('\n') : [] };


        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);

          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }

          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells(
            item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
            item.header.length);
          }

          this.tokens.push(item);

          continue;
        }
      }

      // lheading
      if (cap = this.rules.lheading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[2] === '=' ? 1 : 2,
          text: cap[1] });

        continue;
      }

      // top-level paragraph
      if (top && (cap = this.rules.paragraph.exec(src))) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'paragraph',
          text: cap[1].charAt(cap[1].length - 1) === '\n' ?
          cap[1].slice(0, -1) :
          cap[1] });

        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'text',
          text: cap[0] });

        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return this.tokens;
  };

  /**
      * Inline-Level Grammar
      */

  var inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noop,
    tag: '^comment' +
    '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
    link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    strong: /^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
    em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noop,
    text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/ };


  inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

  inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline.autolink = edit(inline.autolink).
  replace('scheme', inline._scheme).
  replace('email', inline._email).
  getRegex();

  inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

  inline.tag = edit(inline.tag).
  replace('comment', block._comment).
  replace('attribute', inline._attribute).
  getRegex();

  inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
  inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f\\]*\)|[^\s\x00-\x1f()\\])*?)/;
  inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

  inline.link = edit(inline.link).
  replace('label', inline._label).
  replace('href', inline._href).
  replace('title', inline._title).
  getRegex();

  inline.reflink = edit(inline.reflink).
  replace('label', inline._label).
  getRegex();

  /**
               * Normal Inline Grammar
               */

  inline.normal = merge({}, inline);

  /**
                                      * Pedantic Inline Grammar
                                      */

  inline.pedantic = merge({}, inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
    link: edit(/^!?\[(label)\]\((.*?)\)/).
    replace('label', inline._label).
    getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).
    replace('label', inline._label).
    getRegex() });


  /**
                    * GFM Inline Grammar
                    */

  inline.gfm = merge({}, inline.normal, {
    escape: edit(inline.escape).replace('])', '~|])').getRegex(),
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).
    replace('email', inline._email).
    getRegex(),
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^~+(?=\S)([\s\S]*?\S)~+/,
    text: edit(inline.text).
    replace(']|', '~]|').
    replace('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|').
    getRegex() });


  /**
                    * GFM + Line Breaks Inline Grammar
                    */

  inline.breaks = merge({}, inline.gfm, {
    br: edit(inline.br).replace('{2,}', '*').getRegex(),
    text: edit(inline.gfm.text).replace('{2,}', '*').getRegex() });


  /**
                                                                     * Inline Lexer & Compiler
                                                                     */

  function InlineLexer(links, options) {
    this.options = options || marked.defaults;
    this.links = links;
    this.rules = inline.normal;
    this.renderer = this.options.renderer || new Renderer();
    this.renderer.options = this.options;

    if (!this.links) {
      throw new Error('Tokens array requires a `links` property.');
    }

    if (this.options.pedantic) {
      this.rules = inline.pedantic;
    } else if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks;
      } else {
        this.rules = inline.gfm;
      }
    }
  }

  /**
     * Expose Inline Rules
     */

  InlineLexer.rules = inline;

  /**
                               * Static Lexing/Compiling Method
                               */

  InlineLexer.output = function (src, links, options) {
    var inline = new InlineLexer(links, options);
    return inline.output(src);
  };

  /**
      * Lexing/Compiling
      */

  InlineLexer.prototype.output = function (src) {
    var out = '',
    link,
    text,
    href,
    title,
    cap,
    prevCapZero;

    while (src) {
      // escape
      if (cap = this.rules.escape.exec(src)) {
        src = src.substring(cap[0].length);
        out += cap[1];
        continue;
      }

      // autolink
      if (cap = this.rules.autolink.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = escape(this.mangle(cap[1]));
          href = 'mailto:' + text;
        } else {
          text = escape(cap[1]);
          href = text;
        }
        out += this.renderer.link(href, null, text);
        continue;
      }

      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = escape(cap[0]);
          href = 'mailto:' + text;
        } else {
          text = escape(cap[0]);
          if (cap[1] === 'www.') {
            href = 'http://' + text;
          } else {
            href = text;
          }
        }
        out += this.renderer.link(href, null, text);
        continue;
      }

      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false;
        }
        src = src.substring(cap[0].length);
        out += this.options.sanitize ?
        this.options.sanitizer ?
        this.options.sanitizer(cap[0]) :
        escape(cap[0]) :
        cap[0];
        continue;
      }

      // link
      if (cap = this.rules.link.exec(src)) {
        src = src.substring(cap[0].length);
        this.inLink = true;
        href = cap[2];
        if (this.options.pedantic) {
          link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

          if (link) {
            href = link[1];
            title = link[3];
          } else {
            title = '';
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : '';
        }
        href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
        out += this.outputLink(cap, {
          href: InlineLexer.escapes(href),
          title: InlineLexer.escapes(title) });

        this.inLink = false;
        continue;
      }

      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src)) || (
      cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length);
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = this.links[link.toLowerCase()];
        if (!link || !link.href) {
          out += cap[0].charAt(0);
          src = cap[0].substring(1) + src;
          continue;
        }
        this.inLink = true;
        out += this.outputLink(cap, link);
        this.inLink = false;
        continue;
      }

      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }

      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.codespan(escape(cap[2].trim(), true));
        continue;
      }

      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.br();
        continue;
      }

      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.del(this.output(cap[1]));
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.text(escape(this.smartypants(cap[0])));
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return out;
  };

  InlineLexer.escapes = function (text) {
    return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
  };

  /**
      * Compile Link
      */

  InlineLexer.prototype.outputLink = function (cap, link) {
    var href = link.href,
    title = link.title ? escape(link.title) : null;

    return cap[0].charAt(0) !== '!' ?
    this.renderer.link(href, title, this.output(cap[1])) :
    this.renderer.image(href, title, escape(cap[1]));
  };

  /**
      * Smartypants Transformations
      */

  InlineLexer.prototype.smartypants = function (text) {
    if (!this.options.smartypants) return text;
    return text
    // em-dashes
    .replace(/---/g, "\u2014")
    // en-dashes
    .replace(/--/g, "\u2013")
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018")
    // closing singles & apostrophes
    .replace(/'/g, "\u2019")
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C")
    // closing doubles
    .replace(/"/g, "\u201D")
    // ellipses
    .replace(/\.{3}/g, "\u2026");
  };

  /**
      * Mangle Links
      */

  InlineLexer.prototype.mangle = function (text) {
    if (!this.options.mangle) return text;
    var out = '',
    l = text.length,
    i = 0,
    ch;

    for (; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }
      out += '&#' + ch + ';';
    }

    return out;
  };

  /**
      * Renderer
      */

  function Renderer(options) {
    this.options = options || marked.defaults;
  }

  Renderer.prototype.code = function (code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>' + (
      escaped ? code : escape(code, true)) +
      '</code></pre>';
    }

    return '<pre><code class="' +
    this.options.langPrefix +
    escape(lang, true) +
    '">' + (
    escaped ? code : escape(code, true)) +
    '</code></pre>\n';
  };

  Renderer.prototype.blockquote = function (quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  };

  Renderer.prototype.html = function (html) {
    return html;
  };

  Renderer.prototype.heading = function (text, level, raw) {
    if (this.options.headerIds) {
      return '<h' +
      level +
      ' id="' +
      this.options.headerPrefix +
      raw.toLowerCase().replace(/[^\w]+/g, '-') +
      '">' +
      text +
      '</h' +
      level +
      '>\n';
    }
    // ignore IDs
    return '<h' + level + '>' + text + '</h' + level + '>\n';
  };

  Renderer.prototype.hr = function () {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  };

  Renderer.prototype.list = function (body, ordered, start) {
    var type = ordered ? 'ol' : 'ul',
    startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  };

  Renderer.prototype.listitem = function (text) {
    return '<li>' + text + '</li>\n';
  };

  Renderer.prototype.checkbox = function (checked) {
    return '<input ' + (
    checked ? 'checked="" ' : '') +
    'disabled="" type="checkbox"' + (
    this.options.xhtml ? ' /' : '') +
    '> ';
  };

  Renderer.prototype.paragraph = function (text) {
    return '<p>' + text + '</p>\n';
  };

  Renderer.prototype.table = function (header, body) {
    if (body) body = '<tbody>' + body + '</tbody>';

    return '<table>\n' +
    '<thead>\n' +
    header +
    '</thead>\n' +
    body +
    '</table>\n';
  };

  Renderer.prototype.tablerow = function (content) {
    return '<tr>\n' + content + '</tr>\n';
  };

  Renderer.prototype.tablecell = function (content, flags) {
    var type = flags.header ? 'th' : 'td';
    var tag = flags.align ?
    '<' + type + ' align="' + flags.align + '">' :
    '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  };

  // span level renderer
  Renderer.prototype.strong = function (text) {
    return '<strong>' + text + '</strong>';
  };

  Renderer.prototype.em = function (text) {
    return '<em>' + text + '</em>';
  };

  Renderer.prototype.codespan = function (text) {
    return '<code>' + text + '</code>';
  };

  Renderer.prototype.br = function () {
    return this.options.xhtml ? '<br/>' : '<br>';
  };

  Renderer.prototype.del = function (text) {
    return '<del>' + text + '</del>';
  };

  Renderer.prototype.link = function (href, title, text) {
    if (this.options.sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href)).
        replace(/[^\w:]/g, '').
        toLowerCase();
      } catch (e) {
        return text;
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return text;
      }
    }
    if (this.options.baseUrl && !originIndependentUrl.test(href)) {
      href = resolveUrl(this.options.baseUrl, href);
    }
    try {
      href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
      return text;
    }
    var out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  Renderer.prototype.image = function (href, title, text) {
    if (this.options.baseUrl && !originIndependentUrl.test(href)) {
      href = resolveUrl(this.options.baseUrl, href);
    }
    var out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  };

  Renderer.prototype.text = function (text) {
    return text;
  };

  /**
      * TextRenderer
      * returns only the textual part of the token
      */

  function TextRenderer() {}

  // no need for block level renderers

  TextRenderer.prototype.strong =
  TextRenderer.prototype.em =
  TextRenderer.prototype.codespan =
  TextRenderer.prototype.del =
  TextRenderer.prototype.text = function (text) {
    return text;
  };

  TextRenderer.prototype.link =
  TextRenderer.prototype.image = function (href, title, text) {
    return '' + text;
  };

  TextRenderer.prototype.br = function () {
    return '';
  };

  /**
      * Parsing & Compiling
      */

  function Parser(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || marked.defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
  }

  /**
     * Static Parse Method
     */

  Parser.parse = function (src, options) {
    var parser = new Parser(options);
    return parser.parse(src);
  };

  /**
      * Parse Loop
      */

  Parser.prototype.parse = function (src) {
    this.inline = new InlineLexer(src.links, this.options);
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, { renderer: new TextRenderer() }));

    this.tokens = src.reverse();

    var out = '';
    while (this.next()) {
      out += this.tok();
    }

    return out;
  };

  /**
      * Next Token
      */

  Parser.prototype.next = function () {
    return this.token = this.tokens.pop();
  };

  /**
      * Preview Next Token
      */

  Parser.prototype.peek = function () {
    return this.tokens[this.tokens.length - 1] || 0;
  };

  /**
      * Parse Text Tokens
      */

  Parser.prototype.parseText = function () {
    var body = this.token.text;

    while (this.peek().type === 'text') {
      body += '\n' + this.next().text;
    }

    return this.inline.output(body);
  };

  /**
      * Parse Current Token
      */

  Parser.prototype.tok = function () {
    switch (this.token.type) {
      case 'space':{
          return '';
        }
      case 'hr':{
          return this.renderer.hr();
        }
      case 'heading':{
          return this.renderer.heading(
          this.inline.output(this.token.text),
          this.token.depth,
          unescape(this.inlineText.output(this.token.text)));
        }
      case 'code':{
          return this.renderer.code(this.token.text,
          this.token.lang,
          this.token.escaped);
        }
      case 'table':{
          var header = '',
          body = '',
          i,
          row,
          cell,
          j;

          // header
          cell = '';
          for (i = 0; i < this.token.header.length; i++) {
            cell += this.renderer.tablecell(
            this.inline.output(this.token.header[i]),
            { header: true, align: this.token.align[i] });

          }
          header += this.renderer.tablerow(cell);

          for (i = 0; i < this.token.cells.length; i++) {
            row = this.token.cells[i];

            cell = '';
            for (j = 0; j < row.length; j++) {
              cell += this.renderer.tablecell(
              this.inline.output(row[j]),
              { header: false, align: this.token.align[j] });

            }

            body += this.renderer.tablerow(cell);
          }
          return this.renderer.table(header, body);
        }
      case 'blockquote_start':{
          body = '';

          while (this.next().type !== 'blockquote_end') {
            body += this.tok();
          }

          return this.renderer.blockquote(body);
        }
      case 'list_start':{
          body = '';
          var ordered = this.token.ordered,
          start = this.token.start;

          while (this.next().type !== 'list_end') {
            body += this.tok();
          }

          return this.renderer.list(body, ordered, start);
        }
      case 'list_item_start':{
          body = '';
          var loose = this.token.loose;

          if (this.token.task) {
            body += this.renderer.checkbox(this.token.checked);
          }

          while (this.next().type !== 'list_item_end') {
            body += !loose && this.token.type === 'text' ?
            this.parseText() :
            this.tok();
          }

          return this.renderer.listitem(body);
        }
      case 'html':{
          // TODO parse inline content if parameter markdown=1
          return this.renderer.html(this.token.text);
        }
      case 'paragraph':{
          return this.renderer.paragraph(this.inline.output(this.token.text));
        }
      case 'text':{
          return this.renderer.paragraph(this.parseText());
        }}

  };

  /**
      * Helpers
      */

  function escape(html, encode) {
    return html.
    replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;').
    replace(/"/g, '&quot;').
    replace(/'/g, '&#39;');
  }

  function unescape(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function (_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x' ?
        String.fromCharCode(parseInt(n.substring(2), 16)) :
        String.fromCharCode(+n.substring(1));
      }
      return '';
    });
  }

  function edit(regex, opt) {
    regex = regex.source || regex;
    opt = opt || '';
    return {
      replace: function replace(name, val) {
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return this;
      },
      getRegex: function getRegex() {
        return new RegExp(regex, opt);
      } };

  }

  function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (/^[^:]+:\/*[^/]*$/.test(base)) {
        baseUrls[' ' + base] = base + '/';
      } else {
        baseUrls[' ' + base] = rtrim(base, '/', true);
      }
    }
    base = baseUrls[' ' + base];

    if (href.slice(0, 2) === '//') {
      return base.replace(/:[\s\S]*/, ':') + href;
    } else if (href.charAt(0) === '/') {
      return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
    } else {
      return base + href;
    }
  }
  var baseUrls = {};
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

  function noop() {}
  noop.exec = noop;

  function merge(obj) {
    var i = 1,
    target,
    key;

    for (; i < arguments.length; i++) {
      target = arguments[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }

  function splitCells(tableRow, count) {
    // ensure that every cell-delimiting pipe has a space
    // before it to distinguish it from an escaped pipe
    var row = tableRow.replace(/\|/g, function (match, offset, str) {
      var escaped = false,
      curr = offset;
      while (--curr >= 0 && str[curr] === '\\') {escaped = !escaped;}
      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
    cells = row.split(/ \|/),
    i = 0;

    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) {cells.push('');}
    }

    for (; i < cells.length; i++) {
      // leading or trailing whitespace is ignored per the gfm spec
      cells[i] = cells[i].trim().replace(/\\\|/g, '|');
    }
    return cells;
  }

  // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
  // /c*$/ is vulnerable to REDOS.
  // invert: Remove suffix of non-c chars instead. Default falsey.
  function rtrim(str, c, invert) {
    if (str.length === 0) {
      return '';
    }

    // Length of suffix matching the invert condition.
    var suffLen = 0;

    // Step left until we fail to match the invert condition.
    while (suffLen < str.length) {
      var currChar = str.charAt(str.length - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }

    return str.substr(0, str.length - suffLen);
  }

  /**
     * Marked
     */

  function marked(src, opt, callback) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked(): input parameter is undefined or null');
    }
    if (typeof src !== 'string') {
      throw new Error('marked(): input parameter is of type ' +
      Object.prototype.toString.call(src) + ', string expected');
    }

    if (callback || typeof opt === 'function') {
      if (!callback) {
        callback = opt;
        opt = null;
      }

      opt = merge({}, marked.defaults, opt || {});

      var highlight = opt.highlight,
      tokens,
      pending,
      i = 0;

      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return callback(e);
      }

      pending = tokens.length;

      var done = function done(err) {
        if (err) {
          opt.highlight = highlight;
          return callback(err);
        }

        var out;

        try {
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }

        opt.highlight = highlight;

        return err ?
        callback(err) :
        callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return done();
      }

      delete opt.highlight;

      if (!pending) return done();

      for (; i < tokens.length; i++) {
        (function (token) {
          if (token.type !== 'code') {
            return --pending || done();
          }
          return highlight(token.text, token.lang, function (err, code) {
            if (err) return done(err);
            if (code == null || code === token.text) {
              return --pending || done();
            }
            token.text = code;
            token.escaped = true;
            --pending || done();
          });
        })(tokens[i]);
      }

      return;
    }
    try {
      if (opt) opt = merge({}, marked.defaults, opt);
      return Parser.parse(Lexer.lex(src, opt), opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';
      if ((opt || marked.defaults).silent) {
        return '<p>An error occurred:</p><pre>' +
        escape(e.message + '', true) +
        '</pre>';
      }
      throw e;
    }
  }

  /**
     * Options
     */

  marked.options =
  marked.setOptions = function (opt) {
    merge(marked.defaults, opt);
    return marked;
  };

  marked.getDefaults = function () {
    return {
      baseUrl: null,
      breaks: false,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: new Renderer(),
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      tables: true,
      xhtml: false };

  };

  marked.defaults = marked.getDefaults();

  /**
                                           * Expose
                                           */

  marked.Parser = Parser;
  marked.parser = Parser.parse;

  marked.Renderer = Renderer;
  marked.TextRenderer = TextRenderer;

  marked.Lexer = Lexer;
  marked.lexer = Lexer.lex;

  marked.InlineLexer = InlineLexer;
  marked.inlineLexer = InlineLexer.output;

  marked.parse = marked;

  if (true) {
    module.exports = marked;
  } else {}
})(void 0 || (typeof window !== 'undefined' ? window : global));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),

/***/ 779:
/*!***********************************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/components/echarts/echarts.simple.min.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
              * Licensed to the Apache Software Foundation (ASF) under one
              * or more contributor license agreements.  See the NOTICE file
              * distributed with this work for additional information
              * regarding copyright ownership.  The ASF licenses this file
              * to you under the Apache License, Version 2.0 (the
              * "License"); you may not use this file except in compliance
              * with the License.  You may obtain a copy of the License at
              *
              *   http://www.apache.org/licenses/LICENSE-2.0
              *
              * Unless required by applicable law or agreed to in writing,
              * software distributed under the License is distributed on an
              * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
              * KIND, either express or implied.  See the License for the
              * specific language governing permissions and limitations
              * under the License.
              */


!function (t, e) { true ? e(exports) : undefined;}(void 0, function (t, window, document) {"use strict";function e(t, e) {"createCanvas" === t && (Lh = null), kh[t] = e;}function n(t) {if (null == t || "object" != typeof t) return t;var e = t,i = bh.call(t);if ("[object Array]" === i) {if (!E(t)) {e = [];for (var r = 0, a = t.length; r < a; r++) {e[r] = n(t[r]);}}} else if (wh[i]) {if (!E(t)) {var o = t.constructor;if (t.constructor.from) e = o.from(t);else {e = new o(t.length);for (var r = 0, a = t.length; r < a; r++) {e[r] = n(t[r]);}}}} else if (!xh[i] && !E(t) && !S(t)) {e = {};for (var s in t) {t.hasOwnProperty(s) && (e[s] = n(t[s]));}}return e;}function i(t, e, r) {if (!w(e) || !w(t)) return r ? n(e) : t;for (var a in e) {if (e.hasOwnProperty(a)) {var o = t[a],s = e[a];!w(s) || !w(o) || y(s) || y(o) || S(s) || S(o) || b(s) || b(o) || E(s) || E(o) ? !r && a in t || (t[a] = n(e[a], !0)) : i(o, s, r);}}return t;}function r(t, e) {for (var n = t[0], r = 1, a = t.length; r < a; r++) {n = i(n, t[r], e);}return n;}function a(t, e) {for (var n in e) {e.hasOwnProperty(n) && (t[n] = e[n]);}return t;}function o(t, e, n) {for (var i in e) {e.hasOwnProperty(i) && (n ? null != e[i] : null == t[i]) && (t[i] = e[i]);}return t;}function s() {return Lh || (Lh = Ah().getContext("2d")), Lh;}function l(t, e) {if (t) {if (t.indexOf) return t.indexOf(e);for (var n = 0, i = t.length; n < i; n++) {if (t[n] === e) return n;}}return -1;}function h(t, e) {function n() {}var i = t.prototype;n.prototype = e.prototype, t.prototype = new n();for (var r in i) {t.prototype[r] = i[r];}t.prototype.constructor = t, t.superClass = e;}function u(t, e, n) {o(t = "prototype" in t ? t.prototype : t, e = "prototype" in e ? e.prototype : e, n);}function c(t) {if (t) return "string" != typeof t && "number" == typeof t.length;}function f(t, e, n) {if (t && e) if (t.forEach && t.forEach === Sh) t.forEach(e, n);else if (t.length === +t.length) for (var i = 0, r = t.length; i < r; i++) {e.call(n, t[i], i, t);} else for (var a in t) {t.hasOwnProperty(a) && e.call(n, t[a], a, t);}}function d(t, e, n) {if (t && e) {if (t.map && t.map === Ch) return t.map(e, n);for (var i = [], r = 0, a = t.length; r < a; r++) {i.push(e.call(n, t[r], r, t));}return i;}}function p(t, e, n, i) {if (t && e) {if (t.reduce && t.reduce === Dh) return t.reduce(e, n, i);for (var r = 0, a = t.length; r < a; r++) {n = e.call(i, n, t[r], r, t);}return n;}}function g(t, e, n) {if (t && e) {if (t.filter && t.filter === Ih) return t.filter(e, n);for (var i = [], r = 0, a = t.length; r < a; r++) {e.call(n, t[r], r, t) && i.push(t[r]);}return i;}}function m(t, e) {var n = Th.call(arguments, 2);return function () {return t.apply(e, n.concat(Th.call(arguments)));};}function v(t) {var e = Th.call(arguments, 1);return function () {return t.apply(this, e.concat(Th.call(arguments)));};}function y(t) {return "[object Array]" === bh.call(t);}function _(t) {return "function" == typeof t;}function x(t) {return "[object String]" === bh.call(t);}function w(t) {var e = typeof t;return "function" === e || !!t && "object" == e;}function b(t) {return !!xh[bh.call(t)];}function M(t) {return !!wh[bh.call(t)];}function S(t) {return "object" == typeof t && "number" == typeof t.nodeType && "object" == typeof t.ownerDocument;}function I(t) {return t !== t;}function T(t) {for (var e = 0, n = arguments.length; e < n; e++) {if (null != arguments[e]) return arguments[e];}}function C(t, e) {return null != t ? t : e;}function D(t, e, n) {return null != t ? t : null != e ? e : n;}function k() {return Function.call.apply(Th, arguments);}function A(t) {if ("number" == typeof t) return [t, t, t, t];var e = t.length;return 2 === e ? [t[0], t[1], t[0], t[1]] : 3 === e ? [t[0], t[1], t[2], t[1]] : t;}function L(t, e) {if (!t) throw new Error(e);}function P(t) {return null == t ? null : "function" == typeof t.trim ? t.trim() : t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");}function O(t) {t[Ph] = !0;}function E(t) {return t[Ph];}function N(t) {function e(t, e) {n ? i.set(t, e) : i.set(e, t);}var n = y(t),i = this;t instanceof N ? t.each(e) : t && f(t, e);}function R(t) {return new N(t);}function B() {}function z(t, e) {var n = new Oh(2);return null == t && (t = 0), null == e && (e = 0), n[0] = t, n[1] = e, n;}function F(t) {var e = new Oh(2);return e[0] = t[0], e[1] = t[1], e;}function V(t, e, n) {return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t;}function W(t, e, n) {return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t;}function H(t) {return Math.sqrt(G(t));}function G(t) {return t[0] * t[0] + t[1] * t[1];}function q(t, e, n) {return t[0] = e[0] * n, t[1] = e[1] * n, t;}function X(t, e) {var n = H(e);return 0 === n ? (t[0] = 0, t[1] = 0) : (t[0] = e[0] / n, t[1] = e[1] / n), t;}function U(t, e) {return Math.sqrt((t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1]));}function Y(t, e, n) {var i = e[0],r = e[1];return t[0] = n[0] * i + n[2] * r + n[4], t[1] = n[1] * i + n[3] * r + n[5], t;}function j(t, e, n) {return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t;}function Z(t, e, n) {return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t;}function $() {this.on("mousedown", this._dragStart, this), this.on("mousemove", this._drag, this), this.on("mouseup", this._dragEnd, this), this.on("globalout", this._dragEnd, this);}function K(t, e) {return { target: t, topTarget: e && e.topTarget };}function Q(t, e, n) {return { type: t, event: n, target: e.target, topTarget: e.topTarget, cancelBubble: !1, offsetX: n.zrX, offsetY: n.zrY, gestureEvent: n.gestureEvent, pinchX: n.pinchX, pinchY: n.pinchY, pinchScale: n.pinchScale, wheelDelta: n.zrDelta, zrByTouch: n.zrByTouch, which: n.which };}function J() {}function tt(t, e, n) {if (t[t.rectHover ? "rectContain" : "contain"](e, n)) {for (var i, r = t; r;) {if (r.clipPath && !r.clipPath.contain(e, n)) return !1;r.silent && (i = !0), r = r.parent;}return !i || zh;}return !1;}function et() {var t = new Wh(6);return nt(t), t;}function nt(t) {return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t;}function it(t, e) {return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t;}function rt(t, e, n) {var i = e[0] * n[0] + e[2] * n[1],r = e[1] * n[0] + e[3] * n[1],a = e[0] * n[2] + e[2] * n[3],o = e[1] * n[2] + e[3] * n[3],s = e[0] * n[4] + e[2] * n[5] + e[4],l = e[1] * n[4] + e[3] * n[5] + e[5];return t[0] = i, t[1] = r, t[2] = a, t[3] = o, t[4] = s, t[5] = l, t;}function at(t, e, n) {return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4] + n[0], t[5] = e[5] + n[1], t;}function ot(t, e, n) {var i = e[0],r = e[2],a = e[4],o = e[1],s = e[3],l = e[5],h = Math.sin(n),u = Math.cos(n);return t[0] = i * u + o * h, t[1] = -i * h + o * u, t[2] = r * u + s * h, t[3] = -r * h + u * s, t[4] = u * a + h * l, t[5] = u * l - h * a, t;}function st(t, e, n) {var i = n[0],r = n[1];return t[0] = e[0] * i, t[1] = e[1] * r, t[2] = e[2] * i, t[3] = e[3] * r, t[4] = e[4] * i, t[5] = e[5] * r, t;}function lt(t, e) {var n = e[0],i = e[2],r = e[4],a = e[1],o = e[3],s = e[5],l = n * o - a * i;return l ? (l = 1 / l, t[0] = o * l, t[1] = -a * l, t[2] = -i * l, t[3] = n * l, t[4] = (i * s - o * r) * l, t[5] = (a * r - n * s) * l, t) : null;}function ht(t) {return t > Gh || t < -Gh;}function ut(t) {this._target = t.target, this._life = t.life || 1e3, this._delay = t.delay || 0, this._initialized = !1, this.loop = null != t.loop && t.loop, this.gap = t.gap || 0, this.easing = t.easing || "Linear", this.onframe = t.onframe, this.ondestroy = t.ondestroy, this.onrestart = t.onrestart, this._pausedTime = 0, this._paused = !1;}function ct(t) {return (t = Math.round(t)) < 0 ? 0 : t > 255 ? 255 : t;}function ft(t) {return t < 0 ? 0 : t > 1 ? 1 : t;}function dt(t) {return ct(t.length && "%" === t.charAt(t.length - 1) ? parseFloat(t) / 100 * 255 : parseInt(t, 10));}function pt(t) {return ft(t.length && "%" === t.charAt(t.length - 1) ? parseFloat(t) / 100 : parseFloat(t));}function gt(t, e, n) {return n < 0 ? n += 1 : n > 1 && (n -= 1), 6 * n < 1 ? t + (e - t) * n * 6 : 2 * n < 1 ? e : 3 * n < 2 ? t + (e - t) * (2 / 3 - n) * 6 : t;}function mt(t, e, n, i, r) {return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t;}function vt(t, e) {return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;}function yt(t, e) {eu && vt(eu, e), eu = tu.put(t, eu || e.slice());}function _t(t, e) {if (t) {e = e || [];var n = tu.get(t);if (n) return vt(e, n);var i = (t += "").replace(/ /g, "").toLowerCase();if (i in Jh) return vt(e, Jh[i]), yt(t, e), e;if ("#" !== i.charAt(0)) {var r = i.indexOf("("),a = i.indexOf(")");if (-1 !== r && a + 1 === i.length) {var o = i.substr(0, r),s = i.substr(r + 1, a - (r + 1)).split(","),l = 1;switch (o) {case "rgba":if (4 !== s.length) return void mt(e, 0, 0, 0, 1);l = pt(s.pop());case "rgb":return 3 !== s.length ? void mt(e, 0, 0, 0, 1) : (mt(e, dt(s[0]), dt(s[1]), dt(s[2]), l), yt(t, e), e);case "hsla":return 4 !== s.length ? void mt(e, 0, 0, 0, 1) : (s[3] = pt(s[3]), xt(s, e), yt(t, e), e);case "hsl":return 3 !== s.length ? void mt(e, 0, 0, 0, 1) : (xt(s, e), yt(t, e), e);default:return;}}mt(e, 0, 0, 0, 1);} else {if (4 === i.length) return (h = parseInt(i.substr(1), 16)) >= 0 && h <= 4095 ? (mt(e, (3840 & h) >> 4 | (3840 & h) >> 8, 240 & h | (240 & h) >> 4, 15 & h | (15 & h) << 4, 1), yt(t, e), e) : void mt(e, 0, 0, 0, 1);if (7 === i.length) {var h = parseInt(i.substr(1), 16);return h >= 0 && h <= 16777215 ? (mt(e, (16711680 & h) >> 16, (65280 & h) >> 8, 255 & h, 1), yt(t, e), e) : void mt(e, 0, 0, 0, 1);}}}}function xt(t, e) {var n = (parseFloat(t[0]) % 360 + 360) % 360 / 360,i = pt(t[1]),r = pt(t[2]),a = r <= .5 ? r * (i + 1) : r + i - r * i,o = 2 * r - a;return e = e || [], mt(e, ct(255 * gt(o, a, n + 1 / 3)), ct(255 * gt(o, a, n)), ct(255 * gt(o, a, n - 1 / 3)), 1), 4 === t.length && (e[3] = t[3]), e;}function wt(t, e) {var n = _t(t);if (n) {for (var i = 0; i < 3; i++) {n[i] = e < 0 ? n[i] * (1 - e) | 0 : (255 - n[i]) * e + n[i] | 0, n[i] > 255 ? n[i] = 255 : t[i] < 0 && (n[i] = 0);}return bt(n, 4 === n.length ? "rgba" : "rgb");}}function bt(t, e) {if (t && t.length) {var n = t[0] + "," + t[1] + "," + t[2];return "rgba" !== e && "hsva" !== e && "hsla" !== e || (n += "," + t[3]), e + "(" + n + ")";}}function Mt(t, e) {return t[e];}function St(t, e, n) {t[e] = n;}function It(t, e, n) {return (e - t) * n + t;}function Tt(t, e, n) {return n > .5 ? e : t;}function Ct(t, e, n, i, r) {var a = t.length;if (1 == r) for (s = 0; s < a; s++) {i[s] = It(t[s], e[s], n);} else for (var o = a && t[0].length, s = 0; s < a; s++) {for (var l = 0; l < o; l++) {i[s][l] = It(t[s][l], e[s][l], n);}}}function Dt(t, e, n) {var i = t.length,r = e.length;if (i !== r) if (i > r) t.length = r;else for (o = i; o < r; o++) {t.push(1 === n ? e[o] : nu.call(e[o]));}for (var a = t[0] && t[0].length, o = 0; o < t.length; o++) {if (1 === n) isNaN(t[o]) && (t[o] = e[o]);else for (var s = 0; s < a; s++) {isNaN(t[o][s]) && (t[o][s] = e[o][s]);}}}function kt(t, e, n) {if (t === e) return !0;var i = t.length;if (i !== e.length) return !1;if (1 === n) {for (a = 0; a < i; a++) {if (t[a] !== e[a]) return !1;}} else for (var r = t[0].length, a = 0; a < i; a++) {for (var o = 0; o < r; o++) {if (t[a][o] !== e[a][o]) return !1;}}return !0;}function At(t, e, n, i, r, a, o, s, l) {var h = t.length;if (1 == l) for (c = 0; c < h; c++) {s[c] = Lt(t[c], e[c], n[c], i[c], r, a, o);} else for (var u = t[0].length, c = 0; c < h; c++) {for (var f = 0; f < u; f++) {s[c][f] = Lt(t[c][f], e[c][f], n[c][f], i[c][f], r, a, o);}}}function Lt(t, e, n, i, r, a, o) {var s = .5 * (n - t),l = .5 * (i - e);return (2 * (e - n) + s + l) * o + (-3 * (e - n) - 2 * s - l) * a + s * r + e;}function Pt(t) {if (c(t)) {var e = t.length;if (c(t[0])) {for (var n = [], i = 0; i < e; i++) {n.push(nu.call(t[i]));}return n;}return nu.call(t);}return t;}function Ot(t) {return t[0] = Math.floor(t[0]), t[1] = Math.floor(t[1]), t[2] = Math.floor(t[2]), "rgba(" + t.join(",") + ")";}function Et(t) {var e = t[t.length - 1].value;return c(e && e[0]) ? 2 : 1;}function Nt(t, e, n, i, r, a) {var o = t._getter,s = t._setter,l = "spline" === e,h = i.length;if (h) {var u,f = c(i[0].value),d = !1,p = !1,g = f ? Et(i) : 0;i.sort(function (t, e) {return t.time - e.time;}), u = i[h - 1].time;for (var m = [], v = [], y = i[0].value, _ = !0, x = 0; x < h; x++) {m.push(i[x].time / u);var w = i[x].value;if (f && kt(w, y, g) || !f && w === y || (_ = !1), y = w, "string" == typeof w) {var b = _t(w);b ? (w = b, d = !0) : p = !0;}v.push(w);}if (a || !_) {for (var M = v[h - 1], x = 0; x < h - 1; x++) {f ? Dt(v[x], M, g) : !isNaN(v[x]) || isNaN(M) || p || d || (v[x] = M);}f && Dt(o(t._target, r), M, g);var S,I,T,C,D,k,A = 0,L = 0;if (d) var P = [0, 0, 0, 0];var O = new ut({ target: t._target, life: u, loop: t._loop, delay: t._delay, onframe: function onframe(t, e) {var n;if (e < 0) n = 0;else if (e < L) {for (n = S = Math.min(A + 1, h - 1); n >= 0 && !(m[n] <= e); n--) {;}n = Math.min(n, h - 2);} else {for (n = A; n < h && !(m[n] > e); n++) {;}n = Math.min(n - 1, h - 2);}A = n, L = e;var i = m[n + 1] - m[n];if (0 !== i) if (I = (e - m[n]) / i, l) {if (C = v[n], T = v[0 === n ? n : n - 1], D = v[n > h - 2 ? h - 1 : n + 1], k = v[n > h - 3 ? h - 1 : n + 2], f) At(T, C, D, k, I, I * I, I * I * I, o(t, r), g);else {if (d) a = At(T, C, D, k, I, I * I, I * I * I, P, 1), a = Ot(P);else {if (p) return Tt(C, D, I);a = Lt(T, C, D, k, I, I * I, I * I * I);}s(t, r, a);}} else if (f) Ct(v[n], v[n + 1], I, o(t, r), g);else {var a;if (d) Ct(v[n], v[n + 1], I, P, 1), a = Ot(P);else {if (p) return Tt(v[n], v[n + 1], I);a = It(v[n], v[n + 1], I);}s(t, r, a);}}, ondestroy: n });return e && "spline" !== e && (O.easing = e), O;}}}function Rt(t, e, n, i) {n < 0 && (t += n, n = -n), i < 0 && (e += i, i = -i), this.x = t, this.y = e, this.width = n, this.height = i;}function Bt(t) {for (var e = 0; t >= pu;) {e |= 1 & t, t >>= 1;}return t + e;}function zt(t, e, n, i) {var r = e + 1;if (r === n) return 1;if (i(t[r++], t[e]) < 0) {for (; r < n && i(t[r], t[r - 1]) < 0;) {r++;}Ft(t, e, r);} else for (; r < n && i(t[r], t[r - 1]) >= 0;) {r++;}return r - e;}function Ft(t, e, n) {for (n--; e < n;) {var i = t[e];t[e++] = t[n], t[n--] = i;}}function Vt(t, e, n, i, r) {for (i === e && i++; i < n; i++) {for (var a, o = t[i], s = e, l = i; s < l;) {r(o, t[a = s + l >>> 1]) < 0 ? l = a : s = a + 1;}var h = i - s;switch (h) {case 3:t[s + 3] = t[s + 2];case 2:t[s + 2] = t[s + 1];case 1:t[s + 1] = t[s];break;default:for (; h > 0;) {t[s + h] = t[s + h - 1], h--;}}t[s] = o;}}function Wt(t, e, n, i, r, a) {var o = 0,s = 0,l = 1;if (a(t, e[n + r]) > 0) {for (s = i - r; l < s && a(t, e[n + r + l]) > 0;) {o = l, (l = 1 + (l << 1)) <= 0 && (l = s);}l > s && (l = s), o += r, l += r;} else {for (s = r + 1; l < s && a(t, e[n + r - l]) <= 0;) {o = l, (l = 1 + (l << 1)) <= 0 && (l = s);}l > s && (l = s);var h = o;o = r - l, l = r - h;}for (o++; o < l;) {var u = o + (l - o >>> 1);a(t, e[n + u]) > 0 ? o = u + 1 : l = u;}return l;}function Ht(t, e, n, i, r, a) {var o = 0,s = 0,l = 1;if (a(t, e[n + r]) < 0) {for (s = r + 1; l < s && a(t, e[n + r - l]) < 0;) {o = l, (l = 1 + (l << 1)) <= 0 && (l = s);}l > s && (l = s);var h = o;o = r - l, l = r - h;} else {for (s = i - r; l < s && a(t, e[n + r + l]) >= 0;) {o = l, (l = 1 + (l << 1)) <= 0 && (l = s);}l > s && (l = s), o += r, l += r;}for (o++; o < l;) {var u = o + (l - o >>> 1);a(t, e[n + u]) < 0 ? l = u : o = u + 1;}return l;}function Gt(t, e) {function n(n) {var s = a[n],h = o[n],u = a[n + 1],c = o[n + 1];o[n] = h + c, n === l - 3 && (a[n + 1] = a[n + 2], o[n + 1] = o[n + 2]), l--;var f = Ht(t[u], t, s, h, 0, e);s += f, 0 !== (h -= f) && 0 !== (c = Wt(t[s + h - 1], t, u, c, c - 1, e)) && (h <= c ? i(s, h, u, c) : r(s, h, u, c));}function i(n, i, r, a) {var o = 0;for (o = 0; o < i; o++) {h[o] = t[n + o];}var l = 0,u = r,c = n;if (t[c++] = t[u++], 0 != --a) {if (1 !== i) {for (var f, d, p, g = s;;) {f = 0, d = 0, p = !1;do {if (e(t[u], h[l]) < 0) {if (t[c++] = t[u++], d++, f = 0, 0 == --a) {p = !0;break;}} else if (t[c++] = h[l++], f++, d = 0, 1 == --i) {p = !0;break;}} while ((f | d) < g);if (p) break;do {if (0 !== (f = Ht(t[u], h, l, i, 0, e))) {for (o = 0; o < f; o++) {t[c + o] = h[l + o];}if (c += f, l += f, (i -= f) <= 1) {p = !0;break;}}if (t[c++] = t[u++], 0 == --a) {p = !0;break;}if (0 !== (d = Wt(h[l], t, u, a, 0, e))) {for (o = 0; o < d; o++) {t[c + o] = t[u + o];}if (c += d, u += d, 0 === (a -= d)) {p = !0;break;}}if (t[c++] = h[l++], 1 == --i) {p = !0;break;}g--;} while (f >= gu || d >= gu);if (p) break;g < 0 && (g = 0), g += 2;}if ((s = g) < 1 && (s = 1), 1 === i) {for (o = 0; o < a; o++) {t[c + o] = t[u + o];}t[c + a] = h[l];} else {if (0 === i) throw new Error();for (o = 0; o < i; o++) {t[c + o] = h[l + o];}}} else {for (o = 0; o < a; o++) {t[c + o] = t[u + o];}t[c + a] = h[l];}} else for (o = 0; o < i; o++) {t[c + o] = h[l + o];}}function r(n, i, r, a) {var o = 0;for (o = 0; o < a; o++) {h[o] = t[r + o];}var l = n + i - 1,u = a - 1,c = r + a - 1,f = 0,d = 0;if (t[c--] = t[l--], 0 != --i) {if (1 !== a) {for (var p = s;;) {var g = 0,m = 0,v = !1;do {if (e(h[u], t[l]) < 0) {if (t[c--] = t[l--], g++, m = 0, 0 == --i) {v = !0;break;}} else if (t[c--] = h[u--], m++, g = 0, 1 == --a) {v = !0;break;}} while ((g | m) < p);if (v) break;do {if (0 != (g = i - Ht(h[u], t, n, i, i - 1, e))) {for (i -= g, d = (c -= g) + 1, f = (l -= g) + 1, o = g - 1; o >= 0; o--) {t[d + o] = t[f + o];}if (0 === i) {v = !0;break;}}if (t[c--] = h[u--], 1 == --a) {v = !0;break;}if (0 != (m = a - Wt(t[l], h, 0, a, a - 1, e))) {for (a -= m, d = (c -= m) + 1, f = (u -= m) + 1, o = 0; o < m; o++) {t[d + o] = h[f + o];}if (a <= 1) {v = !0;break;}}if (t[c--] = t[l--], 0 == --i) {v = !0;break;}p--;} while (g >= gu || m >= gu);if (v) break;p < 0 && (p = 0), p += 2;}if ((s = p) < 1 && (s = 1), 1 === a) {for (d = (c -= i) + 1, f = (l -= i) + 1, o = i - 1; o >= 0; o--) {t[d + o] = t[f + o];}t[c] = h[u];} else {if (0 === a) throw new Error();for (f = c - (a - 1), o = 0; o < a; o++) {t[f + o] = h[o];}}} else {for (d = (c -= i) + 1, f = (l -= i) + 1, o = i - 1; o >= 0; o--) {t[d + o] = t[f + o];}t[c] = h[u];}} else for (f = c - (a - 1), o = 0; o < a; o++) {t[f + o] = h[o];}}var a,o,s = gu,l = 0,h = [];a = [], o = [], this.mergeRuns = function () {for (; l > 1;) {var t = l - 2;if (t >= 1 && o[t - 1] <= o[t] + o[t + 1] || t >= 2 && o[t - 2] <= o[t] + o[t - 1]) o[t - 1] < o[t + 1] && t--;else if (o[t] > o[t + 1]) break;n(t);}}, this.forceMergeRuns = function () {for (; l > 1;) {var t = l - 2;t > 0 && o[t - 1] < o[t + 1] && t--, n(t);}}, this.pushRun = function (t, e) {a[l] = t, o[l] = e, l += 1;};}function qt(t, e, n, i) {n || (n = 0), i || (i = t.length);var r = i - n;if (!(r < 2)) {var a = 0;if (r < pu) return a = zt(t, n, i, e), void Vt(t, n, i, n + a, e);var o = new Gt(t, e),s = Bt(r);do {if ((a = zt(t, n, i, e)) < s) {var l = r;l > s && (l = s), Vt(t, n, n + l, n + a, e), a = l;}o.pushRun(n, a), o.mergeRuns(), r -= a, n += a;} while (0 !== r);o.forceMergeRuns();}}function Xt(t, e) {return t.zlevel === e.zlevel ? t.z === e.z ? t.z2 - e.z2 : t.z - e.z : t.zlevel - e.zlevel;}function Ut(t, e, n) {var i = null == e.x ? 0 : e.x,r = null == e.x2 ? 1 : e.x2,a = null == e.y ? 0 : e.y,o = null == e.y2 ? 0 : e.y2;return e.global || (i = i * n.width + n.x, r = r * n.width + n.x, a = a * n.height + n.y, o = o * n.height + n.y), i = isNaN(i) ? 0 : i, r = isNaN(r) ? 1 : r, a = isNaN(a) ? 0 : a, o = isNaN(o) ? 0 : o, t.createLinearGradient(i, a, r, o);}function Yt(t, e, n) {var i = n.width,r = n.height,a = Math.min(i, r),o = null == e.x ? .5 : e.x,s = null == e.y ? .5 : e.y,l = null == e.r ? .5 : e.r;return e.global || (o = o * i + n.x, s = s * r + n.y, l *= a), t.createRadialGradient(o, s, 0, o, s, l);}function jt() {return !1;}function Zt(t, e, n) {var i = Ah(),r = e.getWidth(),a = e.getHeight(),o = i.style;return o && (o.position = "absolute", o.left = 0, o.top = 0, o.width = r + "px", o.height = a + "px", i.setAttribute("data-zr-dom-id", t)), i.width = r * n, i.height = a * n, i;}function $t(t) {if ("string" == typeof t) {var e = Cu.get(t);return e && e.image;}return t;}function Kt(t, e, n, i, r) {if (t) {if ("string" == typeof t) {if (e && e.__zrImageSrc === t || !n) return e;var a = Cu.get(t),o = { hostEl: n, cb: i, cbPayload: r };return a ? !Jt(e = a.image) && a.pending.push(o) : (!e && (e = new Image()), e.onload = Qt, Cu.put(t, e.__cachedImgObj = { image: e, pending: [o] }), e.src = e.__zrImageSrc = t), e;}return t;}return e;}function Qt() {var t = this.__cachedImgObj;this.onload = this.__cachedImgObj = null;for (var e = 0; e < t.pending.length; e++) {var n = t.pending[e],i = n.cb;i && i(this, n.cbPayload), n.hostEl.dirty();}t.pending.length = 0;}function Jt(t) {return t && t.width && t.height;}function te(t, e) {var n = t + ":" + (e = e || Pu);if (Du[n]) return Du[n];for (var i = (t + "").split("\n"), r = 0, a = 0, o = i.length; a < o; a++) {r = Math.max(fe(i[a], e).width, r);}return ku > Au && (ku = 0, Du = {}), ku++, Du[n] = r, r;}function ee(t, e, n, i, r, a, o) {return a ? ie(t, e, n, i, r, a, o) : ne(t, e, n, i, r, o);}function ne(t, e, n, i, r, a) {var o = de(t, e, r, a),s = te(t, e);r && (s += r[1] + r[3]);var l = o.outerHeight,h = new Rt(re(0, s, n), ae(0, l, i), s, l);return h.lineHeight = o.lineHeight, h;}function ie(t, e, n, i, r, a, o) {var s = pe(t, { rich: a, truncate: o, font: e, textAlign: n, textPadding: r }),l = s.outerWidth,h = s.outerHeight;return new Rt(re(0, l, n), ae(0, h, i), l, h);}function re(t, e, n) {return "right" === n ? t -= e : "center" === n && (t -= e / 2), t;}function ae(t, e, n) {return "middle" === n ? t -= e / 2 : "bottom" === n && (t -= e), t;}function oe(t, e, n) {var i = e.x,r = e.y,a = e.height,o = e.width,s = a / 2,l = "left",h = "top";switch (t) {case "left":i -= n, r += s, l = "right", h = "middle";break;case "right":i += n + o, r += s, h = "middle";break;case "top":i += o / 2, r -= n, l = "center", h = "bottom";break;case "bottom":i += o / 2, r += a + n, l = "center";break;case "inside":i += o / 2, r += s, l = "center", h = "middle";break;case "insideLeft":i += n, r += s, h = "middle";break;case "insideRight":i += o - n, r += s, l = "right", h = "middle";break;case "insideTop":i += o / 2, r += n, l = "center";break;case "insideBottom":i += o / 2, r += a - n, l = "center", h = "bottom";break;case "insideTopLeft":i += n, r += n;break;case "insideTopRight":i += o - n, r += n, l = "right";break;case "insideBottomLeft":i += n, r += a - n, h = "bottom";break;case "insideBottomRight":i += o - n, r += a - n, l = "right", h = "bottom";}return { x: i, y: r, textAlign: l, textVerticalAlign: h };}function se(t, e, n, i, r) {if (!e) return "";var a = (t + "").split("\n");r = le(e, n, i, r);for (var o = 0, s = a.length; o < s; o++) {a[o] = he(a[o], r);}return a.join("\n");}function le(t, e, n, i) {(i = a({}, i)).font = e;var n = C(n, "...");i.maxIterations = C(i.maxIterations, 2);var r = i.minChar = C(i.minChar, 0);i.cnCharWidth = te("国", e);var o = i.ascCharWidth = te("a", e);i.placeholder = C(i.placeholder, "");for (var s = t = Math.max(0, t - 1), l = 0; l < r && s >= o; l++) {s -= o;}var h = te(n);return h > s && (n = "", h = 0), s = t - h, i.ellipsis = n, i.ellipsisWidth = h, i.contentWidth = s, i.containerWidth = t, i;}function he(t, e) {var n = e.containerWidth,i = e.font,r = e.contentWidth;if (!n) return "";var a = te(t, i);if (a <= n) return t;for (var o = 0;; o++) {if (a <= r || o >= e.maxIterations) {t += e.ellipsis;break;}var s = 0 === o ? ue(t, r, e.ascCharWidth, e.cnCharWidth) : a > 0 ? Math.floor(t.length * r / a) : 0;a = te(t = t.substr(0, s), i);}return "" === t && (t = e.placeholder), t;}function ue(t, e, n, i) {for (var r = 0, a = 0, o = t.length; a < o && r < e; a++) {var s = t.charCodeAt(a);r += 0 <= s && s <= 127 ? n : i;}return a;}function ce(t) {return te("国", t);}function fe(t, e) {return Ou.measureText(t, e);}function de(t, e, n, i) {null != t && (t += "");var r = ce(e),a = t ? t.split("\n") : [],o = a.length * r,s = o;if (n && (s += n[0] + n[2]), t && i) {var l = i.outerHeight,h = i.outerWidth;if (null != l && s > l) t = "", a = [];else if (null != h) for (var u = le(h - (n ? n[1] + n[3] : 0), e, i.ellipsis, { minChar: i.minChar, placeholder: i.placeholder }), c = 0, f = a.length; c < f; c++) {a[c] = he(a[c], u);}}return { lines: a, height: o, outerHeight: s, lineHeight: r };}function pe(t, e) {var n = { lines: [], width: 0, height: 0 };if (null != t && (t += ""), !t) return n;for (var i, r = Lu.lastIndex = 0; null != (i = Lu.exec(t));) {var a = i.index;a > r && ge(n, t.substring(r, a)), ge(n, i[2], i[1]), r = Lu.lastIndex;}r < t.length && ge(n, t.substring(r, t.length));var o = n.lines,s = 0,l = 0,h = [],u = e.textPadding,c = e.truncate,f = c && c.outerWidth,d = c && c.outerHeight;u && (null != f && (f -= u[1] + u[3]), null != d && (d -= u[0] + u[2]));for (A = 0; A < o.length; A++) {for (var p = o[A], g = 0, m = 0, v = 0; v < p.tokens.length; v++) {var y = (L = p.tokens[v]).styleName && e.rich[L.styleName] || {},_ = L.textPadding = y.textPadding,x = L.font = y.font || e.font,w = L.textHeight = C(y.textHeight, ce(x));if (_ && (w += _[0] + _[2]), L.height = w, L.lineHeight = D(y.textLineHeight, e.textLineHeight, w), L.textAlign = y && y.textAlign || e.textAlign, L.textVerticalAlign = y && y.textVerticalAlign || "middle", null != d && s + L.lineHeight > d) return { lines: [], width: 0, height: 0 };L.textWidth = te(L.text, x);var b = y.textWidth,M = null == b || "auto" === b;if ("string" == typeof b && "%" === b.charAt(b.length - 1)) L.percentWidth = b, h.push(L), b = 0;else {if (M) {b = L.textWidth;var S = y.textBackgroundColor,I = S && S.image;I && Jt(I = $t(I)) && (b = Math.max(b, I.width * w / I.height));}var T = _ ? _[1] + _[3] : 0;b += T;var k = null != f ? f - m : null;null != k && k < b && (!M || k < T ? (L.text = "", L.textWidth = b = 0) : (L.text = se(L.text, k - T, x, c.ellipsis, { minChar: c.minChar }), L.textWidth = te(L.text, x), b = L.textWidth + T));}m += L.width = b, y && (g = Math.max(g, L.lineHeight));}p.width = m, p.lineHeight = g, s += g, l = Math.max(l, m);}n.outerWidth = n.width = C(e.textWidth, l), n.outerHeight = n.height = C(e.textHeight, s), u && (n.outerWidth += u[1] + u[3], n.outerHeight += u[0] + u[2]);for (var A = 0; A < h.length; A++) {var L = h[A],P = L.percentWidth;L.width = parseInt(P, 10) / 100 * l;}return n;}function ge(t, e, n) {for (var i = "" === e, r = e.split("\n"), a = t.lines, o = 0; o < r.length; o++) {var s = r[o],l = { styleName: n, text: s, isLineHolder: !s && !i };if (o) a.push({ tokens: [l] });else {var h = (a[a.length - 1] || (a[0] = { tokens: [] })).tokens,u = h.length;1 === u && h[0].isLineHolder ? h[0] = l : (s || !u || i) && h.push(l);}}}function me(t) {var e = (t.fontSize || t.fontFamily) && [t.fontStyle, t.fontWeight, (t.fontSize || 12) + "px", t.fontFamily || "sans-serif"].join(" ");return e && P(e) || t.textFont || t.font;}function ve(t, e) {var n,i,r,a,o = e.x,s = e.y,l = e.width,h = e.height,u = e.r;l < 0 && (o += l, l = -l), h < 0 && (s += h, h = -h), "number" == typeof u ? n = i = r = a = u : u instanceof Array ? 1 === u.length ? n = i = r = a = u[0] : 2 === u.length ? (n = r = u[0], i = a = u[1]) : 3 === u.length ? (n = u[0], i = a = u[1], r = u[2]) : (n = u[0], i = u[1], r = u[2], a = u[3]) : n = i = r = a = 0;var c;n + i > l && (n *= l / (c = n + i), i *= l / c), r + a > l && (r *= l / (c = r + a), a *= l / c), i + r > h && (i *= h / (c = i + r), r *= h / c), n + a > h && (n *= h / (c = n + a), a *= h / c), t.moveTo(o + n, s), t.lineTo(o + l - i, s), 0 !== i && t.arc(o + l - i, s + i, i, -Math.PI / 2, 0), t.lineTo(o + l, s + h - r), 0 !== r && t.arc(o + l - r, s + h - r, r, 0, Math.PI / 2), t.lineTo(o + a, s + h), 0 !== a && t.arc(o + a, s + h - a, a, Math.PI / 2, Math.PI), t.lineTo(o, s + n), 0 !== n && t.arc(o + n, s + n, n, Math.PI, 1.5 * Math.PI);}function ye(t) {return _e(t), f(t.rich, _e), t;}function _e(t) {if (t) {t.font = me(t);var e = t.textAlign;"middle" === e && (e = "center"), t.textAlign = null == e || Eu[e] ? e : "left";var n = t.textVerticalAlign || t.textBaseline;"center" === n && (n = "middle"), t.textVerticalAlign = null == n || Nu[n] ? n : "top", t.textPadding && (t.textPadding = A(t.textPadding));}}function xe(t, e, n, i, r) {i.rich ? be(t, e, n, i, r) : we(t, e, n, i, r);}function we(t, e, n, i, r) {var a = Ae(e, "font", i.font || Pu),o = i.textPadding,s = t.__textCotentBlock;s && !t.__dirty || (s = t.__textCotentBlock = de(n, a, o, i.truncate));var l = s.outerHeight,h = s.lines,u = s.lineHeight,c = ke(l, i, r),f = c.baseX,d = c.baseY,p = c.textAlign,g = c.textVerticalAlign;Se(e, i, r, f, d);var m = ae(d, l, g),v = f,y = m,_ = Te(i);if (_ || o) {var x = te(n, a);o && (x += o[1] + o[3]);var w = re(f, x, p);_ && Ce(t, e, i, w, m, x, l), o && (v = Ee(f, p, o), y += o[0]);}Ae(e, "textAlign", p || "left"), Ae(e, "textBaseline", "middle"), Ae(e, "shadowBlur", i.textShadowBlur || 0), Ae(e, "shadowColor", i.textShadowColor || "transparent"), Ae(e, "shadowOffsetX", i.textShadowOffsetX || 0), Ae(e, "shadowOffsetY", i.textShadowOffsetY || 0), y += u / 2;var b = i.textStrokeWidth,M = Le(i.textStroke, b),S = Pe(i.textFill);M && (Ae(e, "lineWidth", b), Ae(e, "strokeStyle", M)), S && Ae(e, "fillStyle", S);for (var I = 0; I < h.length; I++) {M && e.strokeText(h[I], v, y), S && e.fillText(h[I], v, y), y += u;}}function be(t, e, n, i, r) {var a = t.__textCotentBlock;a && !t.__dirty || (a = t.__textCotentBlock = pe(n, i)), Me(t, e, a, i, r);}function Me(t, e, n, i, r) {var a = n.width,o = n.outerWidth,s = n.outerHeight,l = i.textPadding,h = ke(s, i, r),u = h.baseX,c = h.baseY,f = h.textAlign,d = h.textVerticalAlign;Se(e, i, r, u, c);var p = re(u, o, f),g = ae(c, s, d),m = p,v = g;l && (m += l[3], v += l[0]);var y = m + a;Te(i) && Ce(t, e, i, p, g, o, s);for (var _ = 0; _ < n.lines.length; _++) {for (var x, w = n.lines[_], b = w.tokens, M = b.length, S = w.lineHeight, I = w.width, T = 0, C = m, D = y, k = M - 1; T < M && (!(x = b[T]).textAlign || "left" === x.textAlign);) {Ie(t, e, x, i, S, v, C, "left"), I -= x.width, C += x.width, T++;}for (; k >= 0 && "right" === (x = b[k]).textAlign;) {Ie(t, e, x, i, S, v, D, "right"), I -= x.width, D -= x.width, k--;}for (C += (a - (C - m) - (y - D) - I) / 2; T <= k;) {Ie(t, e, x = b[T], i, S, v, C + x.width / 2, "center"), C += x.width, T++;}v += S;}}function Se(t, e, n, i, r) {if (n && e.textRotation) {var a = e.textOrigin;"center" === a ? (i = n.width / 2 + n.x, r = n.height / 2 + n.y) : a && (i = a[0] + n.x, r = a[1] + n.y), t.translate(i, r), t.rotate(-e.textRotation), t.translate(-i, -r);}}function Ie(t, e, n, i, r, a, o, s) {var l = i.rich[n.styleName] || {},h = n.textVerticalAlign,u = a + r / 2;"top" === h ? u = a + n.height / 2 : "bottom" === h && (u = a + r - n.height / 2), !n.isLineHolder && Te(l) && Ce(t, e, l, "right" === s ? o - n.width : "center" === s ? o - n.width / 2 : o, u - n.height / 2, n.width, n.height);var c = n.textPadding;c && (o = Ee(o, s, c), u -= n.height / 2 - c[2] - n.textHeight / 2), Ae(e, "shadowBlur", D(l.textShadowBlur, i.textShadowBlur, 0)), Ae(e, "shadowColor", l.textShadowColor || i.textShadowColor || "transparent"), Ae(e, "shadowOffsetX", D(l.textShadowOffsetX, i.textShadowOffsetX, 0)), Ae(e, "shadowOffsetY", D(l.textShadowOffsetY, i.textShadowOffsetY, 0)), Ae(e, "textAlign", s), Ae(e, "textBaseline", "middle"), Ae(e, "font", n.font || Pu);var f = Le(l.textStroke || i.textStroke, p),d = Pe(l.textFill || i.textFill),p = C(l.textStrokeWidth, i.textStrokeWidth);f && (Ae(e, "lineWidth", p), Ae(e, "strokeStyle", f), e.strokeText(n.text, o, u)), d && (Ae(e, "fillStyle", d), e.fillText(n.text, o, u));}function Te(t) {return t.textBackgroundColor || t.textBorderWidth && t.textBorderColor;}function Ce(t, e, n, i, r, a, o) {var s = n.textBackgroundColor,l = n.textBorderWidth,h = n.textBorderColor,u = x(s);if (Ae(e, "shadowBlur", n.textBoxShadowBlur || 0), Ae(e, "shadowColor", n.textBoxShadowColor || "transparent"), Ae(e, "shadowOffsetX", n.textBoxShadowOffsetX || 0), Ae(e, "shadowOffsetY", n.textBoxShadowOffsetY || 0), u || l && h) {e.beginPath();var c = n.textBorderRadius;c ? ve(e, { x: i, y: r, width: a, height: o, r: c }) : e.rect(i, r, a, o), e.closePath();}if (u) Ae(e, "fillStyle", s), e.fill();else if (w(s)) {var f = s.image;(f = Kt(f, null, t, De, s)) && Jt(f) && e.drawImage(f, i, r, a, o);}l && h && (Ae(e, "lineWidth", l), Ae(e, "strokeStyle", h), e.stroke());}function De(t, e) {e.image = t;}function ke(t, e, n) {var i = e.x || 0,r = e.y || 0,a = e.textAlign,o = e.textVerticalAlign;if (n) {var s = e.textPosition;if (s instanceof Array) i = n.x + Oe(s[0], n.width), r = n.y + Oe(s[1], n.height);else {var l = oe(s, n, e.textDistance);i = l.x, r = l.y, a = a || l.textAlign, o = o || l.textVerticalAlign;}var h = e.textOffset;h && (i += h[0], r += h[1]);}return { baseX: i, baseY: r, textAlign: a, textVerticalAlign: o };}function Ae(t, e, n) {return t[e] = yu(t, e, n), t[e];}function Le(t, e) {return null == t || e <= 0 || "transparent" === t || "none" === t ? null : t.image || t.colorStops ? "#000" : t;}function Pe(t) {return null == t || "none" === t ? null : t.image || t.colorStops ? "#000" : t;}function Oe(t, e) {return "string" == typeof t ? t.lastIndexOf("%") >= 0 ? parseFloat(t) / 100 * e : parseFloat(t) : t;}function Ee(t, e, n) {return "right" === e ? t - n[1] : "center" === e ? t + n[3] / 2 - n[1] / 2 : t + n[3];}function Ne(t, e) {return null != t && (t || e.textBackgroundColor || e.textBorderWidth && e.textBorderColor || e.textPadding);}function Re(t) {t = t || {}, hu.call(this, t);for (var e in t) {t.hasOwnProperty(e) && "style" !== e && (this[e] = t[e]);}this.style = new xu(t.style, this), this._rect = null, this.__clipPaths = [];}function Be(t) {Re.call(this, t);}function ze(t) {return parseInt(t, 10);}function Fe(t) {return !!t && (!!t.__builtin__ || "function" == typeof t.resize && "function" == typeof t.refresh);}function Ve(t, e, n) {return zu.copy(t.getBoundingRect()), t.transform && zu.applyTransform(t.transform), Fu.width = e, Fu.height = n, !zu.intersect(Fu);}function We(t, e) {if (t == e) return !1;if (!t || !e || t.length !== e.length) return !0;for (var n = 0; n < t.length; n++) {if (t[n] !== e[n]) return !0;}}function He(t, e) {for (var n = 0; n < t.length; n++) {var i = t[n];i.setTransform(e), e.beginPath(), i.buildPath(e, i.shape), e.clip(), i.restoreTransform(e);}}function Ge(t, e) {var n = document.createElement("div");return n.style.cssText = ["position:relative", "overflow:hidden", "width:" + t + "px", "height:" + e + "px", "padding:0", "margin:0", "border-width:0"].join(";") + ";", n;}function qe(t) {return t.getBoundingClientRect ? t.getBoundingClientRect() : { left: 0, top: 0 };}function Xe(t, e, n, i) {return n = n || {}, i || !_h.canvasSupported ? Ue(t, e, n) : _h.browser.firefox && null != e.layerX && e.layerX !== e.offsetX ? (n.zrX = e.layerX, n.zrY = e.layerY) : null != e.offsetX ? (n.zrX = e.offsetX, n.zrY = e.offsetY) : Ue(t, e, n), n;}function Ue(t, e, n) {var i = qe(t);n.zrX = e.clientX - i.left, n.zrY = e.clientY - i.top;}function Ye(t, e, n) {if (null != (e = e || window.event).zrX) return e;var i = e.type;if (i && i.indexOf("touch") >= 0) {var r = "touchend" != i ? e.targetTouches[0] : e.changedTouches[0];r && Xe(t, r, e, n);} else Xe(t, e, e, n), e.zrDelta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;var a = e.button;return null == e.which && void 0 !== a && Hu.test(e.type) && (e.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), e;}function je(t, e, n) {Wu ? t.addEventListener(e, n) : t.attachEvent("on" + e, n);}function Ze(t, e, n) {Wu ? t.removeEventListener(e, n) : t.detachEvent("on" + e, n);}function $e(t) {var e = t[1][0] - t[0][0],n = t[1][1] - t[0][1];return Math.sqrt(e * e + n * n);}function Ke(t) {return [(t[0][0] + t[1][0]) / 2, (t[0][1] + t[1][1]) / 2];}function Qe(t) {return "mousewheel" === t && _h.browser.firefox ? "DOMMouseScroll" : t;}function Je(t, e, n) {var i = t._gestureMgr;"start" === n && i.clear();var r = i.recognize(e, t.handler.findHover(e.zrX, e.zrY, null).target, t.dom);if ("end" === n && i.clear(), r) {var a = r.type;e.gestureEvent = a, t.handler.dispatchToElement({ target: r.target }, a, r.event);}}function tn(t) {t._touching = !0, clearTimeout(t._touchTimer), t._touchTimer = setTimeout(function () {t._touching = !1;}, 700);}function en(t) {var e = t.pointerType;return "pen" === e || "touch" === e;}function nn(t) {function e(t, e) {return function () {if (!e._touching) return t.apply(e, arguments);};}f(Yu, function (e) {t._handlers[e] = m($u[e], t);}), f(Zu, function (e) {t._handlers[e] = m($u[e], t);}), f(Uu, function (n) {t._handlers[n] = e($u[n], t);});}function rn(t) {function e(e, n) {f(e, function (e) {je(t, Qe(e), n._handlers[e]);}, n);}Bh.call(this), this.dom = t, this._touching = !1, this._touchTimer, this._gestureMgr = new qu(), this._handlers = {}, nn(this), _h.pointerEventsSupported ? e(Zu, this) : (_h.touchEventsSupported && e(Yu, this), e(Uu, this));}function an(t, e) {return new tc(vh(), t, e);}function on(t) {return t instanceof Array ? t : null == t ? [] : [t];}function sn(t, e, n) {if (t) {t[e] = t[e] || {}, t.emphasis = t.emphasis || {}, t.emphasis[e] = t.emphasis[e] || {};for (var i = 0, r = n.length; i < r; i++) {var a = n[i];!t.emphasis[e].hasOwnProperty(a) && t[e].hasOwnProperty(a) && (t.emphasis[e][a] = t[e][a]);}}}function ln(t) {return !nc(t) || ic(t) || t instanceof Date ? t : t.value;}function hn(t) {return nc(t) && !(t instanceof Array);}function un(t, e) {e = (e || []).slice();var n = d(t || [], function (t, e) {return { exist: t };});return ec(e, function (t, i) {if (nc(t)) {for (r = 0; r < n.length; r++) {if (!n[r].option && null != t.id && n[r].exist.id === t.id + "") return n[r].option = t, void (e[i] = null);}for (var r = 0; r < n.length; r++) {var a = n[r].exist;if (!(n[r].option || null != a.id && null != t.id || null == t.name || dn(t) || dn(a) || a.name !== t.name + "")) return n[r].option = t, void (e[i] = null);}}}), ec(e, function (t, e) {if (nc(t)) {for (var i = 0; i < n.length; i++) {var r = n[i].exist;if (!n[i].option && !dn(r) && null == t.id) {n[i].option = t;break;}}i >= n.length && n.push({ option: t });}}), n;}function cn(t) {var e = R();ec(t, function (t, n) {var i = t.exist;i && e.set(i.id, t);}), ec(t, function (t, n) {var i = t.option;L(!i || null == i.id || !e.get(i.id) || e.get(i.id) === t, "id duplicates: " + (i && i.id)), i && null != i.id && e.set(i.id, t), !t.keyInfo && (t.keyInfo = {});}), ec(t, function (t, n) {var i = t.exist,r = t.option,a = t.keyInfo;if (nc(r)) {if (a.name = null != r.name ? r.name + "" : i ? i.name : rc + n, i) a.id = i.id;else if (null != r.id) a.id = r.id + "";else {var o = 0;do {a.id = "\0" + a.name + "\0" + o++;} while (e.get(a.id));}e.set(a.id, t);}});}function fn(t) {var e = t.name;return !(!e || !e.indexOf(rc));}function dn(t) {return nc(t) && t.id && 0 === (t.id + "").indexOf("\0_ec_\0");}function pn(t, e) {return null != e.dataIndexInside ? e.dataIndexInside : null != e.dataIndex ? y(e.dataIndex) ? d(e.dataIndex, function (e) {return t.indexOfRawIndex(e);}) : t.indexOfRawIndex(e.dataIndex) : null != e.name ? y(e.name) ? d(e.name, function (e) {return t.indexOfName(e);}) : t.indexOfName(e.name) : void 0;}function gn() {var t = "__\0ec_inner_" + oc++ + "_" + Math.random().toFixed(5);return function (e) {return e[t] || (e[t] = {});};}function mn(t, e, n) {if (x(e)) {var i = {};i[e + "Index"] = 0, e = i;}var r = n && n.defaultMainType;!r || vn(e, r + "Index") || vn(e, r + "Id") || vn(e, r + "Name") || (e[r + "Index"] = 0);var a = {};return ec(e, function (i, r) {var i = e[r];if ("dataIndex" !== r && "dataIndexInside" !== r) {var o = r.match(/^(\w+)(Index|Id|Name)$/) || [],s = o[1],h = (o[2] || "").toLowerCase();if (!(!s || !h || null == i || "index" === h && "none" === i || n && n.includeMainTypes && l(n.includeMainTypes, s) < 0)) {var u = { mainType: s };"index" === h && "all" === i || (u[h] = i);var c = t.queryComponents(u);a[s + "Models"] = c, a[s + "Model"] = c[0];}} else a[r] = i;}), a;}function vn(t, e) {return t && t.hasOwnProperty(e);}function yn(t, e, n) {t.setAttribute ? t.setAttribute(e, n) : t[e] = n;}function _n(t, e) {return t.getAttribute ? t.getAttribute(e) : t[e];}function xn(t) {var e = { main: "", sub: "" };return t && (t = t.split(sc), e.main = t[0] || "", e.sub = t[1] || ""), e;}function wn(t) {L(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(t), 'componentType "' + t + '" illegal');}function bn(t, e) {t.$constructor = t, t.extend = function (t) {var e = this,n = function n() {t.$constructor ? t.$constructor.apply(this, arguments) : e.apply(this, arguments);};return a(n.prototype, t), n.extend = this.extend, n.superCall = Sn, n.superApply = In, h(n, this), n.superClass = e, n;};}function Mn(t) {var e = ["__\0is_clz", hc++, Math.random().toFixed(3)].join("_");t.prototype[e] = !0, t.isInstance = function (t) {return !(!t || !t[e]);};}function Sn(t, e) {var n = k(arguments, 2);return this.superClass.prototype[e].apply(t, n);}function In(t, e, n) {return this.superClass.prototype[e].apply(t, n);}function Tn(t, e) {function n(t) {var e = i[t.main];return e && e[lc] || ((e = i[t.main] = {})[lc] = !0), e;}e = e || {};var i = {};if (t.registerClass = function (t, e) {return e && (wn(e), (e = xn(e)).sub ? e.sub !== lc && (n(e)[e.sub] = t) : i[e.main] = t), t;}, t.getClass = function (t, e, n) {var r = i[t];if (r && r[lc] && (r = e ? r[e] : null), n && !r) throw new Error(e ? "Component " + t + "." + (e || "") + " not exists. Load it first." : t + ".type should be specified.");return r;}, t.getClassesByMainType = function (t) {t = xn(t);var e = [],n = i[t.main];return n && n[lc] ? f(n, function (t, n) {n !== lc && e.push(t);}) : e.push(n), e;}, t.hasClass = function (t) {return t = xn(t), !!i[t.main];}, t.getAllClassMainTypes = function () {var t = [];return f(i, function (e, n) {t.push(n);}), t;}, t.hasSubTypes = function (t) {t = xn(t);var e = i[t.main];return e && e[lc];}, t.parseClassType = xn, e.registerWhenExtend) {var r = t.extend;r && (t.extend = function (e) {var n = r.call(this, e);return t.registerClass(n, e.type);});}return t;}function Cn(t) {return t > -vc && t < vc;}function Dn(t) {return t > vc || t < -vc;}function kn(t, e, n, i, r) {var a = 1 - r;return a * a * (a * t + 3 * r * e) + r * r * (r * i + 3 * a * n);}function An(t, e, n, i, r) {var a = 1 - r;return 3 * (((e - t) * a + 2 * (n - e) * r) * a + (i - n) * r * r);}function Ln(t, e, n, i, r, a) {var o = i + 3 * (e - n) - t,s = 3 * (n - 2 * e + t),l = 3 * (e - t),h = t - r,u = s * s - 3 * o * l,c = s * l - 9 * o * h,f = l * l - 3 * s * h,d = 0;if (Cn(u) && Cn(c)) Cn(s) ? a[0] = 0 : (S = -l / s) >= 0 && S <= 1 && (a[d++] = S);else {var p = c * c - 4 * u * f;if (Cn(p)) {var g = c / u,m = -g / 2;(S = -s / o + g) >= 0 && S <= 1 && (a[d++] = S), m >= 0 && m <= 1 && (a[d++] = m);} else if (p > 0) {var v = mc(p),y = u * s + 1.5 * o * (-c + v),_ = u * s + 1.5 * o * (-c - v);(S = (-s - ((y = y < 0 ? -gc(-y, xc) : gc(y, xc)) + (_ = _ < 0 ? -gc(-_, xc) : gc(_, xc)))) / (3 * o)) >= 0 && S <= 1 && (a[d++] = S);} else {var x = (2 * u * s - 3 * o * c) / (2 * mc(u * u * u)),w = Math.acos(x) / 3,b = mc(u),M = Math.cos(w),S = (-s - 2 * b * M) / (3 * o),m = (-s + b * (M + _c * Math.sin(w))) / (3 * o),I = (-s + b * (M - _c * Math.sin(w))) / (3 * o);S >= 0 && S <= 1 && (a[d++] = S), m >= 0 && m <= 1 && (a[d++] = m), I >= 0 && I <= 1 && (a[d++] = I);}}return d;}function Pn(t, e, n, i, r) {var a = 6 * n - 12 * e + 6 * t,o = 9 * e + 3 * i - 3 * t - 9 * n,s = 3 * e - 3 * t,l = 0;if (Cn(o)) Dn(a) && (c = -s / a) >= 0 && c <= 1 && (r[l++] = c);else {var h = a * a - 4 * o * s;if (Cn(h)) r[0] = -a / (2 * o);else if (h > 0) {var u = mc(h),c = (-a + u) / (2 * o),f = (-a - u) / (2 * o);c >= 0 && c <= 1 && (r[l++] = c), f >= 0 && f <= 1 && (r[l++] = f);}}return l;}function On(t, e, n, i, r, a) {var o = (e - t) * r + t,s = (n - e) * r + e,l = (i - n) * r + n,h = (s - o) * r + o,u = (l - s) * r + s,c = (u - h) * r + h;a[0] = t, a[1] = o, a[2] = h, a[3] = c, a[4] = c, a[5] = u, a[6] = l, a[7] = i;}function En(t, e, n, i, r, a, o, s, l, h, u) {var c,f,d,p,g,m = .005,v = 1 / 0;wc[0] = l, wc[1] = h;for (var y = 0; y < 1; y += .05) {bc[0] = kn(t, n, r, o, y), bc[1] = kn(e, i, a, s, y), (p = Nh(wc, bc)) < v && (c = y, v = p);}v = 1 / 0;for (var _ = 0; _ < 32 && !(m < yc); _++) {f = c - m, d = c + m, bc[0] = kn(t, n, r, o, f), bc[1] = kn(e, i, a, s, f), p = Nh(bc, wc), f >= 0 && p < v ? (c = f, v = p) : (Mc[0] = kn(t, n, r, o, d), Mc[1] = kn(e, i, a, s, d), g = Nh(Mc, wc), d <= 1 && g < v ? (c = d, v = g) : m *= .5);}return u && (u[0] = kn(t, n, r, o, c), u[1] = kn(e, i, a, s, c)), mc(v);}function Nn(t, e, n, i) {var r = 1 - i;return r * (r * t + 2 * i * e) + i * i * n;}function Rn(t, e, n, i) {return 2 * ((1 - i) * (e - t) + i * (n - e));}function Bn(t, e, n, i, r) {var a = t - 2 * e + n,o = 2 * (e - t),s = t - i,l = 0;if (Cn(a)) Dn(o) && (c = -s / o) >= 0 && c <= 1 && (r[l++] = c);else {var h = o * o - 4 * a * s;if (Cn(h)) (c = -o / (2 * a)) >= 0 && c <= 1 && (r[l++] = c);else if (h > 0) {var u = mc(h),c = (-o + u) / (2 * a),f = (-o - u) / (2 * a);c >= 0 && c <= 1 && (r[l++] = c), f >= 0 && f <= 1 && (r[l++] = f);}}return l;}function zn(t, e, n) {var i = t + n - 2 * e;return 0 === i ? .5 : (t - e) / i;}function Fn(t, e, n, i, r) {var a = (e - t) * i + t,o = (n - e) * i + e,s = (o - a) * i + a;r[0] = t, r[1] = a, r[2] = s, r[3] = s, r[4] = o, r[5] = n;}function Vn(t, e, n, i, r, a, o, s, l) {var h,u = .005,c = 1 / 0;wc[0] = o, wc[1] = s;for (var f = 0; f < 1; f += .05) {bc[0] = Nn(t, n, r, f), bc[1] = Nn(e, i, a, f), (m = Nh(wc, bc)) < c && (h = f, c = m);}c = 1 / 0;for (var d = 0; d < 32 && !(u < yc); d++) {var p = h - u,g = h + u;bc[0] = Nn(t, n, r, p), bc[1] = Nn(e, i, a, p);var m = Nh(bc, wc);if (p >= 0 && m < c) h = p, c = m;else {Mc[0] = Nn(t, n, r, g), Mc[1] = Nn(e, i, a, g);var v = Nh(Mc, wc);g <= 1 && v < c ? (h = g, c = v) : u *= .5;}}return l && (l[0] = Nn(t, n, r, h), l[1] = Nn(e, i, a, h)), mc(c);}function Wn(t, e, n, i, r, a) {r[0] = Sc(t, n), r[1] = Sc(e, i), a[0] = Ic(t, n), a[1] = Ic(e, i);}function Hn(t, e, n, i, r, a, o, s, l, h) {var u,c = Pn,f = kn,d = c(t, n, r, o, Pc);for (l[0] = 1 / 0, l[1] = 1 / 0, h[0] = -1 / 0, h[1] = -1 / 0, u = 0; u < d; u++) {var p = f(t, n, r, o, Pc[u]);l[0] = Sc(p, l[0]), h[0] = Ic(p, h[0]);}for (d = c(e, i, a, s, Oc), u = 0; u < d; u++) {var g = f(e, i, a, s, Oc[u]);l[1] = Sc(g, l[1]), h[1] = Ic(g, h[1]);}l[0] = Sc(t, l[0]), h[0] = Ic(t, h[0]), l[0] = Sc(o, l[0]), h[0] = Ic(o, h[0]), l[1] = Sc(e, l[1]), h[1] = Ic(e, h[1]), l[1] = Sc(s, l[1]), h[1] = Ic(s, h[1]);}function Gn(t, e, n, i, r, a, o, s) {var l = zn,h = Nn,u = Ic(Sc(l(t, n, r), 1), 0),c = Ic(Sc(l(e, i, a), 1), 0),f = h(t, n, r, u),d = h(e, i, a, c);o[0] = Sc(t, r, f), o[1] = Sc(e, a, d), s[0] = Ic(t, r, f), s[1] = Ic(e, a, d);}function qn(t, e, n, i, r, a, o, s, l) {var h = j,u = Z,c = Math.abs(r - a);if (c % Dc < 1e-4 && c > 1e-4) return s[0] = t - n, s[1] = e - i, l[0] = t + n, void (l[1] = e + i);if (kc[0] = Cc(r) * n + t, kc[1] = Tc(r) * i + e, Ac[0] = Cc(a) * n + t, Ac[1] = Tc(a) * i + e, h(s, kc, Ac), u(l, kc, Ac), (r %= Dc) < 0 && (r += Dc), (a %= Dc) < 0 && (a += Dc), r > a && !o ? a += Dc : r < a && o && (r += Dc), o) {var f = a;a = r, r = f;}for (var d = 0; d < a; d += Math.PI / 2) {d > r && (Lc[0] = Cc(d) * n + t, Lc[1] = Tc(d) * i + e, h(s, Lc, s), u(l, Lc, l));}}function Xn(t, e, n, i, r, a, o) {if (0 === r) return !1;var s = r,l = 0,h = t;if (o > e + s && o > i + s || o < e - s && o < i - s || a > t + s && a > n + s || a < t - s && a < n - s) return !1;if (t === n) return Math.abs(a - t) <= s / 2;var u = (l = (e - i) / (t - n)) * a - o + (h = (t * i - n * e) / (t - n));return u * u / (l * l + 1) <= s / 2 * s / 2;}function Un(t, e, n, i, r, a, o, s, l, h, u) {if (0 === l) return !1;var c = l;return !(u > e + c && u > i + c && u > a + c && u > s + c || u < e - c && u < i - c && u < a - c && u < s - c || h > t + c && h > n + c && h > r + c && h > o + c || h < t - c && h < n - c && h < r - c && h < o - c) && En(t, e, n, i, r, a, o, s, h, u, null) <= c / 2;}function Yn(t, e, n, i, r, a, o, s, l) {if (0 === o) return !1;var h = o;return !(l > e + h && l > i + h && l > a + h || l < e - h && l < i - h && l < a - h || s > t + h && s > n + h && s > r + h || s < t - h && s < n - h && s < r - h) && Vn(t, e, n, i, r, a, s, l, null) <= h / 2;}function jn(t) {return (t %= Yc) < 0 && (t += Yc), t;}function Zn(t, e, n, i, r, a, o, s, l) {if (0 === o) return !1;var h = o;s -= t, l -= e;var u = Math.sqrt(s * s + l * l);if (u - h > n || u + h < n) return !1;if (Math.abs(i - r) % jc < 1e-4) return !0;if (a) {var c = i;i = jn(r), r = jn(c);} else i = jn(i), r = jn(r);i > r && (r += jc);var f = Math.atan2(l, s);return f < 0 && (f += jc), f >= i && f <= r || f + jc >= i && f + jc <= r;}function $n(t, e, n, i, r, a) {if (a > e && a > i || a < e && a < i) return 0;if (i === e) return 0;var o = i < e ? 1 : -1,s = (a - e) / (i - e);1 !== s && 0 !== s || (o = i < e ? .5 : -.5);var l = s * (n - t) + t;return l === r ? 1 / 0 : l > r ? o : 0;}function Kn(t, e) {return Math.abs(t - e) < Kc;}function Qn() {var t = Jc[0];Jc[0] = Jc[1], Jc[1] = t;}function Jn(t, e, n, i, r, a, o, s, l, h) {if (h > e && h > i && h > a && h > s || h < e && h < i && h < a && h < s) return 0;var u = Ln(e, i, a, s, h, Qc);if (0 === u) return 0;for (var c, f, d = 0, p = -1, g = 0; g < u; g++) {var m = Qc[g],v = 0 === m || 1 === m ? .5 : 1;kn(t, n, r, o, m) < l || (p < 0 && (p = Pn(e, i, a, s, Jc), Jc[1] < Jc[0] && p > 1 && Qn(), c = kn(e, i, a, s, Jc[0]), p > 1 && (f = kn(e, i, a, s, Jc[1]))), 2 == p ? m < Jc[0] ? d += c < e ? v : -v : m < Jc[1] ? d += f < c ? v : -v : d += s < f ? v : -v : m < Jc[0] ? d += c < e ? v : -v : d += s < c ? v : -v);}return d;}function ti(t, e, n, i, r, a, o, s) {if (s > e && s > i && s > a || s < e && s < i && s < a) return 0;var l = Bn(e, i, a, s, Qc);if (0 === l) return 0;var h = zn(e, i, a);if (h >= 0 && h <= 1) {for (var u = 0, c = Nn(e, i, a, h), f = 0; f < l; f++) {d = 0 === Qc[f] || 1 === Qc[f] ? .5 : 1;(p = Nn(t, n, r, Qc[f])) < o || (Qc[f] < h ? u += c < e ? d : -d : u += a < c ? d : -d);}return u;}var d = 0 === Qc[0] || 1 === Qc[0] ? .5 : 1,p = Nn(t, n, r, Qc[0]);return p < o ? 0 : a < e ? d : -d;}function ei(t, e, n, i, r, a, o, s) {if ((s -= e) > n || s < -n) return 0;h = Math.sqrt(n * n - s * s);Qc[0] = -h, Qc[1] = h;var l = Math.abs(i - r);if (l < 1e-4) return 0;if (l % $c < 1e-4) {i = 0, r = $c;p = a ? 1 : -1;return o >= Qc[0] + t && o <= Qc[1] + t ? p : 0;}if (a) {var h = i;i = jn(r), r = jn(h);} else i = jn(i), r = jn(r);i > r && (r += $c);for (var u = 0, c = 0; c < 2; c++) {var f = Qc[c];if (f + t > o) {var d = Math.atan2(s, f),p = a ? 1 : -1;d < 0 && (d = $c + d), (d >= i && d <= r || d + $c >= i && d + $c <= r) && (d > Math.PI / 2 && d < 1.5 * Math.PI && (p = -p), u += p);}}return u;}function ni(t, e, n, i, r) {for (var a = 0, o = 0, s = 0, l = 0, h = 0, u = 0; u < t.length;) {var c = t[u++];switch (c === Zc.M && u > 1 && (n || (a += $n(o, s, l, h, i, r))), 1 == u && (l = o = t[u], h = s = t[u + 1]), c) {case Zc.M:o = l = t[u++], s = h = t[u++];break;case Zc.L:if (n) {if (Xn(o, s, t[u], t[u + 1], e, i, r)) return !0;} else a += $n(o, s, t[u], t[u + 1], i, r) || 0;o = t[u++], s = t[u++];break;case Zc.C:if (n) {if (Un(o, s, t[u++], t[u++], t[u++], t[u++], t[u], t[u + 1], e, i, r)) return !0;} else a += Jn(o, s, t[u++], t[u++], t[u++], t[u++], t[u], t[u + 1], i, r) || 0;o = t[u++], s = t[u++];break;case Zc.Q:if (n) {if (Yn(o, s, t[u++], t[u++], t[u], t[u + 1], e, i, r)) return !0;} else a += ti(o, s, t[u++], t[u++], t[u], t[u + 1], i, r) || 0;o = t[u++], s = t[u++];break;case Zc.A:var f = t[u++],d = t[u++],p = t[u++],g = t[u++],m = t[u++],v = t[u++],y = (t[u++], 1 - t[u++]),_ = Math.cos(m) * p + f,x = Math.sin(m) * g + d;u > 1 ? a += $n(o, s, _, x, i, r) : (l = _, h = x);var w = (i - f) * g / p + f;if (n) {if (Zn(f, d, g, m, m + v, y, e, w, r)) return !0;} else a += ei(f, d, g, m, m + v, y, w, r);o = Math.cos(m + v) * p + f, s = Math.sin(m + v) * g + d;break;case Zc.R:l = o = t[u++], h = s = t[u++];var _ = l + t[u++],x = h + t[u++];if (n) {if (Xn(l, h, _, h, e, i, r) || Xn(_, h, _, x, e, i, r) || Xn(_, x, l, x, e, i, r) || Xn(l, x, l, h, e, i, r)) return !0;} else a += $n(_, h, _, x, i, r), a += $n(l, x, l, h, i, r);break;case Zc.Z:if (n) {if (Xn(o, s, l, h, e, i, r)) return !0;} else a += $n(o, s, l, h, i, r);o = l, s = h;}}return n || Kn(s, h) || (a += $n(o, s, l, h, i, r) || 0), 0 !== a;}function ii(t, e, n) {return ni(t, 0, !1, e, n);}function ri(t, e, n, i) {return ni(t, e, !0, n, i);}function ai(t) {Re.call(this, t), this.path = null;}function oi(t, e, n, i, r, a, o, s, l, h, u) {var c = l * (df / 180),f = ff(c) * (t - n) / 2 + cf(c) * (e - i) / 2,d = -1 * cf(c) * (t - n) / 2 + ff(c) * (e - i) / 2,p = f * f / (o * o) + d * d / (s * s);p > 1 && (o *= uf(p), s *= uf(p));var g = (r === a ? -1 : 1) * uf((o * o * (s * s) - o * o * (d * d) - s * s * (f * f)) / (o * o * (d * d) + s * s * (f * f))) || 0,m = g * o * d / s,v = g * -s * f / o,y = (t + n) / 2 + ff(c) * m - cf(c) * v,_ = (e + i) / 2 + cf(c) * m + ff(c) * v,x = mf([1, 0], [(f - m) / o, (d - v) / s]),w = [(f - m) / o, (d - v) / s],b = [(-1 * f - m) / o, (-1 * d - v) / s],M = mf(w, b);gf(w, b) <= -1 && (M = df), gf(w, b) >= 1 && (M = 0), 0 === a && M > 0 && (M -= 2 * df), 1 === a && M < 0 && (M += 2 * df), u.addData(h, y, _, o, s, x, M, c, a);}function si(t) {if (!t) return [];var e,n = t.replace(/-/g, " -").replace(/  /g, " ").replace(/ /g, ",").replace(/,,/g, ",");for (e = 0; e < hf.length; e++) {n = n.replace(new RegExp(hf[e], "g"), "|" + hf[e]);}var i,r = n.split("|"),a = 0,o = 0,s = new Uc(),l = Uc.CMD;for (e = 1; e < r.length; e++) {var h,u = r[e],c = u.charAt(0),f = 0,d = u.slice(1).replace(/e,-/g, "e-").split(",");d.length > 0 && "" === d[0] && d.shift();for (var p = 0; p < d.length; p++) {d[p] = parseFloat(d[p]);}for (; f < d.length && !isNaN(d[f]) && !isNaN(d[0]);) {var g,m,v,y,_,x,w,b = a,M = o;switch (c) {case "l":a += d[f++], o += d[f++], h = l.L, s.addData(h, a, o);break;case "L":a = d[f++], o = d[f++], h = l.L, s.addData(h, a, o);break;case "m":a += d[f++], o += d[f++], h = l.M, s.addData(h, a, o), c = "l";break;case "M":a = d[f++], o = d[f++], h = l.M, s.addData(h, a, o), c = "L";break;case "h":a += d[f++], h = l.L, s.addData(h, a, o);break;case "H":a = d[f++], h = l.L, s.addData(h, a, o);break;case "v":o += d[f++], h = l.L, s.addData(h, a, o);break;case "V":o = d[f++], h = l.L, s.addData(h, a, o);break;case "C":h = l.C, s.addData(h, d[f++], d[f++], d[f++], d[f++], d[f++], d[f++]), a = d[f - 2], o = d[f - 1];break;case "c":h = l.C, s.addData(h, d[f++] + a, d[f++] + o, d[f++] + a, d[f++] + o, d[f++] + a, d[f++] + o), a += d[f - 2], o += d[f - 1];break;case "S":g = a, m = o;var S = s.len(),I = s.data;i === l.C && (g += a - I[S - 4], m += o - I[S - 3]), h = l.C, b = d[f++], M = d[f++], a = d[f++], o = d[f++], s.addData(h, g, m, b, M, a, o);break;case "s":g = a, m = o;var S = s.len(),I = s.data;i === l.C && (g += a - I[S - 4], m += o - I[S - 3]), h = l.C, b = a + d[f++], M = o + d[f++], a += d[f++], o += d[f++], s.addData(h, g, m, b, M, a, o);break;case "Q":b = d[f++], M = d[f++], a = d[f++], o = d[f++], h = l.Q, s.addData(h, b, M, a, o);break;case "q":b = d[f++] + a, M = d[f++] + o, a += d[f++], o += d[f++], h = l.Q, s.addData(h, b, M, a, o);break;case "T":g = a, m = o;var S = s.len(),I = s.data;i === l.Q && (g += a - I[S - 4], m += o - I[S - 3]), a = d[f++], o = d[f++], h = l.Q, s.addData(h, g, m, a, o);break;case "t":g = a, m = o;var S = s.len(),I = s.data;i === l.Q && (g += a - I[S - 4], m += o - I[S - 3]), a += d[f++], o += d[f++], h = l.Q, s.addData(h, g, m, a, o);break;case "A":v = d[f++], y = d[f++], _ = d[f++], x = d[f++], w = d[f++], oi(b = a, M = o, a = d[f++], o = d[f++], x, w, v, y, _, h = l.A, s);break;case "a":v = d[f++], y = d[f++], _ = d[f++], x = d[f++], w = d[f++], oi(b = a, M = o, a += d[f++], o += d[f++], x, w, v, y, _, h = l.A, s);}}"z" !== c && "Z" !== c || (h = l.Z, s.addData(h)), i = h;}return s.toStatic(), s;}function li(t, e) {var n = si(t);return e = e || {}, e.buildPath = function (t) {if (t.setData) t.setData(n.data), (e = t.getContext()) && t.rebuildPath(e);else {var e = t;n.rebuildPath(e);}}, e.applyTransform = function (t) {lf(n, t), this.dirty(!0);}, e;}function hi(t, e) {return new ai(li(t, e));}function ui(t, e) {return ai.extend(li(t, e));}function ci(t, e, n, i, r, a, o) {var s = .5 * (n - t),l = .5 * (i - e);return (2 * (e - n) + s + l) * o + (-3 * (e - n) - 2 * s - l) * a + s * r + e;}function fi(t, e, n) {var i = e.points,r = e.smooth;if (i && i.length >= 2) {if (r && "spline" !== r) {var a = Sf(i, r, n, e.smoothConstraint);t.moveTo(i[0][0], i[0][1]);for (var o = i.length, s = 0; s < (n ? o : o - 1); s++) {var l = a[2 * s],h = a[2 * s + 1],u = i[(s + 1) % o];t.bezierCurveTo(l[0], l[1], h[0], h[1], u[0], u[1]);}} else {"spline" === r && (i = Mf(i, n)), t.moveTo(i[0][0], i[0][1]);for (var s = 1, c = i.length; s < c; s++) {t.lineTo(i[s][0], i[s][1]);}}n && t.closePath();}}function di(t, e, n) {var i = t.cpx2,r = t.cpy2;return null === i || null === r ? [(n ? An : kn)(t.x1, t.cpx1, t.cpx2, t.x2, e), (n ? An : kn)(t.y1, t.cpy1, t.cpy2, t.y2, e)] : [(n ? Rn : Nn)(t.x1, t.cpx1, t.x2, e), (n ? Rn : Nn)(t.y1, t.cpy1, t.y2, e)];}function pi(t) {Re.call(this, t), this._displayables = [], this._temporaryDisplayables = [], this._cursor = 0, this.notClear = !0;}function gi(t) {return ai.extend(t);}function mi(t, e, n, i) {var r = hi(t, e),a = r.getBoundingRect();return n && ("center" === i && (n = yi(n, a)), _i(r, n)), r;}function vi(t, e, n) {var i = new Be({ style: { image: t, x: e.x, y: e.y, width: e.width, height: e.height }, onload: function onload(t) {if ("center" === n) {var r = { width: t.width, height: t.height };i.setStyle(yi(e, r));}} });return i;}function yi(t, e) {var n,i = e.width / e.height,r = t.height * i;return n = r <= t.width ? t.height : (r = t.width) / i, { x: t.x + t.width / 2 - r / 2, y: t.y + t.height / 2 - n / 2, width: r, height: n };}function _i(t, e) {if (t.applyTransform) {var n = t.getBoundingRect().calculateTransform(e);t.applyTransform(n);}}function xi(t) {var e = t.shape,n = t.style.lineWidth;return Bf(2 * e.x1) === Bf(2 * e.x2) && (e.x1 = e.x2 = wi(e.x1, n, !0)), Bf(2 * e.y1) === Bf(2 * e.y2) && (e.y1 = e.y2 = wi(e.y1, n, !0)), t;}function wi(t, e, n) {var i = Bf(2 * t);return (i + Bf(e)) % 2 == 0 ? i / 2 : (i + (n ? 1 : -1)) / 2;}function bi(t) {return null != t && "none" != t;}function Mi(t) {return "string" == typeof t ? wt(t, -.1) : t;}function Si(t) {if (t.__hoverStlDirty) {var e = t.style.stroke,n = t.style.fill,i = t.__hoverStl;i.fill = i.fill || (bi(n) ? Mi(n) : null), i.stroke = i.stroke || (bi(e) ? Mi(e) : null);var r = {};for (var a in i) {null != i[a] && (r[a] = t.style[a]);}t.__normalStl = r, t.__hoverStlDirty = !1;}}function Ii(t) {if (!t.__isHover) {if (Si(t), t.useHoverLayer) t.__zr && t.__zr.addHover(t, t.__hoverStl);else {var e = t.style,n = e.insideRollbackOpt;n && Hi(e), e.extendFrom(t.__hoverStl), n && (Wi(e, e.insideOriginalTextPosition, n), null == e.textFill && (e.textFill = n.autoColor)), t.dirty(!1), t.z2 += 1;}t.__isHover = !0;}}function Ti(t) {if (t.__isHover) {var e = t.__normalStl;t.useHoverLayer ? t.__zr && t.__zr.removeHover(t) : (e && t.setStyle(e), t.z2 -= 1), t.__isHover = !1;}}function Ci(t) {"group" === t.type ? t.traverse(function (t) {"group" !== t.type && Ii(t);}) : Ii(t);}function Di(t) {"group" === t.type ? t.traverse(function (t) {"group" !== t.type && Ti(t);}) : Ti(t);}function ki(t, e) {t.__hoverStl = t.hoverStyle || e || {}, t.__hoverStlDirty = !0, t.__isHover && Si(t);}function Ai(t) {this.__hoverSilentOnTouch && t.zrByTouch || !this.__isEmphasis && Ci(this);}function Li(t) {this.__hoverSilentOnTouch && t.zrByTouch || !this.__isEmphasis && Di(this);}function Pi() {this.__isEmphasis = !0, Ci(this);}function Oi() {this.__isEmphasis = !1, Di(this);}function Ei(t, e, n) {t.__hoverSilentOnTouch = n && n.hoverSilentOnTouch, "group" === t.type ? t.traverse(function (t) {"group" !== t.type && ki(t, e);}) : ki(t, e), t.on("mouseover", Ai).on("mouseout", Li), t.on("emphasis", Pi).on("normal", Oi);}function Ni(t, e, n, i, r, a, o) {var s,l = (r = r || Vf).labelFetcher,h = r.labelDataIndex,u = r.labelDimIndex,c = n.getShallow("show"),f = i.getShallow("show");(c || f) && (l && (s = l.getFormattedLabel(h, "normal", null, u)), null == s && (s = _(r.defaultText) ? r.defaultText(h, r) : r.defaultText));var d = c ? s : null,p = f ? C(l ? l.getFormattedLabel(h, "emphasis", null, u) : null, s) : null;null == d && null == p || (Ri(t, n, a, r), Ri(e, i, o, r, !0)), t.text = d, e.text = p;}function Ri(t, e, n, i, r) {return Bi(t, e, i, r), n && a(t, n), t.host && t.host.dirty && t.host.dirty(!1), t;}function Bi(t, e, n, i) {if ((n = n || Vf).isRectText) {var r = e.getShallow("position") || (i ? null : "inside");"outside" === r && (r = "top"), t.textPosition = r, t.textOffset = e.getShallow("offset");var a = e.getShallow("rotate");null != a && (a *= Math.PI / 180), t.textRotation = a, t.textDistance = C(e.getShallow("distance"), i ? null : 5);}var o,s = e.ecModel,l = s && s.option.textStyle,h = zi(e);if (h) {o = {};for (var u in h) {if (h.hasOwnProperty(u)) {var c = e.getModel(["rich", u]);Fi(o[u] = {}, c, l, n, i);}}}return t.rich = o, Fi(t, e, l, n, i, !0), n.forceRich && !n.textStyle && (n.textStyle = {}), t;}function zi(t) {for (var e; t && t !== t.ecModel;) {var n = (t.option || Vf).rich;if (n) {e = e || {};for (var i in n) {n.hasOwnProperty(i) && (e[i] = 1);}}t = t.parentModel;}return e;}function Fi(t, e, n, i, r, a) {if (n = !r && n || Vf, t.textFill = Vi(e.getShallow("color"), i) || n.color, t.textStroke = Vi(e.getShallow("textBorderColor"), i) || n.textBorderColor, t.textStrokeWidth = C(e.getShallow("textBorderWidth"), n.textBorderWidth), !r) {if (a) {var o = t.textPosition;t.insideRollback = Wi(t, o, i), t.insideOriginalTextPosition = o, t.insideRollbackOpt = i;}null == t.textFill && (t.textFill = i.autoColor);}t.fontStyle = e.getShallow("fontStyle") || n.fontStyle, t.fontWeight = e.getShallow("fontWeight") || n.fontWeight, t.fontSize = e.getShallow("fontSize") || n.fontSize, t.fontFamily = e.getShallow("fontFamily") || n.fontFamily, t.textAlign = e.getShallow("align"), t.textVerticalAlign = e.getShallow("verticalAlign") || e.getShallow("baseline"), t.textLineHeight = e.getShallow("lineHeight"), t.textWidth = e.getShallow("width"), t.textHeight = e.getShallow("height"), t.textTag = e.getShallow("tag"), a && i.disableBox || (t.textBackgroundColor = Vi(e.getShallow("backgroundColor"), i), t.textPadding = e.getShallow("padding"), t.textBorderColor = Vi(e.getShallow("borderColor"), i), t.textBorderWidth = e.getShallow("borderWidth"), t.textBorderRadius = e.getShallow("borderRadius"), t.textBoxShadowColor = e.getShallow("shadowColor"), t.textBoxShadowBlur = e.getShallow("shadowBlur"), t.textBoxShadowOffsetX = e.getShallow("shadowOffsetX"), t.textBoxShadowOffsetY = e.getShallow("shadowOffsetY")), t.textShadowColor = e.getShallow("textShadowColor") || n.textShadowColor, t.textShadowBlur = e.getShallow("textShadowBlur") || n.textShadowBlur, t.textShadowOffsetX = e.getShallow("textShadowOffsetX") || n.textShadowOffsetX, t.textShadowOffsetY = e.getShallow("textShadowOffsetY") || n.textShadowOffsetY;}function Vi(t, e) {return "auto" !== t ? t : e && e.autoColor ? e.autoColor : null;}function Wi(t, e, n) {var i,r = n.useInsideStyle;return null == t.textFill && !1 !== r && (!0 === r || n.isRectText && e && "string" == typeof e && e.indexOf("inside") >= 0) && (i = { textFill: null, textStroke: t.textStroke, textStrokeWidth: t.textStrokeWidth }, t.textFill = "#fff", null == t.textStroke && (t.textStroke = n.autoColor, null == t.textStrokeWidth && (t.textStrokeWidth = 2))), i;}function Hi(t) {var e = t.insideRollback;e && (t.textFill = e.textFill, t.textStroke = e.textStroke, t.textStrokeWidth = e.textStrokeWidth);}function Gi(t, e) {var n = e || e.getModel("textStyle");return P([t.fontStyle || n && n.getShallow("fontStyle") || "", t.fontWeight || n && n.getShallow("fontWeight") || "", (t.fontSize || n && n.getShallow("fontSize") || 12) + "px", t.fontFamily || n && n.getShallow("fontFamily") || "sans-serif"].join(" "));}function qi(t, e, n, i, r, a) {if ("function" == typeof r && (a = r, r = null), i && i.isAnimationEnabled()) {var o = t ? "Update" : "",s = i.getShallow("animationDuration" + o),l = i.getShallow("animationEasing" + o),h = i.getShallow("animationDelay" + o);"function" == typeof h && (h = h(r, i.getAnimationDelayParams ? i.getAnimationDelayParams(e, r) : null)), "function" == typeof s && (s = s(r)), s > 0 ? e.animateTo(n, s, h || 0, l, a, !!a) : (e.stopAnimation(), e.attr(n), a && a());} else e.stopAnimation(), e.attr(n), a && a();}function Xi(t, e, n, i, r) {qi(!0, t, e, n, i, r);}function Ui(t, e, n, i, r) {qi(!1, t, e, n, i, r);}function Yi(t, e, n) {return e && !c(e) && (e = qh.getLocalTransform(e)), n && (e = lt([], e)), Y([], t, e);}function ji(t, e, n, i) {function r(t) {var e = { position: F(t.position), rotation: t.rotation };return t.shape && (e.shape = a({}, t.shape)), e;}if (t && e) {var o = function (t) {var e = {};return t.traverse(function (t) {!t.isGroup && t.anid && (e[t.anid] = t);}), e;}(t);e.traverse(function (t) {if (!t.isGroup && t.anid) {var e = o[t.anid];if (e) {var i = r(t);t.attr(r(e)), Xi(t, i, n, t.dataIndex);}}});}}function Zi(t, e, n) {this.parentModel = e, this.ecModel = n, this.option = t;}function $i(t, e, n) {for (var i = 0; i < e.length && (!e[i] || null != (t = t && "object" == typeof t ? t[e[i]] : null)); i++) {;}return null == t && n && (t = n.get(e)), t;}function Ki(t, e) {var n = Yf(t).getParent;return n ? n.call(t, e) : t.parentModel;}function Qi(t) {return [t || "", jf++, Math.random().toFixed(5)].join("_");}function Ji(t) {return t.replace(/^\s+/, "").replace(/\s+$/, "");}function tr(t, e, n, i) {var r = e[1] - e[0],a = n[1] - n[0];if (0 === r) return 0 === a ? n[0] : (n[0] + n[1]) / 2;if (i) {if (r > 0) {if (t <= e[0]) return n[0];if (t >= e[1]) return n[1];} else {if (t >= e[0]) return n[0];if (t <= e[1]) return n[1];}} else {if (t === e[0]) return n[0];if (t === e[1]) return n[1];}return (t - e[0]) / r * a + n[0];}function er(t, e) {switch (t) {case "center":case "middle":t = "50%";break;case "left":case "top":t = "0%";break;case "right":case "bottom":t = "100%";}return "string" == typeof t ? Ji(t).match(/%$/) ? parseFloat(t) / 100 * e : parseFloat(t) : null == t ? NaN : +t;}function nr(t, e, n) {return null == e && (e = 10), e = Math.min(Math.max(0, e), 20), t = (+t).toFixed(e), n ? t : +t;}function ir(t) {var e = t.toString(),n = e.indexOf("e");if (n > 0) {var i = +e.slice(n + 1);return i < 0 ? -i : 0;}var r = e.indexOf(".");return r < 0 ? 0 : e.length - 1 - r;}function rr(t, e) {var n = Math.log,i = Math.LN10,r = Math.floor(n(t[1] - t[0]) / i),a = Math.round(n(Math.abs(e[1] - e[0])) / i),o = Math.min(Math.max(-r + a, 0), 20);return isFinite(o) ? o : 20;}function ar(t, e, n) {if (!t[e]) return 0;var i = p(t, function (t, e) {return t + (isNaN(e) ? 0 : e);}, 0);if (0 === i) return 0;for (var r = Math.pow(10, n), a = d(t, function (t) {return (isNaN(t) ? 0 : t) / i * r * 100;}), o = 100 * r, s = d(a, function (t) {return Math.floor(t);}), l = p(s, function (t, e) {return t + e;}, 0), h = d(a, function (t, e) {return t - s[e];}); l < o;) {for (var u = Number.NEGATIVE_INFINITY, c = null, f = 0, g = h.length; f < g; ++f) {h[f] > u && (u = h[f], c = f);}++s[c], h[c] = 0, ++l;}return s[e] / r;}function or(t) {var e = 2 * Math.PI;return (t % e + e) % e;}function sr(t) {return t > -Zf && t < Zf;}function lr(t) {if (t instanceof Date) return t;if ("string" == typeof t) {var e = $f.exec(t);if (!e) return new Date(NaN);if (e[8]) {var n = +e[4] || 0;return "Z" !== e[8].toUpperCase() && (n -= e[8].slice(0, 3)), new Date(Date.UTC(+e[1], +(e[2] || 1) - 1, +e[3] || 1, n, +(e[5] || 0), +e[6] || 0, +e[7] || 0));}return new Date(+e[1], +(e[2] || 1) - 1, +e[3] || 1, +e[4] || 0, +(e[5] || 0), +e[6] || 0, +e[7] || 0);}return null == t ? new Date(NaN) : new Date(Math.round(t));}function hr(t) {return Math.pow(10, ur(t));}function ur(t) {return Math.floor(Math.log(t) / Math.LN10);}function cr(t, e) {var n,i = ur(t),r = Math.pow(10, i),a = t / r;return n = e ? a < 1.5 ? 1 : a < 2.5 ? 2 : a < 4 ? 3 : a < 7 ? 5 : 10 : a < 1 ? 1 : a < 2 ? 2 : a < 3 ? 3 : a < 5 ? 5 : 10, t = n * r, i >= -20 ? +t.toFixed(i < 0 ? -i : 0) : t;}function fr(t) {return isNaN(t) ? "-" : (t = (t + "").split("."))[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (t.length > 1 ? "." + t[1] : "");}function dr(t) {return null == t ? "" : (t + "").replace(Qf, function (t, e) {return Jf[e];});}function pr(t, e, n) {y(e) || (e = [e]);var i = e.length;if (!i) return "";for (var r = e[0].$vars || [], a = 0; a < r.length; a++) {var o = td[a];t = t.replace(ed(o), ed(o, 0));}for (var s = 0; s < i; s++) {for (var l = 0; l < r.length; l++) {var h = e[s][r[l]];t = t.replace(ed(td[l], s), n ? dr(h) : h);}}return t;}function gr(t, e) {var n = (t = x(t) ? { color: t, extraCssText: e } : t || {}).color,i = t.type,e = t.extraCssText;return n ? "subItem" === i ? '<span style="display:inline-block;vertical-align:middle;margin-right:8upx;margin-left:3upx;border-radius:4upx;width:4upx;height:4upx;background-color:' + dr(n) + ";" + (e || "") + '"></span>' : '<span style="display:inline-block;margin-right:5upx;border-radius:10upx;width:10upx;height:10upx;background-color:' + dr(n) + ";" + (e || "") + '"></span>' : "";}function mr(t, e) {return t += "", "0000".substr(0, e - t.length) + t;}function vr(t, e, n) {"week" !== t && "month" !== t && "quarter" !== t && "half-year" !== t && "year" !== t || (t = "MM-dd\nyyyy");var i = lr(e),r = n ? "UTC" : "",a = i["get" + r + "FullYear"](),o = i["get" + r + "Month"]() + 1,s = i["get" + r + "Date"](),l = i["get" + r + "Hours"](),h = i["get" + r + "Minutes"](),u = i["get" + r + "Seconds"](),c = i["get" + r + "Milliseconds"]();return t = t.replace("MM", mr(o, 2)).replace("M", o).replace("yyyy", a).replace("yy", a % 100).replace("dd", mr(s, 2)).replace("d", s).replace("hh", mr(l, 2)).replace("h", l).replace("mm", mr(h, 2)).replace("m", h).replace("ss", mr(u, 2)).replace("s", u).replace("SSS", mr(c, 3));}function yr(t, e, n, i, r) {var a = 0,o = 0;null == i && (i = 1 / 0), null == r && (r = 1 / 0);var s = 0;e.eachChild(function (l, h) {var u,c,f = l.position,d = l.getBoundingRect(),p = e.childAt(h + 1),g = p && p.getBoundingRect();if ("horizontal" === t) {var m = d.width + (g ? -g.x + d.x : 0);(u = a + m) > i || l.newline ? (a = 0, u = m, o += s + n, s = d.height) : s = Math.max(s, d.height);} else {var v = d.height + (g ? -g.y + d.y : 0);(c = o + v) > r || l.newline ? (a += s + n, o = 0, c = v, s = d.width) : s = Math.max(s, d.width);}l.newline || (f[0] = a, f[1] = o, "horizontal" === t ? a = u + n : o = c + n);});}function _r(t, e, n) {n = Kf(n || 0);var i = e.width,r = e.height,a = er(t.left, i),o = er(t.top, r),s = er(t.right, i),l = er(t.bottom, r),h = er(t.width, i),u = er(t.height, r),c = n[2] + n[0],f = n[1] + n[3],d = t.aspect;switch (isNaN(h) && (h = i - s - f - a), isNaN(u) && (u = r - l - c - o), null != d && (isNaN(h) && isNaN(u) && (d > i / r ? h = .8 * i : u = .8 * r), isNaN(h) && (h = d * u), isNaN(u) && (u = h / d)), isNaN(a) && (a = i - s - h - f), isNaN(o) && (o = r - l - u - c), t.left || t.right) {case "center":a = i / 2 - h / 2 - n[3];break;case "right":a = i - h - f;}switch (t.top || t.bottom) {case "middle":case "center":o = r / 2 - u / 2 - n[0];break;case "bottom":o = r - u - c;}a = a || 0, o = o || 0, isNaN(h) && (h = i - f - a - (s || 0)), isNaN(u) && (u = r - c - o - (l || 0));var p = new Rt(a + n[3], o + n[0], h, u);return p.margin = n, p;}function xr(t, e, n) {function i(n, i) {var o = {},l = 0,h = {},u = 0;if (id(n, function (e) {h[e] = t[e];}), id(n, function (t) {r(e, t) && (o[t] = h[t] = e[t]), a(o, t) && l++, a(h, t) && u++;}), s[i]) return a(e, n[1]) ? h[n[2]] = null : a(e, n[2]) && (h[n[1]] = null), h;if (2 !== u && l) {if (l >= 2) return o;for (var c = 0; c < n.length; c++) {var f = n[c];if (!r(o, f) && r(t, f)) {o[f] = t[f];break;}}return o;}return h;}function r(t, e) {return t.hasOwnProperty(e);}function a(t, e) {return null != t[e] && "auto" !== t[e];}function o(t, e, n) {id(t, function (t) {e[t] = n[t];});}!w(n) && (n = {});var s = n.ignoreSize;!y(s) && (s = [s, s]);var l = i(ad[0], 0),h = i(ad[1], 1);o(ad[0], t, l), o(ad[1], t, h);}function wr(t) {return br({}, t);}function br(t, e) {return e && t && id(rd, function (n) {e.hasOwnProperty(n) && (t[n] = e[n]);}), t;}function Mr(t, e) {for (var n = t.length, i = 0; i < n; i++) {if (t[i].length > e) return t[i];}return t[n - 1];}function Sr(t) {var e = t.get("coordinateSystem"),n = { coordSysName: e, coordSysDims: [], axisMap: R(), categoryAxisMap: R() },i = dd[e];if (i) return i(t, n, n.axisMap, n.categoryAxisMap), n;}function Ir(t) {return "category" === t.get("type");}function Tr(t) {this.fromDataset = t.fromDataset, this.data = t.data || (t.sourceFormat === vd ? {} : []), this.sourceFormat = t.sourceFormat || yd, this.seriesLayoutBy = t.seriesLayoutBy || xd, this.dimensionsDefine = t.dimensionsDefine, this.encodeDefine = t.encodeDefine && R(t.encodeDefine), this.startIndex = t.startIndex || 0, this.dimensionsDetectCount = t.dimensionsDetectCount;}function Cr(t) {var e = t.option.source,n = yd;if (M(e)) n = _d;else if (y(e)) for (var i = 0, r = e.length; i < r; i++) {var a = e[i];if (null != a) {if (y(a)) {n = gd;break;}if (w(a)) {n = md;break;}}} else if (w(e)) {for (var o in e) {if (e.hasOwnProperty(o) && c(e[o])) {n = vd;break;}}} else if (null != e) throw new Error("Invalid data");bd(t).sourceFormat = n;}function Dr(t) {return bd(t).source;}function kr(t) {bd(t).datasetMap = R();}function Ar(t) {var e = t.option,n = e.data,i = M(n) ? _d : pd,r = !1,a = e.seriesLayoutBy,o = e.sourceHeader,s = e.dimensions,l = Rr(t);if (l) {var h = l.option;n = h.source, i = bd(l).sourceFormat, r = !0, a = a || h.seriesLayoutBy, null == o && (o = h.sourceHeader), s = s || h.dimensions;}var u = Lr(n, i, a, o, s),c = e.encode;!c && l && (c = Nr(t, l, n, i, a, u)), bd(t).source = new Tr({ data: n, fromDataset: r, seriesLayoutBy: a, sourceFormat: i, dimensionsDefine: u.dimensionsDefine, startIndex: u.startIndex, dimensionsDetectCount: u.dimensionsDetectCount, encodeDefine: c });}function Lr(t, e, n, i, r) {if (!t) return { dimensionsDefine: Pr(r) };var a, o, s;if (e === gd) "auto" === i || null == i ? Or(function (t) {null != t && "-" !== t && (x(t) ? null == o && (o = 1) : o = 0);}, n, t, 10) : o = i ? 1 : 0, r || 1 !== o || (r = [], Or(function (t, e) {r[e] = null != t ? t : "";}, n, t)), a = r ? r.length : n === wd ? t.length : t[0] ? t[0].length : null;else if (e === md) r || (r = Er(t), s = !0);else if (e === vd) r || (r = [], s = !0, f(t, function (t, e) {r.push(e);}));else if (e === pd) {var l = ln(t[0]);a = y(l) && l.length || 1;}var h;return s && f(r, function (t, e) {"name" === (w(t) ? t.name : t) && (h = e);}), { startIndex: o, dimensionsDefine: Pr(r), dimensionsDetectCount: a, potentialNameDimIndex: h };}function Pr(t) {if (t) {var e = R();return d(t, function (t, n) {if (null == (t = a({}, w(t) ? t : { name: t })).name) return t;t.name += "", null == t.displayName && (t.displayName = t.name);var i = e.get(t.name);return i ? t.name += "-" + i.count++ : e.set(t.name, { count: 1 }), t;});}}function Or(t, e, n, i) {if (null == i && (i = 1 / 0), e === wd) for (a = 0; a < n.length && a < i; a++) {t(n[a] ? n[a][0] : null, a);} else for (var r = n[0] || [], a = 0; a < r.length && a < i; a++) {t(r[a], a);}}function Er(t) {for (var e, n = 0; n < t.length && !(e = t[n++]);) {;}if (e) {var i = [];return f(e, function (t, e) {i.push(e);}), i;}}function Nr(t, e, n, i, r, a) {var o = Sr(t),s = {},l = [],h = [],u = t.subType,c = R(["pie", "map", "funnel"]),d = R(["line", "bar", "pictorialBar", "scatter", "effectScatter", "candlestick", "boxplot"]);if (o && null != d.get(u)) {var p = t.ecModel,g = bd(p).datasetMap,m = e.uid + "_" + r,v = g.get(m) || g.set(m, { categoryWayDim: 1, valueWayDim: 0 });f(o.coordSysDims, function (t) {if (null == o.firstCategoryDimIndex) {e = v.valueWayDim++;s[t] = e, h.push(e);} else if (o.categoryAxisMap.get(t)) s[t] = 0, l.push(0);else {var e = v.categoryWayDim++;s[t] = e, h.push(e);}});} else if (null != c.get(u)) {for (var y, _ = 0; _ < 5 && null == y; _++) {zr(n, i, r, a.dimensionsDefine, a.startIndex, _) || (y = _);}if (null != y) {s.value = y;var x = a.potentialNameDimIndex || Math.max(y - 1, 0);h.push(x), l.push(x);}}return l.length && (s.itemName = l), h.length && (s.seriesName = h), s;}function Rr(t) {var e = t.option;if (!e.data) return t.ecModel.getComponent("dataset", e.datasetIndex || 0);}function Br(t, e) {return zr(t.data, t.sourceFormat, t.seriesLayoutBy, t.dimensionsDefine, t.startIndex, e);}function zr(t, e, n, i, r, a) {function o(t) {return (null == t || !isFinite(t) || "" === t) && (!(!x(t) || "-" === t) || void 0);}var s;if (M(t)) return !1;var l;if (i && (l = w(l = i[a]) ? l.name : l), e === gd) {if (n === wd) {for (var h = t[a], u = 0; u < (h || []).length && u < 5; u++) {if (null != (s = o(h[r + u]))) return s;}} else for (u = 0; u < t.length && u < 5; u++) {var c = t[r + u];if (c && null != (s = o(c[a]))) return s;}} else if (e === md) {if (!l) return;for (u = 0; u < t.length && u < 5; u++) {if ((f = t[u]) && null != (s = o(f[l]))) return s;}} else if (e === vd) {if (!l) return;if (!(h = t[l]) || M(h)) return !1;for (u = 0; u < h.length && u < 5; u++) {if (null != (s = o(h[u]))) return s;}} else if (e === pd) for (u = 0; u < t.length && u < 5; u++) {var f = t[u],d = ln(f);if (!y(d)) return !1;if (null != (s = o(d[a]))) return s;}return !1;}function Fr(t, e) {if (e) {var n = e.seiresIndex,i = e.seriesId,r = e.seriesName;return null != n && t.componentIndex !== n || null != i && t.id !== i || null != r && t.name !== r;}}function Vr(t, e) {var r = t.color && !t.colorLayer;f(e, function (e, a) {"colorLayer" === a && r || ld.hasClass(a) || ("object" == typeof e ? t[a] = t[a] ? i(t[a], e, !1) : n(e) : null == t[a] && (t[a] = e));});}function Wr(t) {t = t, this.option = {}, this.option[Md] = 1, this._componentsMap = R({ series: [] }), this._seriesIndices, this._seriesIndicesMap, Vr(t, this._theme.option), i(t, ud, !1), this.mergeOption(t);}function Hr(t, e) {y(e) || (e = e ? [e] : []);var n = {};return f(e, function (e) {n[e] = (t.get(e) || []).slice();}), n;}function Gr(t, e, n) {return e.type ? e.type : n ? n.subType : ld.determineSubType(t, e);}function qr(t, e) {t._seriesIndicesMap = R(t._seriesIndices = d(e, function (t) {return t.componentIndex;}) || []);}function Xr(t, e) {return e.hasOwnProperty("subType") ? g(t, function (t) {return t.subType === e.subType;}) : t;}function Ur(t) {f(Id, function (e) {this[e] = m(t[e], t);}, this);}function Yr() {this._coordinateSystems = [];}function jr(t) {this._api = t, this._timelineOptions = [], this._mediaList = [], this._mediaDefault, this._currentMediaIndices = [], this._optionBackup, this._newBaseOption;}function Zr(t, e, n) {var i,r,a = [],o = [],s = t.timeline;if (t.baseOption && (r = t.baseOption), (s || t.options) && (r = r || {}, a = (t.options || []).slice()), t.media) {r = r || {};var l = t.media;Cd(l, function (t) {t && t.option && (t.query ? o.push(t) : i || (i = t));});}return r || (r = t), r.timeline || (r.timeline = s), Cd([r].concat(a).concat(d(o, function (t) {return t.option;})), function (t) {Cd(e, function (e) {e(t, n);});}), { baseOption: r, timelineOptions: a, mediaDefault: i, mediaList: o };}function $r(t, e, n) {var i = { width: e, height: n, aspectratio: e / n },r = !0;return f(t, function (t, e) {var n = e.match(Ld);if (n && n[1] && n[2]) {var a = n[1],o = n[2].toLowerCase();Kr(i[o], t, a) || (r = !1);}}), r;}function Kr(t, e, n) {return "min" === n ? t >= e : "max" === n ? t <= e : t === e;}function Qr(t, e) {return t.join(",") === e.join(",");}function Jr(t, e) {Cd(e = e || {}, function (e, n) {if (null != e) {var i = t[n];if (ld.hasClass(n)) {e = on(e);var r = un(i = on(i), e);t[n] = kd(r, function (t) {return t.option && t.exist ? Ad(t.exist, t.option, !0) : t.exist || t.option;});} else t[n] = Ad(i, e, !0);}});}function ta(t) {var e = t && t.itemStyle;if (e) for (var n = 0, r = Ed.length; n < r; n++) {var a = Ed[n],o = e.normal,s = e.emphasis;o && o[a] && (t[a] = t[a] || {}, t[a].normal ? i(t[a].normal, o[a]) : t[a].normal = o[a], o[a] = null), s && s[a] && (t[a] = t[a] || {}, t[a].emphasis ? i(t[a].emphasis, s[a]) : t[a].emphasis = s[a], s[a] = null);}}function ea(t, e, n) {if (t && t[e] && (t[e].normal || t[e].emphasis)) {var i = t[e].normal,r = t[e].emphasis;i && (n ? (t[e].normal = t[e].emphasis = null, o(t[e], i)) : t[e] = i), r && (t.emphasis = t.emphasis || {}, t.emphasis[e] = r);}}function na(t) {ea(t, "itemStyle"), ea(t, "lineStyle"), ea(t, "areaStyle"), ea(t, "label"), ea(t, "labelLine"), ea(t, "upperLabel"), ea(t, "edgeLabel");}function ia(t, e) {var n = Od(t) && t[e],i = Od(n) && n.textStyle;if (i) for (var r = 0, a = ac.length; r < a; r++) {var e = ac[r];i.hasOwnProperty(e) && (n[e] = i[e]);}}function ra(t) {t && (na(t), ia(t, "label"), t.emphasis && ia(t.emphasis, "label"));}function aa(t) {if (Od(t)) {ta(t), na(t), ia(t, "label"), ia(t, "upperLabel"), ia(t, "edgeLabel"), t.emphasis && (ia(t.emphasis, "label"), ia(t.emphasis, "upperLabel"), ia(t.emphasis, "edgeLabel"));var e = t.markPoint;e && (ta(e), ra(e));var n = t.markLine;n && (ta(n), ra(n));var i = t.markArea;i && ra(i);var r = t.data;if ("graph" === t.type) {r = r || t.nodes;var a = t.links || t.edges;if (a && !M(a)) for (s = 0; s < a.length; s++) {ra(a[s]);}f(t.categories, function (t) {na(t);});}if (r && !M(r)) for (s = 0; s < r.length; s++) {ra(r[s]);}if ((e = t.markPoint) && e.data) for (var o = e.data, s = 0; s < o.length; s++) {ra(o[s]);}if ((n = t.markLine) && n.data) for (var l = n.data, s = 0; s < l.length; s++) {y(l[s]) ? (ra(l[s][0]), ra(l[s][1])) : ra(l[s]);}"gauge" === t.type ? (ia(t, "axisLabel"), ia(t, "title"), ia(t, "detail")) : "treemap" === t.type ? (ea(t.breadcrumb, "itemStyle"), f(t.levels, function (t) {na(t);})) : "tree" === t.type && na(t.leaves);}}function oa(t) {return y(t) ? t : t ? [t] : [];}function sa(t) {return (y(t) ? t[0] : t) || {};}function la(t, e) {e = e.split(",");for (var n = t, i = 0; i < e.length && null != (n = n && n[e[i]]); i++) {;}return n;}function ha(t, e, n, i) {e = e.split(",");for (var r, a = t, o = 0; o < e.length - 1; o++) {null == a[r = e[o]] && (a[r] = {}), a = a[r];}(i || null == a[e[o]]) && (a[e[o]] = n);}function ua(t) {f(Rd, function (e) {e[0] in t && !(e[1] in t) && (t[e[1]] = t[e[0]]);});}function ca(t) {f(t, function (e, n) {var i = [],r = [NaN, NaN],a = [e.stackResultDimension, e.stackedOverDimension],o = e.data,s = e.isStackedByIndex,l = o.map(a, function (a, l, h) {var u = o.get(e.stackedDimension, h);if (isNaN(u)) return r;var c, f;s ? f = o.getRawIndex(h) : c = o.get(e.stackedByDimension, h);for (var d = NaN, p = n - 1; p >= 0; p--) {var g = t[p];if (s || (f = g.data.rawIndexOf(g.stackedByDimension, c)), f >= 0) {var m = g.data.getByRawIndex(g.stackResultDimension, f);if (u >= 0 && m > 0 || u <= 0 && m < 0) {u += m, d = m;break;}}}return i[0] = u, i[1] = d, i;});o.hostModel.setData(l), e.data = l;});}function fa(t, e) {Tr.isInstance(t) || (t = Tr.seriesDataToSource(t)), this._source = t;var n = this._data = t.data,i = t.sourceFormat;i === _d && (this._offset = 0, this._dimSize = e, this._data = n), a(this, Vd[i === gd ? i + "_" + t.seriesLayoutBy : i]);}function da() {return this._data.length;}function pa(t) {return this._data[t];}function ga(t) {for (var e = 0; e < t.length; e++) {this._data.push(t[e]);}}function ma(t, e, n, i) {return null != n ? t[n] : t;}function va(t, e, n, i) {return ya(t[i], this._dimensionInfos[e]);}function ya(t, e) {var n = e && e.type;if ("ordinal" === n) {var i = e && e.ordinalMeta;return i ? i.parseAndCollect(t) : t;}return "time" === n && "number" != typeof t && null != t && "-" !== t && (t = +lr(t)), null == t || "" === t ? NaN : +t;}function _a(t, e, n) {if (t) {var i = t.getRawDataItem(e);if (null != i) {var r,a,o = t.getProvider().getSource().sourceFormat,s = t.getDimensionInfo(n);return s && (r = s.name, a = s.index), Wd[o](i, e, a, r);}}}function xa(t, e, n) {if (t) {var i = t.getProvider().getSource().sourceFormat;if (i === pd || i === md) {var r = t.getRawDataItem(e);return i !== pd || w(r) || (r = null), r ? r[n] : void 0;}}}function wa(t) {return new ba(t);}function ba(t) {t = t || {}, this._reset = t.reset, this._plan = t.plan, this._count = t.count, this._onDirty = t.onDirty, this._dirty = !0, this.context;}function Ma(t, e, n, i, r, a) {Ud.reset(n, i, r, a), t._callingProgress = e, t._callingProgress({ start: n, end: i, count: i - n, next: Ud.next }, t.context);}function Sa(t, e) {t._dueIndex = t._outputDueEnd = t._dueEnd = 0, t._settedOutputEnd = null;var n, i;!e && t._reset && ((n = t._reset(t.context)) && n.progress && (i = n.forceFirstProgress, n = n.progress), y(n) && !n.length && (n = null)), t._progress = n, t._modBy = t._modDataCount = null;var r = t._downstream;return r && r.dirty(), i;}function Ia(t) {var e = t.name;fn(t) || (t.name = Ta(t) || e);}function Ta(t) {var e = t.getRawData(),n = [];return f(e.mapDimension("seriesName", !0), function (t) {var i = e.getDimensionInfo(t);i.displayName && n.push(i.displayName);}), n.join(" ");}function Ca(t) {return t.model.getRawData().count();}function Da(t) {var e = t.model;return e.setData(e.getRawData().cloneShallow()), ka;}function ka(t, e) {t.end > e.outputData.count() && e.model.getRawData().cloneShallow(e.outputData);}function Aa(t, e) {f(t.CHANGABLE_METHODS, function (n) {t.wrapMethod(n, v(La, e));});}function La(t) {var e = Pa(t);e && e.setOutputEnd(this.count());}function Pa(t) {var e = (t.ecModel || {}).scheduler,n = e && e.getPipeline(t.uid);if (n) {var i = n.currentTask;if (i) {var r = i.agentStubMap;r && (i = r.get(t.uid));}return i;}}function Oa() {this.group = new du(), this.uid = Qi("viewChart"), this.renderTask = wa({ plan: Ra, reset: Ba }), this.renderTask.context = { view: this };}function Ea(t, e) {if (t && (t.trigger(e), "group" === t.type)) for (var n = 0; n < t.childCount(); n++) {Ea(t.childAt(n), e);}}function Na(t, e, n) {var i = pn(t, e);null != i ? f(on(i), function (e) {Ea(t.getItemGraphicEl(e), n);}) : t.eachItemGraphicEl(function (t) {Ea(t, n);});}function Ra(t) {return Jd(t.model);}function Ba(t) {var e = t.model,n = t.ecModel,i = t.api,r = t.payload,a = e.pipelineContext.progressiveRender,o = t.view,s = r && Qd(r).updateMethod,l = a ? "incrementalPrepareRender" : s && o[s] ? s : "render";return "render" !== l && o[l](e, n, i, r), ep[l];}function za(t, e, n) {function i() {u = new Date().getTime(), c = null, t.apply(o, s || []);}var r,a,o,s,l,h = 0,u = 0,c = null;e = e || 0;var f = function f() {r = new Date().getTime(), o = this, s = arguments;var t = l || e,f = l || n;l = null, a = r - (f ? h : u) - t, clearTimeout(c), f ? c = setTimeout(i, t) : a >= 0 ? i() : c = setTimeout(i, -a), h = r;};return f.clear = function () {c && (clearTimeout(c), c = null);}, f.debounceNextCall = function (t) {l = t;}, f;}function Fa(t, e, n, i) {this.ecInstance = t, this.api = e, this.unfinished;var n = this._dataProcessorHandlers = n.slice(),i = this._visualHandlers = i.slice();this._allHandlers = n.concat(i), this._stageTaskMap = R();}function Va(t, e, n, i, r) {function a(t, e) {return t.setDirty && (!t.dirtyMap || t.dirtyMap.get(e.__pipeline.id));}r = r || {};var o;f(e, function (e, s) {if (!r.visualType || r.visualType === e.visualType) {var l = t._stageTaskMap.get(e.uid),h = l.seriesTaskMap,u = l.overallTask;if (u) {var c,f = u.agentStubMap;f.each(function (t) {a(r, t) && (t.dirty(), c = !0);}), c && u.dirty(), sp(u, i);var d = t.getPerformArgs(u, r.block);f.each(function (t) {t.perform(d);}), o |= u.perform(d);} else h && h.each(function (s, l) {a(r, s) && s.dirty();var h = t.getPerformArgs(s, r.block);h.skip = !e.performRawSeries && n.isSeriesFiltered(s.context.model), sp(s, i), o |= s.perform(h);});}}), t.unfinished |= o;}function Wa(t, e, n, i, r) {function a(n) {var a = n.uid,s = o.get(a) || o.set(a, wa({ plan: Ya, reset: ja, count: $a }));s.context = { model: n, ecModel: i, api: r, useClearVisual: e.isVisual && !e.isLayout, plan: e.plan, reset: e.reset, scheduler: t }, Ka(t, n, s);}var o = n.seriesTaskMap || (n.seriesTaskMap = R()),s = e.seriesType,l = e.getTargetSeries;e.createOnAllSeries ? i.eachRawSeries(a) : s ? i.eachRawSeriesByType(s, a) : l && l(i, r).each(a);var h = t._pipelineMap;o.each(function (t, e) {h.get(e) || (t.dispose(), o.removeKey(e));});}function Ha(t, e, n, i, r) {function a(e) {var n = e.uid,i = s.get(n);i || (i = s.set(n, wa({ reset: qa, onDirty: Ua })), o.dirty()), i.context = { model: e, overallProgress: u, modifyOutputEnd: c }, i.agent = o, i.__block = u, Ka(t, e, i);}var o = n.overallTask = n.overallTask || wa({ reset: Ga });o.context = { ecModel: i, api: r, overallReset: e.overallReset, scheduler: t };var s = o.agentStubMap = o.agentStubMap || R(),l = e.seriesType,h = e.getTargetSeries,u = !0,c = e.modifyOutputEnd;l ? i.eachRawSeriesByType(l, a) : h ? h(i, r).each(a) : (u = !1, f(i.getSeries(), a));var d = t._pipelineMap;s.each(function (t, e) {d.get(e) || (t.dispose(), o.dirty(), s.removeKey(e));});}function Ga(t) {t.overallReset(t.ecModel, t.api, t.payload);}function qa(t, e) {return t.overallProgress && Xa;}function Xa() {this.agent.dirty(), this.getDownstream().dirty();}function Ua() {this.agent && this.agent.dirty();}function Ya(t) {return t.plan && t.plan(t.model, t.ecModel, t.api, t.payload);}function ja(t) {t.useClearVisual && t.data.clearAllVisual();var e = t.resetDefines = on(t.reset(t.model, t.ecModel, t.api, t.payload));return e.length > 1 ? d(e, function (t, e) {return Za(e);}) : lp;}function Za(t) {return function (e, n) {var i = n.data,r = n.resetDefines[t];if (r && r.dataEach) for (var a = e.start; a < e.end; a++) {r.dataEach(i, a);} else r && r.progress && r.progress(e, i);};}function $a(t) {return t.data.count();}function Ka(t, e, n) {var i = e.uid,r = t._pipelineMap.get(i);!r.head && (r.head = n), r.tail && r.tail.pipe(n), r.tail = n, n.__idxInPipeline = r.count++, n.__pipeline = r;}function Qa(t) {hp = null;try {t(up, cp);} catch (t) {}return hp;}function Ja(t, e) {for (var n in e.prototype) {t[n] = B;}}function to(t) {return function (e, n, i) {e = e && e.toLowerCase(), Bh.prototype[t].call(this, e, n, i);};}function eo() {Bh.call(this);}function no(t, e, i) {function r(t, e) {return t.__prio - e.__prio;}i = i || {}, "string" == typeof e && (e = zp[e]), this.id, this.group, this._dom = t;var a = this._zr = an(t, { renderer: i.renderer || "canvas", devicePixelRatio: i.devicePixelRatio, width: i.width, height: i.height });this._throttledZrFlush = za(m(a.flush, a), 17), (e = n(e)) && zd(e, !0), this._theme = e, this._chartsViews = [], this._chartsMap = {}, this._componentsViews = [], this._componentsMap = {}, this._coordSysMgr = new Yr();var o = this._api = wo(this);qt(Bp, r), qt(Ep, r), this._scheduler = new Fa(this, o, Ep, Bp), Bh.call(this), this._messageCenter = new eo(), this._initEvents(), this.resize = m(this.resize, this), this._pendingActions = [], a.animation.on("frame", this._onframe, this), uo(a, this), O(this);}function io(t, e, n) {var i,r = this._model,a = this._coordSysMgr.getCoordinateSystems();e = mn(r, e);for (var o = 0; o < a.length; o++) {var s = a[o];if (s[t] && null != (i = s[t](r, e, n))) return i;}}function ro(t) {var e = t._model,n = t._scheduler;n.restorePipelines(e), n.prepareStageTasks(), co(t, "component", e, n), co(t, "chart", e, n), n.plan();}function ao(t, e, n, i, r) {function a(i) {i && i.__alive && i[e] && i[e](i.__model, o, t._api, n);}var o = t._model;if (i) {var s = {};s[i + "Id"] = n[i + "Id"], s[i + "Index"] = n[i + "Index"], s[i + "Name"] = n[i + "Name"];var l = { mainType: i, query: s };r && (l.subType = r);var h = n.excludeSeriesId;null != h && (h = R(on(h))), o && o.eachComponent(l, function (e) {h && null != h.get(e.id) || a(t["series" === i ? "_chartsMap" : "_componentsMap"][e.__viewId]);}, t);} else vp(t._componentsViews.concat(t._chartsViews), a);}function oo(t, e) {var n = t._chartsMap,i = t._scheduler;e.eachSeries(function (t) {i.updateStreamModes(t, n[t.__viewId]);});}function so(t, e) {var n = t.type,i = t.escapeConnect,r = Pp[n],s = r.actionInfo,l = (s.update || "update").split(":"),h = l.pop();l = null != l[0] && xp(l[0]), this[Tp] = !0;var u = [t],c = !1;t.batch && (c = !0, u = d(t.batch, function (e) {return e = o(a({}, e), t), e.batch = null, e;}));var f,p = [],g = "highlight" === n || "downplay" === n;vp(u, function (t) {f = r.action(t, this._model, this._api), (f = f || a({}, t)).type = s.event || f.type, p.push(f), g ? ao(this, h, t, "series") : l && ao(this, h, t, l.main, l.sub);}, this), "none" === h || g || l || (this[Cp] ? (ro(this), Ap.update.call(this, t), this[Cp] = !1) : Ap[h].call(this, t)), f = c ? { type: s.event || n, escapeConnect: i, batch: p } : p[0], this[Tp] = !1, !e && this._messageCenter.trigger(f.type, f);}function lo(t) {for (var e = this._pendingActions; e.length;) {var n = e.shift();so.call(this, n, t);}}function ho(t) {!t && this.trigger("updated");}function uo(t, e) {t.on("rendered", function () {e.trigger("rendered"), !t.animation.isFinished() || e[Cp] || e._scheduler.unfinished || e._pendingActions.length || e.trigger("finished");});}function co(t, e, n, i) {function r(t) {var e = "_ec_" + t.id + "_" + t.type,r = s[e];if (!r) {var u = xp(t.type);(r = new (a ? Zd.getClass(u.main, u.sub) : Oa.getClass(u.sub))()).init(n, h), s[e] = r, o.push(r), l.add(r.group);}t.__viewId = r.__id = e, r.__alive = !0, r.__model = t, r.group.__ecComponentInfo = { mainType: t.mainType, index: t.componentIndex }, !a && i.prepareView(r, t, n, h);}for (var a = "component" === e, o = a ? t._componentsViews : t._chartsViews, s = a ? t._componentsMap : t._chartsMap, l = t._zr, h = t._api, u = 0; u < o.length; u++) {o[u].__alive = !1;}a ? n.eachComponent(function (t, e) {"series" !== t && r(e);}) : n.eachSeries(r);for (u = 0; u < o.length;) {var c = o[u];c.__alive ? u++ : (!a && c.renderTask.dispose(), l.remove(c.group), c.dispose(n, h), o.splice(u, 1), delete s[c.__id], c.__id = c.group.__ecComponentInfo = null);}}function fo(t) {t.clearColorPalette(), t.eachSeries(function (t) {t.clearColorPalette();});}function po(t, e, n, i) {go(t, e, n, i), vp(t._chartsViews, function (t) {t.__alive = !1;}), mo(t, e, n, i), vp(t._chartsViews, function (t) {t.__alive || t.remove(e, n);});}function go(t, e, n, i, r) {vp(r || t._componentsViews, function (t) {var r = t.__model;t.render(r, e, n, i), xo(r, t);});}function mo(t, e, n, i, r) {var a,o = t._scheduler;e.eachSeries(function (e) {var n = t._chartsMap[e.__viewId];n.__alive = !0;var s = n.renderTask;o.updatePayload(s, i), r && r.get(e.uid) && s.dirty(), a |= s.perform(o.getPerformArgs(s)), n.group.silent = !!e.get("silent"), xo(e, n), _o(e, n);}), o.unfinished |= a, yo(t._zr, e), rp(t._zr.dom, e);}function vo(t, e) {vp(Rp, function (n) {n(t, e);});}function yo(t, e) {var n = t.storage,i = 0;n.traverse(function (t) {t.isGroup || i++;}), i > e.get("hoverLayerThreshold") && !_h.node && n.traverse(function (t) {t.isGroup || (t.useHoverLayer = !0);});}function _o(t, e) {var n = t.get("blendMode") || null;e.group.traverse(function (t) {t.isGroup || t.style.blend !== n && t.setStyle("blend", n), t.eachPendingDisplayable && t.eachPendingDisplayable(function (t) {t.setStyle("blend", n);});});}function xo(t, e) {var n = t.get("z"),i = t.get("zlevel");e.group.traverse(function (t) {"group" !== t.type && (null != n && (t.z = n), null != i && (t.zlevel = i));});}function wo(t) {var e = t._coordSysMgr;return a(new Ur(t), { getCoordinateSystems: m(e.getCoordinateSystems, e), getComponentByElement: function getComponentByElement(e) {for (; e;) {var n = e.__ecComponentInfo;if (null != n) return t._model.getComponent(n.mainType, n.index);e = e.parent;}} });}function bo(t) {function e(t, e) {for (var i = 0; i < t.length; i++) {t[i][n] = e;}}var n = "__connectUpdateStatus";vp(Op, function (i, r) {t._messageCenter.on(r, function (i) {if (Wp[t.group] && 0 !== t[n]) {if (i && i.escapeConnect) return;var r = t.makeActionFromEvent(i),a = [];vp(Vp, function (e) {e !== t && e.group === t.group && a.push(e);}), e(a, 0), vp(a, function (t) {1 !== t[n] && t.dispatchAction(r);}), e(a, 2);}});});}function Mo(t) {Wp[t] = !1;}function So(t) {return Vp[_n(t, qp)];}function Io(t, e) {zp[t] = e;}function To(t) {Np.push(t);}function Co(t, e) {Lo(Ep, t, e, bp);}function Do(t, e, n) {"function" == typeof e && (n = e, e = "");var i = _p(t) ? t.type : [t, t = { event: e }][0];t.event = (t.event || i).toLowerCase(), e = t.event, mp(Dp.test(i) && Dp.test(e)), Pp[i] || (Pp[i] = { action: n, actionInfo: t }), Op[e] = i;}function ko(t, e) {Lo(Bp, t, e, Mp, "layout");}function Ao(t, e) {Lo(Bp, t, e, Sp, "visual");}function Lo(t, e, n, i, r) {(yp(e) || _p(e)) && (n = e, e = i);var a = Fa.wrapStageHandler(n, r);return a.__prio = e, a.__raw = n, t.push(a), a;}function Po(t, e) {Fp[t] = e;}function Oo(t) {return Zd.extend(t);}function Eo(t) {return jd.extend(t);}function No(t) {return Oa.extend(t);}function Ro(t) {return t;}function Bo(t, e, n, i, r) {this._old = t, this._new = e, this._oldKeyGetter = n || Ro, this._newKeyGetter = i || Ro, this.context = r;}function zo(t, e, n, i, r) {for (var a = 0; a < t.length; a++) {var o = "_ec_" + r[i](t[a], a),s = e[o];null == s ? (n.push(o), e[o] = a) : (s.length || (e[o] = s = [s]), s.push(a));}}function Fo(t) {var e = {},n = e.encode = {},i = R(),r = [],a = [];f(t.dimensions, function (e) {var o = t.getDimensionInfo(e),s = o.coordDim;if (s) {var l = n[s];n.hasOwnProperty(s) || (l = n[s] = []), l[o.coordDimIndex] = e, o.isExtraCoord || (i.set(s, 1), Wo(o.type) && (r[0] = e)), o.defaultTooltip && a.push(e);}jp.each(function (t, e) {var i = n[e];n.hasOwnProperty(e) || (i = n[e] = []);var r = o.otherDims[e];null != r && !1 !== r && (i[r] = o.name);});});var o = [],s = {};i.each(function (t, e) {var i = n[e];s[e] = i[0], o = o.concat(i);}), e.dataDimsOnCoord = o, e.encodeFirstDimNotExtra = s;var l = n.label;l && l.length && (r = l.slice());var h = n.tooltip;return h && h.length ? a = h.slice() : a.length || (a = r.slice()), n.defaultedLabel = r, n.defaultedTooltip = a, e;}function Vo(t) {return "category" === t ? "ordinal" : "time" === t ? "time" : "float";}function Wo(t) {return !("ordinal" === t || "time" === t);}function Ho(t) {return t._rawCount > 65535 ? Qp : Jp;}function Go(t) {var e = t.constructor;return e === Array ? t.slice() : new e(t);}function qo(t, e) {f(tg.concat(e.__wrappedMethods || []), function (n) {e.hasOwnProperty(n) && (t[n] = e[n]);}), t.__wrappedMethods = e.__wrappedMethods, f(eg, function (i) {t[i] = n(e[i]);}), t._calculationInfo = a(e._calculationInfo);}function Xo(t) {var e = t._invertedIndicesMap;f(e, function (n, i) {var r = t._dimensionInfos[i].ordinalMeta;if (r) {n = e[i] = new Qp(r.categories.length);for (a = 0; a < n.length; a++) {n[a] = NaN;}for (var a = 0; a < t._count; a++) {n[t.get(i, a)] = a;}}});}function Uo(t, e, n) {var i;if (null != e) {var r = t._chunkSize,a = Math.floor(n / r),o = n % r,s = t.dimensions[e],l = t._storage[s][a];if (l) {i = l[o];var h = t._dimensionInfos[s].ordinalMeta;h && h.categories.length && (i = h.categories[i]);}}return i;}function Yo(t) {return t;}function jo(t) {return t < this._count && t >= 0 ? this._indices[t] : -1;}function Zo(t, e) {var n = t._idList[e];return null == n && (n = Uo(t, t._idDimIdx, e)), null == n && (n = $p + e), n;}function $o(t) {return y(t) || (t = [t]), t;}function Ko(t, e) {var n = t.dimensions,i = new ng(d(n, t.getDimensionInfo, t), t.hostModel);qo(i, t);for (var r = i._storage = {}, a = t._storage, o = 0; o < n.length; o++) {var s = n[o];a[s] && (l(e, s) >= 0 ? (r[s] = Qo(a[s]), i._rawExtent[s] = Jo(), i._extent[s] = null) : r[s] = a[s]);}return i;}function Qo(t) {for (var e = new Array(t.length), n = 0; n < t.length; n++) {e[n] = Go(t[n]);}return e;}function Jo() {return [1 / 0, -1 / 0];}function ts(t, e, i) {function r(t, e, n) {null != jp.get(e) ? t.otherDims[e] = n : (t.coordDim = e, t.coordDimIndex = n, u.set(e, !0));}Tr.isInstance(e) || (e = Tr.seriesDataToSource(e)), i = i || {}, t = (t || []).slice();for (var s = (i.dimsDef || []).slice(), l = R(i.encodeDef), h = R(), u = R(), c = [], d = es(e, t, s, i.dimCount), p = 0; p < d; p++) {var g = s[p] = a({}, w(s[p]) ? s[p] : { name: s[p] }),m = g.name,v = c[p] = { otherDims: {} };null != m && null == h.get(m) && (v.name = v.displayName = m, h.set(m, p)), null != g.type && (v.type = g.type), null != g.displayName && (v.displayName = g.displayName);}l.each(function (t, e) {t = on(t).slice();var n = l.set(e, []);f(t, function (t, i) {x(t) && (t = h.get(t)), null != t && t < d && (n[i] = t, r(c[t], e, i));});});var y = 0;f(t, function (t, e) {var i, t, a, s;if (x(t)) i = t, t = {};else {i = t.name;var h = t.ordinalMeta;t.ordinalMeta = null, (t = n(t)).ordinalMeta = h, a = t.dimsDef, s = t.otherDims, t.name = t.coordDim = t.coordDimIndex = t.dimsDef = t.otherDims = null;}var u = on(l.get(i));if (!u.length) for (var d = 0; d < (a && a.length || 1); d++) {for (; y < c.length && null != c[y].coordDim;) {y++;}y < c.length && u.push(y++);}f(u, function (e, n) {var l = c[e];if (r(o(l, t), i, n), null == l.name && a) {var h = a[n];!w(h) && (h = { name: h }), l.name = l.displayName = h.name, l.defaultTooltip = h.defaultTooltip;}s && o(l.otherDims, s);});});var _ = i.generateCoord,b = i.generateCoordCount,M = null != b;b = _ ? b || 1 : 0;for (var S = _ || "value", I = 0; I < d; I++) {null == (v = c[I] = c[I] || {}).coordDim && (v.coordDim = ns(S, u, M), v.coordDimIndex = 0, (!_ || b <= 0) && (v.isExtraCoord = !0), b--), null == v.name && (v.name = ns(v.coordDim, h)), null == v.type && Br(e, I, v.name) && (v.type = "ordinal");}return c;}function es(t, e, n, i) {var r = Math.max(t.dimensionsDetectCount || 1, e.length, n.length, i || 0);return f(e, function (t) {var e = t.dimsDef;e && (r = Math.max(r, e.length));}), r;}function ns(t, e, n) {if (n || null != e.get(t)) {for (var i = 0; null != e.get(t + i);) {i++;}t += i;}return e.set(t, !0), t;}function is(t, e, n) {var i,r,a,o,s = (n = n || {}).byIndex,l = n.stackedCoordDimension,h = !(!t || !t.get("stack"));if (f(e, function (t, n) {x(t) && (e[n] = t = { name: t }), h && !t.isExtraCoord && (s || i || !t.ordinalMeta || (i = t), r || "ordinal" === t.type || "time" === t.type || l && l !== t.coordDim || (r = t));}), !r || s || i || (s = !0), r) {a = "__\0ecstackresult", o = "__\0ecstackedover", i && (i.createInvertedIndices = !0);var u = r.coordDim,c = r.type,d = 0;f(e, function (t) {t.coordDim === u && d++;}), e.push({ name: a, coordDim: u, coordDimIndex: d, type: c, isExtraCoord: !0, isCalculationCoord: !0 }), d++, e.push({ name: o, coordDim: o, coordDimIndex: d, type: c, isExtraCoord: !0, isCalculationCoord: !0 });}return { stackedDimension: r && r.name, stackedByDimension: i && i.name, isStackedByIndex: s, stackedOverDimension: o, stackResultDimension: a };}function rs(t, e) {return !!e && e === t.getCalculationInfo("stackedDimension");}function as(t, e) {return rs(t, e) ? t.getCalculationInfo("stackResultDimension") : e;}function os(t, e, n) {n = n || {}, Tr.isInstance(t) || (t = Tr.seriesDataToSource(t));var i,r = e.get("coordinateSystem"),a = Yr.get(r),o = Sr(e);o && (i = d(o.coordSysDims, function (t) {var e = { name: t },n = o.axisMap.get(t);if (n) {var i = n.get("type");e.type = Vo(i);}return e;})), i || (i = a && (a.getDimensionsInfo ? a.getDimensionsInfo() : a.dimensions.slice()) || ["x", "y"]);var s,l,h = ag(t, { coordDimensions: i, generateCoord: n.generateCoord });o && f(h, function (t, e) {var n = t.coordDim,i = o.categoryAxisMap.get(n);i && (null == s && (s = e), t.ordinalMeta = i.getOrdinalMeta()), null != t.otherDims.itemName && (l = !0);}), l || null == s || (h[s].otherDims.itemName = 0);var u = is(e, h),c = new ng(h, e);c.setCalculationInfo(u);var p = null != s && ss(t) ? function (t, e, n, i) {return i === s ? n : this.defaultDimValueGetter(t, e, n, i);} : null;return c.hasItemOption = !1, c.initData(t, null, p), c;}function ss(t) {if (t.sourceFormat === pd) {var e = ls(t.data || []);return null != e && !y(ln(e));}}function ls(t) {for (var e = 0; e < t.length && null == t[e];) {e++;}return t[e];}function hs(t, e) {if ("image" !== this.type) {var n = this.style,i = this.shape;i && "line" === i.symbolType ? n.stroke = t : this.__isEmptyBrush ? (n.stroke = t, n.fill = e || "#fff") : (n.fill && (n.fill = t), n.stroke && (n.stroke = t)), this.dirty(!1);}}function us(t, e, n, i, r, a, o) {var s = 0 === t.indexOf("empty");s && (t = t.substr(5, 1).toLowerCase() + t.substr(6));var l;return l = 0 === t.indexOf("image://") ? vi(t.slice(8), new Rt(e, n, i, r), o ? "center" : "cover") : 0 === t.indexOf("path://") ? mi(t.slice(7), {}, new Rt(e, n, i, r), o ? "center" : "cover") : new fg({ shape: { symbolType: t, x: e, y: n, width: i, height: r } }), l.__isEmptyBrush = s, l.setColor = hs, l.setColor(a), l;}function cs(t, e) {var n = t.mapDimension("defaultedLabel", !0),i = n.length;if (1 === i) return _a(t, e, n[0]);if (i) {for (var r = [], a = 0; a < n.length; a++) {var o = _a(t, e, n[a]);r.push(o);}return r.join(" ");}}function fs(t, e, n) {du.call(this), this.updateData(t, e, n);}function ds(t) {return [t[0] / 2, t[1] / 2];}function ps(t, e) {this.parent.drift(t, e);}function gs(t) {this.group = new du(), this._symbolCtor = t || fs;}function ms(t, e, n, i) {return e && !isNaN(e[0]) && !isNaN(e[1]) && !(i.isIgnore && i.isIgnore(n)) && !(i.clipShape && !i.clipShape.contain(e[0], e[1])) && "none" !== t.getItemVisual(n, "symbol");}function vs(t) {return null == t || w(t) || (t = { isIgnore: t }), t || {};}function ys(t) {var e = t.hostModel;return { itemStyle: e.getModel("itemStyle").getItemStyle(["color"]), hoverItemStyle: e.getModel("emphasis.itemStyle").getItemStyle(), symbolRotate: e.get("symbolRotate"), symbolOffset: e.get("symbolOffset"), hoverAnimation: e.get("hoverAnimation"), labelModel: e.getModel("label"), hoverLabelModel: e.getModel("emphasis.label"), cursorStyle: e.get("cursor") };}function _s(t, e, n) {var i,r = t.getBaseAxis(),a = t.getOtherAxis(r),o = xs(a, n),s = r.dim,l = a.dim,h = e.mapDimension(l),u = e.mapDimension(s),c = "x" === l || "radius" === l ? 1 : 0,f = d(t.dimensions, function (t) {return e.mapDimension(t);}),p = e.getCalculationInfo("stackResultDimension");return (i |= rs(e, f[0])) && (f[0] = p), (i |= rs(e, f[1])) && (f[1] = p), { dataDimsForPoint: f, valueStart: o, valueAxisDim: l, baseAxisDim: s, stacked: !!i, valueDim: h, baseDim: u, baseDataOffset: c, stackedOverDimension: e.getCalculationInfo("stackedOverDimension") };}function xs(t, e) {var n = 0,i = t.scale.getExtent();return "start" === e ? n = i[0] : "end" === e ? n = i[1] : i[0] > 0 ? n = i[0] : i[1] < 0 && (n = i[1]), n;}function ws(t, e, n, i) {var r = NaN;t.stacked && (r = n.get(n.getCalculationInfo("stackedOverDimension"), i)), isNaN(r) && (r = t.valueStart);var a = t.baseDataOffset,o = [];return o[a] = n.get(t.baseDim, i), o[1 - a] = r, e.dataToPoint(o);}function bs(t, e) {var n = [];return e.diff(t).add(function (t) {n.push({ cmd: "+", idx: t });}).update(function (t, e) {n.push({ cmd: "=", idx: e, idx1: t });}).remove(function (t) {n.push({ cmd: "-", idx: t });}).execute(), n;}function Ms(t) {return isNaN(t[0]) || isNaN(t[1]);}function Ss(t, e, n, i, r, a, o, s, l, h, u) {return "none" !== h && h ? Is.apply(this, arguments) : Ts.apply(this, arguments);}function Is(t, e, n, i, r, a, o, s, l, h, u) {for (var c = 0, f = n, d = 0; d < i; d++) {var p = e[f];if (f >= r || f < 0) break;if (Ms(p)) {if (u) {f += a;continue;}break;}if (f === n) t[a > 0 ? "moveTo" : "lineTo"](p[0], p[1]);else if (l > 0) {var g = e[c],m = "y" === h ? 1 : 0,v = (p[m] - g[m]) * l;Sg(Tg, g), Tg[m] = g[m] + v, Sg(Cg, p), Cg[m] = p[m] - v, t.bezierCurveTo(Tg[0], Tg[1], Cg[0], Cg[1], p[0], p[1]);} else t.lineTo(p[0], p[1]);c = f, f += a;}return d;}function Ts(t, e, n, i, r, a, o, s, l, h, u) {for (var c = 0, f = n, d = 0; d < i; d++) {var p = e[f];if (f >= r || f < 0) break;if (Ms(p)) {if (u) {f += a;continue;}break;}if (f === n) t[a > 0 ? "moveTo" : "lineTo"](p[0], p[1]), Sg(Tg, p);else if (l > 0) {var g = f + a,m = e[g];if (u) for (; m && Ms(e[g]);) {m = e[g += a];}var v = .5,y = e[c];if (!(m = e[g]) || Ms(m)) Sg(Cg, p);else {Ms(m) && !u && (m = p), W(Ig, m, y);var _, x;if ("x" === h || "y" === h) {var w = "x" === h ? 0 : 1;_ = Math.abs(p[w] - y[w]), x = Math.abs(p[w] - m[w]);} else _ = Eh(p, y), x = Eh(p, m);Mg(Cg, p, Ig, -l * (1 - (v = x / (x + _))));}wg(Tg, Tg, s), bg(Tg, Tg, o), wg(Cg, Cg, s), bg(Cg, Cg, o), t.bezierCurveTo(Tg[0], Tg[1], Cg[0], Cg[1], p[0], p[1]), Mg(Tg, p, Ig, l * v);} else t.lineTo(p[0], p[1]);c = f, f += a;}return d;}function Cs(t, e) {var n = [1 / 0, 1 / 0],i = [-1 / 0, -1 / 0];if (e) for (var r = 0; r < t.length; r++) {var a = t[r];a[0] < n[0] && (n[0] = a[0]), a[1] < n[1] && (n[1] = a[1]), a[0] > i[0] && (i[0] = a[0]), a[1] > i[1] && (i[1] = a[1]);}return { min: e ? n : i, max: e ? i : n };}function Ds(t, e) {if (t.length === e.length) {for (var n = 0; n < t.length; n++) {var i = t[n],r = e[n];if (i[0] !== r[0] || i[1] !== r[1]) return;}return !0;}}function ks(t) {return "number" == typeof t ? t : t ? .5 : 0;}function As(t) {var e = t.getGlobalExtent();if (t.onBand) {var n = t.getBandWidth() / 2 - 1,i = e[1] > e[0] ? 1 : -1;e[0] += i * n, e[1] -= i * n;}return e;}function Ls(t, e, n) {if (!n.valueDim) return [];for (var i = [], r = 0, a = e.count(); r < a; r++) {i.push(ws(n, t, e, r));}return i;}function Ps(t, e, n, i) {var r = As(t.getAxis("x")),a = As(t.getAxis("y")),o = t.getBaseAxis().isHorizontal(),s = Math.min(r[0], r[1]),l = Math.min(a[0], a[1]),h = Math.max(r[0], r[1]) - s,u = Math.max(a[0], a[1]) - l;if (n) s -= .5, h += .5, l -= .5, u += .5;else {var c = i.get("lineStyle.width") || 2,f = i.get("clipOverflow") ? c / 2 : Math.max(h, u);o ? (l -= f, u += 2 * f) : (s -= f, h += 2 * f);}var d = new Cf({ shape: { x: s, y: l, width: h, height: u } });return e && (d.shape[o ? "width" : "height"] = 0, Ui(d, { shape: { width: h, height: u } }, i)), d;}function Os(t, e, n, i) {var r = t.getAngleAxis(),a = t.getRadiusAxis().getExtent().slice();a[0] > a[1] && a.reverse();var o = r.getExtent(),s = Math.PI / 180;n && (a[0] -= .5, a[1] += .5);var l = new wf({ shape: { cx: nr(t.cx, 1), cy: nr(t.cy, 1), r0: nr(a[0], 1), r: nr(a[1], 1), startAngle: -o[0] * s, endAngle: -o[1] * s, clockwise: r.inverse } });return e && (l.shape.endAngle = -o[0] * s, Ui(l, { shape: { endAngle: -o[1] * s } }, i)), l;}function Es(t, e, n, i) {return "polar" === t.type ? Os(t, e, n, i) : Ps(t, e, n, i);}function Ns(t, e, n) {for (var i = e.getBaseAxis(), r = "x" === i.dim || "radius" === i.dim ? 0 : 1, a = [], o = 0; o < t.length - 1; o++) {var s = t[o + 1],l = t[o];a.push(l);var h = [];switch (n) {case "end":h[r] = s[r], h[1 - r] = l[1 - r], a.push(h);break;case "middle":var u = (l[r] + s[r]) / 2,c = [];h[r] = c[r] = u, h[1 - r] = l[1 - r], c[1 - r] = s[1 - r], a.push(h), a.push(c);break;default:h[r] = l[r], h[1 - r] = s[1 - r], a.push(h);}}return t[o] && a.push(t[o]), a;}function Rs(t, e) {var n = t.getVisual("visualMeta");if (n && n.length && t.count() && "cartesian2d" === e.type) {for (var i, r, a = n.length - 1; a >= 0; a--) {var o = n[a].dimension,s = t.dimensions[o],l = t.getDimensionInfo(s);if ("x" === (i = l && l.coordDim) || "y" === i) {r = n[a];break;}}if (r) {var h = e.getAxis(i),u = d(r.stops, function (t) {return { coord: h.toGlobalCoord(h.dataToCoord(t.value)), color: t.color };}),c = u.length,p = r.outerColors.slice();c && u[0].coord > u[c - 1].coord && (u.reverse(), p.reverse());var g = u[0].coord - 10,m = u[c - 1].coord + 10,v = m - g;if (v < .001) return "transparent";f(u, function (t) {t.offset = (t.coord - g) / v;}), u.push({ offset: c ? u[c - 1].offset : .5, color: p[1] || "transparent" }), u.unshift({ offset: c ? u[0].offset : .5, color: p[0] || "transparent" });var y = new Ef(0, 0, 0, 0, u, !0);return y[i] = g, y[i + "2"] = m, y;}}}function Bs(t, e, n) {var i = t.get("showAllSymbol"),r = "auto" === i;if (!i || r) {var a = n.getAxesByScale("ordinal")[0];if (a && (!r || !zs(a, e))) {var o = e.mapDimension(a.dim),s = {};return f(a.getViewLabels(), function (t) {s[t.tickValue] = 1;}), function (t) {return !s.hasOwnProperty(e.get(o, t));};}}}function zs(t, e) {var n = t.getExtent(),i = Math.abs(n[1] - n[0]) / t.scale.count();isNaN(i) && (i = 0);for (var r = e.count(), a = Math.max(1, Math.round(r / 5)), o = 0; o < r; o += a) {if (1.5 * fs.getSymbolSize(e, o)[t.isHorizontal() ? 1 : 0] > i) return !1;}return !0;}function Fs(t) {this._setting = t || {}, this._extent = [1 / 0, -1 / 0], this._interval = 0, this.init && this.init.apply(this, arguments);}function Vs(t) {this.categories = t.categories || [], this._needCollect = t.needCollect, this._deduplication = t.deduplication, this._map;}function Ws(t) {return t._map || (t._map = R(t.categories));}function Hs(t) {return w(t) && null != t.value ? t.value : t + "";}function Gs(t, e, n, i) {var r = {},a = t[1] - t[0],o = r.interval = cr(a / e, !0);null != n && o < n && (o = r.interval = n), null != i && o > i && (o = r.interval = i);var s = r.intervalPrecision = qs(o);return Us(r.niceTickExtent = [Ng(Math.ceil(t[0] / o) * o, s), Ng(Math.floor(t[1] / o) * o, s)], t), r;}function qs(t) {return ir(t) + 2;}function Xs(t, e, n) {t[e] = Math.max(Math.min(t[e], n[1]), n[0]);}function Us(t, e) {!isFinite(t[0]) && (t[0] = e[0]), !isFinite(t[1]) && (t[1] = e[1]), Xs(t, 0, e), Xs(t, 1, e), t[0] > t[1] && (t[0] = t[1]);}function Ys(t, e, n, i) {var r = [];if (!t) return r;e[0] < n[0] && r.push(e[0]);for (var a = n[0]; a <= n[1] && (r.push(a), (a = Ng(a + t, i)) !== r[r.length - 1]);) {if (r.length > 1e4) return [];}return e[1] > (r.length ? r[r.length - 1] : n[1]) && r.push(e[1]), r;}function js(t) {return t.get("stack") || zg + t.seriesIndex;}function Zs(t) {return t.dim + t.index;}function $s(t, e) {var n = [];return e.eachSeriesByType(t, function (t) {tl(t) && !el(t) && n.push(t);}), n;}function Ks(t) {var e = [];return f(t, function (t) {var n = t.getData(),i = t.coordinateSystem.getBaseAxis(),r = i.getExtent(),a = "category" === i.type ? i.getBandWidth() : Math.abs(r[1] - r[0]) / n.count(),o = er(t.get("barWidth"), a),s = er(t.get("barMaxWidth"), a),l = t.get("barGap"),h = t.get("barCategoryGap");e.push({ bandWidth: a, barWidth: o, barMaxWidth: s, barGap: l, barCategoryGap: h, axisKey: Zs(i), stackId: js(t) });}), Qs(e);}function Qs(t) {var e = {};f(t, function (t, n) {var i = t.axisKey,r = t.bandWidth,a = e[i] || { bandWidth: r, remainedWidth: r, autoWidthCount: 0, categoryGap: "20%", gap: "30%", stacks: {} },o = a.stacks;e[i] = a;var s = t.stackId;o[s] || a.autoWidthCount++, o[s] = o[s] || { width: 0, maxWidth: 0 };var l = t.barWidth;l && !o[s].width && (o[s].width = l, l = Math.min(a.remainedWidth, l), a.remainedWidth -= l);var h = t.barMaxWidth;h && (o[s].maxWidth = h);var u = t.barGap;null != u && (a.gap = u);var c = t.barCategoryGap;null != c && (a.categoryGap = c);});var n = {};return f(e, function (t, e) {n[e] = {};var i = t.stacks,r = t.bandWidth,a = er(t.categoryGap, r),o = er(t.gap, 1),s = t.remainedWidth,l = t.autoWidthCount,h = (s - a) / (l + (l - 1) * o);h = Math.max(h, 0), f(i, function (t, e) {var n = t.maxWidth;n && n < h && (n = Math.min(n, s), t.width && (n = Math.min(n, t.width)), s -= n, t.width = n, l--);}), h = (s - a) / (l + (l - 1) * o), h = Math.max(h, 0);var u,c = 0;f(i, function (t, e) {t.width || (t.width = h), u = t, c += t.width * (1 + o);}), u && (c -= u.width * o);var d = -c / 2;f(i, function (t, i) {n[e][i] = n[e][i] || { offset: d, width: t.width }, d += t.width * (1 + o);});}), n;}function Js(t, e, n) {if (t && e) {var i = t[Zs(e)];return null != i && null != n && (i = i[js(n)]), i;}}function tl(t) {return t.coordinateSystem && "cartesian2d" === t.coordinateSystem.type;}function el(t) {return t.pipelineContext && t.pipelineContext.large;}function nl(t, e, n) {return l(t.getAxesOnZeroOf(), e) >= 0 || n ? e.toGlobalCoord(e.dataToCoord(0)) : e.getGlobalExtent()[0];}function il(t, e) {return $g(t, Zg(e));}function rl(t, e) {var n,i,r,a = t.type,o = e.getMin(),s = e.getMax(),l = null != o,h = null != s,u = t.getExtent();"ordinal" === a ? n = e.getCategories().length : (y(i = e.get("boundaryGap")) || (i = [i || 0, i || 0]), "boolean" == typeof i[0] && (i = [0, 0]), i[0] = er(i[0], 1), i[1] = er(i[1], 1), r = u[1] - u[0] || Math.abs(u[0])), null == o && (o = "ordinal" === a ? n ? 0 : NaN : u[0] - i[0] * r), null == s && (s = "ordinal" === a ? n ? n - 1 : NaN : u[1] + i[1] * r), "dataMin" === o ? o = u[0] : "function" == typeof o && (o = o({ min: u[0], max: u[1] })), "dataMax" === s ? s = u[1] : "function" == typeof s && (s = s({ min: u[0], max: u[1] })), (null == o || !isFinite(o)) && (o = NaN), (null == s || !isFinite(s)) && (s = NaN), t.setBlank(I(o) || I(s) || "ordinal" === a && !t.getOrdinalMeta().categories.length), e.getNeedCrossZero() && (o > 0 && s > 0 && !l && (o = 0), o < 0 && s < 0 && !h && (s = 0));var c = e.ecModel;if (c && "time" === a) {var d,p = $s("bar", c);if (f(p, function (t) {d |= t.getBaseAxis() === e.axis;}), d) {var g = Ks(p),m = al(o, s, e, g);o = m.min, s = m.max;}}return [o, s];}function al(t, e, n, i) {var r = n.axis.getExtent(),a = r[1] - r[0],o = Js(i, n.axis);if (void 0 === o) return { min: t, max: e };var s = 1 / 0;f(o, function (t) {s = Math.min(t.offset, s);});var l = -1 / 0;f(o, function (t) {l = Math.max(t.offset + t.width, l);}), s = Math.abs(s), l = Math.abs(l);var h = s + l,u = e - t,c = u / (1 - (s + l) / a) - u;return e += c * (l / h), t -= c * (s / h), { min: t, max: e };}function ol(t, e) {var n = rl(t, e),i = null != e.getMin(),r = null != e.getMax(),a = e.get("splitNumber");"log" === t.type && (t.base = e.get("logBase"));var o = t.type;t.setExtent(n[0], n[1]), t.niceExtent({ splitNumber: a, fixMin: i, fixMax: r, minInterval: "interval" === o || "time" === o ? e.get("minInterval") : null, maxInterval: "interval" === o || "time" === o ? e.get("maxInterval") : null });var s = e.get("interval");null != s && t.setInterval && t.setInterval(s);}function sl(t, e) {if (e = e || t.get("type")) switch (e) {case "category":return new Eg(t.getOrdinalMeta ? t.getOrdinalMeta() : t.getCategories(), [1 / 0, -1 / 0]);case "value":return new Bg();default:return (Fs.getClass(e) || Bg).create(t);}}function ll(t) {var e = t.scale.getExtent(),n = e[0],i = e[1];return !(n > 0 && i > 0 || n < 0 && i < 0);}function hl(t) {var e = t.getLabelModel().get("formatter"),n = "category" === t.type ? t.scale.getExtent()[0] : null;return "string" == typeof e ? e = function (t) {return function (e) {return t.replace("{value}", null != e ? e : "");};}(e) : "function" == typeof e ? function (i, r) {return null != n && (r = i - n), e(ul(t, i), r);} : function (e) {return t.scale.getLabel(e);};}function ul(t, e) {return "category" === t.type ? t.scale.getLabel(e) : e;}function cl(t) {var e = t.model,n = t.scale;if (e.get("axisLabel.show") && !n.isBlank()) {var i,r,a = "category" === t.type,o = n.getExtent();r = a ? n.count() : (i = n.getTicks()).length;var s,l = t.getLabelModel(),h = hl(t),u = 1;r > 40 && (u = Math.ceil(r / 40));for (var c = 0; c < r; c += u) {var f = h(i ? i[c] : o[0] + c),d = fl(l.getTextRect(f), l.get("rotate") || 0);s ? s.union(d) : s = d;}return s;}}function fl(t, e) {var n = e * Math.PI / 180,i = t.plain(),r = i.width,a = i.height,o = r * Math.cos(n) + a * Math.sin(n),s = r * Math.sin(n) + a * Math.cos(n);return new Rt(i.x, i.y, o, s);}function dl(t) {return this._axes[t];}function pl(t) {nm.call(this, t);}function gl(t) {return "category" === t.type ? vl(t) : xl(t);}function ml(t, e) {return "category" === t.type ? _l(t, e) : { ticks: t.scale.getTicks() };}function vl(t) {var e = t.getLabelModel(),n = yl(t, e);return !e.get("show") || t.scale.isBlank() ? { labels: [], labelCategoryInterval: n.labelCategoryInterval } : n;}function yl(t, e) {var n = wl(t, "labels"),i = kl(e),r = bl(n, i);if (r) return r;var a, o;return a = _(i) ? Dl(t, i) : Cl(t, o = "auto" === i ? Sl(t) : i), Ml(n, i, { labels: a, labelCategoryInterval: o });}function _l(t, e) {var n = wl(t, "ticks"),i = kl(e),r = bl(n, i);if (r) return r;var a, o;if (e.get("show") && !t.scale.isBlank() || (a = []), _(i)) a = Dl(t, i, !0);else if ("auto" === i) {var s = yl(t, t.getLabelModel());o = s.labelCategoryInterval, a = d(s.labels, function (t) {return t.tickValue;});} else a = Cl(t, o = i, !0);return Ml(n, i, { ticks: a, tickCategoryInterval: o });}function xl(t) {var e = t.scale.getTicks(),n = hl(t);return { labels: d(e, function (e, i) {return { formattedLabel: n(e, i), rawLabel: t.scale.getLabel(e), tickValue: e };}) };}function wl(t, e) {return im(t)[e] || (im(t)[e] = []);}function bl(t, e) {for (var n = 0; n < t.length; n++) {if (t[n].key === e) return t[n].value;}}function Ml(t, e, n) {return t.push({ key: e, value: n }), n;}function Sl(t) {var e = im(t).autoInterval;return null != e ? e : im(t).autoInterval = t.calculateCategoryInterval();}function Il(t) {var e = Tl(t),n = hl(t),i = (e.axisRotate - e.labelRotate) / 180 * Math.PI,r = t.scale,a = r.getExtent(),o = r.count();if (a[1] - a[0] < 1) return 0;var s = 1;o > 40 && (s = Math.max(1, Math.floor(o / 40)));for (var l = a[0], h = t.dataToCoord(l + 1) - t.dataToCoord(l), u = Math.abs(h * Math.cos(i)), c = Math.abs(h * Math.sin(i)), f = 0, d = 0; l <= a[1]; l += s) {var p = 0,g = 0,m = ee(n(l), e.font, "center", "top");p = 1.3 * m.width, g = 1.3 * m.height, f = Math.max(f, p, 7), d = Math.max(d, g, 7);}var v = f / u,y = d / c;isNaN(v) && (v = 1 / 0), isNaN(y) && (y = 1 / 0);var _ = Math.max(0, Math.floor(Math.min(v, y))),x = im(t.model),w = x.lastAutoInterval,b = x.lastTickCount;return null != w && null != b && Math.abs(w - _) <= 1 && Math.abs(b - o) <= 1 && w > _ ? _ = w : (x.lastTickCount = o, x.lastAutoInterval = _), _;}function Tl(t) {var e = t.getLabelModel();return { axisRotate: t.getRotate ? t.getRotate() : t.isHorizontal && !t.isHorizontal() ? 90 : 0, labelRotate: e.get("rotate") || 0, font: e.getFont() };}function Cl(t, e, n) {function i(t) {l.push(n ? t : { formattedLabel: r(t), rawLabel: a.getLabel(t), tickValue: t });}var r = hl(t),a = t.scale,o = a.getExtent(),s = t.getLabelModel(),l = [],h = Math.max((e || 0) + 1, 1),u = o[0],c = a.count();0 !== u && h > 1 && c / h > 2 && (u = Math.round(Math.ceil(u / h) * h));var f = { min: s.get("showMinLabel"), max: s.get("showMaxLabel") };f.min && u !== o[0] && i(o[0]);for (var d = u; d <= o[1]; d += h) {i(d);}return f.max && d !== o[1] && i(o[1]), l;}function Dl(t, e, n) {var i = t.scale,r = hl(t),a = [];return f(i.getTicks(), function (t) {var o = i.getLabel(t);e(t, o) && a.push(n ? t : { formattedLabel: r(t), rawLabel: o, tickValue: t });}), a;}function kl(t) {var e = t.get("interval");return null == e ? "auto" : e;}function Al(t, e) {var n = (t[1] - t[0]) / e / 2;t[0] += n, t[1] -= n;}function Ll(t, e, n, i, r) {function a(t, e) {return u ? t > e : t < e;}var o = e.length;if (t.onBand && !i && o) {var s,l = t.getExtent();if (1 === o) e[0].coord = l[0], s = e[1] = { coord: l[0] };else {var h = e[1].coord - e[0].coord;f(e, function (t) {t.coord -= h / 2;var e = e || 0;e % 2 > 0 && (t.coord -= h / (2 * (e + 1)));}), s = { coord: e[o - 1].coord + h }, e.push(s);}var u = l[0] > l[1];a(e[0].coord, l[0]) && (r ? e[0].coord = l[0] : e.shift()), r && a(l[0], e[0].coord) && e.unshift({ coord: l[0] }), a(l[1], s.coord) && (r ? s.coord = l[1] : e.pop()), r && a(s.coord, l[1]) && e.push({ coord: l[1] });}}function Pl(t, e) {return e.type || (e.data ? "category" : "value");}function Ol(t, e, n) {return t.getCoordSysModel() === e;}function El(t, e, n) {this._coordsMap = {}, this._coordsList = [], this._axesMap = {}, this._axesList = [], this._initCartesian(t, e, n), this.model = t;}function Nl(t, e, n) {n.getAxesOnZeroOf = function () {return i ? [i] : [];};var i,r = t[e],a = n.model,o = a.get("axisLine.onZero"),s = a.get("axisLine.onZeroAxisIndex");if (o) if (null == s) {for (var l in r) {if (r.hasOwnProperty(l) && Rl(r[l])) {i = r[l];break;}}} else Rl(r[s]) && (i = r[s]);}function Rl(t) {return t && "category" !== t.type && "time" !== t.type && ll(t);}function Bl(t, e) {var n = t.getExtent(),i = n[0] + n[1];t.toGlobalCoord = "x" === t.dim ? function (t) {return t + e;} : function (t) {return i - t + e;}, t.toLocalCoord = "x" === t.dim ? function (t) {return t - e;} : function (t) {return i - t + e;};}function zl(t, e) {return d(gm, function (e) {return t.getReferringComponents(e)[0];});}function Fl(t) {return "cartesian2d" === t.get("coordinateSystem");}function Vl(t) {var e = { componentType: t.mainType };return e[t.mainType + "Index"] = t.componentIndex, e;}function Wl(t, e, n, i) {var r,a,o = or(n - t.rotation),s = i[0] > i[1],l = "start" === e && !s || "start" !== e && s;return sr(o - mm / 2) ? (a = l ? "bottom" : "top", r = "center") : sr(o - 1.5 * mm) ? (a = l ? "top" : "bottom", r = "center") : (a = "middle", r = o < 1.5 * mm && o > mm / 2 ? l ? "left" : "right" : l ? "right" : "left"), { rotation: o, textAlign: r, textVerticalAlign: a };}function Hl(t) {var e = t.get("tooltip");return t.get("silent") || !(t.get("triggerEvent") || e && e.show);}function Gl(t, e, n) {var i = t.get("axisLabel.showMinLabel"),r = t.get("axisLabel.showMaxLabel");e = e || [], n = n || [];var a = e[0],o = e[1],s = e[e.length - 1],l = e[e.length - 2],h = n[0],u = n[1],c = n[n.length - 1],f = n[n.length - 2];!1 === i ? (ql(a), ql(h)) : Xl(a, o) && (i ? (ql(o), ql(u)) : (ql(a), ql(h))), !1 === r ? (ql(s), ql(c)) : Xl(l, s) && (r ? (ql(l), ql(f)) : (ql(s), ql(c)));}function ql(t) {t && (t.ignore = !0);}function Xl(t, e, n) {var i = t && t.getBoundingRect().clone(),r = e && e.getBoundingRect().clone();if (i && r) {var a = nt([]);return ot(a, a, -t.rotation), i.applyTransform(rt([], a, t.getLocalTransform())), r.applyTransform(rt([], a, e.getLocalTransform())), i.intersect(r);}}function Ul(t) {return "middle" === t || "center" === t;}function Yl(t, e, n) {var i = e.axis;if (e.get("axisTick.show") && !i.scale.isBlank()) {for (var r = e.getModel("axisTick"), a = r.getModel("lineStyle"), s = r.get("length"), l = i.getTicksCoords(), h = [], u = [], c = t._transform, f = [], d = 0; d < l.length; d++) {var p = l[d].coord;h[0] = p, h[1] = 0, u[0] = p, u[1] = n.tickDirection * s, c && (Y(h, h, c), Y(u, u, c));var g = new Df(xi({ anid: "tick_" + l[d].tickValue, shape: { x1: h[0], y1: h[1], x2: u[0], y2: u[1] }, style: o(a.getLineStyle(), { stroke: e.get("axisLine.lineStyle.color") }), z2: 2, silent: !0 }));t.group.add(g), f.push(g);}return f;}}function jl(t, e, n) {var i = e.axis;if (T(n.axisLabelShow, e.get("axisLabel.show")) && !i.scale.isBlank()) {var r = e.getModel("axisLabel"),a = r.get("margin"),o = i.getViewLabels(),s = (T(n.labelRotate, r.get("rotate")) || 0) * mm / 180,l = _m(n.rotation, s, n.labelDirection),h = e.getCategories(!0),u = [],c = Hl(e),d = e.get("triggerEvent");return f(o, function (o, s) {var f = o.tickValue,p = o.formattedLabel,g = o.rawLabel,m = r;h && h[f] && h[f].textStyle && (m = new Zi(h[f].textStyle, r, e.ecModel));var v = m.getTextColor() || e.get("axisLine.lineStyle.color"),y = [i.dataToCoord(f), n.labelOffset + n.labelDirection * a],_ = new vf({ anid: "label_" + f, position: y, rotation: l.rotation, silent: c, z2: 10 });Ri(_.style, m, { text: p, textAlign: m.getShallow("align", !0) || l.textAlign, textVerticalAlign: m.getShallow("verticalAlign", !0) || m.getShallow("baseline", !0) || l.textVerticalAlign, textFill: "function" == typeof v ? v("category" === i.type ? g : "value" === i.type ? f + "" : f, s) : v }), d && (_.eventData = Vl(e), _.eventData.targetType = "axisLabel", _.eventData.value = g), t._dumbGroup.add(_), _.updateTransform(), u.push(_), t.group.add(_), _.decomposeTransform();}), u;}}function Zl(t) {var e = $l(t);if (e) {var n = e.axisPointerModel,i = e.axis.scale,r = n.option,a = n.get("status"),o = n.get("value");null != o && (o = i.parse(o));var s = Ql(n);null == a && (r.status = s ? "show" : "hide");var l = i.getExtent().slice();l[0] > l[1] && l.reverse(), (null == o || o > l[1]) && (o = l[1]), o < l[0] && (o = l[0]), r.value = o, s && (r.status = e.axis.scale.isBlank() ? "hide" : "show");}}function $l(t) {var e = (t.ecModel.getComponent("axisPointer") || {}).coordSysAxesInfo;return e && e.axesInfo[Jl(t)];}function Kl(t) {var e = $l(t);return e && e.axisPointerModel;}function Ql(t) {return !!t.get("handle.show");}function Jl(t) {return t.type + "||" + t.id;}function th(t, e, n, i, r, a) {var o = xm.getAxisPointerClass(t.axisPointerClass);if (o) {var s = Kl(e);s ? (t._axisPointer || (t._axisPointer = new o())).render(e, s, i, a) : eh(t, i);}}function eh(t, e, n) {var i = t._axisPointer;i && i.dispose(e, n), t._axisPointer = null;}function nh(t, e, n) {n = n || {};var i = t.coordinateSystem,r = e.axis,a = {},o = r.getAxesOnZeroOf()[0],s = r.position,l = o ? "onZero" : s,h = r.dim,u = i.getRect(),c = [u.x, u.x + u.width, u.y, u.y + u.height],f = { left: 0, right: 1, top: 0, bottom: 1, onZero: 2 },d = e.get("offset") || 0,p = "x" === h ? [c[2] - d, c[3] + d] : [c[0] - d, c[1] + d];if (o) {var g = o.toGlobalCoord(o.dataToCoord(0));p[f.onZero] = Math.max(Math.min(g, p[1]), p[0]);}a.position = ["y" === h ? p[f[l]] : c[0], "x" === h ? p[f[l]] : c[3]], a.rotation = Math.PI / 2 * ("x" === h ? 0 : 1);var m = { top: -1, bottom: 1, left: -1, right: 1 };a.labelDirection = a.tickDirection = a.nameDirection = m[s], a.labelOffset = o ? p[f[s]] - p[f.onZero] : 0, e.get("axisTick.inside") && (a.tickDirection = -a.tickDirection), T(n.labelInside, e.get("axisLabel.inside")) && (a.labelDirection = -a.labelDirection);var v = e.get("axisLabel.rotate");return a.labelRotate = "top" === l ? -v : v, a.z2 = 1, a;}function ih(t, e, n, i, r, a, o) {Ni(t, e, n.getModel("label"), n.getModel("emphasis.label"), { labelFetcher: r, labelDataIndex: a, defaultText: cs(r.getData(), a), isRectText: !0, autoColor: i }), rh(t), rh(e);}function rh(t, e) {"outside" === t.textPosition && (t.textPosition = e);}function ah(t, e, n) {n.style.text = null, Xi(n, { shape: { width: 0 } }, e, t, function () {n.parent && n.parent.remove(n);});}function oh(t, e, n) {n.style.text = null, Xi(n, { shape: { r: n.shape.r0 } }, e, t, function () {n.parent && n.parent.remove(n);});}function sh(t, e, n, i, r, a, s, l) {var h = e.getItemVisual(n, "color"),u = e.getItemVisual(n, "opacity"),c = i.getModel("itemStyle"),f = i.getModel("emphasis.itemStyle").getBarItemStyle();l || t.setShape("r", c.get("barBorderRadius") || 0), t.useStyle(o({ fill: h, opacity: u }, c.getBarItemStyle()));var d = i.getShallow("cursor");d && t.attr("cursor", d);var p = s ? r.height > 0 ? "bottom" : "top" : r.width > 0 ? "left" : "right";l || ih(t.style, f, i, h, a, n, p), Ei(t, f);}function lh(t, e) {var n = t.get(Cm) || 0;return Math.min(n, Math.abs(e.width), Math.abs(e.height));}function hh(t, e, n) {var i = t.getData(),r = [],a = i.getLayout("valueAxisHorizontal") ? 1 : 0;r[1 - a] = i.getLayout("valueAxisStart");var o = new Am({ shape: { points: i.getLayout("largePoints") }, incremental: !!n, __startPoint: r, __valueIdx: a });e.add(o), uh(o, t, i);}function uh(t, e, n) {var i = n.getVisual("borderColor") || n.getVisual("color"),r = e.getModel("itemStyle").getItemStyle(["color", "borderColor"]);t.useStyle(r), t.style.fill = null, t.style.stroke = i, t.style.lineWidth = n.getLayout("barWidth");}function ch(t, e, n, i) {var r = e.getData(),a = this.dataIndex,o = r.getName(a),s = e.get("selectedOffset");i.dispatchAction({ type: "pieToggleSelect", from: t, name: o, seriesId: e.id }), r.each(function (t) {fh(r.getItemGraphicEl(t), r.getItemLayout(t), e.isSelected(r.getName(t)), s, n);});}function fh(t, e, n, i, r) {var a = (e.startAngle + e.endAngle) / 2,o = Math.cos(a),s = Math.sin(a),l = n ? i : 0,h = [o * l, s * l];r ? t.animate().when(200, { position: h }).start("bounceOut") : t.attr("position", h);}function dh(t, e) {function n() {a.ignore = a.hoverIgnore, o.ignore = o.hoverIgnore;}function i() {a.ignore = a.normalIgnore, o.ignore = o.normalIgnore;}du.call(this);var r = new wf({ z2: 2 }),a = new Tf(),o = new vf();this.add(r), this.add(a), this.add(o), this.updateData(t, e, !0), this.on("emphasis", n).on("normal", i).on("mouseover", n).on("mouseout", i);}function ph(t, e, n, i, r, a, o) {function s(e, n) {for (var i = e; i >= 0 && (t[i].y -= n, !(i > 0 && t[i].y > t[i - 1].y + t[i - 1].height)); i--) {;}}function l(t, e, n, i, r, a) {for (var o = e ? Number.MAX_VALUE : 0, s = 0, l = t.length; s < l; s++) {if ("center" !== t[s].position) {var h = Math.abs(t[s].y - i),u = t[s].len,c = t[s].len2,f = h < r + u ? Math.sqrt((r + u + c) * (r + u + c) - h * h) : Math.abs(t[s].x - n);e && f >= o && (f = o - 10), !e && f <= o && (f = o + 10), t[s].x = n + f * a, o = f;}}}t.sort(function (t, e) {return t.y - e.y;});for (var h, u = 0, c = t.length, f = [], d = [], p = 0; p < c; p++) {(h = t[p].y - u) < 0 && function (e, n, i, r) {for (var a = e; a < n; a++) {if (t[a].y += i, a > e && a + 1 < n && t[a + 1].y > t[a].y + t[a].height) return void s(a, i / 2);}s(n - 1, i / 2);}(p, c, -h), u = t[p].y + t[p].height;}o - u < 0 && s(c - 1, u - o);for (p = 0; p < c; p++) {t[p].y >= n ? d.push(t[p]) : f.push(t[p]);}l(f, !1, e, n, i, r), l(d, !0, e, n, i, r);}function gh(t, e, n, i, r, a) {for (var o = [], s = [], l = 0; l < t.length; l++) {t[l].x < e ? o.push(t[l]) : s.push(t[l]);}ph(s, e, n, i, 1, r, a), ph(o, e, n, i, -1, r, a);for (l = 0; l < t.length; l++) {var h = t[l].linePoints;if (h) {var u = h[1][0] - h[2][0];t[l].x < e ? h[2][0] = t[l].x + 3 : h[2][0] = t[l].x - 3, h[1][1] = h[2][1] = t[l].y, h[1][0] = h[2][0] + u;}}}var mh = 2311,vh = function vh() {return mh++;},yh = {},_h = yh = "object" == typeof wx && "function" == typeof wx.getSystemInfoSync ? { browser: {}, os: {}, node: !1, wxa: !0, canvasSupported: !0, svgSupported: !1, touchEventsSupported: !0 } : "undefined" == typeof document && "undefined" != typeof self ? { browser: {}, os: {}, node: !1, worker: !0, canvasSupported: !0 } : "undefined" == typeof navigator ? { browser: {}, os: {}, node: !0, worker: !1, canvasSupported: !0, svgSupported: !0 } : function (t) {var e = {},n = {},i = t.match(/Firefox\/([\d.]+)/),r = t.match(/MSIE\s([\d.]+)/) || t.match(/Trident\/.+?rv:(([\d.]+))/),a = t.match(/Edge\/([\d.]+)/),o = /micromessenger/i.test(t);return i && (n.firefox = !0, n.version = i[1]), r && (n.ie = !0, n.version = r[1]), a && (n.edge = !0, n.version = a[1]), o && (n.weChat = !0), { browser: n, os: e, node: !1, canvasSupported: !!document.createElement("canvas").getContext, svgSupported: "undefined" != typeof SVGRect, touchEventsSupported: "ontouchstart" in window && !n.ie && !n.edge, pointerEventsSupported: "onpointerdown" in window && (n.edge || n.ie && n.version >= 11) };}(navigator.userAgent),xh = { "[object Function]": 1, "[object RegExp]": 1, "[object Date]": 1, "[object Error]": 1, "[object CanvasGradient]": 1, "[object CanvasPattern]": 1, "[object Image]": 1, "[object Canvas]": 1 },wh = { "[object Int8Array]": 1, "[object Uint8Array]": 1, "[object Uint8ClampedArray]": 1, "[object Int16Array]": 1, "[object Uint16Array]": 1, "[object Int32Array]": 1, "[object Uint32Array]": 1, "[object Float32Array]": 1, "[object Float64Array]": 1 },bh = Object.prototype.toString,Mh = Array.prototype,Sh = Mh.forEach,Ih = Mh.filter,Th = Mh.slice,Ch = Mh.map,Dh = Mh.reduce,kh = {},Ah = function Ah() {return kh.createCanvas();};kh.createCanvas = function () {return document.createElement("canvas");};var Lh,Ph = "__ec_primitive__";N.prototype = { constructor: N, get: function get(t) {return this.hasOwnProperty(t) ? this[t] : null;}, set: function set(t, e) {return this[t] = e;}, each: function each(t, e) {void 0 !== e && (t = m(t, e));for (var n in this) {this.hasOwnProperty(n) && t(this[n], n);}}, removeKey: function removeKey(t) {delete this[t];} };var Oh = "undefined" == typeof Float32Array ? Array : Float32Array,Eh = U,Nh = function Nh(t, e) {return (t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1]);};$.prototype = { constructor: $, _dragStart: function _dragStart(t) {var e = t.target;e && e.draggable && (this._draggingTarget = e, e.dragging = !0, this._x = t.offsetX, this._y = t.offsetY, this.dispatchToElement(K(e, t), "dragstart", t.event));}, _drag: function _drag(t) {var e = this._draggingTarget;if (e) {var n = t.offsetX,i = t.offsetY,r = n - this._x,a = i - this._y;this._x = n, this._y = i, e.drift(r, a, t), this.dispatchToElement(K(e, t), "drag", t.event);var o = this.findHover(n, i, e).target,s = this._dropTarget;this._dropTarget = o, e !== o && (s && o !== s && this.dispatchToElement(K(s, t), "dragleave", t.event), o && o !== s && this.dispatchToElement(K(o, t), "dragenter", t.event));}}, _dragEnd: function _dragEnd(t) {var e = this._draggingTarget;e && (e.dragging = !1), this.dispatchToElement(K(e, t), "dragend", t.event), this._dropTarget && this.dispatchToElement(K(this._dropTarget, t), "drop", t.event), this._draggingTarget = null, this._dropTarget = null;} };var Rh = Array.prototype.slice,Bh = function Bh() {this._$handlers = {};};Bh.prototype = { constructor: Bh, one: function one(t, e, n) {var i = this._$handlers;if (!e || !t) return this;i[t] || (i[t] = []);for (var r = 0; r < i[t].length; r++) {if (i[t][r].h === e) return this;}return i[t].push({ h: e, one: !0, ctx: n || this }), this;}, on: function on(t, e, n) {var i = this._$handlers;if (!e || !t) return this;i[t] || (i[t] = []);for (var r = 0; r < i[t].length; r++) {if (i[t][r].h === e) return this;}return i[t].push({ h: e, one: !1, ctx: n || this }), this;}, isSilent: function isSilent(t) {var e = this._$handlers;return e[t] && e[t].length;}, off: function off(t, e) {var n = this._$handlers;if (!t) return this._$handlers = {}, this;if (e) {if (n[t]) {for (var i = [], r = 0, a = n[t].length; r < a; r++) {n[t][r].h != e && i.push(n[t][r]);}n[t] = i;}n[t] && 0 === n[t].length && delete n[t];} else delete n[t];return this;}, trigger: function trigger(t) {if (this._$handlers[t]) {var e = arguments,n = e.length;n > 3 && (e = Rh.call(e, 1));for (var i = this._$handlers[t], r = i.length, a = 0; a < r;) {switch (n) {case 1:i[a].h.call(i[a].ctx);break;case 2:i[a].h.call(i[a].ctx, e[1]);break;case 3:i[a].h.call(i[a].ctx, e[1], e[2]);break;default:i[a].h.apply(i[a].ctx, e);}i[a].one ? (i.splice(a, 1), r--) : a++;}}return this;}, triggerWithContext: function triggerWithContext(t) {if (this._$handlers[t]) {var e = arguments,n = e.length;n > 4 && (e = Rh.call(e, 1, e.length - 1));for (var i = e[e.length - 1], r = this._$handlers[t], a = r.length, o = 0; o < a;) {switch (n) {case 1:r[o].h.call(i);break;case 2:r[o].h.call(i, e[1]);break;case 3:r[o].h.call(i, e[1], e[2]);break;default:r[o].h.apply(i, e);}r[o].one ? (r.splice(o, 1), a--) : o++;}}return this;} };var zh = "silent";J.prototype.dispose = function () {};var Fh = ["click", "dblclick", "mousewheel", "mouseout", "mouseup", "mousedown", "mousemove", "contextmenu"],Vh = function Vh(t, e, n, i) {Bh.call(this), this.storage = t, this.painter = e, this.painterRoot = i, n = n || new J(), this.proxy = null, this._hovered = {}, this._lastTouchMoment, this._lastX, this._lastY, $.call(this), this.setHandlerProxy(n);};Vh.prototype = { constructor: Vh, setHandlerProxy: function setHandlerProxy(t) {this.proxy && this.proxy.dispose(), t && (f(Fh, function (e) {t.on && t.on(e, this[e], this);}, this), t.handler = this), this.proxy = t;}, mousemove: function mousemove(t) {var e = t.zrX,n = t.zrY,i = this._hovered,r = i.target;r && !r.__zr && (r = (i = this.findHover(i.x, i.y)).target);var a = this._hovered = this.findHover(e, n),o = a.target,s = this.proxy;s.setCursor && s.setCursor(o ? o.cursor : "default"), r && o !== r && this.dispatchToElement(i, "mouseout", t), this.dispatchToElement(a, "mousemove", t), o && o !== r && this.dispatchToElement(a, "mouseover", t);}, mouseout: function mouseout(t) {this.dispatchToElement(this._hovered, "mouseout", t);var e,n = t.toElement || t.relatedTarget;do {n = n && n.parentNode;} while (n && 9 != n.nodeType && !(e = n === this.painterRoot));!e && this.trigger("globalout", { event: t });}, resize: function resize(t) {this._hovered = {};}, dispatch: function dispatch(t, e) {var n = this[t];n && n.call(this, e);}, dispose: function dispose() {this.proxy.dispose(), this.storage = this.proxy = this.painter = null;}, setCursorStyle: function setCursorStyle(t) {var e = this.proxy;e.setCursor && e.setCursor(t);}, dispatchToElement: function dispatchToElement(t, e, n) {var i = (t = t || {}).target;if (!i || !i.silent) {for (var r = "on" + e, a = Q(e, t, n); i && (i[r] && (a.cancelBubble = i[r].call(i, a)), i.trigger(e, a), i = i.parent, !a.cancelBubble);) {;}a.cancelBubble || (this.trigger(e, a), this.painter && this.painter.eachOtherLayer(function (t) {"function" == typeof t[r] && t[r].call(t, a), t.trigger && t.trigger(e, a);}));}}, findHover: function findHover(t, e, n) {for (var i = this.storage.getDisplayList(), r = { x: t, y: e }, a = i.length - 1; a >= 0; a--) {var o;if (i[a] !== n && !i[a].ignore && (o = tt(i[a], t, e)) && (!r.topTarget && (r.topTarget = i[a]), o !== zh)) {r.target = i[a];break;}}return r;} }, f(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function (t) {Vh.prototype[t] = function (e) {var n = this.findHover(e.zrX, e.zrY),i = n.target;if ("mousedown" === t) this._downEl = i, this._downPoint = [e.zrX, e.zrY], this._upEl = i;else if ("mouseup" === t) this._upEl = i;else if ("click" === t) {if (this._downEl !== this._upEl || !this._downPoint || Eh(this._downPoint, [e.zrX, e.zrY]) > 4) return;this._downPoint = null;}this.dispatchToElement(n, t, e);};}), u(Vh, Bh), u(Vh, $);var Wh = "undefined" == typeof Float32Array ? Array : Float32Array,Hh = nt,Gh = 5e-5,qh = function qh(t) {(t = t || {}).position || (this.position = [0, 0]), null == t.rotation && (this.rotation = 0), t.scale || (this.scale = [1, 1]), this.origin = this.origin || null;},Xh = qh.prototype;Xh.transform = null, Xh.needLocalTransform = function () {return ht(this.rotation) || ht(this.position[0]) || ht(this.position[1]) || ht(this.scale[0] - 1) || ht(this.scale[1] - 1);}, Xh.updateTransform = function () {var t = this.parent,e = t && t.transform,n = this.needLocalTransform(),i = this.transform;n || e ? (i = i || et(), n ? this.getLocalTransform(i) : Hh(i), e && (n ? rt(i, t.transform, i) : it(i, t.transform)), this.transform = i, this.invTransform = this.invTransform || et(), lt(this.invTransform, i)) : i && Hh(i);}, Xh.getLocalTransform = function (t) {return qh.getLocalTransform(this, t);}, Xh.setTransform = function (t) {var e = this.transform,n = t.dpr || 1;e ? t.setTransform(n * e[0], n * e[1], n * e[2], n * e[3], n * e[4], n * e[5]) : t.setTransform(n, 0, 0, n, 0, 0);}, Xh.restoreTransform = function (t) {var e = t.dpr || 1;t.setTransform(e, 0, 0, e, 0, 0);};var Uh = [];Xh.decomposeTransform = function () {if (this.transform) {var t = this.parent,e = this.transform;t && t.transform && (rt(Uh, t.invTransform, e), e = Uh);var n = e[0] * e[0] + e[1] * e[1],i = e[2] * e[2] + e[3] * e[3],r = this.position,a = this.scale;ht(n - 1) && (n = Math.sqrt(n)), ht(i - 1) && (i = Math.sqrt(i)), e[0] < 0 && (n = -n), e[3] < 0 && (i = -i), r[0] = e[4], r[1] = e[5], a[0] = n, a[1] = i, this.rotation = Math.atan2(-e[1] / i, e[0] / n);}}, Xh.getGlobalScale = function () {var t = this.transform;if (!t) return [1, 1];var e = Math.sqrt(t[0] * t[0] + t[1] * t[1]),n = Math.sqrt(t[2] * t[2] + t[3] * t[3]);return t[0] < 0 && (e = -e), t[3] < 0 && (n = -n), [e, n];}, Xh.transformCoordToLocal = function (t, e) {var n = [t, e],i = this.invTransform;return i && Y(n, n, i), n;}, Xh.transformCoordToGlobal = function (t, e) {var n = [t, e],i = this.transform;return i && Y(n, n, i), n;}, qh.getLocalTransform = function (t, e) {Hh(e = e || []);var n = t.origin,i = t.scale || [1, 1],r = t.rotation || 0,a = t.position || [0, 0];return n && (e[4] -= n[0], e[5] -= n[1]), st(e, e, i), r && ot(e, e, r), n && (e[4] += n[0], e[5] += n[1]), e[4] += a[0], e[5] += a[1], e;};var Yh = { linear: function linear(t) {return t;}, quadraticIn: function quadraticIn(t) {return t * t;}, quadraticOut: function quadraticOut(t) {return t * (2 - t);}, quadraticInOut: function quadraticInOut(t) {return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1);}, cubicIn: function cubicIn(t) {return t * t * t;}, cubicOut: function cubicOut(t) {return --t * t * t + 1;}, cubicInOut: function cubicInOut(t) {return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2);}, quarticIn: function quarticIn(t) {return t * t * t * t;}, quarticOut: function quarticOut(t) {return 1 - --t * t * t * t;}, quarticInOut: function quarticInOut(t) {return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2);}, quinticIn: function quinticIn(t) {return t * t * t * t * t;}, quinticOut: function quinticOut(t) {return --t * t * t * t * t + 1;}, quinticInOut: function quinticInOut(t) {return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2);}, sinusoidalIn: function sinusoidalIn(t) {return 1 - Math.cos(t * Math.PI / 2);}, sinusoidalOut: function sinusoidalOut(t) {return Math.sin(t * Math.PI / 2);}, sinusoidalInOut: function sinusoidalInOut(t) {return .5 * (1 - Math.cos(Math.PI * t));}, exponentialIn: function exponentialIn(t) {return 0 === t ? 0 : Math.pow(1024, t - 1);}, exponentialOut: function exponentialOut(t) {return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);}, exponentialInOut: function exponentialInOut(t) {return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)));}, circularIn: function circularIn(t) {return 1 - Math.sqrt(1 - t * t);}, circularOut: function circularOut(t) {return Math.sqrt(1 - --t * t);}, circularInOut: function circularInOut(t) {return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);}, elasticIn: function elasticIn(t) {var e,n = .1;return 0 === t ? 0 : 1 === t ? 1 : (!n || n < 1 ? (n = 1, e = .1) : e = .4 * Math.asin(1 / n) / (2 * Math.PI), -n * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / .4));}, elasticOut: function elasticOut(t) {var e,n = .1;return 0 === t ? 0 : 1 === t ? 1 : (!n || n < 1 ? (n = 1, e = .1) : e = .4 * Math.asin(1 / n) / (2 * Math.PI), n * Math.pow(2, -10 * t) * Math.sin((t - e) * (2 * Math.PI) / .4) + 1);}, elasticInOut: function elasticInOut(t) {var e,n = .1;return 0 === t ? 0 : 1 === t ? 1 : (!n || n < 1 ? (n = 1, e = .1) : e = .4 * Math.asin(1 / n) / (2 * Math.PI), (t *= 2) < 1 ? n * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / .4) * -.5 : n * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / .4) * .5 + 1);}, backIn: function backIn(t) {var e = 1.70158;return t * t * ((e + 1) * t - e);}, backOut: function backOut(t) {var e = 1.70158;return --t * t * ((e + 1) * t + e) + 1;}, backInOut: function backInOut(t) {var e = 2.5949095;return (t *= 2) < 1 ? t * t * ((e + 1) * t - e) * .5 : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2);}, bounceIn: function bounceIn(t) {return 1 - Yh.bounceOut(1 - t);}, bounceOut: function bounceOut(t) {return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;}, bounceInOut: function bounceInOut(t) {return t < .5 ? .5 * Yh.bounceIn(2 * t) : .5 * Yh.bounceOut(2 * t - 1) + .5;} };ut.prototype = { constructor: ut, step: function step(t, e) {if (this._initialized || (this._startTime = t + this._delay, this._initialized = !0), this._paused) this._pausedTime += e;else {var n = (t - this._startTime - this._pausedTime) / this._life;if (!(n < 0)) {n = Math.min(n, 1);var i = this.easing,r = "string" == typeof i ? Yh[i] : i,a = "function" == typeof r ? r(n) : n;return this.fire("frame", a), 1 == n ? this.loop ? (this.restart(t), "restart") : (this._needsRemove = !0, "destroy") : null;}}}, restart: function restart(t) {var e = (t - this._startTime - this._pausedTime) % this._life;this._startTime = t - e + this.gap, this._pausedTime = 0, this._needsRemove = !1;}, fire: function fire(t, e) {this[t = "on" + t] && this[t](this._target, e);}, pause: function pause() {this._paused = !0;}, resume: function resume() {this._paused = !1;} };var jh = function jh() {this.head = null, this.tail = null, this._len = 0;},Zh = jh.prototype;Zh.insert = function (t) {var e = new $h(t);return this.insertEntry(e), e;}, Zh.insertEntry = function (t) {this.head ? (this.tail.next = t, t.prev = this.tail, t.next = null, this.tail = t) : this.head = this.tail = t, this._len++;}, Zh.remove = function (t) {var e = t.prev,n = t.next;e ? e.next = n : this.head = n, n ? n.prev = e : this.tail = e, t.next = t.prev = null, this._len--;}, Zh.len = function () {return this._len;}, Zh.clear = function () {this.head = this.tail = null, this._len = 0;};var $h = function $h(t) {this.value = t, this.next, this.prev;},Kh = function Kh(t) {this._list = new jh(), this._map = {}, this._maxSize = t || 10, this._lastRemovedEntry = null;},Qh = Kh.prototype;Qh.put = function (t, e) {var n = this._list,i = this._map,r = null;if (null == i[t]) {var a = n.len(),o = this._lastRemovedEntry;if (a >= this._maxSize && a > 0) {var s = n.head;n.remove(s), delete i[s.key], r = s.value, this._lastRemovedEntry = s;}o ? o.value = e : o = new $h(e), o.key = t, n.insertEntry(o), i[t] = o;}return r;}, Qh.get = function (t) {var e = this._map[t],n = this._list;if (null != e) return e !== n.tail && (n.remove(e), n.insertEntry(e)), e.value;}, Qh.clear = function () {this._list.clear(), this._map = {};};var Jh = { transparent: [0, 0, 0, 0], aliceblue: [240, 248, 255, 1], antiquewhite: [250, 235, 215, 1], aqua: [0, 255, 255, 1], aquamarine: [127, 255, 212, 1], azure: [240, 255, 255, 1], beige: [245, 245, 220, 1], bisque: [255, 228, 196, 1], black: [0, 0, 0, 1], blanchedalmond: [255, 235, 205, 1], blue: [0, 0, 255, 1], blueviolet: [138, 43, 226, 1], brown: [165, 42, 42, 1], burlywood: [222, 184, 135, 1], cadetblue: [95, 158, 160, 1], chartreuse: [127, 255, 0, 1], chocolate: [210, 105, 30, 1], coral: [255, 127, 80, 1], cornflowerblue: [100, 149, 237, 1], cornsilk: [255, 248, 220, 1], crimson: [220, 20, 60, 1], cyan: [0, 255, 255, 1], darkblue: [0, 0, 139, 1], darkcyan: [0, 139, 139, 1], darkgoldenrod: [184, 134, 11, 1], darkgray: [169, 169, 169, 1], darkgreen: [0, 100, 0, 1], darkgrey: [169, 169, 169, 1], darkkhaki: [189, 183, 107, 1], darkmagenta: [139, 0, 139, 1], darkolivegreen: [85, 107, 47, 1], darkorange: [255, 140, 0, 1], darkorchid: [153, 50, 204, 1], darkred: [139, 0, 0, 1], darksalmon: [233, 150, 122, 1], darkseagreen: [143, 188, 143, 1], darkslateblue: [72, 61, 139, 1], darkslategray: [47, 79, 79, 1], darkslategrey: [47, 79, 79, 1], darkturquoise: [0, 206, 209, 1], darkviolet: [148, 0, 211, 1], deeppink: [255, 20, 147, 1], deepskyblue: [0, 191, 255, 1], dimgray: [105, 105, 105, 1], dimgrey: [105, 105, 105, 1], dodgerblue: [30, 144, 255, 1], firebrick: [178, 34, 34, 1], floralwhite: [255, 250, 240, 1], forestgreen: [34, 139, 34, 1], fuchsia: [255, 0, 255, 1], gainsboro: [220, 220, 220, 1], ghostwhite: [248, 248, 255, 1], gold: [255, 215, 0, 1], goldenrod: [218, 165, 32, 1], gray: [128, 128, 128, 1], green: [0, 128, 0, 1], greenyellow: [173, 255, 47, 1], grey: [128, 128, 128, 1], honeydew: [240, 255, 240, 1], hotpink: [255, 105, 180, 1], indianred: [205, 92, 92, 1], indigo: [75, 0, 130, 1], ivory: [255, 255, 240, 1], khaki: [240, 230, 140, 1], lavender: [230, 230, 250, 1], lavenderblush: [255, 240, 245, 1], lawngreen: [124, 252, 0, 1], lemonchiffon: [255, 250, 205, 1], lightblue: [173, 216, 230, 1], lightcoral: [240, 128, 128, 1], lightcyan: [224, 255, 255, 1], lightgoldenrodyellow: [250, 250, 210, 1], lightgray: [211, 211, 211, 1], lightgreen: [144, 238, 144, 1], lightgrey: [211, 211, 211, 1], lightpink: [255, 182, 193, 1], lightsalmon: [255, 160, 122, 1], lightseagreen: [32, 178, 170, 1], lightskyblue: [135, 206, 250, 1], lightslategray: [119, 136, 153, 1], lightslategrey: [119, 136, 153, 1], lightsteelblue: [176, 196, 222, 1], lightyellow: [255, 255, 224, 1], lime: [0, 255, 0, 1], limegreen: [50, 205, 50, 1], linen: [250, 240, 230, 1], magenta: [255, 0, 255, 1], maroon: [128, 0, 0, 1], mediumaquamarine: [102, 205, 170, 1], mediumblue: [0, 0, 205, 1], mediumorchid: [186, 85, 211, 1], mediumpurple: [147, 112, 219, 1], mediumseagreen: [60, 179, 113, 1], mediumslateblue: [123, 104, 238, 1], mediumspringgreen: [0, 250, 154, 1], mediumturquoise: [72, 209, 204, 1], mediumvioletred: [199, 21, 133, 1], midnightblue: [25, 25, 112, 1], mintcream: [245, 255, 250, 1], mistyrose: [255, 228, 225, 1], moccasin: [255, 228, 181, 1], navajowhite: [255, 222, 173, 1], navy: [0, 0, 128, 1], oldlace: [253, 245, 230, 1], olive: [128, 128, 0, 1], olivedrab: [107, 142, 35, 1], orange: [255, 165, 0, 1], orangered: [255, 69, 0, 1], orchid: [218, 112, 214, 1], palegoldenrod: [238, 232, 170, 1], palegreen: [152, 251, 152, 1], paleturquoise: [175, 238, 238, 1], palevioletred: [219, 112, 147, 1], papayawhip: [255, 239, 213, 1], peachpuff: [255, 218, 185, 1], peru: [205, 133, 63, 1], pink: [255, 192, 203, 1], plum: [221, 160, 221, 1], powderblue: [176, 224, 230, 1], purple: [128, 0, 128, 1], red: [255, 0, 0, 1], rosybrown: [188, 143, 143, 1], royalblue: [65, 105, 225, 1], saddlebrown: [139, 69, 19, 1], salmon: [250, 128, 114, 1], sandybrown: [244, 164, 96, 1], seagreen: [46, 139, 87, 1], seashell: [255, 245, 238, 1], sienna: [160, 82, 45, 1], silver: [192, 192, 192, 1], skyblue: [135, 206, 235, 1], slateblue: [106, 90, 205, 1], slategray: [112, 128, 144, 1], slategrey: [112, 128, 144, 1], snow: [255, 250, 250, 1], springgreen: [0, 255, 127, 1], steelblue: [70, 130, 180, 1], tan: [210, 180, 140, 1], teal: [0, 128, 128, 1], thistle: [216, 191, 216, 1], tomato: [255, 99, 71, 1], turquoise: [64, 224, 208, 1], violet: [238, 130, 238, 1], wheat: [245, 222, 179, 1], white: [255, 255, 255, 1], whitesmoke: [245, 245, 245, 1], yellow: [255, 255, 0, 1], yellowgreen: [154, 205, 50, 1] },tu = new Kh(20),eu = null,nu = Array.prototype.slice,iu = function iu(t, e, n, i) {this._tracks = {}, this._target = t, this._loop = e || !1, this._getter = n || Mt, this._setter = i || St, this._clipCount = 0, this._delay = 0, this._doneList = [], this._onframeList = [], this._clipList = [];};iu.prototype = { when: function when(t, e) {var n = this._tracks;for (var i in e) {if (e.hasOwnProperty(i)) {if (!n[i]) {n[i] = [];var r = this._getter(this._target, i);if (null == r) continue;0 !== t && n[i].push({ time: 0, value: Pt(r) });}n[i].push({ time: t, value: e[i] });}}return this;}, during: function during(t) {return this._onframeList.push(t), this;}, pause: function pause() {for (var t = 0; t < this._clipList.length; t++) {this._clipList[t].pause();}this._paused = !0;}, resume: function resume() {for (var t = 0; t < this._clipList.length; t++) {this._clipList[t].resume();}this._paused = !1;}, isPaused: function isPaused() {return !!this._paused;}, _doneCallback: function _doneCallback() {this._tracks = {}, this._clipList.length = 0;for (var t = this._doneList, e = t.length, n = 0; n < e; n++) {t[n].call(this);}}, start: function start(t, e) {var n,i = this,r = 0;for (var a in this._tracks) {if (this._tracks.hasOwnProperty(a)) {var o = Nt(this, t, function () {--r || i._doneCallback();}, this._tracks[a], a, e);o && (this._clipList.push(o), r++, this.animation && this.animation.addClip(o), n = o);}}if (n) {var s = n.onframe;n.onframe = function (t, e) {s(t, e);for (var n = 0; n < i._onframeList.length; n++) {i._onframeList[n](t, e);}};}return r || this._doneCallback(), this;}, stop: function stop(t) {for (var e = this._clipList, n = this.animation, i = 0; i < e.length; i++) {var r = e[i];t && r.onframe(this._target, 1), n && n.removeClip(r);}e.length = 0;}, delay: function delay(t) {return this._delay = t, this;}, done: function done(t) {return t && this._doneList.push(t), this;}, getClips: function getClips() {return this._clipList;} };var ru = 1;"undefined" != typeof window && (ru = Math.max(window.devicePixelRatio || 1, 1));var au = ru,ou = function ou() {},su = ou,lu = function lu() {this.animators = [];};lu.prototype = { constructor: lu, animate: function animate(t, e) {var n,i = !1,r = this,a = this.__zr;if (t) {var o = t.split("."),s = r;i = "shape" === o[0];for (var h = 0, u = o.length; h < u; h++) {s && (s = s[o[h]]);}s && (n = s);} else n = r;if (n) {var c = r.animators,f = new iu(n, e);return f.during(function (t) {r.dirty(i);}).done(function () {c.splice(l(c, f), 1);}), c.push(f), a && a.animation.addAnimator(f), f;}su('Property "' + t + '" is not existed in element ' + r.id);}, stopAnimation: function stopAnimation(t) {for (var e = this.animators, n = e.length, i = 0; i < n; i++) {e[i].stop(t);}return e.length = 0, this;}, animateTo: function animateTo(t, e, n, i, r, a) {x(n) ? (r = i, i = n, n = 0) : _(i) ? (r = i, i = "linear", n = 0) : _(n) ? (r = n, n = 0) : _(e) ? (r = e, e = 500) : e || (e = 500), this.stopAnimation(), this._animateToShallow("", this, t, e, n);var o = this.animators.slice(),s = o.length;s || r && r();for (var l = 0; l < o.length; l++) {o[l].done(function () {--s || r && r();}).start(i, a);}}, _animateToShallow: function _animateToShallow(t, e, n, i, r) {var a = {},o = 0;for (var s in n) {if (n.hasOwnProperty(s)) if (null != e[s]) w(n[s]) && !c(n[s]) ? this._animateToShallow(t ? t + "." + s : s, e[s], n[s], i, r) : (a[s] = n[s], o++);else if (null != n[s]) if (t) {var l = {};l[t] = {}, l[t][s] = n[s], this.attr(l);} else this.attr(s, n[s]);}return o > 0 && this.animate(t, !1).when(null == i ? 500 : i, a).delay(r || 0), this;} };var hu = function hu(t) {qh.call(this, t), Bh.call(this, t), lu.call(this, t), this.id = t.id || vh();};hu.prototype = { type: "element", name: "", __zr: null, ignore: !1, clipPath: null, isGroup: !1, drift: function drift(t, e) {switch (this.draggable) {case "horizontal":e = 0;break;case "vertical":t = 0;}var n = this.transform;n || (n = this.transform = [1, 0, 0, 1, 0, 0]), n[4] += t, n[5] += e, this.decomposeTransform(), this.dirty(!1);}, beforeUpdate: function beforeUpdate() {}, afterUpdate: function afterUpdate() {}, update: function update() {this.updateTransform();}, traverse: function traverse(t, e) {}, attrKV: function attrKV(t, e) {if ("position" === t || "scale" === t || "origin" === t) {if (e) {var n = this[t];n || (n = this[t] = []), n[0] = e[0], n[1] = e[1];}} else this[t] = e;}, hide: function hide() {this.ignore = !0, this.__zr && this.__zr.refresh();}, show: function show() {this.ignore = !1, this.__zr && this.__zr.refresh();}, attr: function attr(t, e) {if ("string" == typeof t) this.attrKV(t, e);else if (w(t)) for (var n in t) {t.hasOwnProperty(n) && this.attrKV(n, t[n]);}return this.dirty(!1), this;}, setClipPath: function setClipPath(t) {var e = this.__zr;e && t.addSelfToZr(e), this.clipPath && this.clipPath !== t && this.removeClipPath(), this.clipPath = t, t.__zr = e, t.__clipTarget = this, this.dirty(!1);}, removeClipPath: function removeClipPath() {var t = this.clipPath;t && (t.__zr && t.removeSelfFromZr(t.__zr), t.__zr = null, t.__clipTarget = null, this.clipPath = null, this.dirty(!1));}, addSelfToZr: function addSelfToZr(t) {this.__zr = t;var e = this.animators;if (e) for (var n = 0; n < e.length; n++) {t.animation.addAnimator(e[n]);}this.clipPath && this.clipPath.addSelfToZr(t);}, removeSelfFromZr: function removeSelfFromZr(t) {this.__zr = null;var e = this.animators;if (e) for (var n = 0; n < e.length; n++) {t.animation.removeAnimator(e[n]);}this.clipPath && this.clipPath.removeSelfFromZr(t);} }, u(hu, lu), u(hu, qh), u(hu, Bh);var uu = Y,cu = Math.min,fu = Math.max;Rt.prototype = { constructor: Rt, union: function union(t) {var e = cu(t.x, this.x),n = cu(t.y, this.y);this.width = fu(t.x + t.width, this.x + this.width) - e, this.height = fu(t.y + t.height, this.y + this.height) - n, this.x = e, this.y = n;}, applyTransform: function () {var t = [],e = [],n = [],i = [];return function (r) {if (r) {t[0] = n[0] = this.x, t[1] = i[1] = this.y, e[0] = i[0] = this.x + this.width, e[1] = n[1] = this.y + this.height, uu(t, t, r), uu(e, e, r), uu(n, n, r), uu(i, i, r), this.x = cu(t[0], e[0], n[0], i[0]), this.y = cu(t[1], e[1], n[1], i[1]);var a = fu(t[0], e[0], n[0], i[0]),o = fu(t[1], e[1], n[1], i[1]);this.width = a - this.x, this.height = o - this.y;}};}(), calculateTransform: function calculateTransform(t) {var e = this,n = t.width / e.width,i = t.height / e.height,r = et();return at(r, r, [-e.x, -e.y]), st(r, r, [n, i]), at(r, r, [t.x, t.y]), r;}, intersect: function intersect(t) {if (!t) return !1;t instanceof Rt || (t = Rt.create(t));var e = this,n = e.x,i = e.x + e.width,r = e.y,a = e.y + e.height,o = t.x,s = t.x + t.width,l = t.y,h = t.y + t.height;return !(i < o || s < n || a < l || h < r);}, contain: function contain(t, e) {var n = this;return t >= n.x && t <= n.x + n.width && e >= n.y && e <= n.y + n.height;}, clone: function clone() {return new Rt(this.x, this.y, this.width, this.height);}, copy: function copy(t) {this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height;}, plain: function plain() {return { x: this.x, y: this.y, width: this.width, height: this.height };} }, Rt.create = function (t) {return new Rt(t.x, t.y, t.width, t.height);};var du = function du(t) {t = t || {}, hu.call(this, t);for (var e in t) {t.hasOwnProperty(e) && (this[e] = t[e]);}this._children = [], this.__storage = null, this.__dirty = !0;};du.prototype = { constructor: du, isGroup: !0, type: "group", silent: !1, children: function children() {return this._children.slice();}, childAt: function childAt(t) {return this._children[t];}, childOfName: function childOfName(t) {for (var e = this._children, n = 0; n < e.length; n++) {if (e[n].name === t) return e[n];}}, childCount: function childCount() {return this._children.length;}, add: function add(t) {return t && t !== this && t.parent !== this && (this._children.push(t), this._doAdd(t)), this;}, addBefore: function addBefore(t, e) {if (t && t !== this && t.parent !== this && e && e.parent === this) {var n = this._children,i = n.indexOf(e);i >= 0 && (n.splice(i, 0, t), this._doAdd(t));}return this;}, _doAdd: function _doAdd(t) {t.parent && t.parent.remove(t), t.parent = this;var e = this.__storage,n = this.__zr;e && e !== t.__storage && (e.addToStorage(t), t instanceof du && t.addChildrenToStorage(e)), n && n.refresh();}, remove: function remove(t) {var e = this.__zr,n = this.__storage,i = this._children,r = l(i, t);return r < 0 ? this : (i.splice(r, 1), t.parent = null, n && (n.delFromStorage(t), t instanceof du && t.delChildrenFromStorage(n)), e && e.refresh(), this);}, removeAll: function removeAll() {var t,e,n = this._children,i = this.__storage;for (e = 0; e < n.length; e++) {t = n[e], i && (i.delFromStorage(t), t instanceof du && t.delChildrenFromStorage(i)), t.parent = null;}return n.length = 0, this;}, eachChild: function eachChild(t, e) {for (var n = this._children, i = 0; i < n.length; i++) {var r = n[i];t.call(e, r, i);}return this;}, traverse: function traverse(t, e) {for (var n = 0; n < this._children.length; n++) {var i = this._children[n];t.call(e, i), "group" === i.type && i.traverse(t, e);}return this;}, addChildrenToStorage: function addChildrenToStorage(t) {for (var e = 0; e < this._children.length; e++) {var n = this._children[e];t.addToStorage(n), n instanceof du && n.addChildrenToStorage(t);}}, delChildrenFromStorage: function delChildrenFromStorage(t) {for (var e = 0; e < this._children.length; e++) {var n = this._children[e];t.delFromStorage(n), n instanceof du && n.delChildrenFromStorage(t);}}, dirty: function dirty() {return this.__dirty = !0, this.__zr && this.__zr.refresh(), this;}, getBoundingRect: function getBoundingRect(t) {for (var e = null, n = new Rt(0, 0, 0, 0), i = t || this._children, r = [], a = 0; a < i.length; a++) {var o = i[a];if (!o.ignore && !o.invisible) {var s = o.getBoundingRect(),l = o.getLocalTransform(r);l ? (n.copy(s), n.applyTransform(l), (e = e || n.clone()).union(n)) : (e = e || s.clone()).union(s);}}return e || n;} }, h(du, hu);var pu = 32,gu = 7,mu = function mu() {this._roots = [], this._displayList = [], this._displayListLen = 0;};mu.prototype = { constructor: mu, traverse: function traverse(t, e) {for (var n = 0; n < this._roots.length; n++) {this._roots[n].traverse(t, e);}}, getDisplayList: function getDisplayList(t, e) {return e = e || !1, t && this.updateDisplayList(e), this._displayList;}, updateDisplayList: function updateDisplayList(t) {this._displayListLen = 0;for (var e = this._roots, n = this._displayList, i = 0, r = e.length; i < r; i++) {this._updateAndAddDisplayable(e[i], null, t);}n.length = this._displayListLen, _h.canvasSupported && qt(n, Xt);}, _updateAndAddDisplayable: function _updateAndAddDisplayable(t, e, n) {if (!t.ignore || n) {t.beforeUpdate(), t.__dirty && t.update(), t.afterUpdate();var i = t.clipPath;if (i) {e = e ? e.slice() : [];for (var r = i, a = t; r;) {r.parent = a, r.updateTransform(), e.push(r), a = r, r = r.clipPath;}}if (t.isGroup) {for (var o = t._children, s = 0; s < o.length; s++) {var l = o[s];t.__dirty && (l.__dirty = !0), this._updateAndAddDisplayable(l, e, n);}t.__dirty = !1;} else t.__clipPaths = e, this._displayList[this._displayListLen++] = t;}}, addRoot: function addRoot(t) {t.__storage !== this && (t instanceof du && t.addChildrenToStorage(this), this.addToStorage(t), this._roots.push(t));}, delRoot: function delRoot(t) {if (null == t) {for (n = 0; n < this._roots.length; n++) {var e = this._roots[n];e instanceof du && e.delChildrenFromStorage(this);}return this._roots = [], this._displayList = [], void (this._displayListLen = 0);}if (t instanceof Array) for (var n = 0, i = t.length; n < i; n++) {this.delRoot(t[n]);} else {var r = l(this._roots, t);r >= 0 && (this.delFromStorage(t), this._roots.splice(r, 1), t instanceof du && t.delChildrenFromStorage(this));}}, addToStorage: function addToStorage(t) {return t && (t.__storage = this, t.dirty(!1)), this;}, delFromStorage: function delFromStorage(t) {return t && (t.__storage = null), this;}, dispose: function dispose() {this._renderList = this._roots = null;}, displayableSortFunc: Xt };var vu = { shadowBlur: 1, shadowOffsetX: 1, shadowOffsetY: 1, textShadowBlur: 1, textShadowOffsetX: 1, textShadowOffsetY: 1, textBoxShadowBlur: 1, textBoxShadowOffsetX: 1, textBoxShadowOffsetY: 1 },yu = function yu(t, e, n) {return vu.hasOwnProperty(e) ? n *= t.dpr : n;},_u = [["shadowBlur", 0], ["shadowOffsetX", 0], ["shadowOffsetY", 0], ["shadowColor", "#000"], ["lineCap", "butt"], ["lineJoin", "miter"], ["miterLimit", 10]],xu = function xu(t, e) {this.extendFrom(t, !1), this.host = e;};xu.prototype = { constructor: xu, host: null, fill: "#000", stroke: null, opacity: 1, lineDash: null, lineDashOffset: 0, shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0, lineWidth: 1, strokeNoScale: !1, text: null, font: null, textFont: null, fontStyle: null, fontWeight: null, fontSize: null, fontFamily: null, textTag: null, textFill: "#000", textStroke: null, textWidth: null, textHeight: null, textStrokeWidth: 0, textLineHeight: null, textPosition: "inside", textRect: null, textOffset: null, textAlign: null, textVerticalAlign: null, textDistance: 5, textShadowColor: "transparent", textShadowBlur: 0, textShadowOffsetX: 0, textShadowOffsetY: 0, textBoxShadowColor: "transparent", textBoxShadowBlur: 0, textBoxShadowOffsetX: 0, textBoxShadowOffsetY: 0, transformText: !1, textRotation: 0, textOrigin: null, textBackgroundColor: null, textBorderColor: null, textBorderWidth: 0, textBorderRadius: 0, textPadding: null, rich: null, truncate: null, blend: null, bind: function bind(t, e, n) {for (var i = this, r = n && n.style, a = !r, o = 0; o < _u.length; o++) {var s = _u[o],l = s[0];(a || i[l] !== r[l]) && (t[l] = yu(t, l, i[l] || s[1]));}if ((a || i.fill !== r.fill) && (t.fillStyle = i.fill), (a || i.stroke !== r.stroke) && (t.strokeStyle = i.stroke), (a || i.opacity !== r.opacity) && (t.globalAlpha = null == i.opacity ? 1 : i.opacity), (a || i.blend !== r.blend) && (t.globalCompositeOperation = i.blend || "source-over"), this.hasStroke()) {var h = i.lineWidth;t.lineWidth = h / (this.strokeNoScale && e && e.getLineScale ? e.getLineScale() : 1);}}, hasFill: function hasFill() {var t = this.fill;return null != t && "none" !== t;}, hasStroke: function hasStroke() {var t = this.stroke;return null != t && "none" !== t && this.lineWidth > 0;}, extendFrom: function extendFrom(t, e) {if (t) for (var n in t) {!t.hasOwnProperty(n) || !0 !== e && (!1 === e ? this.hasOwnProperty(n) : null == t[n]) || (this[n] = t[n]);}}, set: function set(t, e) {"string" == typeof t ? this[t] = e : this.extendFrom(t, !0);}, clone: function clone() {var t = new this.constructor();return t.extendFrom(this, !0), t;}, getGradient: function getGradient(t, e, n) {for (var i = ("radial" === e.type ? Yt : Ut)(t, e, n), r = e.colorStops, a = 0; a < r.length; a++) {i.addColorStop(r[a].offset, r[a].color);}return i;} };for (var wu = xu.prototype, bu = 0; bu < _u.length; bu++) {var Mu = _u[bu];Mu[0] in wu || (wu[Mu[0]] = Mu[1]);}xu.getGradient = wu.getGradient;var Su = function Su(t, e) {this.image = t, this.repeat = e, this.type = "pattern";};Su.prototype.getCanvasPattern = function (t) {return t.createPattern(this.image, this.repeat || "repeat");};var Iu = function Iu(t, e, n) {var i;n = n || au, "string" == typeof t ? i = Zt(t, e, n) : w(t) && (t = (i = t).id), this.id = t, this.dom = i;var r = i.style;r && (i.onselectstart = jt, r["-webkit-user-select"] = "none", r["user-select"] = "none", r["-webkit-touch-callout"] = "none", r["-webkit-tap-highlight-color"] = "rgba(0,0,0,0)", r.padding = 0, r.margin = 0, r["border-width"] = 0), this.domBack = null, this.ctxBack = null, this.painter = e, this.config = null, this.clearColor = 0, this.motionBlur = !1, this.lastFrameAlpha = .7, this.dpr = n;};Iu.prototype = { constructor: Iu, __dirty: !0, __used: !1, __drawIndex: 0, __startIndex: 0, __endIndex: 0, incremental: !1, getElementCount: function getElementCount() {return this.__endIndex - this.__startIndex;}, initContext: function initContext() {this.ctx = this.dom.getContext("2d"), this.ctx.dpr = this.dpr;}, createBackBuffer: function createBackBuffer() {var t = this.dpr;this.domBack = Zt("back-" + this.id, this.painter, t), this.ctxBack = this.domBack.getContext("2d"), 1 != t && this.ctxBack.scale(t, t);}, resize: function resize(t, e) {var n = this.dpr,i = this.dom,r = i.style,a = this.domBack;r && (r.width = t + "px", r.height = e + "px"), i.width = t * n, i.height = e * n, a && (a.width = t * n, a.height = e * n, 1 != n && this.ctxBack.scale(n, n));}, clear: function clear(t, e) {var n = this.dom,i = this.ctx,r = n.width,a = n.height,e = e || this.clearColor,o = this.motionBlur && !t,s = this.lastFrameAlpha,l = this.dpr;if (o && (this.domBack || this.createBackBuffer(), this.ctxBack.globalCompositeOperation = "copy", this.ctxBack.drawImage(n, 0, 0, r / l, a / l)), i.clearRect(0, 0, r, a), e && "transparent" !== e) {var h;e.colorStops ? (h = e.__canvasGradient || xu.getGradient(i, e, { x: 0, y: 0, width: r, height: a }), e.__canvasGradient = h) : e.image && (h = Su.prototype.getCanvasPattern.call(e, i)), i.save(), i.fillStyle = h || e, i.fillRect(0, 0, r, a), i.restore();}if (o) {var u = this.domBack;i.save(), i.globalAlpha = s, i.drawImage(u, 0, 0, r, a), i.restore();}} };var Tu = "undefined" != typeof window && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function (t) {setTimeout(t, 16);},Cu = new Kh(50),Du = {},ku = 0,Au = 5e3,Lu = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g,Pu = "12px sans-serif",Ou = {};Ou.measureText = function (t, e) {var n = s();return n.font = e || Pu, n.measureText(t);};var Eu = { left: 1, right: 1, center: 1 },Nu = { top: 1, bottom: 1, middle: 1 },Ru = new Rt(),Bu = function Bu() {};Bu.prototype = { constructor: Bu, drawRectText: function drawRectText(t, e) {var n = this.style;e = n.textRect || e, this.__dirty && ye(n);var i = n.text;if (null != i && (i += ""), Ne(i, n)) {t.save();var r = this.transform;n.transformText ? this.setTransform(t) : r && (Ru.copy(e), Ru.applyTransform(r), e = Ru), xe(this, t, i, n, e), t.restore();}} }, Re.prototype = { constructor: Re, type: "displayable", __dirty: !0, invisible: !1, z: 0, z2: 0, zlevel: 0, draggable: !1, dragging: !1, silent: !1, culling: !1, cursor: "pointer", rectHover: !1, progressive: !1, incremental: !1, inplace: !1, beforeBrush: function beforeBrush(t) {}, afterBrush: function afterBrush(t) {}, brush: function brush(t, e) {}, getBoundingRect: function getBoundingRect() {}, contain: function contain(t, e) {return this.rectContain(t, e);}, traverse: function traverse(t, e) {t.call(e, this);}, rectContain: function rectContain(t, e) {var n = this.transformCoordToLocal(t, e);return this.getBoundingRect().contain(n[0], n[1]);}, dirty: function dirty() {this.__dirty = !0, this._rect = null, this.__zr && this.__zr.refresh();}, animateStyle: function animateStyle(t) {return this.animate("style", t);}, attrKV: function attrKV(t, e) {"style" !== t ? hu.prototype.attrKV.call(this, t, e) : this.style.set(e);}, setStyle: function setStyle(t, e) {return this.style.set(t, e), this.dirty(!1), this;}, useStyle: function useStyle(t) {return this.style = new xu(t, this), this.dirty(!1), this;} }, h(Re, hu), u(Re, Bu), Be.prototype = { constructor: Be, type: "image", brush: function brush(t, e) {var n = this.style,i = n.image;n.bind(t, this, e);var r = this._image = Kt(i, this._image, this, this.onload);if (r && Jt(r)) {var a = n.x || 0,o = n.y || 0,s = n.width,l = n.height,h = r.width / r.height;if (null == s && null != l ? s = l * h : null == l && null != s ? l = s / h : null == s && null == l && (s = r.width, l = r.height), this.setTransform(t), n.sWidth && n.sHeight) {var u = n.sx || 0,c = n.sy || 0;t.drawImage(r, u, c, n.sWidth, n.sHeight, a, o, s, l);} else if (n.sx && n.sy) {var f = s - (u = n.sx),d = l - (c = n.sy);t.drawImage(r, u, c, f, d, a, o, s, l);} else t.drawImage(r, a, o, s, l);null != n.text && (this.restoreTransform(t), this.drawRectText(t, this.getBoundingRect()));}}, getBoundingRect: function getBoundingRect() {var t = this.style;return this._rect || (this._rect = new Rt(t.x || 0, t.y || 0, t.width || 0, t.height || 0)), this._rect;} }, h(Be, Re);var zu = new Rt(0, 0, 0, 0),Fu = new Rt(0, 0, 0, 0),Vu = function Vu(t, e, n) {this.type = "canvas";var i = !t.nodeName || "CANVAS" === t.nodeName.toUpperCase();this._opts = n = a({}, n || {}), this.dpr = n.devicePixelRatio || au, this._singleCanvas = i, this.root = t;var r = t.style;r && (r["-webkit-tap-highlight-color"] = "transparent", r["-webkit-user-select"] = r["user-select"] = r["-webkit-touch-callout"] = "none", t.innerHTML = ""), this.storage = e;var o = this._zlevelList = [],s = this._layers = {};if (this._layerConfig = {}, this._needsManuallyCompositing = !1, i) {var l = t.width,h = t.height;null != n.width && (l = n.width), null != n.height && (h = n.height), this.dpr = n.devicePixelRatio || 1, t.width = l * this.dpr, t.height = h * this.dpr, this._width = l, this._height = h;var u = new Iu(t, this, this.dpr);u.__builtin__ = !0, u.initContext(), s[314159] = u, u.zlevel = 314159, o.push(314159), this._domRoot = t;} else {this._width = this._getSize(0), this._height = this._getSize(1);var c = this._domRoot = Ge(this._width, this._height);t.appendChild(c);}this._hoverlayer = null, this._hoverElements = [];};Vu.prototype = { constructor: Vu, getType: function getType() {return "canvas";}, isSingleCanvas: function isSingleCanvas() {return this._singleCanvas;}, getViewportRoot: function getViewportRoot() {return this._domRoot;}, getViewportRootOffset: function getViewportRootOffset() {var t = this.getViewportRoot();if (t) return { offsetLeft: t.offsetLeft || 0, offsetTop: t.offsetTop || 0 };}, refresh: function refresh(t) {var e = this.storage.getDisplayList(!0),n = this._zlevelList;this._redrawId = Math.random(), this._paintList(e, t, this._redrawId);for (var i = 0; i < n.length; i++) {var r = n[i],a = this._layers[r];if (!a.__builtin__ && a.refresh) {var o = 0 === i ? this._backgroundColor : null;a.refresh(o);}}return this.refreshHover(), this;}, addHover: function addHover(t, e) {if (!t.__hoverMir) {var n = new t.constructor({ style: t.style, shape: t.shape });n.__from = t, t.__hoverMir = n, n.setStyle(e), this._hoverElements.push(n);}}, removeHover: function removeHover(t) {var e = t.__hoverMir,n = this._hoverElements,i = l(n, e);i >= 0 && n.splice(i, 1), t.__hoverMir = null;}, clearHover: function clearHover(t) {for (var e = this._hoverElements, n = 0; n < e.length; n++) {var i = e[n].__from;i && (i.__hoverMir = null);}e.length = 0;}, refreshHover: function refreshHover() {var t = this._hoverElements,e = t.length,n = this._hoverlayer;if (n && n.clear(), e) {qt(t, this.storage.displayableSortFunc), n || (n = this._hoverlayer = this.getLayer(1e5));var i = {};n.ctx.save();for (var r = 0; r < e;) {var a = t[r],o = a.__from;o && o.__zr ? (r++, o.invisible || (a.transform = o.transform, a.invTransform = o.invTransform, a.__clipPaths = o.__clipPaths, this._doPaintEl(a, n, !0, i))) : (t.splice(r, 1), o.__hoverMir = null, e--);}n.ctx.restore();}}, getHoverLayer: function getHoverLayer() {return this.getLayer(1e5);}, _paintList: function _paintList(t, e, n) {if (this._redrawId === n) {e = e || !1, this._updateLayerStatus(t);var i = this._doPaintList(t, e);if (this._needsManuallyCompositing && this._compositeManually(), !i) {var r = this;Tu(function () {r._paintList(t, e, n);});}}}, _compositeManually: function _compositeManually() {var t = this.getLayer(314159).ctx,e = this._domRoot.width,n = this._domRoot.height;t.clearRect(0, 0, e, n), this.eachBuiltinLayer(function (i) {i.virtual && t.drawImage(i.dom, 0, 0, e, n);});}, _doPaintList: function _doPaintList(t, e) {for (var n = [], i = 0; i < this._zlevelList.length; i++) {var r = this._zlevelList[i];(s = this._layers[r]).__builtin__ && s !== this._hoverlayer && (s.__dirty || e) && n.push(s);}for (var a = !0, o = 0; o < n.length; o++) {var s = n[o],l = s.ctx,h = {};l.save();var u = e ? s.__startIndex : s.__drawIndex,c = !e && s.incremental && Date.now,d = c && Date.now(),p = s.zlevel === this._zlevelList[0] ? this._backgroundColor : null;if (s.__startIndex === s.__endIndex) s.clear(!1, p);else if (u === s.__startIndex) {var g = t[u];g.incremental && g.notClear && !e || s.clear(!1, p);}-1 === u && (console.error("For some unknown reason. drawIndex is -1"), u = s.__startIndex);for (var m = u; m < s.__endIndex; m++) {var v = t[m];if (this._doPaintEl(v, s, e, h), v.__dirty = !1, c && Date.now() - d > 15) break;}s.__drawIndex = m, s.__drawIndex < s.__endIndex && (a = !1), h.prevElClipPaths && l.restore(), l.restore();}return _h.wxa && f(this._layers, function (t) {t && t.ctx && t.ctx.draw && t.ctx.draw();}), a;}, _doPaintEl: function _doPaintEl(t, e, n, i) {var r = e.ctx,a = t.transform;if ((e.__dirty || n) && !t.invisible && 0 !== t.style.opacity && (!a || a[0] || a[3]) && (!t.culling || !Ve(t, this._width, this._height))) {var o = t.__clipPaths;i.prevElClipPaths && !We(o, i.prevElClipPaths) || (i.prevElClipPaths && (e.ctx.restore(), i.prevElClipPaths = null, i.prevEl = null), o && (r.save(), He(o, r), i.prevElClipPaths = o)), t.beforeBrush && t.beforeBrush(r), t.brush(r, i.prevEl || null), i.prevEl = t, t.afterBrush && t.afterBrush(r);}}, getLayer: function getLayer(t, e) {this._singleCanvas && !this._needsManuallyCompositing && (t = 314159);var n = this._layers[t];return n || ((n = new Iu("zr_" + t, this, this.dpr)).zlevel = t, n.__builtin__ = !0, this._layerConfig[t] && i(n, this._layerConfig[t], !0), e && (n.virtual = e), this.insertLayer(t, n), n.initContext()), n;}, insertLayer: function insertLayer(t, e) {var n = this._layers,i = this._zlevelList,r = i.length,a = null,o = -1,s = this._domRoot;if (n[t]) su("ZLevel " + t + " has been used already");else if (Fe(e)) {if (r > 0 && t > i[0]) {for (o = 0; o < r - 1 && !(i[o] < t && i[o + 1] > t); o++) {;}a = n[i[o]];}if (i.splice(o + 1, 0, t), n[t] = e, !e.virtual) if (a) {var l = a.dom;l.nextSibling ? s.insertBefore(e.dom, l.nextSibling) : s.appendChild(e.dom);} else s.firstChild ? s.insertBefore(e.dom, s.firstChild) : s.appendChild(e.dom);} else su("Layer of zlevel " + t + " is not valid");}, eachLayer: function eachLayer(t, e) {var n,i,r = this._zlevelList;for (i = 0; i < r.length; i++) {n = r[i], t.call(e, this._layers[n], n);}}, eachBuiltinLayer: function eachBuiltinLayer(t, e) {var n,i,r,a = this._zlevelList;for (r = 0; r < a.length; r++) {i = a[r], (n = this._layers[i]).__builtin__ && t.call(e, n, i);}}, eachOtherLayer: function eachOtherLayer(t, e) {var n,i,r,a = this._zlevelList;for (r = 0; r < a.length; r++) {i = a[r], (n = this._layers[i]).__builtin__ || t.call(e, n, i);}}, getLayers: function getLayers() {return this._layers;}, _updateLayerStatus: function _updateLayerStatus(t) {function e(t) {n && (n.__endIndex !== t && (n.__dirty = !0), n.__endIndex = t);}if (this.eachBuiltinLayer(function (t, e) {t.__dirty = t.__used = !1;}), this._singleCanvas) for (r = 1; r < t.length; r++) {if ((o = t[r]).zlevel !== t[r - 1].zlevel || o.incremental) {this._needsManuallyCompositing = !0;break;}}for (var n = null, i = 0, r = 0; r < t.length; r++) {var a,o = t[r],s = o.zlevel;o.incremental ? ((a = this.getLayer(s + .001, this._needsManuallyCompositing)).incremental = !0, i = 1) : a = this.getLayer(s + (i > 0 ? .01 : 0), this._needsManuallyCompositing), a.__builtin__ || su("ZLevel " + s + " has been used by unkown layer " + a.id), a !== n && (a.__used = !0, a.__startIndex !== r && (a.__dirty = !0), a.__startIndex = r, a.incremental ? a.__drawIndex = -1 : a.__drawIndex = r, e(r), n = a), o.__dirty && (a.__dirty = !0, a.incremental && a.__drawIndex < 0 && (a.__drawIndex = r));}e(r), this.eachBuiltinLayer(function (t, e) {!t.__used && t.getElementCount() > 0 && (t.__dirty = !0, t.__startIndex = t.__endIndex = t.__drawIndex = 0), t.__dirty && t.__drawIndex < 0 && (t.__drawIndex = t.__startIndex);});}, clear: function clear() {return this.eachBuiltinLayer(this._clearLayer), this;}, _clearLayer: function _clearLayer(t) {t.clear();}, setBackgroundColor: function setBackgroundColor(t) {this._backgroundColor = t;}, configLayer: function configLayer(t, e) {if (e) {var n = this._layerConfig;n[t] ? i(n[t], e, !0) : n[t] = e;for (var r = 0; r < this._zlevelList.length; r++) {var a = this._zlevelList[r];a !== t && a !== t + .01 || i(this._layers[a], n[t], !0);}}}, delLayer: function delLayer(t) {var e = this._layers,n = this._zlevelList,i = e[t];i && (i.dom.parentNode.removeChild(i.dom), delete e[t], n.splice(l(n, t), 1));}, resize: function resize(t, e) {if (this._domRoot.style) {var n = this._domRoot;n.style.display = "none";var i = this._opts;if (null != t && (i.width = t), null != e && (i.height = e), t = this._getSize(0), e = this._getSize(1), n.style.display = "", this._width != t || e != this._height) {n.style.width = t + "px", n.style.height = e + "px";for (var r in this._layers) {this._layers.hasOwnProperty(r) && this._layers[r].resize(t, e);}f(this._progressiveLayers, function (n) {n.resize(t, e);}), this.refresh(!0);}this._width = t, this._height = e;} else {if (null == t || null == e) return;this._width = t, this._height = e, this.getLayer(314159).resize(t, e);}return this;}, clearLayer: function clearLayer(t) {var e = this._layers[t];e && e.clear();}, dispose: function dispose() {this.root.innerHTML = "", this.root = this.storage = this._domRoot = this._layers = null;}, getRenderedCanvas: function getRenderedCanvas(t) {if (t = t || {}, this._singleCanvas && !this._compositeManually) return this._layers[314159].dom;var e = new Iu("image", this, t.pixelRatio || this.dpr);if (e.initContext(), e.clear(!1, t.backgroundColor || this._backgroundColor), t.pixelRatio <= this.dpr) {this.refresh();var n = e.dom.width,i = e.dom.height,r = e.ctx;this.eachLayer(function (t) {t.__builtin__ ? r.drawImage(t.dom, 0, 0, n, i) : t.renderToCanvas && (e.ctx.save(), t.renderToCanvas(e.ctx), e.ctx.restore());});} else for (var a = {}, o = this.storage.getDisplayList(!0), s = 0; s < o.length; s++) {var l = o[s];this._doPaintEl(l, e, !0, a);}return e.dom;}, getWidth: function getWidth() {return this._width;}, getHeight: function getHeight() {return this._height;}, _getSize: function _getSize(t) {var e = this._opts,n = ["width", "height"][t],i = ["clientWidth", "clientHeight"][t],r = ["paddingLeft", "paddingTop"][t],a = ["paddingRight", "paddingBottom"][t];if (null != e[n] && "auto" !== e[n]) return parseFloat(e[n]);var o = this.root,s = document.defaultView.getComputedStyle(o);return (o[i] || ze(s[n]) || ze(o.style[n])) - (ze(s[r]) || 0) - (ze(s[a]) || 0) | 0;}, pathToImage: function pathToImage(t, e) {e = e || this.dpr;var n = document.createElement("canvas"),i = n.getContext("2d"),r = t.getBoundingRect(),a = t.style,o = a.shadowBlur * e,s = a.shadowOffsetX * e,l = a.shadowOffsetY * e,h = a.hasStroke() ? a.lineWidth : 0,u = Math.max(h / 2, -s + o),c = Math.max(h / 2, s + o),f = Math.max(h / 2, -l + o),d = Math.max(h / 2, l + o),p = r.width + u + c,g = r.height + f + d;n.width = p * e, n.height = g * e, i.scale(e, e), i.clearRect(0, 0, p, g), i.dpr = e;var m = { position: t.position, rotation: t.rotation, scale: t.scale };t.position = [u - r.x, f - r.y], t.rotation = 0, t.scale = [1, 1], t.updateTransform(), t && t.brush(i);var v = new Be({ style: { x: 0, y: 0, image: n } });return null != m.position && (v.position = t.position = m.position), null != m.rotation && (v.rotation = t.rotation = m.rotation), null != m.scale && (v.scale = t.scale = m.scale), v;} };var Wu = "undefined" != typeof window && !!window.addEventListener,Hu = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,Gu = function Gu(t) {t = t || {}, this.stage = t.stage || {}, this.onframe = t.onframe || function () {}, this._clips = [], this._running = !1, this._time, this._pausedTime, this._pauseStart, this._paused = !1, Bh.call(this);};Gu.prototype = { constructor: Gu, addClip: function addClip(t) {this._clips.push(t);}, addAnimator: function addAnimator(t) {t.animation = this;for (var e = t.getClips(), n = 0; n < e.length; n++) {this.addClip(e[n]);}}, removeClip: function removeClip(t) {var e = l(this._clips, t);e >= 0 && this._clips.splice(e, 1);}, removeAnimator: function removeAnimator(t) {for (var e = t.getClips(), n = 0; n < e.length; n++) {this.removeClip(e[n]);}t.animation = null;}, _update: function _update() {for (var t = new Date().getTime() - this._pausedTime, e = t - this._time, n = this._clips, i = n.length, r = [], a = [], o = 0; o < i; o++) {var s = n[o],l = s.step(t, e);l && (r.push(l), a.push(s));}for (o = 0; o < i;) {n[o]._needsRemove ? (n[o] = n[i - 1], n.pop(), i--) : o++;}i = r.length;for (o = 0; o < i; o++) {a[o].fire(r[o]);}this._time = t, this.onframe(e), this.trigger("frame", e), this.stage.update && this.stage.update();}, _startLoop: function _startLoop() {function t() {e._running && (Tu(t), !e._paused && e._update());}var e = this;this._running = !0, Tu(t);}, start: function start() {this._time = new Date().getTime(), this._pausedTime = 0, this._startLoop();}, stop: function stop() {this._running = !1;}, pause: function pause() {this._paused || (this._pauseStart = new Date().getTime(), this._paused = !0);}, resume: function resume() {this._paused && (this._pausedTime += new Date().getTime() - this._pauseStart, this._paused = !1);}, clear: function clear() {this._clips = [];}, isFinished: function isFinished() {return !this._clips.length;}, animate: function animate(t, e) {var n = new iu(t, (e = e || {}).loop, e.getter, e.setter);return this.addAnimator(n), n;} }, u(Gu, Bh);var qu = function qu() {this._track = [];};qu.prototype = { constructor: qu, recognize: function recognize(t, e, n) {return this._doTrack(t, e, n), this._recognize(t);}, clear: function clear() {return this._track.length = 0, this;}, _doTrack: function _doTrack(t, e, n) {var i = t.touches;if (i) {for (var r = { points: [], touches: [], target: e, event: t }, a = 0, o = i.length; a < o; a++) {var s = i[a],l = Xe(n, s, {});r.points.push([l.zrX, l.zrY]), r.touches.push(s);}this._track.push(r);}}, _recognize: function _recognize(t) {for (var e in Xu) {if (Xu.hasOwnProperty(e)) {var n = Xu[e](this._track, t);if (n) return n;}}} };var Xu = { pinch: function pinch(t, e) {var n = t.length;if (n) {var i = (t[n - 1] || {}).points,r = (t[n - 2] || {}).points || i;if (r && r.length > 1 && i && i.length > 1) {var a = $e(i) / $e(r);!isFinite(a) && (a = 1), e.pinchScale = a;var o = Ke(i);return e.pinchX = o[0], e.pinchY = o[1], { type: "pinch", target: t[0].target, event: e };}}} },Uu = ["click", "dblclick", "mousewheel", "mouseout", "mouseup", "mousedown", "mousemove", "contextmenu"],Yu = ["touchstart", "touchend", "touchmove"],ju = { pointerdown: 1, pointerup: 1, pointermove: 1, pointerout: 1 },Zu = d(Uu, function (t) {var e = t.replace("mouse", "pointer");return ju[e] ? e : t;}),$u = { mousemove: function mousemove(t) {t = Ye(this.dom, t), this.trigger("mousemove", t);}, mouseout: function mouseout(t) {var e = (t = Ye(this.dom, t)).toElement || t.relatedTarget;if (e != this.dom) for (; e && 9 != e.nodeType;) {if (e === this.dom) return;e = e.parentNode;}this.trigger("mouseout", t);}, touchstart: function touchstart(t) {(t = Ye(this.dom, t)).zrByTouch = !0, this._lastTouchMoment = new Date(), Je(this, t, "start"), $u.mousemove.call(this, t), $u.mousedown.call(this, t), tn(this);}, touchmove: function touchmove(t) {(t = Ye(this.dom, t)).zrByTouch = !0, Je(this, t, "change"), $u.mousemove.call(this, t), tn(this);}, touchend: function touchend(t) {(t = Ye(this.dom, t)).zrByTouch = !0, Je(this, t, "end"), $u.mouseup.call(this, t), +new Date() - this._lastTouchMoment < 300 && $u.click.call(this, t), tn(this);}, pointerdown: function pointerdown(t) {$u.mousedown.call(this, t);}, pointermove: function pointermove(t) {en(t) || $u.mousemove.call(this, t);}, pointerup: function pointerup(t) {$u.mouseup.call(this, t);}, pointerout: function pointerout(t) {en(t) || $u.mouseout.call(this, t);} };f(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function (t) {$u[t] = function (e) {e = Ye(this.dom, e), this.trigger(t, e);};});var Ku = rn.prototype;Ku.dispose = function () {for (var t = Uu.concat(Yu), e = 0; e < t.length; e++) {var n = t[e];Ze(this.dom, Qe(n), this._handlers[n]);}}, Ku.setCursor = function (t) {this.dom.style && (this.dom.style.cursor = t || "default");}, u(rn, Bh);var Qu = !_h.canvasSupported,Ju = { canvas: Vu },tc = function tc(t, e, n) {n = n || {}, this.dom = e, this.id = t;var i = this,r = new mu(),a = n.renderer;if (Qu) {if (!Ju.vml) throw new Error("You need to require 'zrender/vml/vml' to support IE8");a = "vml";} else a && Ju[a] || (a = "canvas");var o = new Ju[a](e, r, n, t);this.storage = r, this.painter = o;var s = _h.node || _h.worker ? null : new rn(o.getViewportRoot());this.handler = new Vh(r, o, s, o.root), this.animation = new Gu({ stage: { update: m(this.flush, this) } }), this.animation.start(), this._needsRefresh;var l = r.delFromStorage,h = r.addToStorage;r.delFromStorage = function (t) {l.call(r, t), t && t.removeSelfFromZr(i);}, r.addToStorage = function (t) {h.call(r, t), t.addSelfToZr(i);};};tc.prototype = { constructor: tc, getId: function getId() {return this.id;}, add: function add(t) {this.storage.addRoot(t), this._needsRefresh = !0;}, remove: function remove(t) {this.storage.delRoot(t), this._needsRefresh = !0;}, configLayer: function configLayer(t, e) {this.painter.configLayer && this.painter.configLayer(t, e), this._needsRefresh = !0;}, setBackgroundColor: function setBackgroundColor(t) {this.painter.setBackgroundColor && this.painter.setBackgroundColor(t), this._needsRefresh = !0;}, refreshImmediately: function refreshImmediately() {this._needsRefresh = !1, this.painter.refresh(), this._needsRefresh = !1;}, refresh: function refresh() {this._needsRefresh = !0;}, flush: function flush() {var t;this._needsRefresh && (t = !0, this.refreshImmediately()), this._needsRefreshHover && (t = !0, this.refreshHoverImmediately()), t && this.trigger("rendered");}, addHover: function addHover(t, e) {this.painter.addHover && (this.painter.addHover(t, e), this.refreshHover());}, removeHover: function removeHover(t) {this.painter.removeHover && (this.painter.removeHover(t), this.refreshHover());}, clearHover: function clearHover() {this.painter.clearHover && (this.painter.clearHover(), this.refreshHover());}, refreshHover: function refreshHover() {this._needsRefreshHover = !0;}, refreshHoverImmediately: function refreshHoverImmediately() {this._needsRefreshHover = !1, this.painter.refreshHover && this.painter.refreshHover();}, resize: function resize(t) {t = t || {}, this.painter.resize(t.width, t.height), this.handler.resize();}, clearAnimation: function clearAnimation() {this.animation.clear();}, getWidth: function getWidth() {return this.painter.getWidth();}, getHeight: function getHeight() {return this.painter.getHeight();}, pathToImage: function pathToImage(t, e) {return this.painter.pathToImage(t, e);}, setCursorStyle: function setCursorStyle(t) {this.handler.setCursorStyle(t);}, findHover: function findHover(t, e) {return this.handler.findHover(t, e);}, on: function on(t, e, n) {this.handler.on(t, e, n);}, off: function off(t, e) {this.handler.off(t, e);}, trigger: function trigger(t, e) {this.handler.trigger(t, e);}, clear: function clear() {this.storage.delRoot(), this.painter.clear();}, dispose: function dispose() {this.animation.stop(), this.clear(), this.storage.dispose(), this.painter.dispose(), this.handler.dispose(), this.animation = this.storage = this.painter = this.handler = null;} };var ec = f,nc = w,ic = y,rc = "series\0",ac = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "rich", "tag", "color", "textBorderColor", "textBorderWidth", "width", "height", "lineHeight", "align", "verticalAlign", "baseline", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "padding"],oc = 0,sc = ".",lc = "___EC__COMPONENT__CONTAINER___",hc = 0,uc = function uc(t) {for (var e = 0; e < t.length; e++) {t[e][1] || (t[e][1] = t[e][0]);}return function (e, n, i) {for (var r = {}, a = 0; a < t.length; a++) {var o = t[a][1];if (!(n && l(n, o) >= 0 || i && l(i, o) < 0)) {var s = e.getShallow(o);null != s && (r[t[a][0]] = s);}}return r;};},cc = uc([["lineWidth", "width"], ["stroke", "color"], ["opacity"], ["shadowBlur"], ["shadowOffsetX"], ["shadowOffsetY"], ["shadowColor"]]),fc = { getLineStyle: function getLineStyle(t) {var e = cc(this, t),n = this.getLineDash(e.lineWidth);return n && (e.lineDash = n), e;}, getLineDash: function getLineDash(t) {null == t && (t = 1);var e = this.get("type"),n = Math.max(t, 2),i = 4 * t;return "solid" === e || null == e ? null : "dashed" === e ? [i, i] : [n, n];} },dc = uc([["fill", "color"], ["shadowBlur"], ["shadowOffsetX"], ["shadowOffsetY"], ["opacity"], ["shadowColor"]]),pc = { getAreaStyle: function getAreaStyle(t, e) {return dc(this, t, e);} },gc = Math.pow,mc = Math.sqrt,vc = 1e-8,yc = 1e-4,_c = mc(3),xc = 1 / 3,wc = z(),bc = z(),Mc = z(),Sc = Math.min,Ic = Math.max,Tc = Math.sin,Cc = Math.cos,Dc = 2 * Math.PI,kc = z(),Ac = z(),Lc = z(),Pc = [],Oc = [],Ec = { M: 1, L: 2, C: 3, Q: 4, A: 5, Z: 6, R: 7 },Nc = [],Rc = [],Bc = [],zc = [],Fc = Math.min,Vc = Math.max,Wc = Math.cos,Hc = Math.sin,Gc = Math.sqrt,qc = Math.abs,Xc = "undefined" != typeof Float32Array,Uc = function Uc(t) {this._saveData = !t, this._saveData && (this.data = []), this._ctx = null;};Uc.prototype = { constructor: Uc, _xi: 0, _yi: 0, _x0: 0, _y0: 0, _ux: 0, _uy: 0, _len: 0, _lineDash: null, _dashOffset: 0, _dashIdx: 0, _dashSum: 0, setScale: function setScale(t, e) {this._ux = qc(1 / au / t) || 0, this._uy = qc(1 / au / e) || 0;}, getContext: function getContext() {return this._ctx;}, beginPath: function beginPath(t) {return this._ctx = t, t && t.beginPath(), t && (this.dpr = t.dpr), this._saveData && (this._len = 0), this._lineDash && (this._lineDash = null, this._dashOffset = 0), this;}, moveTo: function moveTo(t, e) {return this.addData(Ec.M, t, e), this._ctx && this._ctx.moveTo(t, e), this._x0 = t, this._y0 = e, this._xi = t, this._yi = e, this;}, lineTo: function lineTo(t, e) {var n = qc(t - this._xi) > this._ux || qc(e - this._yi) > this._uy || this._len < 5;return this.addData(Ec.L, t, e), this._ctx && n && (this._needsDash() ? this._dashedLineTo(t, e) : this._ctx.lineTo(t, e)), n && (this._xi = t, this._yi = e), this;}, bezierCurveTo: function bezierCurveTo(t, e, n, i, r, a) {return this.addData(Ec.C, t, e, n, i, r, a), this._ctx && (this._needsDash() ? this._dashedBezierTo(t, e, n, i, r, a) : this._ctx.bezierCurveTo(t, e, n, i, r, a)), this._xi = r, this._yi = a, this;}, quadraticCurveTo: function quadraticCurveTo(t, e, n, i) {return this.addData(Ec.Q, t, e, n, i), this._ctx && (this._needsDash() ? this._dashedQuadraticTo(t, e, n, i) : this._ctx.quadraticCurveTo(t, e, n, i)), this._xi = n, this._yi = i, this;}, arc: function arc(t, e, n, i, r, a) {return this.addData(Ec.A, t, e, n, n, i, r - i, 0, a ? 0 : 1), this._ctx && this._ctx.arc(t, e, n, i, r, a), this._xi = Wc(r) * n + t, this._yi = Hc(r) * n + t, this;}, arcTo: function arcTo(t, e, n, i, r) {return this._ctx && this._ctx.arcTo(t, e, n, i, r), this;}, rect: function rect(t, e, n, i) {return this._ctx && this._ctx.rect(t, e, n, i), this.addData(Ec.R, t, e, n, i), this;}, closePath: function closePath() {this.addData(Ec.Z);var t = this._ctx,e = this._x0,n = this._y0;return t && (this._needsDash() && this._dashedLineTo(e, n), t.closePath()), this._xi = e, this._yi = n, this;}, fill: function fill(t) {t && t.fill(), this.toStatic();}, stroke: function stroke(t) {t && t.stroke(), this.toStatic();}, setLineDash: function setLineDash(t) {if (t instanceof Array) {this._lineDash = t, this._dashIdx = 0;for (var e = 0, n = 0; n < t.length; n++) {e += t[n];}this._dashSum = e;}return this;}, setLineDashOffset: function setLineDashOffset(t) {return this._dashOffset = t, this;}, len: function len() {return this._len;}, setData: function setData(t) {var e = t.length;this.data && this.data.length == e || !Xc || (this.data = new Float32Array(e));for (var n = 0; n < e; n++) {this.data[n] = t[n];}this._len = e;}, appendPath: function appendPath(t) {t instanceof Array || (t = [t]);for (var e = t.length, n = 0, i = this._len, r = 0; r < e; r++) {n += t[r].len();}Xc && this.data instanceof Float32Array && (this.data = new Float32Array(i + n));for (r = 0; r < e; r++) {for (var a = t[r].data, o = 0; o < a.length; o++) {this.data[i++] = a[o];}}this._len = i;}, addData: function addData(t) {if (this._saveData) {var e = this.data;this._len + arguments.length > e.length && (this._expandData(), e = this.data);for (var n = 0; n < arguments.length; n++) {e[this._len++] = arguments[n];}this._prevCmd = t;}}, _expandData: function _expandData() {if (!(this.data instanceof Array)) {for (var t = [], e = 0; e < this._len; e++) {t[e] = this.data[e];}this.data = t;}}, _needsDash: function _needsDash() {return this._lineDash;}, _dashedLineTo: function _dashedLineTo(t, e) {var n,i,r = this._dashSum,a = this._dashOffset,o = this._lineDash,s = this._ctx,l = this._xi,h = this._yi,u = t - l,c = e - h,f = Gc(u * u + c * c),d = l,p = h,g = o.length;for (u /= f, c /= f, a < 0 && (a = r + a), d -= (a %= r) * u, p -= a * c; u > 0 && d <= t || u < 0 && d >= t || 0 == u && (c > 0 && p <= e || c < 0 && p >= e);) {d += u * (n = o[i = this._dashIdx]), p += c * n, this._dashIdx = (i + 1) % g, u > 0 && d < l || u < 0 && d > l || c > 0 && p < h || c < 0 && p > h || s[i % 2 ? "moveTo" : "lineTo"](u >= 0 ? Fc(d, t) : Vc(d, t), c >= 0 ? Fc(p, e) : Vc(p, e));}u = d - t, c = p - e, this._dashOffset = -Gc(u * u + c * c);}, _dashedBezierTo: function _dashedBezierTo(t, e, n, i, r, a) {var o,s,l,h,u,c = this._dashSum,f = this._dashOffset,d = this._lineDash,p = this._ctx,g = this._xi,m = this._yi,v = kn,y = 0,_ = this._dashIdx,x = d.length,w = 0;for (f < 0 && (f = c + f), f %= c, o = 0; o < 1; o += .1) {s = v(g, t, n, r, o + .1) - v(g, t, n, r, o), l = v(m, e, i, a, o + .1) - v(m, e, i, a, o), y += Gc(s * s + l * l);}for (; _ < x && !((w += d[_]) > f); _++) {;}for (o = (w - f) / y; o <= 1;) {h = v(g, t, n, r, o), u = v(m, e, i, a, o), _ % 2 ? p.moveTo(h, u) : p.lineTo(h, u), o += d[_] / y, _ = (_ + 1) % x;}_ % 2 != 0 && p.lineTo(r, a), s = r - h, l = a - u, this._dashOffset = -Gc(s * s + l * l);}, _dashedQuadraticTo: function _dashedQuadraticTo(t, e, n, i) {var r = n,a = i;n = (n + 2 * t) / 3, i = (i + 2 * e) / 3, t = (this._xi + 2 * t) / 3, e = (this._yi + 2 * e) / 3, this._dashedBezierTo(t, e, n, i, r, a);}, toStatic: function toStatic() {var t = this.data;t instanceof Array && (t.length = this._len, Xc && (this.data = new Float32Array(t)));}, getBoundingRect: function getBoundingRect() {Nc[0] = Nc[1] = Bc[0] = Bc[1] = Number.MAX_VALUE, Rc[0] = Rc[1] = zc[0] = zc[1] = -Number.MAX_VALUE;for (var t = this.data, e = 0, n = 0, i = 0, r = 0, a = 0; a < t.length;) {var o = t[a++];switch (1 == a && (i = e = t[a], r = n = t[a + 1]), o) {case Ec.M:e = i = t[a++], n = r = t[a++], Bc[0] = i, Bc[1] = r, zc[0] = i, zc[1] = r;break;case Ec.L:Wn(e, n, t[a], t[a + 1], Bc, zc), e = t[a++], n = t[a++];break;case Ec.C:Hn(e, n, t[a++], t[a++], t[a++], t[a++], t[a], t[a + 1], Bc, zc), e = t[a++], n = t[a++];break;case Ec.Q:Gn(e, n, t[a++], t[a++], t[a], t[a + 1], Bc, zc), e = t[a++], n = t[a++];break;case Ec.A:var s = t[a++],l = t[a++],h = t[a++],u = t[a++],c = t[a++],f = t[a++] + c,d = (t[a++], 1 - t[a++]);1 == a && (i = Wc(c) * h + s, r = Hc(c) * u + l), qn(s, l, h, u, c, f, d, Bc, zc), e = Wc(f) * h + s, n = Hc(f) * u + l;break;case Ec.R:Wn(i = e = t[a++], r = n = t[a++], i + t[a++], r + t[a++], Bc, zc);break;case Ec.Z:e = i, n = r;}j(Nc, Nc, Bc), Z(Rc, Rc, zc);}return 0 === a && (Nc[0] = Nc[1] = Rc[0] = Rc[1] = 0), new Rt(Nc[0], Nc[1], Rc[0] - Nc[0], Rc[1] - Nc[1]);}, rebuildPath: function rebuildPath(t) {for (var e, n, i, r, a, o, s = this.data, l = this._ux, h = this._uy, u = this._len, c = 0; c < u;) {var f = s[c++];switch (1 == c && (e = i = s[c], n = r = s[c + 1]), f) {case Ec.M:e = i = s[c++], n = r = s[c++], t.moveTo(i, r);break;case Ec.L:a = s[c++], o = s[c++], (qc(a - i) > l || qc(o - r) > h || c === u - 1) && (t.lineTo(a, o), i = a, r = o);break;case Ec.C:t.bezierCurveTo(s[c++], s[c++], s[c++], s[c++], s[c++], s[c++]), i = s[c - 2], r = s[c - 1];break;case Ec.Q:t.quadraticCurveTo(s[c++], s[c++], s[c++], s[c++]), i = s[c - 2], r = s[c - 1];break;case Ec.A:var d = s[c++],p = s[c++],g = s[c++],m = s[c++],v = s[c++],y = s[c++],_ = s[c++],x = s[c++],w = g > m ? g : m,b = g > m ? 1 : g / m,M = g > m ? m / g : 1,S = v + y;Math.abs(g - m) > .001 ? (t.translate(d, p), t.rotate(_), t.scale(b, M), t.arc(0, 0, w, v, S, 1 - x), t.scale(1 / b, 1 / M), t.rotate(-_), t.translate(-d, -p)) : t.arc(d, p, w, v, S, 1 - x), 1 == c && (e = Wc(v) * g + d, n = Hc(v) * m + p), i = Wc(S) * g + d, r = Hc(S) * m + p;break;case Ec.R:e = i = s[c], n = r = s[c + 1], t.rect(s[c++], s[c++], s[c++], s[c++]);break;case Ec.Z:t.closePath(), i = e, r = n;}}} }, Uc.CMD = Ec;var Yc = 2 * Math.PI,jc = 2 * Math.PI,Zc = Uc.CMD,$c = 2 * Math.PI,Kc = 1e-4,Qc = [-1, -1, -1],Jc = [-1, -1],tf = Su.prototype.getCanvasPattern,ef = Math.abs,nf = new Uc(!0);ai.prototype = { constructor: ai, type: "path", __dirtyPath: !0, strokeContainThreshold: 5, brush: function brush(t, e) {var n = this.style,i = this.path || nf,r = n.hasStroke(),a = n.hasFill(),o = n.fill,s = n.stroke,l = a && !!o.colorStops,h = r && !!s.colorStops,u = a && !!o.image,c = r && !!s.image;if (n.bind(t, this, e), this.setTransform(t), this.__dirty) {var f;l && (f = f || this.getBoundingRect(), this._fillGradient = n.getGradient(t, o, f)), h && (f = f || this.getBoundingRect(), this._strokeGradient = n.getGradient(t, s, f));}l ? t.fillStyle = this._fillGradient : u && (t.fillStyle = tf.call(o, t)), h ? t.strokeStyle = this._strokeGradient : c && (t.strokeStyle = tf.call(s, t));var d = n.lineDash,p = n.lineDashOffset,g = !!t.setLineDash,m = this.getGlobalScale();i.setScale(m[0], m[1]), this.__dirtyPath || d && !g && r ? (i.beginPath(t), d && !g && (i.setLineDash(d), i.setLineDashOffset(p)), this.buildPath(i, this.shape, !1), this.path && (this.__dirtyPath = !1)) : (t.beginPath(), this.path.rebuildPath(t)), a && i.fill(t), d && g && (t.setLineDash(d), t.lineDashOffset = p), r && i.stroke(t), d && g && t.setLineDash([]), null != n.text && (this.restoreTransform(t), this.drawRectText(t, this.getBoundingRect()));}, buildPath: function buildPath(t, e, n) {}, createPathProxy: function createPathProxy() {this.path = new Uc();}, getBoundingRect: function getBoundingRect() {var t = this._rect,e = this.style,n = !t;if (n) {var i = this.path;i || (i = this.path = new Uc()), this.__dirtyPath && (i.beginPath(), this.buildPath(i, this.shape, !1)), t = i.getBoundingRect();}if (this._rect = t, e.hasStroke()) {var r = this._rectWithStroke || (this._rectWithStroke = t.clone());if (this.__dirty || n) {r.copy(t);var a = e.lineWidth,o = e.strokeNoScale ? this.getLineScale() : 1;e.hasFill() || (a = Math.max(a, this.strokeContainThreshold || 4)), o > 1e-10 && (r.width += a / o, r.height += a / o, r.x -= a / o / 2, r.y -= a / o / 2);}return r;}return t;}, contain: function contain(t, e) {var n = this.transformCoordToLocal(t, e),i = this.getBoundingRect(),r = this.style;if (t = n[0], e = n[1], i.contain(t, e)) {var a = this.path.data;if (r.hasStroke()) {var o = r.lineWidth,s = r.strokeNoScale ? this.getLineScale() : 1;if (s > 1e-10 && (r.hasFill() || (o = Math.max(o, this.strokeContainThreshold)), ri(a, o / s, t, e))) return !0;}if (r.hasFill()) return ii(a, t, e);}return !1;}, dirty: function dirty(t) {null == t && (t = !0), t && (this.__dirtyPath = t, this._rect = null), this.__dirty = !0, this.__zr && this.__zr.refresh(), this.__clipTarget && this.__clipTarget.dirty();}, animateShape: function animateShape(t) {return this.animate("shape", t);}, attrKV: function attrKV(t, e) {"shape" === t ? (this.setShape(e), this.__dirtyPath = !0, this._rect = null) : Re.prototype.attrKV.call(this, t, e);}, setShape: function setShape(t, e) {var n = this.shape;if (n) {if (w(t)) for (var i in t) {t.hasOwnProperty(i) && (n[i] = t[i]);} else n[t] = e;this.dirty(!0);}return this;}, getLineScale: function getLineScale() {var t = this.transform;return t && ef(t[0] - 1) > 1e-10 && ef(t[3] - 1) > 1e-10 ? Math.sqrt(ef(t[0] * t[3] - t[2] * t[1])) : 1;} }, ai.extend = function (t) {var e = function e(_e2) {ai.call(this, _e2), t.style && this.style.extendFrom(t.style, !1);var n = t.shape;if (n) {this.shape = this.shape || {};var i = this.shape;for (var r in n) {!i.hasOwnProperty(r) && n.hasOwnProperty(r) && (i[r] = n[r]);}}t.init && t.init.call(this, _e2);};h(e, ai);for (var n in t) {"style" !== n && "shape" !== n && (e.prototype[n] = t[n]);}return e;}, h(ai, Re);var rf = Uc.CMD,af = [[], [], []],of = Math.sqrt,sf = Math.atan2,lf = function lf(t, e) {var n,i,r,a,o,s,l = t.data,h = rf.M,u = rf.C,c = rf.L,f = rf.R,d = rf.A,p = rf.Q;for (r = 0, a = 0; r < l.length;) {switch (n = l[r++], a = r, i = 0, n) {case h:case c:i = 1;break;case u:i = 3;break;case p:i = 2;break;case d:var g = e[4],m = e[5],v = of(e[0] * e[0] + e[1] * e[1]),y = of(e[2] * e[2] + e[3] * e[3]),_ = sf(-e[1] / y, e[0] / v);l[r] *= v, l[r++] += g, l[r] *= y, l[r++] += m, l[r++] *= v, l[r++] *= y, l[r++] += _, l[r++] += _, a = r += 2;break;case f:s[0] = l[r++], s[1] = l[r++], Y(s, s, e), l[a++] = s[0], l[a++] = s[1], s[0] += l[r++], s[1] += l[r++], Y(s, s, e), l[a++] = s[0], l[a++] = s[1];}for (o = 0; o < i; o++) {(s = af[o])[0] = l[r++], s[1] = l[r++], Y(s, s, e), l[a++] = s[0], l[a++] = s[1];}}},hf = ["m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A"],uf = Math.sqrt,cf = Math.sin,ff = Math.cos,df = Math.PI,pf = function pf(t) {return Math.sqrt(t[0] * t[0] + t[1] * t[1]);},gf = function gf(t, e) {return (t[0] * e[0] + t[1] * e[1]) / (pf(t) * pf(e));},mf = function mf(t, e) {return (t[0] * e[1] < t[1] * e[0] ? -1 : 1) * Math.acos(gf(t, e));},vf = function vf(t) {Re.call(this, t);};vf.prototype = { constructor: vf, type: "text", brush: function brush(t, e) {var n = this.style;this.__dirty && ye(n), n.fill = n.stroke = n.shadowBlur = n.shadowColor = n.shadowOffsetX = n.shadowOffsetY = null;var i = n.text;null != i && (i += ""), n.bind(t, this, e), Ne(i, n) && (this.setTransform(t), xe(this, t, i, n), this.restoreTransform(t));}, getBoundingRect: function getBoundingRect() {var t = this.style;if (this.__dirty && ye(t), !this._rect) {var e = t.text;null != e ? e += "" : e = "";var n = ee(t.text + "", t.font, t.textAlign, t.textVerticalAlign, t.textPadding, t.rich);if (n.x += t.x || 0, n.y += t.y || 0, Le(t.textStroke, t.textStrokeWidth)) {var i = t.textStrokeWidth;n.x -= i / 2, n.y -= i / 2, n.width += i, n.height += i;}this._rect = n;}return this._rect;} }, h(vf, Re);var yf = ai.extend({ type: "circle", shape: { cx: 0, cy: 0, r: 0 }, buildPath: function buildPath(t, e, n) {n && t.moveTo(e.cx + e.r, e.cy), t.arc(e.cx, e.cy, e.r, 0, 2 * Math.PI, !0);} }),_f = [["shadowBlur", 0], ["shadowColor", "#000"], ["shadowOffsetX", 0], ["shadowOffsetY", 0]],xf = function xf(t) {return _h.browser.ie && _h.browser.version >= 11 ? function () {var e,n = this.__clipPaths,i = this.style;if (n) for (var r = 0; r < n.length; r++) {var a = n[r],o = a && a.shape,s = a && a.type;if (o && ("sector" === s && o.startAngle === o.endAngle || "rect" === s && (!o.width || !o.height))) {for (l = 0; l < _f.length; l++) {_f[l][2] = i[_f[l][0]], i[_f[l][0]] = _f[l][1];}e = !0;break;}}if (t.apply(this, arguments), e) for (var l = 0; l < _f.length; l++) {i[_f[l][0]] = _f[l][2];}} : t;},wf = ai.extend({ type: "sector", shape: { cx: 0, cy: 0, r0: 0, r: 0, startAngle: 0, endAngle: 2 * Math.PI, clockwise: !0 }, brush: xf(ai.prototype.brush), buildPath: function buildPath(t, e) {var n = e.cx,i = e.cy,r = Math.max(e.r0 || 0, 0),a = Math.max(e.r, 0),o = e.startAngle,s = e.endAngle,l = e.clockwise,h = Math.cos(o),u = Math.sin(o);t.moveTo(h * r + n, u * r + i), t.lineTo(h * a + n, u * a + i), t.arc(n, i, a, o, s, !l), t.lineTo(Math.cos(s) * r + n, Math.sin(s) * r + i), 0 !== r && t.arc(n, i, r, s, o, l), t.closePath();} }),bf = ai.extend({ type: "ring", shape: { cx: 0, cy: 0, r: 0, r0: 0 }, buildPath: function buildPath(t, e) {var n = e.cx,i = e.cy,r = 2 * Math.PI;t.moveTo(n + e.r, i), t.arc(n, i, e.r, 0, r, !1), t.moveTo(n + e.r0, i), t.arc(n, i, e.r0, 0, r, !0);} }),Mf = function Mf(t, e) {for (var n = t.length, i = [], r = 0, a = 1; a < n; a++) {r += U(t[a - 1], t[a]);}var o = r / 2;o = o < n ? n : o;for (a = 0; a < o; a++) {var s,l,h,u = a / (o - 1) * (e ? n : n - 1),c = Math.floor(u),f = u - c,d = t[c % n];e ? (s = t[(c - 1 + n) % n], l = t[(c + 1) % n], h = t[(c + 2) % n]) : (s = t[0 === c ? c : c - 1], l = t[c > n - 2 ? n - 1 : c + 1], h = t[c > n - 3 ? n - 1 : c + 2]);var p = f * f,g = f * p;i.push([ci(s[0], d[0], l[0], h[0], f, p, g), ci(s[1], d[1], l[1], h[1], f, p, g)]);}return i;},Sf = function Sf(t, e, n, i) {var r,a,o,s,l = [],h = [],u = [],c = [];if (i) {o = [1 / 0, 1 / 0], s = [-1 / 0, -1 / 0];for (var f = 0, d = t.length; f < d; f++) {j(o, o, t[f]), Z(s, s, t[f]);}j(o, o, i[0]), Z(s, s, i[1]);}for (var f = 0, d = t.length; f < d; f++) {var p = t[f];if (n) r = t[f ? f - 1 : d - 1], a = t[(f + 1) % d];else {if (0 === f || f === d - 1) {l.push(F(t[f]));continue;}r = t[f - 1], a = t[f + 1];}W(h, a, r), q(h, h, e);var g = U(p, r),m = U(p, a),v = g + m;0 !== v && (g /= v, m /= v), q(u, h, -g), q(c, h, m);var y = V([], p, u),_ = V([], p, c);i && (Z(y, y, o), j(y, y, s), Z(_, _, o), j(_, _, s)), l.push(y), l.push(_);}return n && l.push(l.shift()), l;},If = ai.extend({ type: "polygon", shape: { points: null, smooth: !1, smoothConstraint: null }, buildPath: function buildPath(t, e) {fi(t, e, !0);} }),Tf = ai.extend({ type: "polyline", shape: { points: null, smooth: !1, smoothConstraint: null }, style: { stroke: "#000", fill: null }, buildPath: function buildPath(t, e) {fi(t, e, !1);} }),Cf = ai.extend({ type: "rect", shape: { r: 0, x: 0, y: 0, width: 0, height: 0 }, buildPath: function buildPath(t, e) {var n = e.x,i = e.y,r = e.width,a = e.height;e.r ? ve(t, e) : t.rect(n, i, r, a), t.closePath();} }),Df = ai.extend({ type: "line", shape: { x1: 0, y1: 0, x2: 0, y2: 0, percent: 1 }, style: { stroke: "#000", fill: null }, buildPath: function buildPath(t, e) {var n = e.x1,i = e.y1,r = e.x2,a = e.y2,o = e.percent;0 !== o && (t.moveTo(n, i), o < 1 && (r = n * (1 - o) + r * o, a = i * (1 - o) + a * o), t.lineTo(r, a));}, pointAt: function pointAt(t) {var e = this.shape;return [e.x1 * (1 - t) + e.x2 * t, e.y1 * (1 - t) + e.y2 * t];} }),kf = [],Af = ai.extend({ type: "bezier-curve", shape: { x1: 0, y1: 0, x2: 0, y2: 0, cpx1: 0, cpy1: 0, percent: 1 }, style: { stroke: "#000", fill: null }, buildPath: function buildPath(t, e) {var n = e.x1,i = e.y1,r = e.x2,a = e.y2,o = e.cpx1,s = e.cpy1,l = e.cpx2,h = e.cpy2,u = e.percent;0 !== u && (t.moveTo(n, i), null == l || null == h ? (u < 1 && (Fn(n, o, r, u, kf), o = kf[1], r = kf[2], Fn(i, s, a, u, kf), s = kf[1], a = kf[2]), t.quadraticCurveTo(o, s, r, a)) : (u < 1 && (On(n, o, l, r, u, kf), o = kf[1], l = kf[2], r = kf[3], On(i, s, h, a, u, kf), s = kf[1], h = kf[2], a = kf[3]), t.bezierCurveTo(o, s, l, h, r, a)));}, pointAt: function pointAt(t) {return di(this.shape, t, !1);}, tangentAt: function tangentAt(t) {var e = di(this.shape, t, !0);return X(e, e);} }),Lf = ai.extend({ type: "arc", shape: { cx: 0, cy: 0, r: 0, startAngle: 0, endAngle: 2 * Math.PI, clockwise: !0 }, style: { stroke: "#000", fill: null }, buildPath: function buildPath(t, e) {var n = e.cx,i = e.cy,r = Math.max(e.r, 0),a = e.startAngle,o = e.endAngle,s = e.clockwise,l = Math.cos(a),h = Math.sin(a);t.moveTo(l * r + n, h * r + i), t.arc(n, i, r, a, o, !s);} }),Pf = ai.extend({ type: "compound", shape: { paths: null }, _updatePathDirty: function _updatePathDirty() {for (var t = this.__dirtyPath, e = this.shape.paths, n = 0; n < e.length; n++) {t = t || e[n].__dirtyPath;}this.__dirtyPath = t, this.__dirty = this.__dirty || t;}, beforeBrush: function beforeBrush() {this._updatePathDirty();for (var t = this.shape.paths || [], e = this.getGlobalScale(), n = 0; n < t.length; n++) {t[n].path || t[n].createPathProxy(), t[n].path.setScale(e[0], e[1]);}}, buildPath: function buildPath(t, e) {for (var n = e.paths || [], i = 0; i < n.length; i++) {n[i].buildPath(t, n[i].shape, !0);}}, afterBrush: function afterBrush() {for (var t = this.shape.paths || [], e = 0; e < t.length; e++) {t[e].__dirtyPath = !1;}}, getBoundingRect: function getBoundingRect() {return this._updatePathDirty(), ai.prototype.getBoundingRect.call(this);} }),Of = function Of(t) {this.colorStops = t || [];};Of.prototype = { constructor: Of, addColorStop: function addColorStop(t, e) {this.colorStops.push({ offset: t, color: e });} };var Ef = function Ef(t, e, n, i, r, a) {this.x = null == t ? 0 : t, this.y = null == e ? 0 : e, this.x2 = null == n ? 1 : n, this.y2 = null == i ? 0 : i, this.type = "linear", this.global = a || !1, Of.call(this, r);};Ef.prototype = { constructor: Ef }, h(Ef, Of);var Nf = function Nf(t, e, n, i, r) {this.x = null == t ? .5 : t, this.y = null == e ? .5 : e, this.r = null == n ? .5 : n, this.type = "radial", this.global = r || !1, Of.call(this, i);};Nf.prototype = { constructor: Nf }, h(Nf, Of), pi.prototype.incremental = !0, pi.prototype.clearDisplaybles = function () {this._displayables = [], this._temporaryDisplayables = [], this._cursor = 0, this.dirty(), this.notClear = !1;}, pi.prototype.addDisplayable = function (t, e) {e ? this._temporaryDisplayables.push(t) : this._displayables.push(t), this.dirty();}, pi.prototype.addDisplayables = function (t, e) {e = e || !1;for (var n = 0; n < t.length; n++) {this.addDisplayable(t[n], e);}}, pi.prototype.eachPendingDisplayable = function (t) {for (e = this._cursor; e < this._displayables.length; e++) {t && t(this._displayables[e]);}for (var e = 0; e < this._temporaryDisplayables.length; e++) {t && t(this._temporaryDisplayables[e]);}}, pi.prototype.update = function () {this.updateTransform();for (t = this._cursor; t < this._displayables.length; t++) {(e = this._displayables[t]).parent = this, e.update(), e.parent = null;}for (var t = 0; t < this._temporaryDisplayables.length; t++) {var e = this._temporaryDisplayables[t];e.parent = this, e.update(), e.parent = null;}}, pi.prototype.brush = function (t, e) {for (n = this._cursor; n < this._displayables.length; n++) {(i = this._displayables[n]).beforeBrush && i.beforeBrush(t), i.brush(t, n === this._cursor ? null : this._displayables[n - 1]), i.afterBrush && i.afterBrush(t);}this._cursor = n;for (var n = 0; n < this._temporaryDisplayables.length; n++) {var i = this._temporaryDisplayables[n];i.beforeBrush && i.beforeBrush(t), i.brush(t, 0 === n ? null : this._temporaryDisplayables[n - 1]), i.afterBrush && i.afterBrush(t);}this._temporaryDisplayables = [], this.notClear = !0;};var Rf = [];pi.prototype.getBoundingRect = function () {if (!this._rect) {for (var t = new Rt(1 / 0, 1 / 0, -1 / 0, -1 / 0), e = 0; e < this._displayables.length; e++) {var n = this._displayables[e],i = n.getBoundingRect().clone();n.needLocalTransform() && i.applyTransform(n.getLocalTransform(Rf)), t.union(i);}this._rect = t;}return this._rect;}, pi.prototype.contain = function (t, e) {var n = this.transformCoordToLocal(t, e);if (this.getBoundingRect().contain(n[0], n[1])) for (var i = 0; i < this._displayables.length; i++) {if (this._displayables[i].contain(t, e)) return !0;}return !1;}, h(pi, Re);var Bf = Math.round,zf = Math.max,Ff = Math.min,Vf = {},Wf = (Object.freeze || Object)({ extendShape: gi, extendPath: function extendPath(t, e) {return ui(t, e);}, makePath: mi, makeImage: vi, mergePath: function mergePath(t, e) {for (var n = [], i = t.length, r = 0; r < i; r++) {var a = t[r];a.path || a.createPathProxy(), a.__dirtyPath && a.buildPath(a.path, a.shape, !0), n.push(a.path);}var o = new ai(e);return o.createPathProxy(), o.buildPath = function (t) {t.appendPath(n);var e = t.getContext();e && t.rebuildPath(e);}, o;}, resizePath: _i, subPixelOptimizeLine: xi, subPixelOptimizeRect: function subPixelOptimizeRect(t) {var e = t.shape,n = t.style.lineWidth,i = e.x,r = e.y,a = e.width,o = e.height;return e.x = wi(e.x, n, !0), e.y = wi(e.y, n, !0), e.width = Math.max(wi(i + a, n, !1) - e.x, 0 === a ? 0 : 1), e.height = Math.max(wi(r + o, n, !1) - e.y, 0 === o ? 0 : 1), t;}, subPixelOptimize: wi, setHoverStyle: Ei, setLabelStyle: Ni, setTextStyle: Ri, setText: function setText(t, e, n) {var i,r = { isRectText: !0 };!1 === n ? i = !0 : r.autoColor = n, Bi(t, e, r, i), t.host && t.host.dirty && t.host.dirty(!1);}, getFont: Gi, updateProps: Xi, initProps: Ui, getTransform: function getTransform(t, e) {for (var n = nt([]); t && t !== e;) {rt(n, t.getLocalTransform(), n), t = t.parent;}return n;}, applyTransform: Yi, transformDirection: function transformDirection(t, e, n) {var i = 0 === e[4] || 0 === e[5] || 0 === e[0] ? 1 : Math.abs(2 * e[4] / e[0]),r = 0 === e[4] || 0 === e[5] || 0 === e[2] ? 1 : Math.abs(2 * e[4] / e[2]),a = ["left" === t ? -i : "right" === t ? i : 0, "top" === t ? -r : "bottom" === t ? r : 0];return a = Yi(a, e, n), Math.abs(a[0]) > Math.abs(a[1]) ? a[0] > 0 ? "right" : "left" : a[1] > 0 ? "bottom" : "top";}, groupTransition: ji, clipPointsByRect: function clipPointsByRect(t, e) {return d(t, function (t) {var n = t[0];n = zf(n, e.x), n = Ff(n, e.x + e.width);var i = t[1];return i = zf(i, e.y), i = Ff(i, e.y + e.height), [n, i];});}, clipRectByRect: function clipRectByRect(t, e) {var n = zf(t.x, e.x),i = Ff(t.x + t.width, e.x + e.width),r = zf(t.y, e.y),a = Ff(t.y + t.height, e.y + e.height);if (i >= n && a >= r) return { x: n, y: r, width: i - n, height: a - r };}, createIcon: function createIcon(t, e, n) {var i = (e = a({ rectHover: !0 }, e)).style = { strokeNoScale: !0 };if (n = n || { x: -1, y: -1, width: 2, height: 2 }, t) return 0 === t.indexOf("image://") ? (i.image = t.slice(8), o(i, n), new Be(e)) : mi(t.replace("path://", ""), e, n, "center");}, Group: du, Image: Be, Text: vf, Circle: yf, Sector: wf, Ring: bf, Polygon: If, Polyline: Tf, Rect: Cf, Line: Df, BezierCurve: Af, Arc: Lf, IncrementalDisplayable: pi, CompoundPath: Pf, LinearGradient: Ef, RadialGradient: Nf, BoundingRect: Rt }),Hf = ["textStyle", "color"],Gf = { getTextColor: function getTextColor(t) {var e = this.ecModel;return this.getShallow("color") || (!t && e ? e.get(Hf) : null);}, getFont: function getFont() {return Gi({ fontStyle: this.getShallow("fontStyle"), fontWeight: this.getShallow("fontWeight"), fontSize: this.getShallow("fontSize"), fontFamily: this.getShallow("fontFamily") }, this.ecModel);}, getTextRect: function getTextRect(t) {return ee(t, this.getFont(), this.getShallow("align"), this.getShallow("verticalAlign") || this.getShallow("baseline"), this.getShallow("padding"), this.getShallow("rich"), this.getShallow("truncateText"));} },qf = uc([["fill", "color"], ["stroke", "borderColor"], ["lineWidth", "borderWidth"], ["opacity"], ["shadowBlur"], ["shadowOffsetX"], ["shadowOffsetY"], ["shadowColor"], ["textPosition"], ["textAlign"]]),Xf = { getItemStyle: function getItemStyle(t, e) {var n = qf(this, t, e),i = this.getBorderLineDash();return i && (n.lineDash = i), n;}, getBorderLineDash: function getBorderLineDash() {var t = this.get("borderType");return "solid" === t || null == t ? null : "dashed" === t ? [5, 5] : [1, 1];} },Uf = u,Yf = gn();Zi.prototype = { constructor: Zi, init: null, mergeOption: function mergeOption(t) {i(this.option, t, !0);}, get: function get(t, e) {return null == t ? this.option : $i(this.option, this.parsePath(t), !e && Ki(this, t));}, getShallow: function getShallow(t, e) {var n = this.option,i = null == n ? n : n[t],r = !e && Ki(this, t);return null == i && r && (i = r.getShallow(t)), i;}, getModel: function getModel(t, e) {var n,i = null == t ? this.option : $i(this.option, t = this.parsePath(t));return e = e || (n = Ki(this, t)) && n.getModel(t), new Zi(i, e, this.ecModel);}, isEmpty: function isEmpty() {return null == this.option;}, restoreData: function restoreData() {}, clone: function clone() {return new (0, this.constructor)(n(this.option));}, setReadOnly: function setReadOnly(t) {}, parsePath: function parsePath(t) {return "string" == typeof t && (t = t.split(".")), t;}, customizeGetParent: function customizeGetParent(t) {Yf(this).getParent = t;}, isAnimationEnabled: function isAnimationEnabled() {if (!_h.node) {if (null != this.option.animation) return !!this.option.animation;if (this.parentModel) return this.parentModel.isAnimationEnabled();}} }, bn(Zi), Mn(Zi), Uf(Zi, fc), Uf(Zi, pc), Uf(Zi, Gf), Uf(Zi, Xf);var jf = 0,Zf = 1e-4,$f = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d\d)(?::(\d\d)(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/,Kf = A,Qf = /([&<>"'])/g,Jf = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" },td = ["a", "b", "c", "d", "e", "f", "g"],ed = function ed(t, e) {return "{" + t + (null == e ? "" : e) + "}";},nd = se,id = f,rd = ["left", "right", "top", "bottom", "width", "height"],ad = [["width", "left", "right"], ["height", "top", "bottom"]],od = (v(yr, "vertical"), v(yr, "horizontal"), { getBoxLayoutParams: function getBoxLayoutParams() {return { left: this.get("left"), top: this.get("top"), right: this.get("right"), bottom: this.get("bottom"), width: this.get("width"), height: this.get("height") };} }),sd = gn(),ld = Zi.extend({ type: "component", id: "", name: "", mainType: "", subType: "", componentIndex: 0, defaultOption: null, ecModel: null, dependentModels: [], uid: null, layoutMode: null, $constructor: function $constructor(t, e, n, i) {Zi.call(this, t, e, n, i), this.uid = Qi("ec_cpt_model");}, init: function init(t, e, n, i) {this.mergeDefaultAndTheme(t, n);}, mergeDefaultAndTheme: function mergeDefaultAndTheme(t, e) {var n = this.layoutMode,r = n ? wr(t) : {};i(t, e.getTheme().get(this.mainType)), i(t, this.getDefaultOption()), n && xr(t, r, n);}, mergeOption: function mergeOption(t, e) {i(this.option, t, !0);var n = this.layoutMode;n && xr(this.option, t, n);}, optionUpdated: function optionUpdated(t, e) {}, getDefaultOption: function getDefaultOption() {var t = sd(this);if (!t.defaultOption) {for (var e = [], n = this.constructor; n;) {var r = n.prototype.defaultOption;r && e.push(r), n = n.superClass;}for (var a = {}, o = e.length - 1; o >= 0; o--) {a = i(a, e[o], !0);}t.defaultOption = a;}return t.defaultOption;}, getReferringComponents: function getReferringComponents(t) {return this.ecModel.queryComponents({ mainType: t, index: this.get(t + "Index", !0), id: this.get(t + "Id", !0) });} });Tn(ld, { registerWhenExtend: !0 }), function (t) {var e = {};t.registerSubTypeDefaulter = function (t, n) {t = xn(t), e[t.main] = n;}, t.determineSubType = function (n, i) {var r = i.type;if (!r) {var a = xn(n).main;t.hasSubTypes(n) && e[a] && (r = e[a](i));}return r;};}(ld), function (t, e) {function n(t) {var n = {},a = [];return f(t, function (o) {var s = i(n, o),h = r(s.originalDeps = e(o), t);s.entryCount = h.length, 0 === s.entryCount && a.push(o), f(h, function (t) {l(s.predecessor, t) < 0 && s.predecessor.push(t);var e = i(n, t);l(e.successor, t) < 0 && e.successor.push(o);});}), { graph: n, noEntryList: a };}function i(t, e) {return t[e] || (t[e] = { predecessor: [], successor: [] }), t[e];}function r(t, e) {var n = [];return f(t, function (t) {l(e, t) >= 0 && n.push(t);}), n;}t.topologicalTravel = function (t, e, i, r) {function a(t) {s[t].entryCount--, 0 === s[t].entryCount && l.push(t);}if (t.length) {var o = n(e),s = o.graph,l = o.noEntryList,h = {};for (f(t, function (t) {h[t] = !0;}); l.length;) {var u = l.pop(),c = s[u],d = !!h[u];d && (i.call(r, u, c.originalDeps.slice()), delete h[u]), f(c.successor, d ? function (t) {h[t] = !0, a(t);} : a);}f(h, function () {throw new Error("Circle dependency may exists");});}};}(ld, function (t) {var e = [];return f(ld.getClassesByMainType(t), function (t) {e = e.concat(t.prototype.dependencies || []);}), e = d(e, function (t) {return xn(t).main;}), "dataset" !== t && l(e, "dataset") <= 0 && e.unshift("dataset"), e;}), u(ld, od);var hd = "";"undefined" != typeof navigator && (hd = navigator.platform || "");var ud = { color: ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda29a", "#6e7074", "#546570", "#c4ccd3"], gradientColor: ["#f6efa6", "#d88273", "#bf444c"], textStyle: { fontFamily: hd.match(/^Win/) ? "Microsoft YaHei" : "sans-serif", fontSize: 12, fontStyle: "normal", fontWeight: "normal" }, blendMode: null, animation: "auto", animationDuration: 1e3, animationDurationUpdate: 300, animationEasing: "exponentialOut", animationEasingUpdate: "cubicOut", animationThreshold: 2e3, progressiveThreshold: 3e3, progressive: 400, hoverLayerThreshold: 3e3, useUTC: !1 },cd = gn(),fd = { clearColorPalette: function clearColorPalette() {cd(this).colorIdx = 0, cd(this).colorNameMap = {};}, getColorFromPalette: function getColorFromPalette(t, e, n) {var i = cd(e = e || this),r = i.colorIdx || 0,a = i.colorNameMap = i.colorNameMap || {};if (a.hasOwnProperty(t)) return a[t];var o = on(this.get("color", !0)),s = this.get("colorLayer", !0),l = null != n && s ? Mr(s, n) : o;if ((l = l || o) && l.length) {var h = l[r];return t && (a[t] = h), i.colorIdx = (r + 1) % l.length, h;}} },dd = { cartesian2d: function cartesian2d(t, e, n, i) {var r = t.getReferringComponents("xAxis")[0],a = t.getReferringComponents("yAxis")[0];e.coordSysDims = ["x", "y"], n.set("x", r), n.set("y", a), Ir(r) && (i.set("x", r), e.firstCategoryDimIndex = 0), Ir(a) && (i.set("y", a), e.firstCategoryDimIndex = 1);}, singleAxis: function singleAxis(t, e, n, i) {var r = t.getReferringComponents("singleAxis")[0];e.coordSysDims = ["single"], n.set("single", r), Ir(r) && (i.set("single", r), e.firstCategoryDimIndex = 0);}, polar: function polar(t, e, n, i) {var r = t.getReferringComponents("polar")[0],a = r.findAxisModel("radiusAxis"),o = r.findAxisModel("angleAxis");e.coordSysDims = ["radius", "angle"], n.set("radius", a), n.set("angle", o), Ir(a) && (i.set("radius", a), e.firstCategoryDimIndex = 0), Ir(o) && (i.set("angle", o), e.firstCategoryDimIndex = 1);}, geo: function geo(t, e, n, i) {e.coordSysDims = ["lng", "lat"];}, parallel: function parallel(t, e, n, i) {var r = t.ecModel,a = r.getComponent("parallel", t.get("parallelIndex")),o = e.coordSysDims = a.dimensions.slice();f(a.parallelAxisIndex, function (t, a) {var s = r.getComponent("parallelAxis", t),l = o[a];n.set(l, s), Ir(s) && null == e.firstCategoryDimIndex && (i.set(l, s), e.firstCategoryDimIndex = a);});} },pd = "original",gd = "arrayRows",md = "objectRows",vd = "keyedColumns",yd = "unknown",_d = "typedArray",xd = "column",wd = "row";Tr.seriesDataToSource = function (t) {return new Tr({ data: t, sourceFormat: M(t) ? _d : pd, fromDataset: !1 });}, Mn(Tr);var bd = gn(),Md = "\0_ec_inner",Sd = Zi.extend({ init: function init(t, e, n, i) {n = n || {}, this.option = null, this._theme = new Zi(n), this._optionManager = i;}, setOption: function setOption(t, e) {L(!(Md in t), "please use chart.getOption()"), this._optionManager.setOption(t, e), this.resetOption(null);}, resetOption: function resetOption(t) {var e = !1,n = this._optionManager;if (!t || "recreate" === t) {var i = n.mountOption("recreate" === t);this.option && "recreate" !== t ? (this.restoreData(), this.mergeOption(i)) : Wr.call(this, i), e = !0;}if ("timeline" !== t && "media" !== t || this.restoreData(), !t || "recreate" === t || "timeline" === t) {var r = n.getTimelineOption(this);r && (this.mergeOption(r), e = !0);}if (!t || "recreate" === t || "media" === t) {var a = n.getMediaOption(this, this._api);a.length && f(a, function (t) {this.mergeOption(t, e = !0);}, this);}return e;}, mergeOption: function mergeOption(t) {var e = this.option,r = this._componentsMap,o = [];kr(this), f(t, function (t, r) {null != t && (ld.hasClass(r) ? r && o.push(r) : e[r] = null == e[r] ? n(t) : i(e[r], t, !0));}), ld.topologicalTravel(o, ld.getAllClassMainTypes(), function (n, i) {var o = on(t[n]),s = un(r.get(n), o);cn(s), f(s, function (t, e) {var i = t.option;w(i) && (t.keyInfo.mainType = n, t.keyInfo.subType = Gr(n, i, t.exist));});var l = Hr(r, i);e[n] = [], r.set(n, []), f(s, function (t, i) {var o = t.exist,s = t.option;if (L(w(s) || o, "Empty component definition"), s) {var h = ld.getClass(n, t.keyInfo.subType, !0);if (o && o instanceof h) o.name = t.keyInfo.name, o.mergeOption(s, this), o.optionUpdated(s, !1);else {var u = a({ dependentModels: l, componentIndex: i }, t.keyInfo);a(o = new h(s, this, this, u), u), o.init(s, this, this, u), o.optionUpdated(null, !0);}} else o.mergeOption({}, this), o.optionUpdated({}, !1);r.get(n)[i] = o, e[n][i] = o.option;}, this), "series" === n && qr(this, r.get("series"));}, this), this._seriesIndicesMap = R(this._seriesIndices = this._seriesIndices || []);}, getOption: function getOption() {var t = n(this.option);return f(t, function (e, n) {if (ld.hasClass(n)) {for (var i = (e = on(e)).length - 1; i >= 0; i--) {dn(e[i]) && e.splice(i, 1);}t[n] = e;}}), delete t[Md], t;}, getTheme: function getTheme() {return this._theme;}, getComponent: function getComponent(t, e) {var n = this._componentsMap.get(t);if (n) return n[e || 0];}, queryComponents: function queryComponents(t) {var e = t.mainType;if (!e) return [];var n = t.index,i = t.id,r = t.name,a = this._componentsMap.get(e);if (!a || !a.length) return [];var o;if (null != n) y(n) || (n = [n]), o = g(d(n, function (t) {return a[t];}), function (t) {return !!t;});else if (null != i) {var s = y(i);o = g(a, function (t) {return s && l(i, t.id) >= 0 || !s && t.id === i;});} else if (null != r) {var h = y(r);o = g(a, function (t) {return h && l(r, t.name) >= 0 || !h && t.name === r;});} else o = a.slice();return Xr(o, t);}, findComponents: function findComponents(t) {var e = t.query,n = t.mainType,i = function (t) {var e = n + "Index",i = n + "Id",r = n + "Name";return !t || null == t[e] && null == t[i] && null == t[r] ? null : { mainType: n, index: t[e], id: t[i], name: t[r] };}(e);return function (e) {return t.filter ? g(e, t.filter) : e;}(Xr(i ? this.queryComponents(i) : this._componentsMap.get(n), t));}, eachComponent: function eachComponent(t, e, n) {var i = this._componentsMap;"function" == typeof t ? (n = e, e = t, i.each(function (t, i) {f(t, function (t, r) {e.call(n, i, t, r);});})) : x(t) ? f(i.get(t), e, n) : w(t) && f(this.findComponents(t), e, n);}, getSeriesByName: function getSeriesByName(t) {return g(this._componentsMap.get("series"), function (e) {return e.name === t;});}, getSeriesByIndex: function getSeriesByIndex(t) {return this._componentsMap.get("series")[t];}, getSeriesByType: function getSeriesByType(t) {return g(this._componentsMap.get("series"), function (e) {return e.subType === t;});}, getSeries: function getSeries() {return this._componentsMap.get("series").slice();}, getSeriesCount: function getSeriesCount() {return this._componentsMap.get("series").length;}, eachSeries: function eachSeries(t, e) {f(this._seriesIndices, function (n) {var i = this._componentsMap.get("series")[n];t.call(e, i, n);}, this);}, eachRawSeries: function eachRawSeries(t, e) {f(this._componentsMap.get("series"), t, e);}, eachSeriesByType: function eachSeriesByType(t, e, n) {f(this._seriesIndices, function (i) {var r = this._componentsMap.get("series")[i];r.subType === t && e.call(n, r, i);}, this);}, eachRawSeriesByType: function eachRawSeriesByType(t, e, n) {return f(this.getSeriesByType(t), e, n);}, isSeriesFiltered: function isSeriesFiltered(t) {return null == this._seriesIndicesMap.get(t.componentIndex);}, getCurrentSeriesIndices: function getCurrentSeriesIndices() {return (this._seriesIndices || []).slice();}, filterSeries: function filterSeries(t, e) {qr(this, g(this._componentsMap.get("series"), t, e));}, restoreData: function restoreData(t) {var e = this._componentsMap;qr(this, e.get("series"));var n = [];e.each(function (t, e) {n.push(e);}), ld.topologicalTravel(n, ld.getAllClassMainTypes(), function (n, i) {f(e.get(n), function (e) {("series" !== n || !Fr(e, t)) && e.restoreData();});});} });u(Sd, fd);var Id = ["getDom", "getZr", "getWidth", "getHeight", "getDevicePixelRatio", "dispatchAction", "isDisposed", "on", "off", "getDataURL", "getConnectedDataURL", "getModel", "getOption", "getViewOfComponentModel", "getViewOfSeriesModel"],Td = {};Yr.prototype = { constructor: Yr, create: function create(t, e) {var n = [];f(Td, function (i, r) {var a = i.create(t, e);n = n.concat(a || []);}), this._coordinateSystems = n;}, update: function update(t, e) {f(this._coordinateSystems, function (n) {n.update && n.update(t, e);});}, getCoordinateSystems: function getCoordinateSystems() {return this._coordinateSystems.slice();} }, Yr.register = function (t, e) {Td[t] = e;}, Yr.get = function (t) {return Td[t];};var Cd = f,Dd = n,kd = d,Ad = i,Ld = /^(min|max)?(.+)$/;jr.prototype = { constructor: jr, setOption: function setOption(t, e) {t && f(on(t.series), function (t) {t && t.data && M(t.data) && O(t.data);}), t = Dd(t, !0);var n = this._optionBackup,i = Zr.call(this, t, e, !n);this._newBaseOption = i.baseOption, n ? (Jr(n.baseOption, i.baseOption), i.timelineOptions.length && (n.timelineOptions = i.timelineOptions), i.mediaList.length && (n.mediaList = i.mediaList), i.mediaDefault && (n.mediaDefault = i.mediaDefault)) : this._optionBackup = i;}, mountOption: function mountOption(t) {var e = this._optionBackup;return this._timelineOptions = kd(e.timelineOptions, Dd), this._mediaList = kd(e.mediaList, Dd), this._mediaDefault = Dd(e.mediaDefault), this._currentMediaIndices = [], Dd(t ? e.baseOption : this._newBaseOption);}, getTimelineOption: function getTimelineOption(t) {var e,n = this._timelineOptions;if (n.length) {var i = t.getComponent("timeline");i && (e = Dd(n[i.getCurrentIndex()], !0));}return e;}, getMediaOption: function getMediaOption(t) {var e = this._api.getWidth(),n = this._api.getHeight(),i = this._mediaList,r = this._mediaDefault,a = [],o = [];if (!i.length && !r) return o;for (var s = 0, l = i.length; s < l; s++) {$r(i[s].query, e, n) && a.push(s);}return !a.length && r && (a = [-1]), a.length && !Qr(a, this._currentMediaIndices) && (o = kd(a, function (t) {return Dd(-1 === t ? r.option : i[t].option);})), this._currentMediaIndices = a, o;} };var Pd = f,Od = w,Ed = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"],Nd = function Nd(t, e) {Pd(oa(t.series), function (t) {Od(t) && aa(t);});var n = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];e && n.push("valueAxis", "categoryAxis", "logAxis", "timeAxis"), Pd(n, function (e) {Pd(oa(t[e]), function (t) {t && (ia(t, "axisLabel"), ia(t.axisPointer, "label"));});}), Pd(oa(t.parallel), function (t) {var e = t && t.parallelAxisDefault;ia(e, "axisLabel"), ia(e && e.axisPointer, "label");}), Pd(oa(t.calendar), function (t) {ea(t, "itemStyle"), ia(t, "dayLabel"), ia(t, "monthLabel"), ia(t, "yearLabel");}), Pd(oa(t.radar), function (t) {ia(t, "name");}), Pd(oa(t.geo), function (t) {Od(t) && (ra(t), Pd(oa(t.regions), function (t) {ra(t);}));}), Pd(oa(t.timeline), function (t) {ra(t), ea(t, "label"), ea(t, "itemStyle"), ea(t, "controlStyle", !0);var e = t.data;y(e) && f(e, function (t) {w(t) && (ea(t, "label"), ea(t, "itemStyle"));});}), Pd(oa(t.toolbox), function (t) {ea(t, "iconStyle"), Pd(t.feature, function (t) {ea(t, "iconStyle");});}), ia(sa(t.axisPointer), "label"), ia(sa(t.tooltip).axisPointer, "label");},Rd = [["x", "left"], ["y", "top"], ["x2", "right"], ["y2", "bottom"]],Bd = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"],zd = function zd(t, e) {Nd(t, e), t.series = on(t.series), f(t.series, function (t) {if (w(t)) {var e = t.type;if ("pie" !== e && "gauge" !== e || null != t.clockWise && (t.clockwise = t.clockWise), "gauge" === e) {var n = la(t, "pointer.color");null != n && ha(t, "itemStyle.normal.color", n);}ua(t);}}), t.dataRange && (t.visualMap = t.dataRange), f(Bd, function (e) {var n = t[e];n && (y(n) || (n = [n]), f(n, function (t) {ua(t);}));});},Fd = fa.prototype;Fd.pure = !1, Fd.persistent = !0, Fd.getSource = function () {return this._source;};var Vd = { arrayRows_column: { pure: !0, count: function count() {return Math.max(0, this._data.length - this._source.startIndex);}, getItem: function getItem(t) {return this._data[t + this._source.startIndex];}, appendData: ga }, arrayRows_row: { pure: !0, count: function count() {var t = this._data[0];return t ? Math.max(0, t.length - this._source.startIndex) : 0;}, getItem: function getItem(t) {t += this._source.startIndex;for (var e = [], n = this._data, i = 0; i < n.length; i++) {var r = n[i];e.push(r ? r[t] : null);}return e;}, appendData: function appendData() {throw new Error('Do not support appendData when set seriesLayoutBy: "row".');} }, objectRows: { pure: !0, count: da, getItem: pa, appendData: ga }, keyedColumns: { pure: !0, count: function count() {var t = this._source.dimensionsDefine[0].name,e = this._data[t];return e ? e.length : 0;}, getItem: function getItem(t) {for (var e = [], n = this._source.dimensionsDefine, i = 0; i < n.length; i++) {var r = this._data[n[i].name];e.push(r ? r[t] : null);}return e;}, appendData: function appendData(t) {var e = this._data;f(t, function (t, n) {for (var i = e[n] || (e[n] = []), r = 0; r < (t || []).length; r++) {i.push(t[r]);}});} }, original: { count: da, getItem: pa, appendData: ga }, typedArray: { persistent: !1, pure: !0, count: function count() {return this._data ? this._data.length / this._dimSize : 0;}, getItem: function getItem(t, e) {t -= this._offset, e = e || [];for (var n = this._dimSize * t, i = 0; i < this._dimSize; i++) {e[i] = this._data[n + i];}return e;}, appendData: function appendData(t) {this._data = t;}, clean: function clean() {this._offset += this.count(), this._data = null;} } },Wd = { arrayRows: ma, objectRows: function objectRows(t, e, n, i) {return null != n ? t[i] : t;}, keyedColumns: ma, original: function original(t, e, n, i) {var r = ln(t);return null != n && r instanceof Array ? r[n] : r;}, typedArray: ma },Hd = { arrayRows: va, objectRows: function objectRows(t, e, n, i) {return ya(t[e], this._dimensionInfos[e]);}, keyedColumns: va, original: function original(t, e, n, i) {var r = t && (null == t.value ? t : t.value);return !this._rawData.pure && hn(t) && (this.hasItemOption = !0), ya(r instanceof Array ? r[i] : r, this._dimensionInfos[e]);}, typedArray: function typedArray(t, e, n, i) {return t[i];} },Gd = /\{@(.+?)\}/g,qd = { getDataParams: function getDataParams(t, e) {var n = this.getData(e),i = this.getRawValue(t, e),r = n.getRawIndex(t),a = n.getName(t),o = n.getRawDataItem(t),s = n.getItemVisual(t, "color");return { componentType: this.mainType, componentSubType: this.subType, seriesType: "series" === this.mainType ? this.subType : null, seriesIndex: this.seriesIndex, seriesId: this.id, seriesName: this.name, name: a, dataIndex: r, data: o, dataType: e, value: i, color: s, marker: gr(s), $vars: ["seriesName", "name", "value"] };}, getFormattedLabel: function getFormattedLabel(t, e, n, i, r) {e = e || "normal";var a = this.getData(n),o = a.getItemModel(t),s = this.getDataParams(t, n);null != i && s.value instanceof Array && (s.value = s.value[i]);var l = o.get("normal" === e ? [r || "label", "formatter"] : [e, r || "label", "formatter"]);return "function" == typeof l ? (s.status = e, l(s)) : "string" == typeof l ? pr(l, s).replace(Gd, function (e, n) {var i = n.length;return "[" === n.charAt(0) && "]" === n.charAt(i - 1) && (n = +n.slice(1, i - 1)), _a(a, t, n);}) : void 0;}, getRawValue: function getRawValue(t, e) {return _a(this.getData(e), t);}, formatTooltip: function formatTooltip() {} },Xd = ba.prototype;Xd.perform = function (t) {function e(t) {return !(t >= 1) && (t = 1), t;}var n = this._upstream,i = t && t.skip;if (this._dirty && n) {var r = this.context;r.data = r.outputData = n.context.outputData;}this.__pipeline && (this.__pipeline.currentTask = this);var a;this._plan && !i && (a = this._plan(this.context));var o = e(this._modBy),s = this._modDataCount || 0,l = e(t && t.modBy),h = t && t.modDataCount || 0;o === l && s === h || (a = "reset");var u;(this._dirty || "reset" === a) && (this._dirty = !1, u = Sa(this, i)), this._modBy = l, this._modDataCount = h;var c = t && t.step;if (this._dueEnd = n ? n._outputDueEnd : this._count ? this._count(this.context) : 1 / 0, this._progress) {var f = this._dueIndex,d = Math.min(null != c ? this._dueIndex + c : 1 / 0, this._dueEnd);if (!i && (u || f < d)) {var p = this._progress;if (y(p)) for (var g = 0; g < p.length; g++) {Ma(this, p[g], f, d, l, h);} else Ma(this, p, f, d, l, h);}this._dueIndex = d;var m = null != this._settedOutputEnd ? this._settedOutputEnd : d;this._outputDueEnd = m;} else this._dueIndex = this._outputDueEnd = null != this._settedOutputEnd ? this._settedOutputEnd : this._dueEnd;return this.unfinished();};var Ud = function () {function t() {return i < n ? i++ : null;}function e() {var t = i % o * r + Math.ceil(i / o),e = i >= n ? null : t < a ? t : i;return i++, e;}var n,i,r,a,o,s = { reset: function reset(l, h, u, c) {i = l, n = h, r = u, a = c, o = Math.ceil(a / r), s.next = r > 1 && a > 0 ? e : t;} };return s;}();Xd.dirty = function () {this._dirty = !0, this._onDirty && this._onDirty(this.context);}, Xd.unfinished = function () {return this._progress && this._dueIndex < this._dueEnd;}, Xd.pipe = function (t) {(this._downstream !== t || this._dirty) && (this._downstream = t, t._upstream = this, t.dirty());}, Xd.dispose = function () {this._disposed || (this._upstream && (this._upstream._downstream = null), this._downstream && (this._downstream._upstream = null), this._dirty = !1, this._disposed = !0);}, Xd.getUpstream = function () {return this._upstream;}, Xd.getDownstream = function () {return this._downstream;}, Xd.setOutputEnd = function (t) {this._outputDueEnd = this._settedOutputEnd = t;};var Yd = gn(),jd = ld.extend({ type: "series.__base__", seriesIndex: 0, coordinateSystem: null, defaultOption: null, legendDataProvider: null, visualColorAccessPath: "itemStyle.color", layoutMode: null, init: function init(t, e, n, i) {this.seriesIndex = this.componentIndex, this.dataTask = wa({ count: Ca, reset: Da }), this.dataTask.context = { model: this }, this.mergeDefaultAndTheme(t, n), Ar(this);var r = this.getInitialData(t, n);Aa(r, this), this.dataTask.context.data = r, Yd(this).dataBeforeProcessed = r, Ia(this);}, mergeDefaultAndTheme: function mergeDefaultAndTheme(t, e) {var n = this.layoutMode,r = n ? wr(t) : {},a = this.subType;ld.hasClass(a) && (a += "Series"), i(t, e.getTheme().get(this.subType)), i(t, this.getDefaultOption()), sn(t, "label", ["show"]), this.fillDataTextStyle(t.data), n && xr(t, r, n);}, mergeOption: function mergeOption(t, e) {t = i(this.option, t, !0), this.fillDataTextStyle(t.data);var n = this.layoutMode;n && xr(this.option, t, n), Ar(this);var r = this.getInitialData(t, e);Aa(r, this), this.dataTask.dirty(), this.dataTask.context.data = r, Yd(this).dataBeforeProcessed = r, Ia(this);}, fillDataTextStyle: function fillDataTextStyle(t) {if (t && !M(t)) for (var e = ["show"], n = 0; n < t.length; n++) {t[n] && t[n].label && sn(t[n], "label", e);}}, getInitialData: function getInitialData() {}, appendData: function appendData(t) {this.getRawData().appendData(t.data);}, getData: function getData(t) {var e = Pa(this);if (e) {var n = e.context.data;return null == t ? n : n.getLinkedData(t);}return Yd(this).data;}, setData: function setData(t) {var e = Pa(this);if (e) {var n = e.context;n.data !== t && e.modifyOutputEnd && e.setOutputEnd(t.count()), n.outputData = t, e !== this.dataTask && (n.data = t);}Yd(this).data = t;}, getSource: function getSource() {return Dr(this);}, getRawData: function getRawData() {return Yd(this).dataBeforeProcessed;}, getBaseAxis: function getBaseAxis() {var t = this.coordinateSystem;return t && t.getBaseAxis && t.getBaseAxis();}, formatTooltip: function formatTooltip(t, e, n) {function i(t) {return dr(fr(t));}var r = this.getData(),a = r.mapDimension("defaultedTooltip", !0),o = a.length,s = this.getRawValue(t),l = y(s),h = r.getItemVisual(t, "color");w(h) && h.colorStops && (h = (h.colorStops[0] || {}).color), h = h || "transparent";var u = o > 1 || l && !o ? function (n) {function i(t, n) {var i = r.getDimensionInfo(n);if (i && !1 !== i.otherDims.tooltip) {var a = i.type,l = gr({ color: h, type: "subItem" }),u = (o ? l + dr(i.displayName || "-") + ": " : "") + dr("ordinal" === a ? t + "" : "time" === a ? e ? "" : vr("yyyy/MM/dd hh:mm:ss", t) : fr(t));u && s.push(u);}}var o = p(n, function (t, e, n) {var i = r.getDimensionInfo(n);return t |= i && !1 !== i.tooltip && null != i.displayName;}, 0),s = [];return a.length ? f(a, function (e) {i(_a(r, t, e), e);}) : f(n, i), (o ? "<br/>" : "") + s.join(o ? "<br/>" : ", ");}(s) : i(o ? _a(r, t, a[0]) : l ? s[0] : s),c = gr(h),d = r.getName(t),g = this.name;return fn(this) || (g = ""), g = g ? dr(g) + (e ? ": " : "<br/>") : "", e ? c + g + u : g + c + (d ? dr(d) + ": " + u : u);}, isAnimationEnabled: function isAnimationEnabled() {if (_h.node) return !1;var t = this.getShallow("animation");return t && this.getData().count() > this.getShallow("animationThreshold") && (t = !1), t;}, restoreData: function restoreData() {this.dataTask.dirty();}, getColorFromPalette: function getColorFromPalette(t, e, n) {var i = this.ecModel,r = fd.getColorFromPalette.call(this, t, e, n);return r || (r = i.getColorFromPalette(t, e, n)), r;}, coordDimToDataDim: function coordDimToDataDim(t) {return this.getRawData().mapDimension(t, !0);}, getProgressive: function getProgressive() {return this.get("progressive");}, getProgressiveThreshold: function getProgressiveThreshold() {return this.get("progressiveThreshold");}, getAxisTooltipData: null, getTooltipPosition: null, pipeTask: null, preventIncremental: null, pipelineContext: null });u(jd, qd), u(jd, fd);var Zd = function Zd() {this.group = new du(), this.uid = Qi("viewComponent");};Zd.prototype = { constructor: Zd, init: function init(t, e) {}, render: function render(t, e, n, i) {}, dispose: function dispose() {} };var $d = Zd.prototype;$d.updateView = $d.updateLayout = $d.updateVisual = function (t, e, n, i) {}, bn(Zd), Tn(Zd, { registerWhenExtend: !0 });var Kd = function Kd() {var t = gn();return function (e) {var n = t(e),i = e.pipelineContext,r = n.large,a = n.progressiveRender,o = n.large = i.large,s = n.progressiveRender = i.progressiveRender;return !!(r ^ o || a ^ s) && "reset";};},Qd = gn(),Jd = Kd();Oa.prototype = { type: "chart", init: function init(t, e) {}, render: function render(t, e, n, i) {}, highlight: function highlight(t, e, n, i) {Na(t.getData(), i, "emphasis");}, downplay: function downplay(t, e, n, i) {Na(t.getData(), i, "normal");}, remove: function remove(t, e) {this.group.removeAll();}, dispose: function dispose() {}, incrementalPrepareRender: null, incrementalRender: null, updateTransform: null };var tp = Oa.prototype;tp.updateView = tp.updateLayout = tp.updateVisual = function (t, e, n, i) {this.render(t, e, n, i);}, bn(Oa), Tn(Oa, { registerWhenExtend: !0 }), Oa.markUpdateMethod = function (t, e) {Qd(t).updateMethod = e;};var ep = { incrementalPrepareRender: { progress: function progress(t, e) {e.view.incrementalRender(t, e.model, e.ecModel, e.api, e.payload);} }, render: { forceFirstProgress: !0, progress: function progress(t, e) {e.view.render(e.model, e.ecModel, e.api, e.payload);} } },np = { createOnAllSeries: !0, performRawSeries: !0, reset: function reset(t, e) {var n = t.getData(),i = (t.visualColorAccessPath || "itemStyle.color").split("."),r = t.get(i) || t.getColorFromPalette(t.name, null, e.getSeriesCount());if (n.setVisual("color", r), !e.isSeriesFiltered(t)) {"function" != typeof r || r instanceof Of || n.each(function (e) {n.setItemVisual(e, "color", r(t.getDataParams(e)));});return { dataEach: n.hasItemOption ? function (t, e) {var n = t.getItemModel(e).get(i, !0);null != n && t.setItemVisual(e, "color", n);} : null };}} },ip = { toolbox: { brush: { title: { rect: "矩形选择", polygon: "圈选", lineX: "横向选择", lineY: "纵向选择", keep: "保持选择", clear: "清除选择" } }, dataView: { title: "数据视图", lang: ["数据视图", "关闭", "刷新"] }, dataZoom: { title: { zoom: "区域缩放", back: "区域缩放还原" } }, magicType: { title: { line: "切换为折线图", bar: "切换为柱状图", stack: "切换为堆叠", tiled: "切换为平铺" } }, restore: { title: "还原" }, saveAsImage: { title: "保存为图片", lang: ["右键另存为图片"] } }, series: { typeNames: { pie: "饼图", bar: "柱状图", line: "折线图", scatter: "散点图", effectScatter: "涟漪散点图", radar: "雷达图", tree: "树图", treemap: "矩形树图", boxplot: "箱型图", candlestick: "K线图", k: "K线图", heatmap: "热力图", map: "地图", parallel: "平行坐标图", lines: "线图", graph: "关系图", sankey: "桑基图", funnel: "漏斗图", gauge: "仪表盘图", pictorialBar: "象形柱图", themeRiver: "主题河流图", sunburst: "旭日图" } }, aria: { general: { withTitle: "这是一个关于“{title}”的图表。", withoutTitle: "这是一个图表，" }, series: { single: { prefix: "", withName: "图表类型是{seriesType}，表示{seriesName}。", withoutName: "图表类型是{seriesType}。" }, multiple: { prefix: "它由{seriesCount}个图表系列组成。", withName: "第{seriesId}个系列是一个表示{seriesName}的{seriesType}，", withoutName: "第{seriesId}个系列是一个{seriesType}，", separator: { middle: "；", end: "。" } } }, data: { allData: "其数据是——", partialData: "其中，前{displayCnt}项是——", withName: "{name}的数据是{value}", withoutName: "{value}", separator: { middle: "，", end: "" } } } },rp = function rp(t, e) {function n(t, e) {if ("string" != typeof t) return t;var n = t;return f(e, function (t, e) {n = n.replace(new RegExp("\\{\\s*" + e + "\\s*\\}", "g"), t);}), n;}function i(t) {var e = a.get(t);if (null == e) {for (var n = t.split("."), i = ip.aria, r = 0; r < n.length; ++r) {i = i[n[r]];}return i;}return e;}function r(t) {return ip.series.typeNames[t] || "自定义图";}var a = e.getModel("aria");if (a.get("show")) if (a.get("description")) t.setAttribute("aria-label", a.get("description"));else {var o = 0;e.eachSeries(function (t, e) {++o;}, this);var s,l = a.get("data.maxCount") || 10,h = a.get("series.maxCount") || 10,u = Math.min(o, h);if (!(o < 1)) {var c = function () {var t = e.getModel("title").option;return t && t.length && (t = t[0]), t && t.text;}();s = c ? n(i("general.withTitle"), { title: c }) : i("general.withoutTitle");var d = [];s += n(i(o > 1 ? "series.multiple.prefix" : "series.single.prefix"), { seriesCount: o }), e.eachSeries(function (t, e) {if (e < u) {var a,s = t.get("name"),h = "series." + (o > 1 ? "multiple" : "single") + ".";a = n(a = i(s ? h + "withName" : h + "withoutName"), { seriesId: t.seriesIndex, seriesName: t.get("name"), seriesType: r(t.subType) });var c = t.getData();window.data = c, c.count() > l ? a += n(i("data.partialData"), { displayCnt: l }) : a += i("data.allData");for (var f = [], p = 0; p < c.count(); p++) {if (p < l) {var g = c.getName(p),m = _a(c, p);f.push(n(i(g ? "data.withName" : "data.withoutName"), { name: g, value: m }));}}a += f.join(i("data.separator.middle")) + i("data.separator.end"), d.push(a);}}), s += d.join(i("series.multiple.separator.middle")) + i("series.multiple.separator.end"), t.setAttribute("aria-label", s);}}},ap = Math.PI,op = Fa.prototype;op.restoreData = function (t, e) {t.restoreData(e), this._stageTaskMap.each(function (t) {var e = t.overallTask;e && e.dirty();});}, op.getPerformArgs = function (t, e) {if (t.__pipeline) {var n = this._pipelineMap.get(t.__pipeline.id),i = n.context,r = !e && n.progressiveEnabled && (!i || i.progressiveRender) && t.__idxInPipeline > n.blockIndex ? n.step : null,a = i && i.modDataCount;return { step: r, modBy: null != a ? Math.ceil(a / r) : null, modDataCount: a };}}, op.getPipeline = function (t) {return this._pipelineMap.get(t);}, op.updateStreamModes = function (t, e) {var n = this._pipelineMap.get(t.uid),i = t.getData().count(),r = n.progressiveEnabled && e.incrementalPrepareRender && i >= n.threshold,a = t.get("large") && i >= t.get("largeThreshold"),o = "mod" === t.get("progressiveChunkMode") ? i : null;t.pipelineContext = n.context = { progressiveRender: r, modDataCount: o, large: a };}, op.restorePipelines = function (t) {var e = this,n = e._pipelineMap = R();t.eachSeries(function (t) {var i = t.getProgressive(),r = t.uid;n.set(r, { id: r, head: null, tail: null, threshold: t.getProgressiveThreshold(), progressiveEnabled: i && !(t.preventIncremental && t.preventIncremental()), blockIndex: -1, step: Math.round(i || 700), count: 0 }), Ka(e, t, t.dataTask);});}, op.prepareStageTasks = function () {var t = this._stageTaskMap,e = this.ecInstance.getModel(),n = this.api;f(this._allHandlers, function (i) {var r = t.get(i.uid) || t.set(i.uid, []);i.reset && Wa(this, i, r, e, n), i.overallReset && Ha(this, i, r, e, n);}, this);}, op.prepareView = function (t, e, n, i) {var r = t.renderTask,a = r.context;a.model = e, a.ecModel = n, a.api = i, r.__block = !t.incrementalPrepareRender, Ka(this, e, r);}, op.performDataProcessorTasks = function (t, e) {Va(this, this._dataProcessorHandlers, t, e, { block: !0 });}, op.performVisualTasks = function (t, e, n) {Va(this, this._visualHandlers, t, e, n);}, op.performSeriesTasks = function (t) {var e;t.eachSeries(function (t) {e |= t.dataTask.perform();}), this.unfinished |= e;}, op.plan = function () {this._pipelineMap.each(function (t) {var e = t.tail;do {if (e.__block) {t.blockIndex = e.__idxInPipeline;break;}e = e.getUpstream();} while (e);});};var sp = op.updatePayload = function (t, e) {"remain" !== e && (t.context.payload = e);},lp = Za(0);Fa.wrapStageHandler = function (t, e) {return _(t) && (t = { overallReset: t, seriesType: Qa(t) }), t.uid = Qi("stageHandler"), e && (t.visualType = e), t;};var hp,up = {},cp = {};Ja(up, Sd), Ja(cp, Ur), up.eachSeriesByType = up.eachRawSeriesByType = function (t) {hp = t;}, up.eachComponent = function (t) {"series" === t.mainType && t.subType && (hp = t.subType);};var fp = ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#E062AE", "#E690D1", "#e7bcf3", "#9d96f5", "#8378EA", "#96BFFF"],dp = { color: fp, colorLayer: [["#37A2DA", "#ffd85c", "#fd7b5f"], ["#37A2DA", "#67E0E3", "#FFDB5C", "#ff9f7f", "#E062AE", "#9d96f5"], ["#37A2DA", "#32C5E9", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#e7bcf3", "#8378EA", "#96BFFF"], fp] },pp = ["#dd6b66", "#759aa0", "#e69d87", "#8dc1a9", "#ea7e53", "#eedd78", "#73a373", "#73b9bc", "#7289ab", "#91ca8c", "#f49f42"],gp = { color: pp, backgroundColor: "#333", tooltip: { axisPointer: { lineStyle: { color: "#eee" }, crossStyle: { color: "#eee" } } }, legend: { textStyle: { color: "#eee" } }, textStyle: { color: "#eee" }, title: { textStyle: { color: "#eee" } }, toolbox: { iconStyle: { normal: { borderColor: "#eee" } } }, dataZoom: { textStyle: { color: "#eee" } }, visualMap: { textStyle: { color: "#eee" } }, timeline: { lineStyle: { color: "#eee" }, itemStyle: { normal: { color: pp[1] } }, label: { normal: { textStyle: { color: "#eee" } } }, controlStyle: { normal: { color: "#eee", borderColor: "#eee" } } }, timeAxis: { axisLine: { lineStyle: { color: "#eee" } }, axisTick: { lineStyle: { color: "#eee" } }, axisLabel: { textStyle: { color: "#eee" } }, splitLine: { lineStyle: { type: "dashed", color: "#aaa" } }, splitArea: { areaStyle: { color: "#eee" } } }, logAxis: { axisLine: { lineStyle: { color: "#eee" } }, axisTick: { lineStyle: { color: "#eee" } }, axisLabel: { textStyle: { color: "#eee" } }, splitLine: { lineStyle: { type: "dashed", color: "#aaa" } }, splitArea: { areaStyle: { color: "#eee" } } }, valueAxis: { axisLine: { lineStyle: { color: "#eee" } }, axisTick: { lineStyle: { color: "#eee" } }, axisLabel: { textStyle: { color: "#eee" } }, splitLine: { lineStyle: { type: "dashed", color: "#aaa" } }, splitArea: { areaStyle: { color: "#eee" } } }, categoryAxis: { axisLine: { lineStyle: { color: "#eee" } }, axisTick: { lineStyle: { color: "#eee" } }, axisLabel: { textStyle: { color: "#eee" } }, splitLine: { lineStyle: { type: "dashed", color: "#aaa" } }, splitArea: { areaStyle: { color: "#eee" } } }, line: { symbol: "circle" }, graph: { color: pp }, gauge: { title: { textStyle: { color: "#eee" } } }, candlestick: { itemStyle: { normal: { color: "#FD1050", color0: "#0CF49B", borderColor: "#FD1050", borderColor0: "#0CF49B" } } } };gp.categoryAxis.splitLine.show = !1, ld.extend({ type: "dataset", defaultOption: { seriesLayoutBy: xd, sourceHeader: null, dimensions: null, source: null }, optionUpdated: function optionUpdated() {Cr(this);} }), Zd.extend({ type: "dataset" });var mp = L,vp = f,yp = _,_p = w,xp = ld.parseClassType,wp = { zrender: "4.0.4" },bp = 1e3,Mp = 1e3,Sp = 3e3,Ip = { PROCESSOR: { FILTER: bp, STATISTIC: 5e3 }, VISUAL: { LAYOUT: Mp, GLOBAL: 2e3, CHART: Sp, COMPONENT: 4e3, BRUSH: 5e3 } },Tp = "__flagInMainProcess",Cp = "__optionUpdated",Dp = /^[a-zA-Z0-9_]+$/;eo.prototype.on = to("on"), eo.prototype.off = to("off"), eo.prototype.one = to("one"), u(eo, Bh);var kp = no.prototype;kp._onframe = function () {if (!this._disposed) {var t = this._scheduler;if (this[Cp]) {var e = this[Cp].silent;this[Tp] = !0, ro(this), Ap.update.call(this), this[Tp] = !1, this[Cp] = !1, lo.call(this, e), ho.call(this, e);} else if (t.unfinished) {var n = 1,i = this._model;this._api;t.unfinished = !1;do {var r = +new Date();t.performSeriesTasks(i), t.performDataProcessorTasks(i), oo(this, i), t.performVisualTasks(i), mo(this, this._model, 0, "remain"), n -= +new Date() - r;} while (n > 0 && t.unfinished);t.unfinished || this._zr.flush();}}}, kp.getDom = function () {return this._dom;}, kp.getZr = function () {return this._zr;}, kp.setOption = function (t, e, n) {var i;if (_p(e) && (n = e.lazyUpdate, i = e.silent, e = e.notMerge), this[Tp] = !0, !this._model || e) {var r = new jr(this._api),a = this._theme,o = this._model = new Sd(null, null, a, r);o.scheduler = this._scheduler, o.init(null, null, a, r);}this._model.setOption(t, Np), n ? (this[Cp] = { silent: i }, this[Tp] = !1) : (ro(this), Ap.update.call(this), this._zr.flush(), this[Cp] = !1, this[Tp] = !1, lo.call(this, i), ho.call(this, i));}, kp.setTheme = function () {console.log("ECharts#setTheme() is DEPRECATED in ECharts 3.0");}, kp.getModel = function () {return this._model;}, kp.getOption = function () {return this._model && this._model.getOption();}, kp.getWidth = function () {return this._zr.getWidth();}, kp.getHeight = function () {return this._zr.getHeight();}, kp.getDevicePixelRatio = function () {return this._zr.painter.dpr || window.devicePixelRatio || 1;}, kp.getRenderedCanvas = function (t) {if (_h.canvasSupported) return (t = t || {}).pixelRatio = t.pixelRatio || 1, t.backgroundColor = t.backgroundColor || this._model.get("backgroundColor"), this._zr.painter.getRenderedCanvas(t);}, kp.getSvgDataUrl = function () {if (_h.svgSupported) {var t = this._zr;return f(t.storage.getDisplayList(), function (t) {t.stopAnimation(!0);}), t.painter.pathToDataUrl();}}, kp.getDataURL = function (t) {var e = (t = t || {}).excludeComponents,n = this._model,i = [],r = this;vp(e, function (t) {n.eachComponent({ mainType: t }, function (t) {var e = r._componentsMap[t.__viewId];e.group.ignore || (i.push(e), e.group.ignore = !0);});});var a = "svg" === this._zr.painter.getType() ? this.getSvgDataUrl() : this.getRenderedCanvas(t).toDataURL("image/" + (t && t.type || "png"));return vp(i, function (t) {t.group.ignore = !1;}), a;}, kp.getConnectedDataURL = function (t) {if (_h.canvasSupported) {var e = this.group,i = Math.min,r = Math.max;if (Wp[e]) {var a = 1 / 0,o = 1 / 0,s = -1 / 0,l = -1 / 0,h = [],u = t && t.pixelRatio || 1;f(Vp, function (u, c) {if (u.group === e) {var f = u.getRenderedCanvas(n(t)),d = u.getDom().getBoundingClientRect();a = i(d.left, a), o = i(d.top, o), s = r(d.right, s), l = r(d.bottom, l), h.push({ dom: f, left: d.left, top: d.top });}});var c = (s *= u) - (a *= u),d = (l *= u) - (o *= u),p = Ah();p.width = c, p.height = d;var g = an(p);return vp(h, function (t) {var e = new Be({ style: { x: t.left * u - a, y: t.top * u - o, image: t.dom } });g.add(e);}), g.refreshImmediately(), p.toDataURL("image/" + (t && t.type || "png"));}return this.getDataURL(t);}}, kp.convertToPixel = v(io, "convertToPixel"), kp.convertFromPixel = v(io, "convertFromPixel"), kp.containPixel = function (t, e) {var n;return t = mn(this._model, t), f(t, function (t, i) {i.indexOf("Models") >= 0 && f(t, function (t) {var r = t.coordinateSystem;if (r && r.containPoint) n |= !!r.containPoint(e);else if ("seriesModels" === i) {var a = this._chartsMap[t.__viewId];a && a.containPoint && (n |= a.containPoint(e, t));}}, this);}, this), !!n;}, kp.getVisual = function (t, e) {var n = (t = mn(this._model, t, { defaultMainType: "series" })).seriesModel.getData(),i = t.hasOwnProperty("dataIndexInside") ? t.dataIndexInside : t.hasOwnProperty("dataIndex") ? n.indexOfRawIndex(t.dataIndex) : null;return null != i ? n.getItemVisual(i, e) : n.getVisual(e);}, kp.getViewOfComponentModel = function (t) {return this._componentsMap[t.__viewId];}, kp.getViewOfSeriesModel = function (t) {return this._chartsMap[t.__viewId];};var Ap = { prepareAndUpdate: function prepareAndUpdate(t) {ro(this), Ap.update.call(this, t);}, update: function update(t) {var e = this._model,n = this._api,i = this._zr,r = this._coordSysMgr,a = this._scheduler;if (e) {a.restoreData(e, t), a.performSeriesTasks(e), r.create(e, n), a.performDataProcessorTasks(e, t), oo(this, e), r.update(e, n), fo(e), a.performVisualTasks(e, t), po(this, e, n, t);var o = e.get("backgroundColor") || "transparent";if (_h.canvasSupported) i.setBackgroundColor(o);else {var s = _t(o);o = bt(s, "rgb"), 0 === s[3] && (o = "transparent");}vo(e, n);}}, updateTransform: function updateTransform(t) {var e = this._model,n = this,i = this._api;if (e) {var r = [];e.eachComponent(function (a, o) {var s = n.getViewOfComponentModel(o);if (s && s.__alive) if (s.updateTransform) {var l = s.updateTransform(o, e, i, t);l && l.update && r.push(s);} else r.push(s);});var a = R();e.eachSeries(function (r) {var o = n._chartsMap[r.__viewId];if (o.updateTransform) {var s = o.updateTransform(r, e, i, t);s && s.update && a.set(r.uid, 1);} else a.set(r.uid, 1);}), fo(e), this._scheduler.performVisualTasks(e, t, { setDirty: !0, dirtyMap: a }), mo(n, e, 0, t, a), vo(e, this._api);}}, updateView: function updateView(t) {var e = this._model;e && (Oa.markUpdateMethod(t, "updateView"), fo(e), this._scheduler.performVisualTasks(e, t, { setDirty: !0 }), po(this, this._model, this._api, t), vo(e, this._api));}, updateVisual: function updateVisual(t) {Ap.update.call(this, t);}, updateLayout: function updateLayout(t) {Ap.update.call(this, t);} };kp.resize = function (t) {this._zr.resize(t);var e = this._model;if (this._loadingFX && this._loadingFX.resize(), e) {var n = e.resetOption("media"),i = t && t.silent;this[Tp] = !0, n && ro(this), Ap.update.call(this), this[Tp] = !1, lo.call(this, i), ho.call(this, i);}}, kp.showLoading = function (t, e) {if (_p(t) && (e = t, t = ""), t = t || "default", this.hideLoading(), Fp[t]) {var n = Fp[t](this._api, e),i = this._zr;this._loadingFX = n, i.add(n);}}, kp.hideLoading = function () {this._loadingFX && this._zr.remove(this._loadingFX), this._loadingFX = null;}, kp.makeActionFromEvent = function (t) {var e = a({}, t);return e.type = Op[t.type], e;}, kp.dispatchAction = function (t, e) {_p(e) || (e = { silent: !!e }), Pp[t.type] && this._model && (this[Tp] ? this._pendingActions.push(t) : (so.call(this, t, e.silent), e.flush ? this._zr.flush(!0) : !1 !== e.flush && _h.browser.weChat && this._throttledZrFlush(), lo.call(this, e.silent), ho.call(this, e.silent)));}, kp.appendData = function (t) {var e = t.seriesIndex;this.getModel().getSeriesByIndex(e).appendData(t), this._scheduler.unfinished = !0;}, kp.on = to("on"), kp.off = to("off"), kp.one = to("one");var Lp = ["click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "globalout", "contextmenu"];kp._initEvents = function () {vp(Lp, function (t) {this._zr.on(t, function (e) {var n,i = this.getModel(),r = e.target;if ("globalout" === t) n = {};else if (r && null != r.dataIndex) {var o = r.dataModel || i.getSeriesByIndex(r.seriesIndex);n = o && o.getDataParams(r.dataIndex, r.dataType) || {};} else r && r.eventData && (n = a({}, r.eventData));n && (n.event = e, n.type = t, this.trigger(t, n));}, this);}, this), vp(Op, function (t, e) {this._messageCenter.on(e, function (t) {this.trigger(e, t);}, this);}, this);}, kp.isDisposed = function () {return this._disposed;}, kp.clear = function () {this.setOption({ series: [] }, !0);}, kp.dispose = function () {if (!this._disposed) {this._disposed = !0, yn(this.getDom(), qp, "");var t = this._api,e = this._model;vp(this._componentsViews, function (n) {n.dispose(e, t);}), vp(this._chartsViews, function (n) {n.dispose(e, t);}), this._zr.dispose(), delete Vp[this.id];}}, u(no, Bh);var Pp = {},Op = {},Ep = [],Np = [],Rp = [],Bp = [],zp = {},Fp = {},Vp = {},Wp = {},Hp = new Date() - 0,Gp = new Date() - 0,qp = "_echarts_instance_",Xp = {},Up = Mo;Ao(2e3, np), To(zd), Co(5e3, function (t) {var e = R();t.eachSeries(function (t) {var n = t.get("stack");if (n) {var i = e.get(n) || e.set(n, []),r = t.getData(),a = { stackResultDimension: r.getCalculationInfo("stackResultDimension"), stackedOverDimension: r.getCalculationInfo("stackedOverDimension"), stackedDimension: r.getCalculationInfo("stackedDimension"), stackedByDimension: r.getCalculationInfo("stackedByDimension"), isStackedByIndex: r.getCalculationInfo("isStackedByIndex"), data: r, seriesModel: t };if (!a.stackedDimension || !a.isStackedByIndex && !a.stackedByDimension) return;i.length && r.setCalculationInfo("stackedOnSeries", i[i.length - 1].seriesModel), i.push(a);}}), e.each(ca);}), Po("default", function (t, e) {o(e = e || {}, { text: "loading", color: "#c23531", textColor: "#000", maskColor: "rgba(255, 255, 255, 0.8)", zlevel: 0 });var n = new Cf({ style: { fill: e.maskColor }, zlevel: e.zlevel, z: 1e4 }),i = new Lf({ shape: { startAngle: -ap / 2, endAngle: -ap / 2 + .1, r: 10 }, style: { stroke: e.color, lineCap: "round", lineWidth: 5 }, zlevel: e.zlevel, z: 10001 }),r = new Cf({ style: { fill: "none", text: e.text, textPosition: "right", textDistance: 10, textFill: e.textColor }, zlevel: e.zlevel, z: 10001 });i.animateShape(!0).when(1e3, { endAngle: 3 * ap / 2 }).start("circularInOut"), i.animateShape(!0).when(1e3, { startAngle: 3 * ap / 2 }).delay(300).start("circularInOut");var a = new du();return a.add(i), a.add(r), a.add(n), a.resize = function () {var e = t.getWidth() / 2,a = t.getHeight() / 2;i.setShape({ cx: e, cy: a });var o = i.shape.r;r.setShape({ x: e - o, y: a - o, width: 2 * o, height: 2 * o }), n.setShape({ x: 0, y: 0, width: t.getWidth(), height: t.getHeight() });}, a.resize(), a;}), Do({ type: "highlight", event: "highlight", update: "highlight" }, B), Do({ type: "downplay", event: "downplay", update: "downplay" }, B), Io("light", dp), Io("dark", gp);var Yp = {};Bo.prototype = { constructor: Bo, add: function add(t) {return this._add = t, this;}, update: function update(t) {return this._update = t, this;}, remove: function remove(t) {return this._remove = t, this;}, execute: function execute() {var t = this._old,e = this._new,n = {},i = [],r = [];for (zo(t, {}, i, "_oldKeyGetter", this), zo(e, n, r, "_newKeyGetter", this), a = 0; a < t.length; a++) {null != (s = n[o = i[a]]) ? ((h = s.length) ? (1 === h && (n[o] = null), s = s.unshift()) : n[o] = null, this._update && this._update(s, a)) : this._remove && this._remove(a);}for (var a = 0; a < r.length; a++) {var o = r[a];if (n.hasOwnProperty(o)) {var s = n[o];if (null == s) continue;if (s.length) for (var l = 0, h = s.length; l < h; l++) {this._add && this._add(s[l]);} else this._add && this._add(s);}}} };var jp = R(["tooltip", "label", "itemName", "itemId", "seriesName"]),Zp = w,$p = "e\0\0",Kp = { float: "undefined" == typeof Float64Array ? Array : Float64Array, int: "undefined" == typeof Int32Array ? Array : Int32Array, ordinal: Array, number: Array, time: Array },Qp = "undefined" == typeof Uint32Array ? Array : Uint32Array,Jp = "undefined" == typeof Uint16Array ? Array : Uint16Array,tg = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_rawData", "_chunkSize", "_chunkCount", "_dimValueGetter", "_count", "_rawCount", "_nameDimIdx", "_idDimIdx"],eg = ["_extent", "_approximateExtent", "_rawExtent"],ng = function ng(t, e) {t = t || ["x", "y"];for (var n = {}, i = [], r = {}, a = 0; a < t.length; a++) {var o = t[a];x(o) && (o = { name: o });var s = o.name;o.type = o.type || "float", o.coordDim || (o.coordDim = s, o.coordDimIndex = 0), o.otherDims = o.otherDims || {}, i.push(s), n[s] = o, o.index = a, o.createInvertedIndices && (r[s] = []);}this.dimensions = i, this._dimensionInfos = n, this.hostModel = e, this.dataType, this._indices = null, this._count = 0, this._rawCount = 0, this._storage = {}, this._nameList = [], this._idList = [], this._optionModels = [], this._visual = {}, this._layout = {}, this._itemVisuals = [], this.hasItemVisual = {}, this._itemLayouts = [], this._graphicEls = [], this._chunkSize = 1e5, this._chunkCount = 0, this._rawData, this._rawExtent = {}, this._extent = {}, this._approximateExtent = {}, this._dimensionsSummary = Fo(this), this._invertedIndicesMap = r, this._calculationInfo = {};},ig = ng.prototype;ig.type = "list", ig.hasItemOption = !0, ig.getDimension = function (t) {return isNaN(t) || (t = this.dimensions[t] || t), t;}, ig.getDimensionInfo = function (t) {return this._dimensionInfos[this.getDimension(t)];}, ig.getDimensionsOnCoord = function () {return this._dimensionsSummary.dataDimsOnCoord.slice();}, ig.mapDimension = function (t, e) {var n = this._dimensionsSummary;if (null == e) return n.encodeFirstDimNotExtra[t];var i = n.encode[t];return !0 === e ? (i || []).slice() : i && i[e];}, ig.initData = function (t, e, n) {(Tr.isInstance(t) || c(t)) && (t = new fa(t, this.dimensions.length)), this._rawData = t, this._storage = {}, this._indices = null, this._nameList = e || [], this._idList = [], this._nameRepeatCount = {}, n || (this.hasItemOption = !1), this.defaultDimValueGetter = Hd[this._rawData.getSource().sourceFormat], this._dimValueGetter = n = n || this.defaultDimValueGetter, this._rawExtent = {}, this._initDataFromProvider(0, t.count()), t.pure && (this.hasItemOption = !1);}, ig.getProvider = function () {return this._rawData;}, ig.appendData = function (t) {var e = this._rawData,n = this.count();e.appendData(t);var i = e.count();e.persistent || (i += n), this._initDataFromProvider(n, i);}, ig._initDataFromProvider = function (t, e) {if (!(t >= e)) {for (var n, i = this._chunkSize, r = this._rawData, a = this._storage, o = this.dimensions, s = o.length, l = this._dimensionInfos, h = this._nameList, u = this._idList, c = this._rawExtent, f = this._nameRepeatCount = {}, d = this._chunkCount, p = d - 1, g = 0; g < s; g++) {c[T = o[g]] || (c[T] = [1 / 0, -1 / 0]);var m = l[T];0 === m.otherDims.itemName && (n = this._nameDimIdx = g), 0 === m.otherDims.itemId && (this._idDimIdx = g);var v = Kp[m.type];a[T] || (a[T] = []);var y = a[T][p];if (y && y.length < i) {for (var _ = new v(Math.min(e - p * i, i)), x = 0; x < y.length; x++) {_[x] = y[x];}a[T][p] = _;}for (I = d * i; I < e; I += i) {a[T].push(new v(Math.min(e - I, i)));}this._chunkCount = a[T].length;}for (var w = new Array(s), b = t; b < e; b++) {w = r.getItem(b, w);for (var M = Math.floor(b / i), S = b % i, I = 0; I < s; I++) {var T = o[I],C = a[T][M],D = this._dimValueGetter(w, T, b, I);C[S] = D;var k = c[T];D < k[0] && (k[0] = D), D > k[1] && (k[1] = D);}if (!r.pure) {var A = h[b];if (w && null == A) if (null != w.name) h[b] = A = w.name;else if (null != n) {var L = o[n],P = a[L][M];if (P) {A = P[S];var O = l[L].ordinalMeta;O && O.categories.length && (A = O.categories[A]);}}var E = null == w ? null : w.id;null == E && null != A && (f[A] = f[A] || 0, E = A, f[A] > 0 && (E += "__ec__" + f[A]), f[A]++), null != E && (u[b] = E);}}!r.persistent && r.clean && r.clean(), this._rawCount = this._count = e, this._extent = {}, Xo(this);}}, ig.count = function () {return this._count;}, ig.getIndices = function () {var t = this._indices;if (t) {var e = t.constructor,n = this._count;if (e === Array) {i = new e(n);for (r = 0; r < n; r++) {i[r] = t[r];}} else i = new e(t.buffer, 0, n);} else for (var i = new (e = Ho(this))(this.count()), r = 0; r < i.length; r++) {i[r] = r;}return i;}, ig.get = function (t, e) {if (!(e >= 0 && e < this._count)) return NaN;var n = this._storage;if (!n[t]) return NaN;e = this.getRawIndex(e);var i = Math.floor(e / this._chunkSize),r = e % this._chunkSize;return n[t][i][r];}, ig.getByRawIndex = function (t, e) {if (!(e >= 0 && e < this._rawCount)) return NaN;var n = this._storage[t];if (!n) return NaN;var i = Math.floor(e / this._chunkSize),r = e % this._chunkSize;return n[i][r];}, ig._getFast = function (t, e) {var n = Math.floor(e / this._chunkSize),i = e % this._chunkSize;return this._storage[t][n][i];}, ig.getValues = function (t, e) {var n = [];y(t) || (e = t, t = this.dimensions);for (var i = 0, r = t.length; i < r; i++) {n.push(this.get(t[i], e));}return n;}, ig.hasValue = function (t) {for (var e = this._dimensionsSummary.dataDimsOnCoord, n = this._dimensionInfos, i = 0, r = e.length; i < r; i++) {if ("ordinal" !== n[e[i]].type && isNaN(this.get(e[i], t))) return !1;}return !0;}, ig.getDataExtent = function (t) {t = this.getDimension(t);var e = [1 / 0, -1 / 0];if (!this._storage[t]) return e;var n,i = this.count();if (!this._indices) return this._rawExtent[t].slice();if (n = this._extent[t]) return n.slice();for (var r = (n = e)[0], a = n[1], o = 0; o < i; o++) {var s = this._getFast(t, this.getRawIndex(o));s < r && (r = s), s > a && (a = s);}return n = [r, a], this._extent[t] = n, n;}, ig.getApproximateExtent = function (t) {return t = this.getDimension(t), this._approximateExtent[t] || this.getDataExtent(t);}, ig.setApproximateExtent = function (t, e) {e = this.getDimension(e), this._approximateExtent[e] = t.slice();}, ig.getCalculationInfo = function (t) {return this._calculationInfo[t];}, ig.setCalculationInfo = function (t, e) {Zp(t) ? a(this._calculationInfo, t) : this._calculationInfo[t] = e;}, ig.getSum = function (t) {var e = 0;if (this._storage[t]) for (var n = 0, i = this.count(); n < i; n++) {var r = this.get(t, n);isNaN(r) || (e += r);}return e;}, ig.getMedian = function (t) {var e = [];this.each(t, function (t, n) {isNaN(t) || e.push(t);});var n = [].concat(e).sort(function (t, e) {return t - e;}),i = this.count();return 0 === i ? 0 : i % 2 == 1 ? n[(i - 1) / 2] : (n[i / 2] + n[i / 2 - 1]) / 2;}, ig.rawIndexOf = function (t, e) {var n = (t && this._invertedIndicesMap[t])[e];return null == n || isNaN(n) ? -1 : n;}, ig.indexOfName = function (t) {for (var e = 0, n = this.count(); e < n; e++) {if (this.getName(e) === t) return e;}return -1;}, ig.indexOfRawIndex = function (t) {if (!this._indices) return t;if (t >= this._rawCount || t < 0) return -1;var e = this._indices,n = e[t];if (null != n && n < this._count && n === t) return t;for (var i = 0, r = this._count - 1; i <= r;) {var a = (i + r) / 2 | 0;if (e[a] < t) i = a + 1;else {if (!(e[a] > t)) return a;r = a - 1;}}return -1;}, ig.indicesOfNearest = function (t, e, n) {var i = [];if (!this._storage[t]) return i;null == n && (n = 1 / 0);for (var r = Number.MAX_VALUE, a = -1, o = 0, s = this.count(); o < s; o++) {var l = e - this.get(t, o),h = Math.abs(l);l <= n && h <= r && ((h < r || l >= 0 && a < 0) && (r = h, a = l, i.length = 0), i.push(o));}return i;}, ig.getRawIndex = Yo, ig.getRawDataItem = function (t) {if (this._rawData.persistent) return this._rawData.getItem(this.getRawIndex(t));for (var e = [], n = 0; n < this.dimensions.length; n++) {var i = this.dimensions[n];e.push(this.get(i, t));}return e;}, ig.getName = function (t) {var e = this.getRawIndex(t);return this._nameList[e] || Uo(this, this._nameDimIdx, e) || "";}, ig.getId = function (t) {return Zo(this, this.getRawIndex(t));}, ig.each = function (t, e, n, i) {if (this._count) {"function" == typeof t && (i = n, n = e, e = t, t = []), n = n || i || this;for (var r = (t = d($o(t), this.getDimension, this)).length, a = 0; a < this.count(); a++) {switch (r) {case 0:e.call(n, a);break;case 1:e.call(n, this.get(t[0], a), a);break;case 2:e.call(n, this.get(t[0], a), this.get(t[1], a), a);break;default:for (var o = 0, s = []; o < r; o++) {s[o] = this.get(t[o], a);}s[o] = a, e.apply(n, s);}}}}, ig.filterSelf = function (t, e, n, i) {if (this._count) {"function" == typeof t && (i = n, n = e, e = t, t = []), n = n || i || this, t = d($o(t), this.getDimension, this);for (var r = this.count(), a = new (Ho(this))(r), o = [], s = t.length, l = 0, h = t[0], u = 0; u < r; u++) {var c,f = this.getRawIndex(u);if (0 === s) c = e.call(n, u);else if (1 === s) {var p = this._getFast(h, f);c = e.call(n, p, u);} else {for (var g = 0; g < s; g++) {o[g] = this._getFast(h, f);}o[g] = u, c = e.apply(n, o);}c && (a[l++] = f);}return l < r && (this._indices = a), this._count = l, this._extent = {}, this.getRawIndex = this._indices ? jo : Yo, this;}}, ig.selectRange = function (t) {if (this._count) {var e = [];for (var n in t) {t.hasOwnProperty(n) && e.push(n);}var i = e.length;if (i) {var r = this.count(),a = new (Ho(this))(r),o = 0,s = e[0],l = t[s][0],h = t[s][1],u = !1;if (!this._indices) {var c = 0;if (1 === i) {for (var f = this._storage[e[0]], d = 0; d < this._chunkCount; d++) {for (var p = f[d], g = Math.min(this._count - d * this._chunkSize, this._chunkSize), m = 0; m < g; m++) {((w = p[m]) >= l && w <= h || isNaN(w)) && (a[o++] = c), c++;}}u = !0;} else if (2 === i) {for (var f = this._storage[s], v = this._storage[e[1]], y = t[e[1]][0], _ = t[e[1]][1], d = 0; d < this._chunkCount; d++) {for (var p = f[d], x = v[d], g = Math.min(this._count - d * this._chunkSize, this._chunkSize), m = 0; m < g; m++) {var w = p[m],b = x[m];(w >= l && w <= h || isNaN(w)) && (b >= y && b <= _ || isNaN(b)) && (a[o++] = c), c++;}}u = !0;}}if (!u) if (1 === i) for (m = 0; m < r; m++) {S = this.getRawIndex(m);((w = this._getFast(s, S)) >= l && w <= h || isNaN(w)) && (a[o++] = S);} else for (m = 0; m < r; m++) {for (var M = !0, S = this.getRawIndex(m), d = 0; d < i; d++) {var I = e[d];((w = this._getFast(n, S)) < t[I][0] || w > t[I][1]) && (M = !1);}M && (a[o++] = this.getRawIndex(m));}return o < r && (this._indices = a), this._count = o, this._extent = {}, this.getRawIndex = this._indices ? jo : Yo, this;}}}, ig.mapArray = function (t, e, n, i) {"function" == typeof t && (i = n, n = e, e = t, t = []), n = n || i || this;var r = [];return this.each(t, function () {r.push(e && e.apply(this, arguments));}, n), r;}, ig.map = function (t, e, n, i) {n = n || i || this;var r = Ko(this, t = d($o(t), this.getDimension, this));r._indices = this._indices, r.getRawIndex = r._indices ? jo : Yo;for (var a = r._storage, o = [], s = this._chunkSize, l = t.length, h = this.count(), u = [], c = r._rawExtent, f = 0; f < h; f++) {for (var p = 0; p < l; p++) {u[p] = this.get(t[p], f);}u[l] = f;var g = e && e.apply(n, u);if (null != g) {"object" != typeof g && (o[0] = g, g = o);for (var m = this.getRawIndex(f), v = Math.floor(m / s), y = m % s, _ = 0; _ < g.length; _++) {var x = t[_],w = g[_],b = c[x],M = a[x];M && (M[v][y] = w), w < b[0] && (b[0] = w), w > b[1] && (b[1] = w);}}}return r;}, ig.downSample = function (t, e, n, i) {for (var r = Ko(this, [t]), a = r._storage, o = [], s = Math.floor(1 / e), l = a[t], h = this.count(), u = this._chunkSize, c = r._rawExtent[t], f = new (Ho(this))(h), d = 0, p = 0; p < h; p += s) {s > h - p && (s = h - p, o.length = s);for (var g = 0; g < s; g++) {var m = this.getRawIndex(p + g),v = Math.floor(m / u),y = m % u;o[g] = l[v][y];}var _ = n(o),x = this.getRawIndex(Math.min(p + i(o, _) || 0, h - 1)),w = x % u;l[Math.floor(x / u)][w] = _, _ < c[0] && (c[0] = _), _ > c[1] && (c[1] = _), f[d++] = x;}return r._count = d, r._indices = f, r.getRawIndex = jo, r;}, ig.getItemModel = function (t) {var e = this.hostModel;return new Zi(this.getRawDataItem(t), e, e && e.ecModel);}, ig.diff = function (t) {var e = this;return new Bo(t ? t.getIndices() : [], this.getIndices(), function (e) {return Zo(t, e);}, function (t) {return Zo(e, t);});}, ig.getVisual = function (t) {var e = this._visual;return e && e[t];}, ig.setVisual = function (t, e) {if (Zp(t)) for (var n in t) {t.hasOwnProperty(n) && this.setVisual(n, t[n]);} else this._visual = this._visual || {}, this._visual[t] = e;}, ig.setLayout = function (t, e) {if (Zp(t)) for (var n in t) {t.hasOwnProperty(n) && this.setLayout(n, t[n]);} else this._layout[t] = e;}, ig.getLayout = function (t) {return this._layout[t];}, ig.getItemLayout = function (t) {return this._itemLayouts[t];}, ig.setItemLayout = function (t, e, n) {this._itemLayouts[t] = n ? a(this._itemLayouts[t] || {}, e) : e;}, ig.clearItemLayouts = function () {this._itemLayouts.length = 0;}, ig.getItemVisual = function (t, e, n) {var i = this._itemVisuals[t],r = i && i[e];return null != r || n ? r : this.getVisual(e);}, ig.setItemVisual = function (t, e, n) {var i = this._itemVisuals[t] || {},r = this.hasItemVisual;if (this._itemVisuals[t] = i, Zp(e)) for (var a in e) {e.hasOwnProperty(a) && (i[a] = e[a], r[a] = !0);} else i[e] = n, r[e] = !0;}, ig.clearAllVisual = function () {this._visual = {}, this._itemVisuals = [], this.hasItemVisual = {};};var rg = function rg(t) {t.seriesIndex = this.seriesIndex, t.dataIndex = this.dataIndex, t.dataType = this.dataType;};ig.setItemGraphicEl = function (t, e) {var n = this.hostModel;e && (e.dataIndex = t, e.dataType = this.dataType, e.seriesIndex = n && n.seriesIndex, "group" === e.type && e.traverse(rg, e)), this._graphicEls[t] = e;}, ig.getItemGraphicEl = function (t) {return this._graphicEls[t];}, ig.eachItemGraphicEl = function (t, e) {f(this._graphicEls, function (n, i) {n && t && t.call(e, n, i);});}, ig.cloneShallow = function (t) {if (!t) {var e = d(this.dimensions, this.getDimensionInfo, this);t = new ng(e, this.hostModel);}if (t._storage = this._storage, qo(t, this), this._indices) {var n = this._indices.constructor;t._indices = new n(this._indices);} else t._indices = null;return t.getRawIndex = t._indices ? jo : Yo, t;}, ig.wrapMethod = function (t, e) {var n = this[t];"function" == typeof n && (this.__wrappedMethods = this.__wrappedMethods || [], this.__wrappedMethods.push(t), this[t] = function () {var t = n.apply(this, arguments);return e.apply(this, [t].concat(k(arguments)));});}, ig.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "map"], ig.CHANGABLE_METHODS = ["filterSelf", "selectRange"];var ag = function ag(t, e) {return e = e || {}, ts(e.coordDimensions || [], t, { dimsDef: e.dimensionsDefine || t.dimensionsDefine, encodeDef: e.encodeDefine || t.encodeDefine, dimCount: e.dimensionsCount, generateCoord: e.generateCoord, generateCoordCount: e.generateCoordCount });};jd.extend({ type: "series.line", dependencies: ["grid", "polar"], getInitialData: function getInitialData(t, e) {return os(this.getSource(), this);}, defaultOption: { zlevel: 0, z: 2, coordinateSystem: "cartesian2d", legendHoverLink: !0, hoverAnimation: !0, clipOverflow: !0, label: { position: "top" }, lineStyle: { width: 2, type: "solid" }, step: !1, smooth: !1, smoothMonotone: null, symbol: "emptyCircle", symbolSize: 4, symbolRotate: null, showSymbol: !0, showAllSymbol: "auto", connectNulls: !1, sampling: "none", animationEasing: "linear", progressive: 0, hoverLayerThreshold: 1 / 0 } });var og = gi({ type: "triangle", shape: { cx: 0, cy: 0, width: 0, height: 0 }, buildPath: function buildPath(t, e) {var n = e.cx,i = e.cy,r = e.width / 2,a = e.height / 2;t.moveTo(n, i - a), t.lineTo(n + r, i + a), t.lineTo(n - r, i + a), t.closePath();} }),sg = gi({ type: "diamond", shape: { cx: 0, cy: 0, width: 0, height: 0 }, buildPath: function buildPath(t, e) {var n = e.cx,i = e.cy,r = e.width / 2,a = e.height / 2;t.moveTo(n, i - a), t.lineTo(n + r, i), t.lineTo(n, i + a), t.lineTo(n - r, i), t.closePath();} }),lg = gi({ type: "pin", shape: { x: 0, y: 0, width: 0, height: 0 }, buildPath: function buildPath(t, e) {var n = e.x,i = e.y,r = e.width / 5 * 3,a = Math.max(r, e.height),o = r / 2,s = o * o / (a - o),l = i - a + o + s,h = Math.asin(s / o),u = Math.cos(h) * o,c = Math.sin(h),f = Math.cos(h),d = .6 * o,p = .7 * o;t.moveTo(n - u, l + s), t.arc(n, l, o, Math.PI - h, 2 * Math.PI + h), t.bezierCurveTo(n + u - c * d, l + s + f * d, n, i - p, n, i), t.bezierCurveTo(n, i - p, n - u + c * d, l + s + f * d, n - u, l + s), t.closePath();} }),hg = gi({ type: "arrow", shape: { x: 0, y: 0, width: 0, height: 0 }, buildPath: function buildPath(t, e) {var n = e.height,i = e.width,r = e.x,a = e.y,o = i / 3 * 2;t.moveTo(r, a), t.lineTo(r + o, a + n), t.lineTo(r, a + n / 4 * 3), t.lineTo(r - o, a + n), t.lineTo(r, a), t.closePath();} }),ug = { line: function line(t, e, n, i, r) {r.x1 = t, r.y1 = e + i / 2, r.x2 = t + n, r.y2 = e + i / 2;}, rect: function rect(t, e, n, i, r) {r.x = t, r.y = e, r.width = n, r.height = i;}, roundRect: function roundRect(t, e, n, i, r) {r.x = t, r.y = e, r.width = n, r.height = i, r.r = Math.min(n, i) / 4;}, square: function square(t, e, n, i, r) {var a = Math.min(n, i);r.x = t, r.y = e, r.width = a, r.height = a;}, circle: function circle(t, e, n, i, r) {r.cx = t + n / 2, r.cy = e + i / 2, r.r = Math.min(n, i) / 2;}, diamond: function diamond(t, e, n, i, r) {r.cx = t + n / 2, r.cy = e + i / 2, r.width = n, r.height = i;}, pin: function pin(t, e, n, i, r) {r.x = t + n / 2, r.y = e + i / 2, r.width = n, r.height = i;}, arrow: function arrow(t, e, n, i, r) {r.x = t + n / 2, r.y = e + i / 2, r.width = n, r.height = i;}, triangle: function triangle(t, e, n, i, r) {r.cx = t + n / 2, r.cy = e + i / 2, r.width = n, r.height = i;} },cg = {};f({ line: Df, rect: Cf, roundRect: Cf, square: Cf, circle: yf, diamond: sg, pin: lg, arrow: hg, triangle: og }, function (t, e) {cg[e] = new t();});var fg = gi({ type: "symbol", shape: { symbolType: "", x: 0, y: 0, width: 0, height: 0 }, beforeBrush: function beforeBrush() {var t = this.style;"pin" === this.shape.symbolType && "inside" === t.textPosition && (t.textPosition = ["50%", "40%"], t.textAlign = "center", t.textVerticalAlign = "middle");}, buildPath: function buildPath(t, e, n) {var i = e.symbolType,r = cg[i];"none" !== e.symbolType && (r || (r = cg[i = "rect"]), ug[i](e.x, e.y, e.width, e.height, r.shape), r.buildPath(t, r.shape, n));} }),dg = fs.prototype,pg = fs.getSymbolSize = function (t, e) {var n = t.getItemVisual(e, "symbolSize");return n instanceof Array ? n.slice() : [+n, +n];};dg._createSymbol = function (t, e, n, i, r) {this.removeAll();var a = us(t, -1, -1, 2, 2, e.getItemVisual(n, "color"), r);a.attr({ z2: 100, culling: !0, scale: ds(i) }), a.drift = ps, this._symbolType = t, this.add(a);}, dg.stopSymbolAnimation = function (t) {this.childAt(0).stopAnimation(t);}, dg.getSymbolPath = function () {return this.childAt(0);}, dg.getScale = function () {return this.childAt(0).scale;}, dg.highlight = function () {this.childAt(0).trigger("emphasis");}, dg.downplay = function () {this.childAt(0).trigger("normal");}, dg.setZ = function (t, e) {var n = this.childAt(0);n.zlevel = t, n.z = e;}, dg.setDraggable = function (t) {var e = this.childAt(0);e.draggable = t, e.cursor = t ? "move" : "pointer";}, dg.updateData = function (t, e, n) {this.silent = !1;var i = t.getItemVisual(e, "symbol") || "circle",r = t.hostModel,a = pg(t, e),o = i !== this._symbolType;if (o) {var s = t.getItemVisual(e, "symbolKeepAspect");this._createSymbol(i, t, e, a, s);} else (l = this.childAt(0)).silent = !1, Xi(l, { scale: ds(a) }, r, e);if (this._updateCommon(t, e, a, n), o) {var l = this.childAt(0),h = n && n.fadeIn,u = { scale: l.scale.slice() };h && (u.style = { opacity: l.style.opacity }), l.scale = [0, 0], h && (l.style.opacity = 0), Ui(l, u, r, e);}this._seriesModel = r;};var gg = ["itemStyle"],mg = ["emphasis", "itemStyle"],vg = ["label"],yg = ["emphasis", "label"];dg._updateCommon = function (t, e, n, i) {var r = this.childAt(0),o = t.hostModel,s = t.getItemVisual(e, "color");"image" !== r.type && r.useStyle({ strokeNoScale: !0 });var l = i && i.itemStyle,h = i && i.hoverItemStyle,u = i && i.symbolRotate,c = i && i.symbolOffset,f = i && i.labelModel,d = i && i.hoverLabelModel,p = i && i.hoverAnimation,g = i && i.cursorStyle;if (!i || t.hasItemOption) {var m = i && i.itemModel ? i.itemModel : t.getItemModel(e);l = m.getModel(gg).getItemStyle(["color"]), h = m.getModel(mg).getItemStyle(), u = m.getShallow("symbolRotate"), c = m.getShallow("symbolOffset"), f = m.getModel(vg), d = m.getModel(yg), p = m.getShallow("hoverAnimation"), g = m.getShallow("cursor");} else h = a({}, h);var v = r.style;r.attr("rotation", (u || 0) * Math.PI / 180 || 0), c && r.attr("position", [er(c[0], n[0]), er(c[1], n[1])]), g && r.attr("cursor", g), r.setColor(s, i && i.symbolInnerColor), r.setStyle(l);var y = t.getItemVisual(e, "opacity");null != y && (v.opacity = y);var _ = t.getItemVisual(e, "liftZ"),x = r.__z2Origin;null != _ ? null == x && (r.__z2Origin = r.z2, r.z2 += _) : null != x && (r.z2 = x, r.__z2Origin = null);var w = i && i.useNameLabel;Ni(v, h, f, d, { labelFetcher: o, labelDataIndex: e, defaultText: function defaultText(e, n) {return w ? t.getName(e) : cs(t, e);}, isRectText: !0, autoColor: s }), r.off("mouseover").off("mouseout").off("emphasis").off("normal"), r.hoverStyle = h, Ei(r);var b = ds(n);if (p && o.isAnimationEnabled()) {var M = function M() {if (!this.incremental) {var t = b[1] / b[0];this.animateTo({ scale: [Math.max(1.1 * b[0], b[0] + 3), Math.max(1.1 * b[1], b[1] + 3 * t)] }, 400, "elasticOut");}},S = function S() {this.incremental || this.animateTo({ scale: b }, 400, "elasticOut");};r.on("mouseover", M).on("mouseout", S).on("emphasis", M).on("normal", S);}}, dg.fadeOut = function (t, e) {var n = this.childAt(0);this.silent = n.silent = !0, !(e && e.keepLabel) && (n.style.text = null), Xi(n, { style: { opacity: 0 }, scale: [0, 0] }, this._seriesModel, this.dataIndex, t);}, h(fs, du);var _g = gs.prototype;_g.updateData = function (t, e) {e = vs(e);var n = this.group,i = t.hostModel,r = this._data,a = this._symbolCtor,o = ys(t);r || n.removeAll(), t.diff(r).add(function (i) {var r = t.getItemLayout(i);if (ms(t, r, i, e)) {var s = new a(t, i, o);s.attr("position", r), t.setItemGraphicEl(i, s), n.add(s);}}).update(function (s, l) {var h = r.getItemGraphicEl(l),u = t.getItemLayout(s);ms(t, u, s, e) ? (h ? (h.updateData(t, s, o), Xi(h, { position: u }, i)) : (h = new a(t, s)).attr("position", u), n.add(h), t.setItemGraphicEl(s, h)) : n.remove(h);}).remove(function (t) {var e = r.getItemGraphicEl(t);e && e.fadeOut(function () {n.remove(e);});}).execute(), this._data = t;}, _g.isPersistent = function () {return !0;}, _g.updateLayout = function () {var t = this._data;t && t.eachItemGraphicEl(function (e, n) {var i = t.getItemLayout(n);e.attr("position", i);});}, _g.incrementalPrepareUpdate = function (t) {this._seriesScope = ys(t), this._data = null, this.group.removeAll();}, _g.incrementalUpdate = function (t, e, n) {n = vs(n);for (var i = t.start; i < t.end; i++) {var r = e.getItemLayout(i);if (ms(e, r, i, n)) {var a = new this._symbolCtor(e, i, this._seriesScope);a.traverse(function (t) {t.isGroup || (t.incremental = t.useHoverLayer = !0);}), a.attr("position", r), this.group.add(a), e.setItemGraphicEl(i, a);}}}, _g.remove = function (t) {var e = this.group,n = this._data;n && t ? n.eachItemGraphicEl(function (t) {t.fadeOut(function () {e.remove(t);});}) : e.removeAll();};var xg = function xg(t, e, n, i, r, a, o, s) {for (var l = bs(t, e), h = [], u = [], c = [], f = [], d = [], p = [], g = [], m = _s(r, e, o), v = _s(a, t, s), y = 0; y < l.length; y++) {var _ = l[y],x = !0;switch (_.cmd) {case "=":var w = t.getItemLayout(_.idx),b = e.getItemLayout(_.idx1);(isNaN(w[0]) || isNaN(w[1])) && (w = b.slice()), h.push(w), u.push(b), c.push(n[_.idx]), f.push(i[_.idx1]), g.push(e.getRawIndex(_.idx1));break;case "+":M = _.idx;h.push(r.dataToPoint([e.get(m.dataDimsForPoint[0], M), e.get(m.dataDimsForPoint[1], M)])), u.push(e.getItemLayout(M).slice()), c.push(ws(m, r, e, M)), f.push(i[M]), g.push(e.getRawIndex(M));break;case "-":var M = _.idx,S = t.getRawIndex(M);S !== M ? (h.push(t.getItemLayout(M)), u.push(a.dataToPoint([t.get(v.dataDimsForPoint[0], M), t.get(v.dataDimsForPoint[1], M)])), c.push(n[M]), f.push(ws(v, a, t, M)), g.push(S)) : x = !1;}x && (d.push(_), p.push(p.length));}p.sort(function (t, e) {return g[t] - g[e];});for (var I = [], T = [], C = [], D = [], k = [], y = 0; y < p.length; y++) {M = p[y];I[y] = h[M], T[y] = u[M], C[y] = c[M], D[y] = f[M], k[y] = d[M];}return { current: I, next: T, stackedOnCurrent: C, stackedOnNext: D, status: k };},wg = j,bg = Z,Mg = function Mg(t, e, n, i) {return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t;},Sg = function Sg(t, e) {return t[0] = e[0], t[1] = e[1], t;},Ig = [],Tg = [],Cg = [],Dg = ai.extend({ type: "ec-polyline", shape: { points: [], smooth: 0, smoothConstraint: !0, smoothMonotone: null, connectNulls: !1 }, style: { fill: null, stroke: "#000" }, brush: xf(ai.prototype.brush), buildPath: function buildPath(t, e) {var n = e.points,i = 0,r = n.length,a = Cs(n, e.smoothConstraint);if (e.connectNulls) {for (; r > 0 && Ms(n[r - 1]); r--) {;}for (; i < r && Ms(n[i]); i++) {;}}for (; i < r;) {i += Ss(t, n, i, r, r, 1, a.min, a.max, e.smooth, e.smoothMonotone, e.connectNulls) + 1;}} }),kg = ai.extend({ type: "ec-polygon", shape: { points: [], stackedOnPoints: [], smooth: 0, stackedOnSmooth: 0, smoothConstraint: !0, smoothMonotone: null, connectNulls: !1 }, brush: xf(ai.prototype.brush), buildPath: function buildPath(t, e) {var n = e.points,i = e.stackedOnPoints,r = 0,a = n.length,o = e.smoothMonotone,s = Cs(n, e.smoothConstraint),l = Cs(i, e.smoothConstraint);if (e.connectNulls) {for (; a > 0 && Ms(n[a - 1]); a--) {;}for (; r < a && Ms(n[r]); r++) {;}}for (; r < a;) {var h = Ss(t, n, r, a, a, 1, s.min, s.max, e.smooth, o, e.connectNulls);Ss(t, i, r + h - 1, h, a, -1, l.min, l.max, e.stackedOnSmooth, o, e.connectNulls), r += h + 1, t.closePath();}} });Oa.extend({ type: "line", init: function init() {var t = new du(),e = new gs();this.group.add(e.group), this._symbolDraw = e, this._lineGroup = t;}, render: function render(t, e, n) {var i = t.coordinateSystem,r = this.group,a = t.getData(),s = t.getModel("lineStyle"),l = t.getModel("areaStyle"),h = a.mapArray(a.getItemLayout),u = "polar" === i.type,c = this._coordSys,f = this._symbolDraw,d = this._polyline,p = this._polygon,g = this._lineGroup,m = t.get("animation"),v = !l.isEmpty(),y = l.get("origin"),_ = Ls(i, a, _s(i, a, y)),x = t.get("showSymbol"),w = x && !u && Bs(t, a, i),b = this._data;b && b.eachItemGraphicEl(function (t, e) {t.__temp && (r.remove(t), b.setItemGraphicEl(e, null));}), x || f.remove(), r.add(g);var M = !u && t.get("step");d && c.type === i.type && M === this._step ? (v && !p ? p = this._newPolygon(h, _, i, m) : p && !v && (g.remove(p), p = this._polygon = null), g.setClipPath(Es(i, !1, !1, t)), x && f.updateData(a, { isIgnore: w, clipShape: Es(i, !1, !0, t) }), a.eachItemGraphicEl(function (t) {t.stopAnimation(!0);}), Ds(this._stackedOnPoints, _) && Ds(this._points, h) || (m ? this._updateAnimation(a, _, i, n, M, y) : (M && (h = Ns(h, i, M), _ = Ns(_, i, M)), d.setShape({ points: h }), p && p.setShape({ points: h, stackedOnPoints: _ })))) : (x && f.updateData(a, { isIgnore: w, clipShape: Es(i, !1, !0, t) }), M && (h = Ns(h, i, M), _ = Ns(_, i, M)), d = this._newPolyline(h, i, m), v && (p = this._newPolygon(h, _, i, m)), g.setClipPath(Es(i, !0, !1, t)));var S = Rs(a, i) || a.getVisual("color");d.useStyle(o(s.getLineStyle(), { fill: "none", stroke: S, lineJoin: "bevel" }));var I = t.get("smooth");if (I = ks(t.get("smooth")), d.setShape({ smooth: I, smoothMonotone: t.get("smoothMonotone"), connectNulls: t.get("connectNulls") }), p) {var T = a.getCalculationInfo("stackedOnSeries"),C = 0;p.useStyle(o(l.getAreaStyle(), { fill: S, opacity: .7, lineJoin: "bevel" })), T && (C = ks(T.get("smooth"))), p.setShape({ smooth: I, stackedOnSmooth: C, smoothMonotone: t.get("smoothMonotone"), connectNulls: t.get("connectNulls") });}this._data = a, this._coordSys = i, this._stackedOnPoints = _, this._points = h, this._step = M, this._valueOrigin = y;}, dispose: function dispose() {}, highlight: function highlight(t, e, n, i) {var r = t.getData(),a = pn(r, i);if (!(a instanceof Array) && null != a && a >= 0) {var o = r.getItemGraphicEl(a);if (!o) {var s = r.getItemLayout(a);if (!s) return;(o = new fs(r, a)).position = s, o.setZ(t.get("zlevel"), t.get("z")), o.ignore = isNaN(s[0]) || isNaN(s[1]), o.__temp = !0, r.setItemGraphicEl(a, o), o.stopSymbolAnimation(!0), this.group.add(o);}o.highlight();} else Oa.prototype.highlight.call(this, t, e, n, i);}, downplay: function downplay(t, e, n, i) {var r = t.getData(),a = pn(r, i);if (null != a && a >= 0) {var o = r.getItemGraphicEl(a);o && (o.__temp ? (r.setItemGraphicEl(a, null), this.group.remove(o)) : o.downplay());} else Oa.prototype.downplay.call(this, t, e, n, i);}, _newPolyline: function _newPolyline(t) {var e = this._polyline;return e && this._lineGroup.remove(e), e = new Dg({ shape: { points: t }, silent: !0, z2: 10 }), this._lineGroup.add(e), this._polyline = e, e;}, _newPolygon: function _newPolygon(t, e) {var n = this._polygon;return n && this._lineGroup.remove(n), n = new kg({ shape: { points: t, stackedOnPoints: e }, silent: !0 }), this._lineGroup.add(n), this._polygon = n, n;}, _updateAnimation: function _updateAnimation(t, e, n, i, r, a) {var o = this._polyline,s = this._polygon,l = t.hostModel,h = xg(this._data, t, this._stackedOnPoints, e, this._coordSys, n, this._valueOrigin, a),u = h.current,c = h.stackedOnCurrent,f = h.next,d = h.stackedOnNext;r && (u = Ns(h.current, n, r), c = Ns(h.stackedOnCurrent, n, r), f = Ns(h.next, n, r), d = Ns(h.stackedOnNext, n, r)), o.shape.__points = h.current, o.shape.points = u, Xi(o, { shape: { points: f } }, l), s && (s.setShape({ points: u, stackedOnPoints: c }), Xi(s, { shape: { points: f, stackedOnPoints: d } }, l));for (var p = [], g = h.status, m = 0; m < g.length; m++) {if ("=" === g[m].cmd) {var v = t.getItemGraphicEl(g[m].idx1);v && p.push({ el: v, ptIdx: m });}}o.animators && o.animators.length && o.animators[0].during(function () {for (var t = 0; t < p.length; t++) {p[t].el.attr("position", o.shape.__points[p[t].ptIdx]);}});}, remove: function remove(t) {var e = this.group,n = this._data;this._lineGroup.removeAll(), this._symbolDraw.remove(!0), n && n.eachItemGraphicEl(function (t, i) {t.__temp && (e.remove(t), n.setItemGraphicEl(i, null));}), this._polyline = this._polygon = this._coordSys = this._points = this._stackedOnPoints = this._data = null;} });var Ag = { average: function average(t) {for (var e = 0, n = 0, i = 0; i < t.length; i++) {isNaN(t[i]) || (e += t[i], n++);}return 0 === n ? NaN : e / n;}, sum: function sum(t) {for (var e = 0, n = 0; n < t.length; n++) {e += t[n] || 0;}return e;}, max: function max(t) {for (var e = -1 / 0, n = 0; n < t.length; n++) {t[n] > e && (e = t[n]);}return isFinite(e) ? e : NaN;}, min: function min(t) {for (var e = 1 / 0, n = 0; n < t.length; n++) {t[n] < e && (e = t[n]);}return isFinite(e) ? e : NaN;}, nearest: function nearest(t) {return t[0];} },Lg = function Lg(t, e) {return Math.round(t.length / 2);};Fs.prototype.parse = function (t) {return t;}, Fs.prototype.getSetting = function (t) {return this._setting[t];}, Fs.prototype.contain = function (t) {var e = this._extent;return t >= e[0] && t <= e[1];}, Fs.prototype.normalize = function (t) {var e = this._extent;return e[1] === e[0] ? .5 : (t - e[0]) / (e[1] - e[0]);}, Fs.prototype.scale = function (t) {var e = this._extent;return t * (e[1] - e[0]) + e[0];}, Fs.prototype.unionExtent = function (t) {var e = this._extent;t[0] < e[0] && (e[0] = t[0]), t[1] > e[1] && (e[1] = t[1]);}, Fs.prototype.unionExtentFromData = function (t, e) {this.unionExtent(t.getApproximateExtent(e));}, Fs.prototype.getExtent = function () {return this._extent.slice();}, Fs.prototype.setExtent = function (t, e) {var n = this._extent;isNaN(t) || (n[0] = t), isNaN(e) || (n[1] = e);}, Fs.prototype.isBlank = function () {return this._isBlank;}, Fs.prototype.setBlank = function (t) {this._isBlank = t;}, Fs.prototype.getLabel = null, bn(Fs), Tn(Fs, { registerWhenExtend: !0 }), Vs.createByAxisModel = function (t) {var e = t.option,n = e.data,i = n && d(n, Hs);return new Vs({ categories: i, needCollect: !i, deduplication: !1 !== e.dedplication });};var Pg = Vs.prototype;Pg.getOrdinal = function (t) {return Ws(this).get(t);}, Pg.parseAndCollect = function (t) {var e,n = this._needCollect;if ("string" != typeof t && !n) return t;if (n && !this._deduplication) return e = this.categories.length, this.categories[e] = t, e;var i = Ws(this);return null == (e = i.get(t)) && (n ? (e = this.categories.length, this.categories[e] = t, i.set(t, e)) : e = NaN), e;};var Og = Fs.prototype,Eg = Fs.extend({ type: "ordinal", init: function init(t, e) {t && !y(t) || (t = new Vs({ categories: t })), this._ordinalMeta = t, this._extent = e || [0, t.categories.length - 1];}, parse: function parse(t) {return "string" == typeof t ? this._ordinalMeta.getOrdinal(t) : Math.round(t);}, contain: function contain(t) {return t = this.parse(t), Og.contain.call(this, t) && null != this._ordinalMeta.categories[t];}, normalize: function normalize(t) {return Og.normalize.call(this, this.parse(t));}, scale: function scale(t) {return Math.round(Og.scale.call(this, t));}, getTicks: function getTicks() {for (var t = [], e = this._extent, n = e[0]; n <= e[1];) {t.push(n), n++;}return t;}, getLabel: function getLabel(t) {if (!this.isBlank()) return this._ordinalMeta.categories[t];}, count: function count() {return this._extent[1] - this._extent[0] + 1;}, unionExtentFromData: function unionExtentFromData(t, e) {this.unionExtent(t.getApproximateExtent(e));}, getOrdinalMeta: function getOrdinalMeta() {return this._ordinalMeta;}, niceTicks: B, niceExtent: B });Eg.create = function () {return new Eg();};var Ng = nr,Rg = nr,Bg = Fs.extend({ type: "interval", _interval: 0, _intervalPrecision: 2, setExtent: function setExtent(t, e) {var n = this._extent;isNaN(t) || (n[0] = parseFloat(t)), isNaN(e) || (n[1] = parseFloat(e));}, unionExtent: function unionExtent(t) {var e = this._extent;t[0] < e[0] && (e[0] = t[0]), t[1] > e[1] && (e[1] = t[1]), Bg.prototype.setExtent.call(this, e[0], e[1]);}, getInterval: function getInterval() {return this._interval;}, setInterval: function setInterval(t) {this._interval = t, this._niceExtent = this._extent.slice(), this._intervalPrecision = qs(t);}, getTicks: function getTicks() {return Ys(this._interval, this._extent, this._niceExtent, this._intervalPrecision);}, getLabel: function getLabel(t, e) {if (null == t) return "";var n = e && e.precision;return null == n ? n = ir(t) || 0 : "auto" === n && (n = this._intervalPrecision), t = Rg(t, n, !0), fr(t);}, niceTicks: function niceTicks(t, e, n) {t = t || 5;var i = this._extent,r = i[1] - i[0];if (isFinite(r)) {r < 0 && (r = -r, i.reverse());var a = Gs(i, t, e, n);this._intervalPrecision = a.intervalPrecision, this._interval = a.interval, this._niceExtent = a.niceTickExtent;}}, niceExtent: function niceExtent(t) {var e = this._extent;if (e[0] === e[1]) if (0 !== e[0]) {var n = e[0];t.fixMax ? e[0] -= n / 2 : (e[1] += n / 2, e[0] -= n / 2);} else e[1] = 1;var i = e[1] - e[0];isFinite(i) || (e[0] = 0, e[1] = 1), this.niceTicks(t.splitNumber, t.minInterval, t.maxInterval);var r = this._interval;t.fixMin || (e[0] = Rg(Math.floor(e[0] / r) * r)), t.fixMax || (e[1] = Rg(Math.ceil(e[1] / r) * r));} });Bg.create = function () {return new Bg();};var zg = "__ec_stack_",Fg = "undefined" != typeof Float32Array ? Float32Array : Array,Vg = { seriesType: "bar", plan: Kd(), reset: function reset(t) {if (tl(t) && el(t)) {var e = t.getData(),n = t.coordinateSystem,i = n.getBaseAxis(),r = n.getOtherAxis(i),a = e.mapDimension(r.dim),o = e.mapDimension(i.dim),s = r.isHorizontal(),l = s ? 0 : 1,h = Js(Ks([t]), i, t).width;return h > .5 || (h = .5), { progress: function progress(t, e) {for (var u, c = new Fg(2 * t.count), f = [], d = [], p = 0; null != (u = t.next());) {d[l] = e.get(a, u), d[1 - l] = e.get(o, u), f = n.dataToPoint(d, null, f), c[p++] = f[0], c[p++] = f[1];}e.setLayout({ largePoints: c, barWidth: h, valueAxisStart: nl(i, r, !1), valueAxisHorizontal: s });} };}} },Wg = Bg.prototype,Hg = Math.ceil,Gg = Math.floor,qg = function qg(t, e, n, i) {for (; n < i;) {var r = n + i >>> 1;t[r][1] < e ? n = r + 1 : i = r;}return n;},Xg = Bg.extend({ type: "time", getLabel: function getLabel(t) {var e = this._stepLvl,n = new Date(t);return vr(e[0], n, this.getSetting("useUTC"));}, niceExtent: function niceExtent(t) {var e = this._extent;if (e[0] === e[1] && (e[0] -= 864e5, e[1] += 864e5), e[1] === -1 / 0 && e[0] === 1 / 0) {var n = new Date();e[1] = +new Date(n.getFullYear(), n.getMonth(), n.getDate()), e[0] = e[1] - 864e5;}this.niceTicks(t.splitNumber, t.minInterval, t.maxInterval);var i = this._interval;t.fixMin || (e[0] = nr(Gg(e[0] / i) * i)), t.fixMax || (e[1] = nr(Hg(e[1] / i) * i));}, niceTicks: function niceTicks(t, e, n) {t = t || 10;var i = this._extent,r = i[1] - i[0],a = r / t;null != e && a < e && (a = e), null != n && a > n && (a = n);var o = Ug.length,s = qg(Ug, a, 0, o),l = Ug[Math.min(s, o - 1)],h = l[1];"year" === l[0] && (h *= cr(r / h / t, !0));var u = this.getSetting("useUTC") ? 0 : 60 * new Date(+i[0] || +i[1]).getTimezoneOffset() * 1e3,c = [Math.round(Hg((i[0] - u) / h) * h + u), Math.round(Gg((i[1] - u) / h) * h + u)];Us(c, i), this._stepLvl = l, this._interval = h, this._niceExtent = c;}, parse: function parse(t) {return +lr(t);} });f(["contain", "normalize"], function (t) {Xg.prototype[t] = function (e) {return Wg[t].call(this, this.parse(e));};});var Ug = [["hh:mm:ss", 1e3], ["hh:mm:ss", 5e3], ["hh:mm:ss", 1e4], ["hh:mm:ss", 15e3], ["hh:mm:ss", 3e4], ["hh:mm\nMM-dd", 6e4], ["hh:mm\nMM-dd", 3e5], ["hh:mm\nMM-dd", 6e5], ["hh:mm\nMM-dd", 9e5], ["hh:mm\nMM-dd", 18e5], ["hh:mm\nMM-dd", 36e5], ["hh:mm\nMM-dd", 72e5], ["hh:mm\nMM-dd", 216e5], ["hh:mm\nMM-dd", 432e5], ["MM-dd\nyyyy", 864e5], ["MM-dd\nyyyy", 1728e5], ["MM-dd\nyyyy", 2592e5], ["MM-dd\nyyyy", 3456e5], ["MM-dd\nyyyy", 432e6], ["MM-dd\nyyyy", 5184e5], ["week", 6048e5], ["MM-dd\nyyyy", 864e6], ["week", 12096e5], ["week", 18144e5], ["month", 26784e5], ["week", 36288e5], ["month", 53568e5], ["week", 36288e5], ["quarter", 8208e6], ["month", 107136e5], ["month", 13392e6], ["half-year", 16416e6], ["month", 214272e5], ["month", 26784e6], ["year", 32832e6]];Xg.create = function (t) {return new Xg({ useUTC: t.ecModel.get("useUTC") });};var Yg = Fs.prototype,jg = Bg.prototype,Zg = ir,$g = nr,Kg = Math.floor,Qg = Math.ceil,Jg = Math.pow,tm = Math.log,em = Fs.extend({ type: "log", base: 10, $constructor: function $constructor() {Fs.apply(this, arguments), this._originalScale = new Bg();}, getTicks: function getTicks() {var t = this._originalScale,e = this._extent,n = t.getExtent();return d(jg.getTicks.call(this), function (i) {var r = nr(Jg(this.base, i));return r = i === e[0] && t.__fixMin ? il(r, n[0]) : r, r = i === e[1] && t.__fixMax ? il(r, n[1]) : r;}, this);}, getLabel: jg.getLabel, scale: function scale(t) {return t = Yg.scale.call(this, t), Jg(this.base, t);}, setExtent: function setExtent(t, e) {var n = this.base;t = tm(t) / tm(n), e = tm(e) / tm(n), jg.setExtent.call(this, t, e);}, getExtent: function getExtent() {var t = this.base,e = Yg.getExtent.call(this);e[0] = Jg(t, e[0]), e[1] = Jg(t, e[1]);var n = this._originalScale,i = n.getExtent();return n.__fixMin && (e[0] = il(e[0], i[0])), n.__fixMax && (e[1] = il(e[1], i[1])), e;}, unionExtent: function unionExtent(t) {this._originalScale.unionExtent(t);var e = this.base;t[0] = tm(t[0]) / tm(e), t[1] = tm(t[1]) / tm(e), Yg.unionExtent.call(this, t);}, unionExtentFromData: function unionExtentFromData(t, e) {this.unionExtent(t.getApproximateExtent(e));}, niceTicks: function niceTicks(t) {t = t || 10;var e = this._extent,n = e[1] - e[0];if (!(n === 1 / 0 || n <= 0)) {var i = hr(n);for (t / n * i <= .5 && (i *= 10); !isNaN(i) && Math.abs(i) < 1 && Math.abs(i) > 0;) {i *= 10;}var r = [nr(Qg(e[0] / i) * i), nr(Kg(e[1] / i) * i)];this._interval = i, this._niceExtent = r;}}, niceExtent: function niceExtent(t) {jg.niceExtent.call(this, t);var e = this._originalScale;e.__fixMin = t.fixMin, e.__fixMax = t.fixMax;} });f(["contain", "normalize"], function (t) {em.prototype[t] = function (e) {return e = tm(e) / tm(this.base), Yg[t].call(this, e);};}), em.create = function () {return new em();};var nm = function nm(t) {this._axes = {}, this._dimList = [], this.name = t || "";};nm.prototype = { constructor: nm, type: "cartesian", getAxis: function getAxis(t) {return this._axes[t];}, getAxes: function getAxes() {return d(this._dimList, dl, this);}, getAxesByScale: function getAxesByScale(t) {return t = t.toLowerCase(), g(this.getAxes(), function (e) {return e.scale.type === t;});}, addAxis: function addAxis(t) {var e = t.dim;this._axes[e] = t, this._dimList.push(e);}, dataToCoord: function dataToCoord(t) {return this._dataCoordConvert(t, "dataToCoord");}, coordToData: function coordToData(t) {return this._dataCoordConvert(t, "coordToData");}, _dataCoordConvert: function _dataCoordConvert(t, e) {for (var n = this._dimList, i = t instanceof Array ? [] : {}, r = 0; r < n.length; r++) {var a = n[r],o = this._axes[a];i[a] = o[e](t[a]);}return i;} }, pl.prototype = { constructor: pl, type: "cartesian2d", dimensions: ["x", "y"], getBaseAxis: function getBaseAxis() {return this.getAxesByScale("ordinal")[0] || this.getAxesByScale("time")[0] || this.getAxis("x");}, containPoint: function containPoint(t) {var e = this.getAxis("x"),n = this.getAxis("y");return e.contain(e.toLocalCoord(t[0])) && n.contain(n.toLocalCoord(t[1]));}, containData: function containData(t) {return this.getAxis("x").containData(t[0]) && this.getAxis("y").containData(t[1]);}, dataToPoint: function dataToPoint(t, e, n) {var i = this.getAxis("x"),r = this.getAxis("y");return n = n || [], n[0] = i.toGlobalCoord(i.dataToCoord(t[0])), n[1] = r.toGlobalCoord(r.dataToCoord(t[1])), n;}, clampData: function clampData(t, e) {var n = this.getAxis("x").scale,i = this.getAxis("y").scale,r = n.getExtent(),a = i.getExtent(),o = n.parse(t[0]),s = i.parse(t[1]);return e = e || [], e[0] = Math.min(Math.max(Math.min(r[0], r[1]), o), Math.max(r[0], r[1])), e[1] = Math.min(Math.max(Math.min(a[0], a[1]), s), Math.max(a[0], a[1])), e;}, pointToData: function pointToData(t, e) {var n = this.getAxis("x"),i = this.getAxis("y");return e = e || [], e[0] = n.coordToData(n.toLocalCoord(t[0])), e[1] = i.coordToData(i.toLocalCoord(t[1])), e;}, getOtherAxis: function getOtherAxis(t) {return this.getAxis("x" === t.dim ? "y" : "x");} }, h(pl, nm);var im = gn(),rm = [0, 1],am = function am(t, e, n) {this.dim = t, this.scale = e, this._extent = n || [0, 0], this.inverse = !1, this.onBand = !1;};am.prototype = { constructor: am, contain: function contain(t) {var e = this._extent,n = Math.min(e[0], e[1]),i = Math.max(e[0], e[1]);return t >= n && t <= i;}, containData: function containData(t) {return this.contain(this.dataToCoord(t));}, getExtent: function getExtent() {return this._extent.slice();}, getPixelPrecision: function getPixelPrecision(t) {return rr(t || this.scale.getExtent(), this._extent);}, setExtent: function setExtent(t, e) {var n = this._extent;n[0] = t, n[1] = e;}, dataToCoord: function dataToCoord(t, e) {var n = this._extent,i = this.scale;return t = i.normalize(t), this.onBand && "ordinal" === i.type && Al(n = n.slice(), i.count()), tr(t, rm, n, e);}, coordToData: function coordToData(t, e) {var n = this._extent,i = this.scale;this.onBand && "ordinal" === i.type && Al(n = n.slice(), i.count());var r = tr(t, n, rm, e);return this.scale.scale(r);}, pointToData: function pointToData(t, e) {}, getTicksCoords: function getTicksCoords(t) {var e = (t = t || {}).tickModel || this.getTickModel(),n = ml(this, e),i = d(n.ticks, function (t) {return { coord: this.dataToCoord(t), tickValue: t };}, this),r = e.get("alignWithLabel");return Ll(this, i, n.tickCategoryInterval, r, t.clamp), i;}, getViewLabels: function getViewLabels() {return gl(this).labels;}, getLabelModel: function getLabelModel() {return this.model.getModel("axisLabel");}, getTickModel: function getTickModel() {return this.model.getModel("axisTick");}, getBandWidth: function getBandWidth() {var t = this._extent,e = this.scale.getExtent(),n = e[1] - e[0] + (this.onBand ? 1 : 0);0 === n && (n = 1);var i = Math.abs(t[1] - t[0]);return Math.abs(i) / n;}, isHorizontal: null, getRotate: null, calculateCategoryInterval: function calculateCategoryInterval() {return Il(this);} };var om = function om(t, e, n, i, r) {am.call(this, t, e, n), this.type = i || "value", this.position = r || "bottom";};om.prototype = { constructor: om, index: 0, getAxesOnZeroOf: null, model: null, isHorizontal: function isHorizontal() {var t = this.position;return "top" === t || "bottom" === t;}, getGlobalExtent: function getGlobalExtent(t) {var e = this.getExtent();return e[0] = this.toGlobalCoord(e[0]), e[1] = this.toGlobalCoord(e[1]), t && e[0] > e[1] && e.reverse(), e;}, getOtherAxis: function getOtherAxis() {this.grid.getOtherAxis();}, pointToData: function pointToData(t, e) {return this.coordToData(this.toLocalCoord(t["x" === this.dim ? 0 : 1]), e);}, toLocalCoord: null, toGlobalCoord: null }, h(om, am);var sm = { show: !0, zlevel: 0, z: 0, inverse: !1, name: "", nameLocation: "end", nameRotate: null, nameTruncate: { maxWidth: null, ellipsis: "...", placeholder: "." }, nameTextStyle: {}, nameGap: 15, silent: !1, triggerEvent: !1, tooltip: { show: !1 }, axisPointer: {}, axisLine: { show: !0, onZero: !0, onZeroAxisIndex: null, lineStyle: { color: "#333", width: 1, type: "solid" }, symbol: ["none", "none"], symbolSize: [10, 15] }, axisTick: { show: !0, inside: !1, length: 5, lineStyle: { width: 1 } }, axisLabel: { show: !0, inside: !1, rotate: 0, showMinLabel: null, showMaxLabel: null, margin: 8, fontSize: 12 }, splitLine: { show: !0, lineStyle: { color: ["#ccc"], width: 1, type: "solid" } }, splitArea: { show: !1, areaStyle: { color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"] } } },lm = {};lm.categoryAxis = i({ boundaryGap: !0, deduplication: null, splitLine: { show: !1 }, axisTick: { alignWithLabel: !1, interval: "auto" }, axisLabel: { interval: "auto" } }, sm), lm.valueAxis = i({ boundaryGap: [0, 0], splitNumber: 5 }, sm), lm.timeAxis = o({ scale: !0, min: "dataMin", max: "dataMax" }, lm.valueAxis), lm.logAxis = o({ scale: !0, logBase: 10 }, lm.valueAxis);var hm = ["value", "category", "time", "log"],um = function um(t, e, n, a) {f(hm, function (o) {e.extend({ type: t + "Axis." + o, mergeDefaultAndTheme: function mergeDefaultAndTheme(e, r) {var a = this.layoutMode,s = a ? wr(e) : {};i(e, r.getTheme().get(o + "Axis")), i(e, this.getDefaultOption()), e.type = n(t, e), a && xr(e, s, a);}, optionUpdated: function optionUpdated() {"category" === this.option.type && (this.__ordinalMeta = Vs.createByAxisModel(this));}, getCategories: function getCategories(t) {var e = this.option;if ("category" === e.type) return t ? e.data : this.__ordinalMeta.categories;}, getOrdinalMeta: function getOrdinalMeta() {return this.__ordinalMeta;}, defaultOption: r([{}, lm[o + "Axis"], a], !0) });}), ld.registerSubTypeDefaulter(t + "Axis", v(n, t));},cm = { getMin: function getMin(t) {var e = this.option,n = t || null == e.rangeStart ? e.min : e.rangeStart;return this.axis && null != n && "dataMin" !== n && "function" != typeof n && !I(n) && (n = this.axis.scale.parse(n)), n;}, getMax: function getMax(t) {var e = this.option,n = t || null == e.rangeEnd ? e.max : e.rangeEnd;return this.axis && null != n && "dataMax" !== n && "function" != typeof n && !I(n) && (n = this.axis.scale.parse(n)), n;}, getNeedCrossZero: function getNeedCrossZero() {var t = this.option;return null == t.rangeStart && null == t.rangeEnd && !t.scale;}, getCoordSysModel: B, setRange: function setRange(t, e) {this.option.rangeStart = t, this.option.rangeEnd = e;}, resetRange: function resetRange() {this.option.rangeStart = this.option.rangeEnd = null;} },fm = ld.extend({ type: "cartesian2dAxis", axis: null, init: function init() {fm.superApply(this, "init", arguments), this.resetRange();}, mergeOption: function mergeOption() {fm.superApply(this, "mergeOption", arguments), this.resetRange();}, restoreData: function restoreData() {fm.superApply(this, "restoreData", arguments), this.resetRange();}, getCoordSysModel: function getCoordSysModel() {return this.ecModel.queryComponents({ mainType: "grid", index: this.option.gridIndex, id: this.option.gridId })[0];} });i(fm.prototype, cm);var dm = { offset: 0 };um("x", fm, Pl, dm), um("y", fm, Pl, dm), ld.extend({ type: "grid", dependencies: ["xAxis", "yAxis"], layoutMode: "box", coordinateSystem: null, defaultOption: { show: !1, zlevel: 0, z: 0, left: "10%", top: 60, right: "10%", bottom: 60, containLabel: !1, backgroundColor: "rgba(0,0,0,0)", borderWidth: 1, borderColor: "#ccc" } });var pm = El.prototype;pm.type = "grid", pm.axisPointerEnabled = !0, pm.getRect = function () {return this._rect;}, pm.update = function (t, e) {var n = this._axesMap;this._updateScale(t, this.model), f(n.x, function (t) {ol(t.scale, t.model);}), f(n.y, function (t) {ol(t.scale, t.model);}), f(n.x, function (t) {Nl(n, "y", t);}), f(n.y, function (t) {Nl(n, "x", t);}), this.resize(this.model, e);}, pm.resize = function (t, e, n) {function i() {f(a, function (t) {var e = t.isHorizontal(),n = e ? [0, r.width] : [0, r.height],i = t.inverse ? 1 : 0;t.setExtent(n[i], n[1 - i]), Bl(t, e ? r.x : r.y);});}var r = _r(t.getBoxLayoutParams(), { width: e.getWidth(), height: e.getHeight() });this._rect = r;var a = this._axesList;i(), !n && t.get("containLabel") && (f(a, function (t) {if (!t.model.get("axisLabel.inside")) {var e = cl(t);if (e) {var n = t.isHorizontal() ? "height" : "width",i = t.model.get("axisLabel.margin");r[n] -= e[n] + i, "top" === t.position ? r.y += e.height + i : "left" === t.position && (r.x += e.width + i);}}}), i());}, pm.getAxis = function (t, e) {var n = this._axesMap[t];if (null != n) {if (null == e) for (var i in n) {if (n.hasOwnProperty(i)) return n[i];}return n[e];}}, pm.getAxes = function () {return this._axesList.slice();}, pm.getCartesian = function (t, e) {if (null != t && null != e) {var n = "x" + t + "y" + e;return this._coordsMap[n];}w(t) && (e = t.yAxisIndex, t = t.xAxisIndex);for (var i = 0, r = this._coordsList; i < r.length; i++) {if (r[i].getAxis("x").index === t || r[i].getAxis("y").index === e) return r[i];}}, pm.getCartesians = function () {return this._coordsList.slice();}, pm.convertToPixel = function (t, e, n) {var i = this._findConvertTarget(t, e);return i.cartesian ? i.cartesian.dataToPoint(n) : i.axis ? i.axis.toGlobalCoord(i.axis.dataToCoord(n)) : null;}, pm.convertFromPixel = function (t, e, n) {var i = this._findConvertTarget(t, e);return i.cartesian ? i.cartesian.pointToData(n) : i.axis ? i.axis.coordToData(i.axis.toLocalCoord(n)) : null;}, pm._findConvertTarget = function (t, e) {var n,i,r = e.seriesModel,a = e.xAxisModel || r && r.getReferringComponents("xAxis")[0],o = e.yAxisModel || r && r.getReferringComponents("yAxis")[0],s = e.gridModel,h = this._coordsList;return r ? l(h, n = r.coordinateSystem) < 0 && (n = null) : a && o ? n = this.getCartesian(a.componentIndex, o.componentIndex) : a ? i = this.getAxis("x", a.componentIndex) : o ? i = this.getAxis("y", o.componentIndex) : s && s.coordinateSystem === this && (n = this._coordsList[0]), { cartesian: n, axis: i };}, pm.containPoint = function (t) {var e = this._coordsList[0];if (e) return e.containPoint(t);}, pm._initCartesian = function (t, e, n) {function i(n) {return function (i, s) {if (Ol(i, t, e)) {var l = i.get("position");"x" === n ? "top" !== l && "bottom" !== l && r[l = "bottom"] && (l = "top" === l ? "bottom" : "top") : "left" !== l && "right" !== l && r[l = "left"] && (l = "left" === l ? "right" : "left"), r[l] = !0;var h = new om(n, sl(i), [0, 0], i.get("type"), l),u = "category" === h.type;h.onBand = u && i.get("boundaryGap"), h.inverse = i.get("inverse"), i.axis = h, h.model = i, h.grid = this, h.index = s, this._axesList.push(h), a[n][s] = h, o[n]++;}};}var r = { left: !1, right: !1, top: !1, bottom: !1 },a = { x: {}, y: {} },o = { x: 0, y: 0 };if (e.eachComponent("xAxis", i("x"), this), e.eachComponent("yAxis", i("y"), this), !o.x || !o.y) return this._axesMap = {}, void (this._axesList = []);this._axesMap = a, f(a.x, function (e, n) {f(a.y, function (i, r) {var a = "x" + n + "y" + r,o = new pl(a);o.grid = this, o.model = t, this._coordsMap[a] = o, this._coordsList.push(o), o.addAxis(e), o.addAxis(i);}, this);}, this);}, pm._updateScale = function (t, e) {function n(t, e, n) {f(t.mapDimension(e.dim, !0), function (n) {e.scale.unionExtentFromData(t, as(t, n));});}f(this._axesList, function (t) {t.scale.setExtent(1 / 0, -1 / 0);}), t.eachSeries(function (i) {if (Fl(i)) {var r = zl(i),a = r[0],o = r[1];if (!Ol(a, e, t) || !Ol(o, e, t)) return;var s = this.getCartesian(a.componentIndex, o.componentIndex),l = i.getData(),h = s.getAxis("x"),u = s.getAxis("y");"list" === l.type && (n(l, h), n(l, u));}}, this);}, pm.getTooltipAxes = function (t) {var e = [],n = [];return f(this.getCartesians(), function (i) {var r = null != t && "auto" !== t ? i.getAxis(t) : i.getBaseAxis(),a = i.getOtherAxis(r);l(e, r) < 0 && e.push(r), l(n, a) < 0 && n.push(a);}), { baseAxes: e, otherAxes: n };};var gm = ["xAxis", "yAxis"];El.create = function (t, e) {var n = [];return t.eachComponent("grid", function (i, r) {var a = new El(i, t, e);a.name = "grid_" + r, a.resize(i, e, !0), i.coordinateSystem = a, n.push(a);}), t.eachSeries(function (t) {if (Fl(t)) {var e = zl(t),n = e[0],i = e[1],r = n.getCoordSysModel().coordinateSystem;t.coordinateSystem = r.getCartesian(n.componentIndex, i.componentIndex);}}), n;}, El.dimensions = El.prototype.dimensions = pl.prototype.dimensions, Yr.register("cartesian2d", El);var mm = Math.PI,vm = function vm(t, e) {this.opt = e, this.axisModel = t, o(e, { labelOffset: 0, nameDirection: 1, tickDirection: 1, labelDirection: 1, silent: !0 }), this.group = new du();var n = new du({ position: e.position.slice(), rotation: e.rotation });n.updateTransform(), this._transform = n.transform, this._dumbGroup = n;};vm.prototype = { constructor: vm, hasBuilder: function hasBuilder(t) {return !!ym[t];}, add: function add(t) {ym[t].call(this);}, getGroup: function getGroup() {return this.group;} };var ym = { axisLine: function axisLine() {var t = this.opt,e = this.axisModel;if (e.get("axisLine.show")) {var n = this.axisModel.axis.getExtent(),i = this._transform,r = [n[0], 0],o = [n[1], 0];i && (Y(r, r, i), Y(o, o, i));var s = a({ lineCap: "round" }, e.getModel("axisLine.lineStyle").getLineStyle());this.group.add(new Df(xi({ anid: "line", shape: { x1: r[0], y1: r[1], x2: o[0], y2: o[1] }, style: s, strokeContainThreshold: t.strokeContainThreshold || 5, silent: !0, z2: 1 })));var l = e.get("axisLine.symbol"),h = e.get("axisLine.symbolSize"),u = e.get("axisLine.symbolOffset") || 0;if ("number" == typeof u && (u = [u, u]), null != l) {"string" == typeof l && (l = [l, l]), "string" != typeof h && "number" != typeof h || (h = [h, h]);var c = h[0],d = h[1];f([{ rotate: t.rotation + Math.PI / 2, offset: u[0], r: 0 }, { rotate: t.rotation - Math.PI / 2, offset: u[1], r: Math.sqrt((r[0] - o[0]) * (r[0] - o[0]) + (r[1] - o[1]) * (r[1] - o[1])) }], function (e, n) {if ("none" !== l[n] && null != l[n]) {var i = us(l[n], -c / 2, -d / 2, c, d, s.stroke, !0),a = e.r + e.offset,o = [r[0] + a * Math.cos(t.rotation), r[1] - a * Math.sin(t.rotation)];i.attr({ rotation: e.rotate, position: o, silent: !0 }), this.group.add(i);}}, this);}}}, axisTickLabel: function axisTickLabel() {var t = this.axisModel,e = this.opt,n = Yl(this, t, e);Gl(t, jl(this, t, e), n);}, axisName: function axisName() {var t = this.opt,e = this.axisModel,n = T(t.axisName, e.get("name"));if (n) {var i,r = e.get("nameLocation"),o = t.nameDirection,s = e.getModel("nameTextStyle"),l = e.get("nameGap") || 0,h = this.axisModel.axis.getExtent(),u = h[0] > h[1] ? -1 : 1,c = ["start" === r ? h[0] - u * l : "end" === r ? h[1] + u * l : (h[0] + h[1]) / 2, Ul(r) ? t.labelOffset + o * l : 0],f = e.get("nameRotate");null != f && (f = f * mm / 180);var d;Ul(r) ? i = _m(t.rotation, null != f ? f : t.rotation, o) : (i = Wl(t, r, f || 0, h), null != (d = t.axisNameAvailableWidth) && (d = Math.abs(d / Math.sin(i.rotation)), !isFinite(d) && (d = null)));var p = s.getFont(),g = e.get("nameTruncate", !0) || {},m = g.ellipsis,v = T(t.nameTruncateMaxWidth, g.maxWidth, d),y = null != m && null != v ? nd(n, v, p, m, { minChar: 2, placeholder: g.placeholder }) : n,_ = e.get("tooltip", !0),x = e.mainType,w = { componentType: x, name: n, $vars: ["name"] };w[x + "Index"] = e.componentIndex;var b = new vf({ anid: "name", __fullText: n, __truncatedText: y, position: c, rotation: i.rotation, silent: Hl(e), z2: 1, tooltip: _ && _.show ? a({ content: n, formatter: function formatter() {return n;}, formatterParams: w }, _) : null });Ri(b.style, s, { text: y, textFont: p, textFill: s.getTextColor() || e.get("axisLine.lineStyle.color"), textAlign: i.textAlign, textVerticalAlign: i.textVerticalAlign }), e.get("triggerEvent") && (b.eventData = Vl(e), b.eventData.targetType = "axisName", b.eventData.name = n), this._dumbGroup.add(b), b.updateTransform(), this.group.add(b), b.decomposeTransform();}} },_m = vm.innerTextLayout = function (t, e, n) {var i,r,a = or(e - t);return sr(a) ? (r = n > 0 ? "top" : "bottom", i = "center") : sr(a - mm) ? (r = n > 0 ? "bottom" : "top", i = "center") : (r = "middle", i = a > 0 && a < mm ? n > 0 ? "right" : "left" : n > 0 ? "left" : "right"), { rotation: a, textAlign: i, textVerticalAlign: r };},xm = Oo({ type: "axis", _axisPointer: null, axisPointerClass: null, render: function render(t, e, n, i) {this.axisPointerClass && Zl(t), xm.superApply(this, "render", arguments), th(this, t, 0, n, 0, !0);}, updateAxisPointer: function updateAxisPointer(t, e, n, i, r) {th(this, t, 0, n, 0, !1);}, remove: function remove(t, e) {var n = this._axisPointer;n && n.remove(e), xm.superApply(this, "remove", arguments);}, dispose: function dispose(t, e) {eh(this, e), xm.superApply(this, "dispose", arguments);} }),wm = [];xm.registerAxisPointerClass = function (t, e) {wm[t] = e;}, xm.getAxisPointerClass = function (t) {return t && wm[t];};var bm = ["axisLine", "axisTickLabel", "axisName"],Mm = ["splitArea", "splitLine"],Sm = xm.extend({ type: "cartesianAxis", axisPointerClass: "CartesianAxisPointer", render: function render(t, e, n, i) {this.group.removeAll();var r = this._axisGroup;if (this._axisGroup = new du(), this.group.add(this._axisGroup), t.get("show")) {var a = t.getCoordSysModel(),o = nh(a, t),s = new vm(t, o);f(bm, s.add, s), this._axisGroup.add(s.getGroup()), f(Mm, function (e) {t.get(e + ".show") && this["_" + e](t, a);}, this), ji(r, this._axisGroup, t), Sm.superCall(this, "render", t, e, n, i);}}, remove: function remove() {this._splitAreaColors = null;}, _splitLine: function _splitLine(t, e) {var n = t.axis;if (!n.scale.isBlank()) {var i = t.getModel("splitLine"),r = i.getModel("lineStyle"),a = r.get("color");a = y(a) ? a : [a];for (var s = e.coordinateSystem.getRect(), l = n.isHorizontal(), h = 0, u = n.getTicksCoords({ tickModel: i }), c = [], f = [], d = r.getLineStyle(), p = 0; p < u.length; p++) {var g = n.toGlobalCoord(u[p].coord);l ? (c[0] = g, c[1] = s.y, f[0] = g, f[1] = s.y + s.height) : (c[0] = s.x, c[1] = g, f[0] = s.x + s.width, f[1] = g);var m = h++ % a.length,v = u[p].tickValue;this._axisGroup.add(new Df(xi({ anid: null != v ? "line_" + u[p].tickValue : null, shape: { x1: c[0], y1: c[1], x2: f[0], y2: f[1] }, style: o({ stroke: a[m] }, d), silent: !0 })));}}}, _splitArea: function _splitArea(t, e) {var n = t.axis;if (!n.scale.isBlank()) {var i = t.getModel("splitArea"),r = i.getModel("areaStyle"),a = r.get("color"),s = e.coordinateSystem.getRect(),l = n.getTicksCoords({ tickModel: i, clamp: !0 });if (l.length) {var h = a.length,u = this._splitAreaColors,c = R(),f = 0;if (u) for (m = 0; m < l.length; m++) {var d = u.get(l[m].tickValue);if (null != d) {f = (d + (h - 1) * m) % h;break;}}var p = n.toGlobalCoord(l[0].coord),g = r.getAreaStyle();a = y(a) ? a : [a];for (var m = 1; m < l.length; m++) {var v,_,x,w,b = n.toGlobalCoord(l[m].coord);n.isHorizontal() ? (v = p, _ = s.y, x = b - v, w = s.height, p = v + x) : (v = s.x, _ = p, x = s.width, p = _ + (w = b - _));var M = l[m - 1].tickValue;null != M && c.set(M, f), this._axisGroup.add(new Cf({ anid: null != M ? "area_" + M : null, shape: { x: v, y: _, width: x, height: w }, style: o({ fill: a[f] }, g), silent: !0 })), f = (f + 1) % h;}this._splitAreaColors = c;}}} });Sm.extend({ type: "xAxis" }), Sm.extend({ type: "yAxis" }), Oo({ type: "grid", render: function render(t, e) {this.group.removeAll(), t.get("show") && this.group.add(new Cf({ shape: t.coordinateSystem.getRect(), style: o({ fill: t.get("backgroundColor") }, t.getItemStyle()), silent: !0, z2: -1 }));} }), To(function (t) {t.xAxis && t.yAxis && !t.grid && (t.grid = {});}), Ao(function (t, e, n) {return { seriesType: t, performRawSeries: !0, reset: function reset(t, i, r) {var a = t.getData(),o = t.get("symbol") || e,s = t.get("symbolSize"),l = t.get("symbolKeepAspect");if (a.setVisual({ legendSymbol: n || o, symbol: o, symbolSize: s, symbolKeepAspect: l }), !i.isSeriesFiltered(t)) {var h = "function" == typeof s;return { dataEach: a.hasItemOption || h ? function (e, n) {if ("function" == typeof s) {var i = t.getRawValue(n),r = t.getDataParams(n);e.setItemVisual(n, "symbolSize", s(i, r));}if (e.hasItemOption) {var a = e.getItemModel(n),o = a.getShallow("symbol", !0),l = a.getShallow("symbolSize", !0),h = a.getShallow("symbolKeepAspect", !0);null != o && e.setItemVisual(n, "symbol", o), null != l && e.setItemVisual(n, "symbolSize", l), null != h && e.setItemVisual(n, "symbolKeepAspect", h);}} : null };}} };}("line", "circle", "line")), ko(function (t) {return { seriesType: t, plan: Kd(), reset: function reset(t) {var e = t.getData(),n = t.coordinateSystem,i = t.pipelineContext.large;if (n) {var r = d(n.dimensions, function (t) {return e.mapDimension(t);}).slice(0, 2),a = r.length,o = e.getCalculationInfo("stackResultDimension");return rs(e, r[0]) && (r[0] = o), rs(e, r[1]) && (r[1] = o), a && { progress: function progress(t, e) {for (var o = t.end - t.start, s = i && new Float32Array(o * a), l = t.start, h = 0, u = [], c = []; l < t.end; l++) {var f;if (1 === a) d = e.get(r[0], l), f = !isNaN(d) && n.dataToPoint(d, null, c);else {var d = u[0] = e.get(r[0], l),p = u[1] = e.get(r[1], l);f = !isNaN(d) && !isNaN(p) && n.dataToPoint(u, null, c);}i ? (s[h++] = f ? f[0] : NaN, s[h++] = f ? f[1] : NaN) : e.setItemLayout(l, f && f.slice() || [NaN, NaN]);}i && e.setLayout("symbolPoints", s);} };}} };}("line")), Co(Ip.PROCESSOR.STATISTIC, function (t) {return { seriesType: t, modifyOutputEnd: !0, reset: function reset(t, e, n) {var i = t.getData(),r = t.get("sampling"),a = t.coordinateSystem;if ("cartesian2d" === a.type && r) {var o = a.getBaseAxis(),s = a.getOtherAxis(o),l = o.getExtent(),h = l[1] - l[0],u = Math.round(i.count() / h);if (u > 1) {var c;"string" == typeof r ? c = Ag[r] : "function" == typeof r && (c = r), c && t.setData(i.downSample(i.mapDimension(s.dim), 1 / u, c, Lg));}}} };}("line")), jd.extend({ type: "series.__base_bar__", getInitialData: function getInitialData(t, e) {return os(this.getSource(), this);}, getMarkerPosition: function getMarkerPosition(t) {var e = this.coordinateSystem;if (e) {var n = e.dataToPoint(e.clampData(t)),i = this.getData(),r = i.getLayout("offset"),a = i.getLayout("size");return n[e.getBaseAxis().isHorizontal() ? 0 : 1] += r + a / 2, n;}return [NaN, NaN];}, defaultOption: { zlevel: 0, z: 2, coordinateSystem: "cartesian2d", legendHoverLink: !0, barMinHeight: 0, barMinAngle: 0, large: !1, largeThreshold: 400, progressive: 3e3, progressiveChunkMode: "mod", itemStyle: {}, emphasis: {} } }).extend({ type: "series.bar", dependencies: ["grid", "polar"], brushSelector: "rect", getProgressive: function getProgressive() {return !!this.get("large") && this.get("progressive");}, getProgressiveThreshold: function getProgressiveThreshold() {var t = this.get("progressiveThreshold"),e = this.get("largeThreshold");return e > t && (t = e), t;} });var Im = uc([["fill", "color"], ["stroke", "borderColor"], ["lineWidth", "borderWidth"], ["stroke", "barBorderColor"], ["lineWidth", "barBorderWidth"], ["opacity"], ["shadowBlur"], ["shadowOffsetX"], ["shadowOffsetY"], ["shadowColor"]]),Tm = { getBarItemStyle: function getBarItemStyle(t) {var e = Im(this, t);if (this.getBorderLineDash) {var n = this.getBorderLineDash();n && (e.lineDash = n);}return e;} },Cm = ["itemStyle", "barBorderWidth"];a(Zi.prototype, Tm), No({ type: "bar", render: function render(t, e, n) {this._updateDrawMode(t);var i = t.get("coordinateSystem");return "cartesian2d" !== i && "polar" !== i || (this._isLargeDraw ? this._renderLarge(t, e, n) : this._renderNormal(t, e, n)), this.group;}, incrementalPrepareRender: function incrementalPrepareRender(t, e, n) {this._clear(), this._updateDrawMode(t);}, incrementalRender: function incrementalRender(t, e, n, i) {this._incrementalRenderLarge(t, e);}, _updateDrawMode: function _updateDrawMode(t) {var e = t.pipelineContext.large;(null == this._isLargeDraw || e ^ this._isLargeDraw) && (this._isLargeDraw = e, this._clear());}, _renderNormal: function _renderNormal(t, e, n) {var i,r = this.group,a = t.getData(),o = this._data,s = t.coordinateSystem,l = s.getBaseAxis();"cartesian2d" === s.type ? i = l.isHorizontal() : "polar" === s.type && (i = "angle" === l.dim);var h = t.isAnimationEnabled() ? t : null;a.diff(o).add(function (e) {if (a.hasValue(e)) {var n = a.getItemModel(e),o = km[s.type](a, e, n),l = Dm[s.type](a, e, n, o, i, h);a.setItemGraphicEl(e, l), r.add(l), sh(l, a, e, n, o, t, i, "polar" === s.type);}}).update(function (e, n) {var l = o.getItemGraphicEl(n);if (a.hasValue(e)) {var u = a.getItemModel(e),c = km[s.type](a, e, u);l ? Xi(l, { shape: c }, h, e) : l = Dm[s.type](a, e, u, c, i, h, !0), a.setItemGraphicEl(e, l), r.add(l), sh(l, a, e, u, c, t, i, "polar" === s.type);} else r.remove(l);}).remove(function (t) {var e = o.getItemGraphicEl(t);"cartesian2d" === s.type ? e && ah(t, h, e) : e && oh(t, h, e);}).execute(), this._data = a;}, _renderLarge: function _renderLarge(t, e, n) {this._clear(), hh(t, this.group);}, _incrementalRenderLarge: function _incrementalRenderLarge(t, e) {hh(e, this.group, !0);}, dispose: B, remove: function remove(t) {this._clear(t);}, _clear: function _clear(t) {var e = this.group,n = this._data;t && t.get("animation") && n && !this._isLargeDraw ? n.eachItemGraphicEl(function (e) {"sector" === e.type ? oh(e.dataIndex, t, e) : ah(e.dataIndex, t, e);}) : e.removeAll(), this._data = null;} });var Dm = { cartesian2d: function cartesian2d(t, e, n, i, r, o, s) {var l = new Cf({ shape: a({}, i) });if (o) {var h = l.shape,u = r ? "height" : "width",c = {};h[u] = 0, c[u] = i[u], Wf[s ? "updateProps" : "initProps"](l, { shape: c }, o, e);}return l;}, polar: function polar(t, e, n, i, r, a, s) {var l = i.startAngle < i.endAngle,h = new wf({ shape: o({ clockwise: l }, i) });if (a) {var u = h.shape,c = r ? "r" : "endAngle",f = {};u[c] = r ? 0 : i.startAngle, f[c] = i[c], Wf[s ? "updateProps" : "initProps"](h, { shape: f }, a, e);}return h;} },km = { cartesian2d: function cartesian2d(t, e, n) {var i = t.getItemLayout(e),r = lh(n, i),a = i.width > 0 ? 1 : -1,o = i.height > 0 ? 1 : -1;return { x: i.x + a * r / 2, y: i.y + o * r / 2, width: i.width - a * r, height: i.height - o * r };}, polar: function polar(t, e, n) {var i = t.getItemLayout(e);return { cx: i.cx, cy: i.cy, r0: i.r0, r: i.r, startAngle: i.startAngle, endAngle: i.endAngle };} },Am = ai.extend({ type: "largeBar", shape: { points: [] }, buildPath: function buildPath(t, e) {for (var n = e.points, i = this.__startPoint, r = this.__valueIdx, a = 0; a < n.length; a += 2) {i[this.__valueIdx] = n[a + r], t.moveTo(i[0], i[1]), t.lineTo(n[a], n[a + 1]);}} });ko(v(function (t, e) {var n = $s(t, e),i = Ks(n),r = {};f(n, function (t) {var e = t.getData(),n = t.coordinateSystem,a = n.getBaseAxis(),o = js(t),s = i[Zs(a)][o],l = s.offset,h = s.width,u = n.getOtherAxis(a),c = t.get("barMinHeight") || 0;r[o] = r[o] || [], e.setLayout({ offset: l, size: h });for (var f = e.mapDimension(u.dim), d = e.mapDimension(a.dim), p = rs(e, f), g = u.isHorizontal(), m = nl(a, u, p), v = 0, y = e.count(); v < y; v++) {var _ = e.get(f, v),x = e.get(d, v);if (!isNaN(_)) {var w = _ >= 0 ? "p" : "n",b = m;p && (r[o][x] || (r[o][x] = { p: m, n: m }), b = r[o][x][w]);var M, S, I, T;if (g) M = b, S = (C = n.dataToPoint([_, x]))[1] + l, I = C[0] - m, T = h, Math.abs(I) < c && (I = (I < 0 ? -1 : 1) * c), p && (r[o][x][w] += I);else {var C = n.dataToPoint([x, _]);M = C[0] + l, S = b, I = h, T = C[1] - m, Math.abs(T) < c && (T = (T <= 0 ? -1 : 1) * c), p && (r[o][x][w] += T);}e.setItemLayout(v, { x: M, y: S, width: I, height: T });}}}, this);}, "bar")), ko(Vg), Ao({ seriesType: "bar", reset: function reset(t) {t.getData().setVisual("legendSymbol", "roundRect");} });var Lm = function Lm(t, e, n) {e = y(e) && { coordDimensions: e } || a({}, e);var i = t.getSource(),r = ag(i, e),o = new ng(r, t);return o.initData(i, n), o;},Pm = { updateSelectedMap: function updateSelectedMap(t) {this._targetList = y(t) ? t.slice() : [], this._selectTargetMap = p(t || [], function (t, e) {return t.set(e.name, e), t;}, R());}, select: function select(t, e) {var n = null != e ? this._targetList[e] : this._selectTargetMap.get(t);"single" === this.get("selectedMode") && this._selectTargetMap.each(function (t) {t.selected = !1;}), n && (n.selected = !0);}, unSelect: function unSelect(t, e) {var n = null != e ? this._targetList[e] : this._selectTargetMap.get(t);n && (n.selected = !1);}, toggleSelected: function toggleSelected(t, e) {var n = null != e ? this._targetList[e] : this._selectTargetMap.get(t);if (null != n) return this[n.selected ? "unSelect" : "select"](t, e), n.selected;}, isSelected: function isSelected(t, e) {var n = null != e ? this._targetList[e] : this._selectTargetMap.get(t);return n && n.selected;} },Om = Eo({ type: "series.pie", init: function init(t) {Om.superApply(this, "init", arguments), this.legendDataProvider = function () {return this.getRawData();}, this.updateSelectedMap(this._createSelectableList()), this._defaultLabelLine(t);}, mergeOption: function mergeOption(t) {Om.superCall(this, "mergeOption", t), this.updateSelectedMap(this._createSelectableList());}, getInitialData: function getInitialData(t, e) {return Lm(this, ["value"]);}, _createSelectableList: function _createSelectableList() {for (var t = this.getRawData(), e = t.mapDimension("value"), n = [], i = 0, r = t.count(); i < r; i++) {n.push({ name: t.getName(i), value: t.get(e, i), selected: xa(t, i, "selected") });}return n;}, getDataParams: function getDataParams(t) {var e = this.getData(),n = Om.superCall(this, "getDataParams", t),i = [];return e.each(e.mapDimension("value"), function (t) {i.push(t);}), n.percent = ar(i, t, e.hostModel.get("percentPrecision")), n.$vars.push("percent"), n;}, _defaultLabelLine: function _defaultLabelLine(t) {sn(t, "labelLine", ["show"]);var e = t.labelLine,n = t.emphasis.labelLine;e.show = e.show && t.label.show, n.show = n.show && t.emphasis.label.show;}, defaultOption: { zlevel: 0, z: 2, legendHoverLink: !0, hoverAnimation: !0, center: ["50%", "50%"], radius: [0, "75%"], clockwise: !0, startAngle: 90, minAngle: 0, selectedOffset: 10, hoverOffset: 10, avoidLabelOverlap: !0, percentPrecision: 2, stillShowZeroSum: !0, label: { rotate: !1, show: !0, position: "outer" }, labelLine: { show: !0, length: 15, length2: 15, smooth: !1, lineStyle: { width: 1, type: "solid" } }, itemStyle: { borderWidth: 1 }, animationType: "expansion", animationEasing: "cubicOut" } });u(Om, Pm);var Em = dh.prototype;Em.updateData = function (t, e, n) {function i() {s.stopAnimation(!0), s.animateTo({ shape: { r: u.r + l.get("hoverOffset") } }, 300, "elasticOut");}function r() {s.stopAnimation(!0), s.animateTo({ shape: { r: u.r } }, 300, "elasticOut");}var s = this.childAt(0),l = t.hostModel,h = t.getItemModel(e),u = t.getItemLayout(e),c = a({}, u);c.label = null, n ? (s.setShape(c), "scale" === l.getShallow("animationType") ? (s.shape.r = u.r0, Ui(s, { shape: { r: u.r } }, l, e)) : (s.shape.endAngle = u.startAngle, Xi(s, { shape: { endAngle: u.endAngle } }, l, e))) : Xi(s, { shape: c }, l, e);var f = t.getItemVisual(e, "color");s.useStyle(o({ lineJoin: "bevel", fill: f }, h.getModel("itemStyle").getItemStyle())), s.hoverStyle = h.getModel("emphasis.itemStyle").getItemStyle();var d = h.getShallow("cursor");d && s.attr("cursor", d), fh(this, t.getItemLayout(e), l.isSelected(null, e), l.get("selectedOffset"), l.get("animation")), s.off("mouseover").off("mouseout").off("emphasis").off("normal"), h.get("hoverAnimation") && l.isAnimationEnabled() && s.on("mouseover", i).on("mouseout", r).on("emphasis", i).on("normal", r), this._updateLabel(t, e), Ei(this);}, Em._updateLabel = function (t, e) {var n = this.childAt(1),i = this.childAt(2),r = t.hostModel,a = t.getItemModel(e),o = t.getItemLayout(e).label,s = t.getItemVisual(e, "color");Xi(n, { shape: { points: o.linePoints || [[o.x, o.y], [o.x, o.y], [o.x, o.y]] } }, r, e), Xi(i, { style: { x: o.x, y: o.y } }, r, e), i.attr({ rotation: o.rotation, origin: [o.x, o.y], z2: 10 });var l = a.getModel("label"),h = a.getModel("emphasis.label"),u = a.getModel("labelLine"),c = a.getModel("emphasis.labelLine"),s = t.getItemVisual(e, "color");Ni(i.style, i.hoverStyle = {}, l, h, { labelFetcher: t.hostModel, labelDataIndex: e, defaultText: t.getName(e), autoColor: s, useInsideStyle: !!o.inside }, { textAlign: o.textAlign, textVerticalAlign: o.verticalAlign, opacity: t.getItemVisual(e, "opacity") }), i.ignore = i.normalIgnore = !l.get("show"), i.hoverIgnore = !h.get("show"), n.ignore = n.normalIgnore = !u.get("show"), n.hoverIgnore = !c.get("show"), n.setStyle({ stroke: s, opacity: t.getItemVisual(e, "opacity") }), n.setStyle(u.getModel("lineStyle").getLineStyle()), n.hoverStyle = c.getModel("lineStyle").getLineStyle();var f = u.get("smooth");f && !0 === f && (f = .4), n.setShape({ smooth: f });}, h(dh, du);Oa.extend({ type: "pie", init: function init() {var t = new du();this._sectorGroup = t;}, render: function render(t, e, n, i) {if (!i || i.from !== this.uid) {var r = t.getData(),a = this._data,o = this.group,s = e.get("animation"),l = !a,h = t.get("animationType"),u = v(ch, this.uid, t, s, n),c = t.get("selectedMode");if (r.diff(a).add(function (t) {var e = new dh(r, t);l && "scale" !== h && e.eachChild(function (t) {t.stopAnimation(!0);}), c && e.on("click", u), r.setItemGraphicEl(t, e), o.add(e);}).update(function (t, e) {var n = a.getItemGraphicEl(e);n.updateData(r, t), n.off("click"), c && n.on("click", u), o.add(n), r.setItemGraphicEl(t, n);}).remove(function (t) {var e = a.getItemGraphicEl(t);o.remove(e);}).execute(), s && l && r.count() > 0 && "scale" !== h) {var f = r.getItemLayout(0),d = Math.max(n.getWidth(), n.getHeight()) / 2,p = m(o.removeClipPath, o);o.setClipPath(this._createClipPath(f.cx, f.cy, d, f.startAngle, f.clockwise, p, t));}this._data = r;}}, dispose: function dispose() {}, _createClipPath: function _createClipPath(t, e, n, i, r, a, o) {var s = new wf({ shape: { cx: t, cy: e, r0: 0, r: n, startAngle: i, endAngle: i, clockwise: r } });return Ui(s, { shape: { endAngle: i + (r ? 1 : -1) * Math.PI * 2 } }, o, a), s;}, containPoint: function containPoint(t, e) {var n = e.getData().getItemLayout(0);if (n) {var i = t[0] - n.cx,r = t[1] - n.cy,a = Math.sqrt(i * i + r * r);return a <= n.r && a >= n.r0;}} });var Nm = function Nm(t, e, n, i) {var r,a,o = t.getData(),s = [],l = !1;o.each(function (n) {var i,h,u,c,f = o.getItemLayout(n),d = o.getItemModel(n),p = d.getModel("label"),g = p.get("position") || d.get("emphasis.label.position"),m = d.getModel("labelLine"),v = m.get("length"),y = m.get("length2"),_ = (f.startAngle + f.endAngle) / 2,x = Math.cos(_),w = Math.sin(_);r = f.cx, a = f.cy;var b = "inside" === g || "inner" === g;if ("center" === g) i = f.cx, h = f.cy, c = "center";else {var M = (b ? (f.r + f.r0) / 2 * x : f.r * x) + r,S = (b ? (f.r + f.r0) / 2 * w : f.r * w) + a;if (i = M + 3 * x, h = S + 3 * w, !b) {var I = M + x * (v + e - f.r),T = S + w * (v + e - f.r),C = I + (x < 0 ? -1 : 1) * y,D = T;i = C + (x < 0 ? -5 : 5), h = D, u = [[M, S], [I, T], [C, D]];}c = b ? "center" : x > 0 ? "left" : "right";}var k = p.getFont(),A = p.get("rotate") ? x < 0 ? -_ + Math.PI : -_ : 0,L = ee(t.getFormattedLabel(n, "normal") || o.getName(n), k, c, "top");l = !!A, f.label = { x: i, y: h, position: g, height: L.height, len: v, len2: y, linePoints: u, textAlign: c, verticalAlign: "middle", rotation: A, inside: b }, b || s.push(f.label);}), !l && t.get("avoidLabelOverlap") && gh(s, r, a, e, n, i);},Rm = 2 * Math.PI,Bm = Math.PI / 180;!function (t, e) {f(e, function (e) {e.update = "updateView", Do(e, function (n, i) {var r = {};return i.eachComponent({ mainType: "series", subType: t, query: n }, function (t) {t[e.method] && t[e.method](n.name, n.dataIndex);var i = t.getData();i.each(function (e) {var n = i.getName(e);r[n] = t.isSelected(n) || !1;});}), { name: n.name, selected: r };});});}("pie", [{ type: "pieToggleSelect", event: "pieselectchanged", method: "toggleSelected" }, { type: "pieSelect", event: "pieselected", method: "select" }, { type: "pieUnSelect", event: "pieunselected", method: "unSelect" }]), Ao(function (t) {return { getTargetSeries: function getTargetSeries(e) {var n = {},i = R();return e.eachSeriesByType(t, function (t) {t.__paletteScope = n, i.set(t.uid, t);}), i;}, reset: function reset(t, e) {var n = t.getRawData(),i = {},r = t.getData();r.each(function (t) {var e = r.getRawIndex(t);i[e] = t;}), n.each(function (e) {var a = i[e],o = null != a && r.getItemVisual(a, "color", !0);if (o) n.setItemVisual(e, "color", o);else {var s = n.getItemModel(e).get("itemStyle.color") || t.getColorFromPalette(n.getName(e) || e + "", t.__paletteScope, n.count());n.setItemVisual(e, "color", s), null != a && r.setItemVisual(a, "color", s);}});} };}("pie")), ko(v(function (t, e, n, i) {e.eachSeriesByType(t, function (t) {var e = t.getData(),i = e.mapDimension("value"),r = t.get("center"),a = t.get("radius");y(a) || (a = [0, a]), y(r) || (r = [r, r]);var o = n.getWidth(),s = n.getHeight(),l = Math.min(o, s),h = er(r[0], o),u = er(r[1], s),c = er(a[0], l / 2),f = er(a[1], l / 2),d = -t.get("startAngle") * Bm,p = t.get("minAngle") * Bm,g = 0;e.each(i, function (t) {!isNaN(t) && g++;});var m = e.getSum(i),v = Math.PI / (m || g) * 2,_ = t.get("clockwise"),x = t.get("roseType"),w = t.get("stillShowZeroSum"),b = e.getDataExtent(i);b[0] = 0;var M = Rm,S = 0,I = d,T = _ ? 1 : -1;if (e.each(i, function (t, n) {var i;if (isNaN(t)) e.setItemLayout(n, { angle: NaN, startAngle: NaN, endAngle: NaN, clockwise: _, cx: h, cy: u, r0: c, r: x ? NaN : f });else {(i = "area" !== x ? 0 === m && w ? v : t * v : Rm / g) < p ? (i = p, M -= p) : S += t;var r = I + T * i;e.setItemLayout(n, { angle: i, startAngle: I, endAngle: r, clockwise: _, cx: h, cy: u, r0: c, r: x ? tr(t, b, [c, f]) : f }), I = r;}}), M < Rm && g) if (M <= .001) {var C = Rm / g;e.each(i, function (t, n) {if (!isNaN(t)) {var i = e.getItemLayout(n);i.angle = C, i.startAngle = d + T * n * C, i.endAngle = d + T * (n + 1) * C;}});} else v = M / S, I = d, e.each(i, function (t, n) {if (!isNaN(t)) {var i = e.getItemLayout(n),r = i.angle === p ? p : t * v;i.startAngle = I, i.endAngle = I + T * r, I += T * r;}});Nm(t, f, o, s);});}, "pie")), Co(function (t) {return { seriesType: t, reset: function reset(t, e) {var n = e.findComponents({ mainType: "legend" });if (n && n.length) {var i = t.getData();i.filterSelf(function (t) {for (var e = i.getName(t), r = 0; r < n.length; r++) {if (!n[r].isSelected(e)) return !1;}return !0;});}} };}("pie")), t.version = "4.1.0", t.dependencies = wp, t.PRIORITY = Ip, t.init = function (t, e, n) {var i = So(t);if (i) return i;var r = new no(t, e, n);return r.id = "ec_" + Hp++, Vp[r.id] = r, yn(t, qp, r.id), bo(r), r;}, t.connect = function (t) {if (y(t)) {var e = t;t = null, vp(e, function (e) {null != e.group && (t = e.group);}), t = t || "g_" + Gp++, vp(e, function (e) {e.group = t;});}return Wp[t] = !0, t;}, t.disConnect = Mo, t.disconnect = Up, t.dispose = function (t) {"string" == typeof t ? t = Vp[t] : t instanceof no || (t = So(t)), t instanceof no && !t.isDisposed() && t.dispose();}, t.getInstanceByDom = So, t.getInstanceById = function (t) {return Vp[t];}, t.registerTheme = Io, t.registerPreprocessor = To, t.registerProcessor = Co, t.registerPostUpdate = function (t) {Rp.push(t);}, t.registerAction = Do, t.registerCoordinateSystem = function (t, e) {Yr.register(t, e);}, t.getCoordinateSystemDimensions = function (t) {var e = Yr.get(t);if (e) return e.getDimensionsInfo ? e.getDimensionsInfo() : e.dimensions.slice();}, t.registerLayout = ko, t.registerVisual = Ao, t.registerLoading = Po, t.extendComponentModel = function (t) {return ld.extend(t);}, t.extendComponentView = Oo, t.extendSeriesModel = Eo, t.extendChartView = No, t.setCanvasCreator = function (t) {e("createCanvas", t);}, t.registerMap = function (t, e, n) {e.geoJson && !e.features && (n = e.specialAreas, e = e.geoJson), "string" == typeof e && (e = "undefined" != typeof JSON && JSON.parse ? JSON.parse(e) : new Function("return (" + e + ");")()), Xp[t] = { geoJson: e, specialAreas: n };}, t.getMap = function (t) {return Xp[t];}, t.dataTool = Yp;});

/***/ }),

/***/ 8:
/*!*********************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/pages.json?{"type":"stat"} ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__E35F033" };exports.default = _default;

/***/ }),

/***/ 800:
/*!**************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/common/city.data.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{ "value": 110000, "label": "北京市", "children": [{ "value": 110101, "label": "东城区" }, { "value": 110102, "label": "西城区" }, { "value": 110105, "label": "朝阳区" }, { "value": 110106, "label": "丰台区" }, { "value": 110107, "label": "石景山区" }, { "value": 110108, "label": "海淀区" }, { "value": 110109, "label": "门头沟区" }, { "value": 110111, "label": "房山区" }, { "value": 110112, "label": "通州区" }, { "value": 110113, "label": "顺义区" }, { "value": 110114, "label": "昌平区" }, { "value": 110115, "label": "大兴区" }, { "value": 110116, "label": "怀柔区" }, { "value": 110117, "label": "平谷区" }, { "value": 110118, "label": "密云区" }, { "value": 110119, "label": "延庆区" }] }, { "value": 120000, "label": "天津市", "children": [{ "value": 120101, "label": "和平区" }, { "value": 120102, "label": "河东区" }, { "value": 120103, "label": "河西区" }, { "value": 120104, "label": "南开区" }, { "value": 120105, "label": "河北区" }, { "value": 120106, "label": "红桥区" }, { "value": 120110, "label": "东丽区" }, { "value": 120111, "label": "西青区" }, { "value": 120112, "label": "津南区" }, { "value": 120113, "label": "北辰区" }, { "value": 120114, "label": "武清区" }, { "value": 120115, "label": "宝坻区" }, { "value": 120116, "label": "滨海新区" }, { "value": 120117, "label": "宁河区" }, { "value": 120118, "label": "静海区" }, { "value": 120119, "label": "蓟州区" }] }, { "value": 130000, "label": "河北省", "children": [{ "value": 130100, "label": "石家庄市" }, { "value": 130200, "label": "唐山市" }, { "value": 130300, "label": "秦皇岛市" }, { "value": 130400, "label": "邯郸市" }, { "value": 130500, "label": "邢台市" }, { "value": 130600, "label": "保定市" }, { "value": 130700, "label": "张家口市" }, { "value": 130800, "label": "承德市" }, { "value": 130900, "label": "沧州市" }, { "value": 131000, "label": "廊坊市" }, { "value": 131100, "label": "衡水市" }, { "value": 139000, "label": "省直辖县级行政区划" }] }, { "value": 140000, "label": "山西省", "children": [{ "value": 140100, "label": "太原市" }, { "value": 140200, "label": "大同市" }, { "value": 140300, "label": "阳泉市" }, { "value": 140400, "label": "长治市" }, { "value": 140500, "label": "晋城市" }, { "value": 140600, "label": "朔州市" }, { "value": 140700, "label": "晋中市" }, { "value": 140800, "label": "运城市" }, { "value": 140900, "label": "忻州市" }, { "value": 141000, "label": "临汾市" }, { "value": 141100, "label": "吕梁市" }] }, { "value": 150000, "label": "内蒙古自治区", "children": [{ "value": 150100, "label": "呼和浩特市" }, { "value": 150200, "label": "包头市" }, { "value": 150300, "label": "乌海市" }, { "value": 150400, "label": "赤峰市" }, { "value": 150500, "label": "通辽市" }, { "value": 150600, "label": "鄂尔多斯市" }, { "value": 150700, "label": "呼伦贝尔市" }, { "value": 150800, "label": "巴彦淖尔市" }, { "value": 150900, "label": "乌兰察布市" }, { "value": 152200, "label": "兴安盟" }, { "value": 152500, "label": "锡林郭勒盟" }, { "value": 152900, "label": "阿拉善盟" }] }, { "value": 210000, "label": "辽宁省", "children": [{ "value": 210100, "label": "沈阳市" }, { "value": 210200, "label": "大连市" }, { "value": 210300, "label": "鞍山市" }, { "value": 210400, "label": "抚顺市" }, { "value": 210500, "label": "本溪市" }, { "value": 210600, "label": "丹东市" }, { "value": 210700, "label": "锦州市" }, { "value": 210800, "label": "营口市" }, { "value": 210900, "label": "阜新市" }, { "value": 211000, "label": "辽阳市" }, { "value": 211100, "label": "盘锦市" }, { "value": 211200, "label": "铁岭市" }, { "value": 211300, "label": "朝阳市" }, { "value": 211400, "label": "葫芦岛市" }] }, { "value": 220000, "label": "吉林省", "children": [{ "value": 220100, "label": "长春市" }, { "value": 220200, "label": "吉林市" }, { "value": 220300, "label": "四平市" }, { "value": 220400, "label": "辽源市" }, { "value": 220500, "label": "通化市" }, { "value": 220600, "label": "白山市" }, { "value": 220700, "label": "松原市" }, { "value": 220800, "label": "白城市" }, { "value": 222400, "label": "延边朝鲜族自治州" }] }, { "value": 230000, "label": "黑龙江省", "children": [{ "value": 230100, "label": "哈尔滨市" }, { "value": 230200, "label": "齐齐哈尔市" }, { "value": 230300, "label": "鸡西市" }, { "value": 230400, "label": "鹤岗市" }, { "value": 230500, "label": "双鸭山市" }, { "value": 230600, "label": "大庆市" }, { "value": 230700, "label": "伊春市" }, { "value": 230800, "label": "佳木斯市" }, { "value": 230900, "label": "七台河市" }, { "value": 231000, "label": "牡丹江市" }, { "value": 231100, "label": "黑河市" }, { "value": 231200, "label": "绥化市" }, { "value": 232700, "label": "大兴安岭地区" }] }, { "value": 310000, "label": "上海市", "children": [{ "value": 310101, "label": "黄浦区" }, { "value": 310104, "label": "徐汇区" }, { "value": 310105, "label": "长宁区" }, { "value": 310106, "label": "静安区" }, { "value": 310107, "label": "普陀区" }, { "value": 310109, "label": "虹口区" }, { "value": 310110, "label": "杨浦区" }, { "value": 310112, "label": "闵行区" }, { "value": 310113, "label": "宝山区" }, { "value": 310114, "label": "嘉定区" }, { "value": 310115, "label": "浦东新区" }, { "value": 310116, "label": "金山区" }, { "value": 310117, "label": "松江区" }, { "value": 310118, "label": "青浦区" }, { "value": 310120, "label": "奉贤区" }, { "value": 310151, "label": "崇明区" }] }, { "value": 320000, "label": "江苏省", "children": [{ "value": 320100, "label": "南京市" }, { "value": 320200, "label": "无锡市" }, { "value": 320300, "label": "徐州市" }, { "value": 320400, "label": "常州市" }, { "value": 320500, "label": "苏州市" }, { "value": 320600, "label": "南通市" }, { "value": 320700, "label": "连云港市" }, { "value": 320800, "label": "淮安市" }, { "value": 320900, "label": "盐城市" }, { "value": 321000, "label": "扬州市" }, { "value": 321100, "label": "镇江市" }, { "value": 321200, "label": "泰州市" }, { "value": 321300, "label": "宿迁市" }] }, { "value": 330000, "label": "浙江省", "children": [{ "value": 330100, "label": "杭州市" }, { "value": 330200, "label": "宁波市" }, { "value": 330300, "label": "温州市" }, { "value": 330400, "label": "嘉兴市" }, { "value": 330500, "label": "湖州市" }, { "value": 330600, "label": "绍兴市" }, { "value": 330700, "label": "金华市" }, { "value": 330800, "label": "衢州市" }, { "value": 330900, "label": "舟山市" }, { "value": 331000, "label": "台州市" }, { "value": 331100, "label": "丽水市" }] }, { "value": 340000, "label": "安徽省", "children": [{ "value": 340100, "label": "合肥市" }, { "value": 340200, "label": "芜湖市" }, { "value": 340300, "label": "蚌埠市" }, { "value": 340400, "label": "淮南市" }, { "value": 340500, "label": "马鞍山市" }, { "value": 340600, "label": "淮北市" }, { "value": 340700, "label": "铜陵市" }, { "value": 340800, "label": "安庆市" }, { "value": 341000, "label": "黄山市" }, { "value": 341100, "label": "滁州市" }, { "value": 341200, "label": "阜阳市" }, { "value": 341300, "label": "宿州市" }, { "value": 341500, "label": "六安市" }, { "value": 341600, "label": "亳州市" }, { "value": 341700, "label": "池州市" }, { "value": 341800, "label": "宣城市" }] }, { "value": 350000, "label": "福建省", "children": [{ "value": 350100, "label": "福州市" }, { "value": 350200, "label": "厦门市" }, { "value": 350300, "label": "莆田市" }, { "value": 350400, "label": "三明市" }, { "value": 350500, "label": "泉州市" }, { "value": 350600, "label": "漳州市" }, { "value": 350700, "label": "南平市" }, { "value": 350800, "label": "龙岩市" }, { "value": 350900, "label": "宁德市" }] }, { "value": 360000, "label": "江西省", "children": [{ "value": 360100, "label": "南昌市" }, { "value": 360200, "label": "景德镇市" }, { "value": 360300, "label": "萍乡市" }, { "value": 360400, "label": "九江市" }, { "value": 360500, "label": "新余市" }, { "value": 360600, "label": "鹰潭市" }, { "value": 360700, "label": "赣州市" }, { "value": 360800, "label": "吉安市" }, { "value": 360900, "label": "宜春市" }, { "value": 361000, "label": "抚州市" }, { "value": 361100, "label": "上饶市" }] }, { "value": 370000, "label": "山东省", "children": [{ "value": 370100, "label": "济南市" }, { "value": 370200, "label": "青岛市" }, { "value": 370300, "label": "淄博市" }, { "value": 370400, "label": "枣庄市" }, { "value": 370500, "label": "东营市" }, { "value": 370600, "label": "烟台市" }, { "value": 370700, "label": "潍坊市" }, { "value": 370800, "label": "济宁市" }, { "value": 370900, "label": "泰安市" }, { "value": 371000, "label": "威海市" }, { "value": 371100, "label": "日照市" }, { "value": 371200, "label": "莱芜市" }, { "value": 371300, "label": "临沂市" }, { "value": 371400, "label": "德州市" }, { "value": 371500, "label": "聊城市" }, { "value": 371600, "label": "滨州市" }, { "value": 371700, "label": "菏泽市" }] }, { "value": 410000, "label": "河南省", "children": [{ "value": 410100, "label": "郑州市" }, { "value": 410200, "label": "开封市" }, { "value": 410300, "label": "洛阳市" }, { "value": 410400, "label": "平顶山市" }, { "value": 410500, "label": "安阳市" }, { "value": 410600, "label": "鹤壁市" }, { "value": 410700, "label": "新乡市" }, { "value": 410800, "label": "焦作市" }, { "value": 410900, "label": "濮阳市" }, { "value": 411000, "label": "许昌市" }, { "value": 411100, "label": "漯河市" }, { "value": 411200, "label": "三门峡市" }, { "value": 411300, "label": "南阳市" }, { "value": 411400, "label": "商丘市" }, { "value": 411500, "label": "信阳市" }, { "value": 411600, "label": "周口市" }, { "value": 411700, "label": "驻马店市" }, { "value": 419000, "label": "省直辖县级行政区划" }] }, { "value": 420000, "label": "湖北省", "children": [{ "value": 420100, "label": "武汉市" }, { "value": 420200, "label": "黄石市" }, { "value": 420300, "label": "十堰市" }, { "value": 420500, "label": "宜昌市" }, { "value": 420600, "label": "襄阳市" }, { "value": 420700, "label": "鄂州市" }, { "value": 420800, "label": "荆门市" }, { "value": 420900, "label": "孝感市" }, { "value": 421000, "label": "荆州市" }, { "value": 421100, "label": "黄冈市" }, { "value": 421200, "label": "咸宁市" }, { "value": 421300, "label": "随州市" }, { "value": 422800, "label": "恩施土家族苗族自治州" }, { "value": 429000, "label": "省直辖县级行政区划" }] }, { "value": 430000, "label": "湖南省", "children": [{ "value": 430100, "label": "长沙市" }, { "value": 430200, "label": "株洲市" }, { "value": 430300, "label": "湘潭市" }, { "value": 430400, "label": "衡阳市" }, { "value": 430500, "label": "邵阳市" }, { "value": 430600, "label": "岳阳市" }, { "value": 430700, "label": "常德市" }, { "value": 430800, "label": "张家界市" }, { "value": 430900, "label": "益阳市" }, { "value": 431000, "label": "郴州市" }, { "value": 431100, "label": "永州市" }, { "value": 431200, "label": "怀化市" }, { "value": 431300, "label": "娄底市" }, { "value": 433100, "label": "湘西土家族苗族自治州" }] }, { "value": 440000, "label": "广东省", "children": [{ "value": 440100, "label": "广州市" }, { "value": 440200, "label": "韶关市" }, { "value": 440300, "label": "深圳市" }, { "value": 440400, "label": "珠海市" }, { "value": 440500, "label": "汕头市" }, { "value": 440600, "label": "佛山市" }, { "value": 440700, "label": "江门市" }, { "value": 440800, "label": "湛江市" }, { "value": 440900, "label": "茂名市" }, { "value": 441200, "label": "肇庆市" }, { "value": 441300, "label": "惠州市" }, { "value": 441400, "label": "梅州市" }, { "value": 441500, "label": "汕尾市" }, { "value": 441600, "label": "河源市" }, { "value": 441700, "label": "阳江市" }, { "value": 441800, "label": "清远市" }, { "value": 441900, "label": "东莞市" }, { "value": 442000, "label": "中山市" }, { "value": 445100, "label": "潮州市" }, { "value": 445200, "label": "揭阳市" }, { "value": 445300, "label": "云浮市" }] }, { "value": 450000, "label": "广西壮族自治区", "children": [{ "value": 450100, "label": "南宁市" }, { "value": 450200, "label": "柳州市" }, { "value": 450300, "label": "桂林市" }, { "value": 450400, "label": "梧州市" }, { "value": 450500, "label": "北海市" }, { "value": 450600, "label": "防城港市" }, { "value": 450700, "label": "钦州市" }, { "value": 450800, "label": "贵港市" }, { "value": 450900, "label": "玉林市" }, { "value": 451000, "label": "百色市" }, { "value": 451100, "label": "贺州市" }, { "value": 451200, "label": "河池市" }, { "value": 451300, "label": "来宾市" }, { "value": 451400, "label": "崇左市" }] }, { "value": 460000, "label": "海南省", "children": [{ "value": 460100, "label": "海口市" }, { "value": 460200, "label": "三亚市" }, { "value": 460300, "label": "三沙市" }, { "value": 460400, "label": "儋州市" }, { "value": 469000, "label": "省直辖县级行政区划" }] }, { "value": 500000, "label": "重庆市", "children": [{ "value": 500101, "label": "万州区" }, { "value": 500102, "label": "涪陵区" }, { "value": 500103, "label": "渝中区" }, { "value": 500104, "label": "大渡口区" }, { "value": 500105, "label": "江北区" }, { "value": 500106, "label": "沙坪坝区" }, { "value": 500107, "label": "九龙坡区" }, { "value": 500108, "label": "南岸区" }, { "value": 500109, "label": "北碚区" }, { "value": 500110, "label": "綦江区" }, { "value": 500111, "label": "大足区" }, { "value": 500112, "label": "渝北区" }, { "value": 500113, "label": "巴南区" }, { "value": 500114, "label": "黔江区" }, { "value": 500115, "label": "长寿区" }, { "value": 500116, "label": "江津区" }, { "value": 500117, "label": "合川区" }, { "value": 500118, "label": "永川区" }, { "value": 500119, "label": "南川区" }, { "value": 500120, "label": "璧山区" }, { "value": 500151, "label": "铜梁区" }, { "value": 500152, "label": "潼南区" }, { "value": 500153, "label": "荣昌区" }, { "value": 500154, "label": "开州区" }] }, { "value": 510000, "label": "四川省", "children": [{ "value": 510100, "label": "成都市" }, { "value": 510300, "label": "自贡市" }, { "value": 510400, "label": "攀枝花市" }, { "value": 510500, "label": "泸州市" }, { "value": 510600, "label": "德阳市" }, { "value": 510700, "label": "绵阳市" }, { "value": 510800, "label": "广元市" }, { "value": 510900, "label": "遂宁市" }, { "value": 511000, "label": "内江市" }, { "value": 511100, "label": "乐山市" }, { "value": 511300, "label": "南充市" }, { "value": 511400, "label": "眉山市" }, { "value": 511500, "label": "宜宾市" }, { "value": 511600, "label": "广安市" }, { "value": 511700, "label": "达州市" }, { "value": 511800, "label": "雅安市" }, { "value": 511900, "label": "巴中市" }, { "value": 512000, "label": "资阳市" }, { "value": 513200, "label": "阿坝藏族羌族自治州" }, { "value": 513300, "label": "甘孜藏族自治州" }, { "value": 513400, "label": "凉山彝族自治州" }] }, { "value": 520000, "label": "贵州省", "children": [{ "value": 520100, "label": "贵阳市" }, { "value": 520200, "label": "六盘水市" }, { "value": 520300, "label": "遵义市" }, { "value": 520400, "label": "安顺市" }, { "value": 520500, "label": "毕节市" }, { "value": 520600, "label": "铜仁市" }, { "value": 522300, "label": "黔西南布依族苗族自治州" }, { "value": 522600, "label": "黔东南苗族侗族自治州" }, { "value": 522700, "label": "黔南布依族苗族自治州" }] }, { "value": 530000, "label": "云南省", "children": [{ "value": 530100, "label": "昆明市" }, { "value": 530300, "label": "曲靖市" }, { "value": 530400, "label": "玉溪市" }, { "value": 530500, "label": "保山市" }, { "value": 530600, "label": "昭通市" }, { "value": 530700, "label": "丽江市" }, { "value": 530800, "label": "普洱市" }, { "value": 530900, "label": "临沧市" }, { "value": 532300, "label": "楚雄彝族自治州" }, { "value": 532500, "label": "红河哈尼族彝族自治州" }, { "value": 532600, "label": "文山壮族苗族自治州" }, { "value": 532800, "label": "西双版纳傣族自治州" }, { "value": 532900, "label": "大理白族自治州" }, { "value": 533100, "label": "德宏傣族景颇族自治州" }, { "value": 533300, "label": "怒江傈僳族自治州" }, { "value": 533400, "label": "迪庆藏族自治州" }] }, { "value": 540000, "label": "西藏自治区", "children": [{ "value": 540100, "label": "拉萨市" }, { "value": 540200, "label": "日喀则市" }, { "value": 540300, "label": "昌都市" }, { "value": 540400, "label": "林芝市" }, { "value": 540500, "label": "山南市" }, { "value": 542400, "label": "那曲地区" }, { "value": 542500, "label": "阿里地区" }] }, { "value": 610000, "label": "陕西省", "children": [{ "value": 610100, "label": "西安市" }, { "value": 610200, "label": "铜川市" }, { "value": 610300, "label": "宝鸡市" }, { "value": 610400, "label": "咸阳市" }, { "value": 610500, "label": "渭南市" }, { "value": 610600, "label": "延安市" }, { "value": 610700, "label": "汉中市" }, { "value": 610800, "label": "榆林市" }, { "value": 610900, "label": "安康市" }, { "value": 611000, "label": "商洛市" }] }, { "value": 620000, "label": "甘肃省", "children": [{ "value": 620100, "label": "兰州市" }, { "value": 620200, "label": "嘉峪关市" }, { "value": 620300, "label": "金昌市" }, { "value": 620400, "label": "白银市" }, { "value": 620500, "label": "天水市" }, { "value": 620600, "label": "武威市" }, { "value": 620700, "label": "张掖市" }, { "value": 620800, "label": "平凉市" }, { "value": 620900, "label": "酒泉市" }, { "value": 621000, "label": "庆阳市" }, { "value": 621100, "label": "定西市" }, { "value": 621200, "label": "陇南市" }, { "value": 622900, "label": "临夏回族自治州" }, { "value": 623000, "label": "甘南藏族自治州" }] }, { "value": 630000, "label": "青海省", "children": [{ "value": 630100, "label": "西宁市" }, { "value": 630200, "label": "海东市" }, { "value": 632200, "label": "海北藏族自治州" }, { "value": 632300, "label": "黄南藏族自治州" }, { "value": 632500, "label": "海南藏族自治州" }, { "value": 632600, "label": "果洛藏族自治州" }, { "value": 632700, "label": "玉树藏族自治州" }, { "value": 632800, "label": "海西蒙古族藏族自治州" }] }, { "value": 640000, "label": "宁夏回族自治区", "children": [{ "value": 640100, "label": "银川市" }, { "value": 640200, "label": "石嘴山市" }, { "value": 640300, "label": "吴忠市" }, { "value": 640400, "label": "固原市" }, { "value": 640500, "label": "中卫市" }] }, { "value": 650000, "label": "新疆维吾尔自治区", "children": [{ "value": 650100, "label": "乌鲁木齐市" }, { "value": 650200, "label": "克拉玛依市" }, { "value": 650400, "label": "吐鲁番市" }, { "value": 650500, "label": "哈密市" }, { "value": 652300, "label": "昌吉回族自治州" }, { "value": 652700, "label": "博尔塔拉蒙古自治州" }, { "value": 652800, "label": "巴音郭楞蒙古自治州" }, { "value": 652900, "label": "阿克苏地区" }, { "value": 653000, "label": "克孜勒苏柯尔克孜自治州" }, { "value": 653100, "label": "喀什地区" }, { "value": 653200, "label": "和田地区" }, { "value": 654000, "label": "伊犁哈萨克自治州" }, { "value": 654200, "label": "塔城地区" }, { "value": 654300, "label": "阿勒泰地区" }, { "value": 659000, "label": "自治区直辖县级行政区划" }] }, { "value": 710000, "label": "台湾省", "children": [{ "value": "710100", "label": "台北市" }, { "value": "710200", "label": "高雄市" }, { "value": "710300", "label": "台南市" }, { "value": "710400", "label": "台中市" }, { "value": "710500", "label": "金门县" }, { "value": "710600", "label": "南投县" }, { "value": "710700", "label": "基隆市" }, { "value": "710800", "label": "新竹市" }, { "value": "710900", "label": "嘉义市" }, { "value": "711100", "label": "新北市" }, { "value": "711200", "label": "宜兰县" }, { "value": "711300", "label": "新竹县" }, { "value": "711400", "label": "桃园县" }, { "value": "711500", "label": "苗栗县" }, { "value": "711700", "label": "彰化县" }, { "value": "711900", "label": "嘉义县" }, { "value": "712100", "label": "云林县" }, { "value": "712400", "label": "屏东县" }, { "value": "712500", "label": "台东县" }, { "value": "712600", "label": "花莲县" }, { "value": "712700", "label": "澎湖县" }] }, { "value": 810000, "label": "香港特别行政区", "children": [{ "value": "810100", "label": "香港岛" }, { "value": "810200", "label": "九龙" }, { "value": "810300", "label": "新界" }] }, { "value": 820000, "label": "澳门特别行政区", "children": [{ "value": "820100", "label": "澳门半岛" }, { "value": "820200", "label": "氹仔岛" }, { "value": "820300", "label": "路环岛" }] }];exports.default = _default;

/***/ }),

/***/ 859:
/*!************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/common/airport.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
module.exports = {
  "list": [{
    "letter": "A",
    "data": [
    "阿克苏机场",
    "阿拉山口机场",
    "阿勒泰机场",
    "阿里昆莎机场",
    "安庆天柱山机场",
    "澳门国际机场"] },

  {
    "letter": "B",
    "data": [
    "保山机场",
    "包头机场",
    "北海福成机场",
    "北京南苑机场",
    "北京首都国际机场"] },

  {
    "letter": "C",
    "data": [
    "长白山机场",
    "长春龙嘉国际机场",
    "常德桃花源机场",
    "昌都邦达机场",
    "长沙黄花国际机场",
    "长治王村机场",
    "常州奔牛机场",
    "成都双流国际机场",
    "赤峰机场"] },

  {
    "letter": "D",
    "data": [
    "大理机场",
    "大连周水子国际机场",
    "大庆萨尔图机场",
    "大同东王庄机场",
    "达州河市机场",
    "丹东浪头机场",
    "德宏芒市机场",
    "迪庆香格里拉机场",
    "东营机场",
    "敦煌机场"] },

  {
    "letter": "E",
    "data": [
    "鄂尔多斯机场",
    "恩施许家坪机场",
    "二连浩特赛乌苏国际机场"] },

  {
    "letter": "F",
    "data": [
    "阜阳西关机场",
    "福州长乐国际机场"] },

  {
    "letter": "G",
    "data": [
    "赣州黄金机场",
    "格尔木机场",
    "固原六盘山机场",
    "广元盘龙机场",
    "广州白云国际机场",
    "桂林两江国际机场",
    "贵阳龙洞堡国际机场"] },

  {
    "letter": "H",
    "data": [
    "哈尔滨太平国际机场",
    "哈密机场",
    "海口美兰国际机场",
    "海拉尔东山国际机场",
    "邯郸机场",
    "汉中机场",
    "杭州萧山国际机场",
    "合肥骆岗国际机场",
    "和田机场",
    "黑河机场",
    "呼和浩特白塔国际机场",
    "淮安涟水机场",
    "黄山屯溪国际机场"] },

  {
    "letter": "I",
    "data": [] },
  {
    "letter": "J",
    "data": [
    "济南遥墙国际机场",
    "济宁曲阜机场",
    "鸡西兴凯湖机场",
    "佳木斯东郊机场",
    "嘉峪关机场",
    "锦州小岭子机场",
    "景德镇机场",
    "井冈山机场",
    "九江庐山机场",
    "九寨黄龙机场"] },

  {
    "letter": "K",
    "data": [
    "喀什机场",
    "克拉玛依机场",
    "库车龟兹机场",
    "库尔勒机场",
    "昆明巫家坝国际机场"] },

  {
    "letter": "L",
    "data": [
    "拉萨贡嘎机场",
    "兰州中川机场",
    "丽江三义机场",
    "黎平机场",
    "连云港白塔埠机场",
    "临沧机场",
    "临沂机场",
    "林芝米林机场",
    "柳州白莲机场",
    "龙岩冠豸山机场",
    "泸州蓝田机场",
    "洛阳北郊机场"] },

  {
    "letter": "M",
    "data": [
    "满洲里西郊机场",
    "绵阳南郊机场",
    "漠河古莲机场",
    "牡丹江海浪机场"] },

  {
    "letter": "N",
    "data": [
    "南昌昌北国际机场",
    "南充高坪机场",
    "南京禄口国际机场",
    "南宁吴圩机场",
    "南通兴东机场",
    "南阳姜营机场",
    "宁波栎社国际机场"] },

  {
    "letter": "O",
    "data": [] },
  {
    "letter": "P",
    "data": [
    "普洱思茅机场"] },

  {
    "letter": "Q",
    "data": [
    "齐齐哈尔三家子机场",
    "秦皇岛山海关机场",
    "青岛流亭国际机场",
    "衢州机场",
    "泉州晋江机场"] },

  {
    "letter": "R",
    "data": [
    "日喀则和平机场"] },

  {
    "letter": "S",
    "data": [
    "三亚凤凰国际机场",
    "汕头外砂机场",
    "上海虹桥国际机场",
    "上海浦东国际机场",
    "深圳宝安国际机场",
    "沈阳桃仙国际机场",
    "石家庄正定国际机场",
    "苏南硕放国际机场"] },

  {
    "letter": "T",
    "data": [
    "塔城机场",
    "太原武宿国际机场",
    "台州路桥机场 (黄岩机场)",
    "唐山三女河机场",
    "腾冲驼峰机场",
    "天津滨海国际机场",
    "通辽机场",
    "铜仁凤凰机场"] },

  {
    "letter": "U",
    "data": [] },
  {
    "letter": "V",
    "data": [] },
  {
    "letter": "W",
    "data": [
    "万州五桥机场",
    "潍坊机场",
    "威海大水泊机场",
    "文山普者黑机场",
    "温州永强国际机场",
    "乌海机场",
    "武汉天河国际机场",
    "乌兰浩特机场",
    "乌鲁木齐地窝堡国际机场",
    "武夷山机场",
    "梧州长洲岛机场"] },

  {
    "letter": "X",
    "data": [
    "西安咸阳国际机场",
    "西昌青山机场",
    "锡林浩特机场",
    "西宁曹家堡机场",
    "西双版纳嘎洒机场",
    "厦门高崎国际机场",
    "香港国际机场",
    "襄阳刘集机场",
    "兴义机场",
    "徐州观音机场"] },

  {
    "letter": "Y",
    "data": [
    "延安二十里堡机场",
    "盐城机场",
    "延吉朝阳川机场",
    "烟台莱山国际机场",
    "宜宾菜坝机场",
    "宜昌三峡机场",
    "伊春林都机场",
    "伊宁机场",
    "义乌机场",
    "银川河东机场",
    "永州零陵机场",
    "榆林榆阳机场",
    "玉树巴塘机场",
    "运城张孝机场"] },

  {
    "letter": "Z",
    "data": [
    "湛江机场",
    "昭通机场",
    "郑州新郑国际机场",
    "芷江机场",
    "重庆江北国际机场",
    "中卫香山机场",
    "舟山朱家尖机场",
    "珠海三灶机场"] }] };

/***/ }),

/***/ 924:
/*!*****************************************************************************************!*\
  !*** F:/projects/02.Projects/02.RPA/02.Trunk/01.Web/uni-app/引导页/common/graceChecker.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /**
              数据验证（表单验证）
              来自 grace.hcoder.net 
              作者 hcoder 深海
              */
module.exports = {
  error: '',
  check: function check(data, rule) {
    for (var i = 0; i < rule.length; i++) {
      if (!rule[i].checkType) {return true;}
      if (!rule[i].name) {return true;}
      if (!rule[i].errorMsg) {return true;}
      if (!data[rule[i].name]) {this.error = rule[i].errorMsg;return false;}
      switch (rule[i].checkType) {
        case 'string':
          var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'int':
          var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
          break;
        case 'between':
          if (!this.isNumber(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          var minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'betweenD':
          var reg = /^-?[1-9][0-9]?$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          var minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'betweenF':
          var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          var minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'same':
          if (data[rule[i].name] != rule[i].checkRule) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'notsame':
          if (data[rule[i].name] == rule[i].checkRule) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'email':
          var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'phoneno':
          var reg = /^1[0-9]{10,10}$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'zipcode':
          var reg = /^[0-9]{6}$/;
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'reg':
          var reg = new RegExp(rule[i].checkRule);
          if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg;return false;}
          break;
        case 'in':
          if (rule[i].checkRule.indexOf(data[rule[i].name]) == -1) {
            this.error = rule[i].errorMsg;return false;
          }
          break;
        case 'notnull':
          if (data[rule[i].name] == null || data[rule[i].name].length < 1) {this.error = rule[i].errorMsg;return false;}
          break;}

    }
    return true;
  },
  isNumber: function isNumber(checkVal) {
    var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
    return reg.test(checkVal);
  } };

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map