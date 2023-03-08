// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/importFile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importFileInit = importFileInit;
function importFileInit(imageRowSlice) {
  var input = document.querySelector('input[type=file]');
  input.addEventListener('change', function (evt) {
    var source = evt.target.files[0];
    var image = new Image();
    image.onload = function () {
      imageRowSlice.max = image.height;
      drawFrame(this);
    };
    image.onerror = function () {
      console.log("error loading image!");
    };
    window.URL.revokeObjectURL(image.src);
    image.src = window.URL.createObjectURL(source);
  }, false);
}
function drawFrame(source) {
  var MAX_WIDTH = 800;
  var MAX_HEIGHT = 800;
  var width = source.naturalWidth || source.videoWidth;
  var height = source.naturalHeight || source.videoHeight;

  // Change the resizing logic
  if (width > height) {
    if (width > MAX_WIDTH) {
      height = height * (MAX_WIDTH / width);
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width = width * (MAX_HEIGHT / height);
      height = MAX_HEIGHT;
    }
  }
  var canvas = document.getElementById("Mycanvas");
  var context = canvas.getContext("2d");
  var canvas2 = document.getElementById("ProcessCanvas");
  var context2 = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  context.drawImage(source, 0, 0, width, height);
  canvas2.width = width;
  canvas2.height = height;
  context2.drawImage(source, 0, 0, width, height);
}
},{}],"js/kernel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Kernel = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Kernel = /*#__PURE__*/function (_Float32Array) {
  _inherits(Kernel, _Float32Array);
  var _super = _createSuper(Kernel);
  function Kernel() {
    var _this;
    _classCallCheck(this, Kernel);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "sigma", void 0);
    _defineProperty(_assertThisInitialized(_this), "sigma2", void 0);
    _defineProperty(_assertThisInitialized(_this), "kernelSize", void 0);
    _defineProperty(_assertThisInitialized(_this), "subtract", false);
    return _this;
  }
  _createClass(Kernel, [{
    key: "initGauss",
    value: function initGauss(sigma, sigma2, kernelSize) {
      this.sigma = sigma;
      this.sigma2 = sigma2;
      if (sigma2 == 0) this.sigma2 = this.sigma;
      this.kernelSize = kernelSize;
      var GAUSSKERN = 6.0;
      var dim = 0;
      if (kernelSize != 0) dim = kernelSize;else dim = parseInt(Math.max(3.0, GAUSSKERN * this.sigma));
      var sqrtSigmaPi2 = Math.sqrt(Math.PI * 2.0) * this.sigma;
      var s2 = 2.0 * this.sigma * this.sigma2;
      var sum = 0.0;
      var kernel = new Float32Array(dim - !(dim & 1)); // Make it odd number
      var half = parseInt(kernel.length / 2);
      for (var j = 0, i = -half; j < kernel.length; i++, j++) {
        kernel[j] = Math.exp(-(i * i) / s2) / sqrtSigmaPi2;
        sum += kernel[j];
      }
      // Normalize the gaussian kernel to prevent image darkening/brightening
      for (var i = 0; i < dim; i++) {
        kernel[i] /= sum;
      }
      this.self = kernel;
    }
  }, {
    key: "initBoxKernel",
    value: function initBoxKernel(kernelSize) {
      this.sigma = 1;
      this.sigma2 = 1;
      this.kernelSize = kernelSize;
      var dim = 0;
      if (kernelSize != 0) dim = kernelSize;else dim = 3;
      var sum = 0.0;
      var kernel = new Float32Array(dim - !(dim & 1)); // Make it odd number
      var half = parseInt(kernel.length / 2);
      for (var j = 0, i = -half; j < kernel.length; i++, j++) {
        kernel[j] = 1;
        sum += kernel[j];
      }
      // Normalize the kernel to prevent image darkening/brightening
      for (var i = 0; i < dim; i++) {
        kernel[i] /= sum;
      }
      this.self = kernel;
    }
  }, {
    key: "printMatrix",
    value: function printMatrix() {
      var k = [];
      for (var i = 0; i < kernel.length; i++) {
        k.push(kernel[i] / kernel[0]);
      }
      var k_t = [];
      for (var i = 0; i < k.length; i++) {
        k_t.push([k[i]]);
      }
      ;
      var k_m = multiply(k_t, [k]);
      var k_m_sum = k_m.reduce(function (a, b) {
        return a.concat(b);
      }).reduce(function (a, b) {
        return a + b;
      });
      for (var row = 0; row < k_m.length; row++) {
        for (var col = 0; col < k_m[0].length; col++) {
          k_m[row][col] = k_m[row][col] / k_m_sum;
        }
      }
      console.log(k_m);
    }
  }, {
    key: "plotKernel",
    value: function plotKernel() {}
  }]);
  return Kernel;
}( /*#__PURE__*/_wrapNativeSuper(Float32Array));
exports.Kernel = Kernel;
},{}],"js/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Filter = void 0;
var _kernel = require("./kernel.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Filter = /*#__PURE__*/function () {
  function Filter() {
    _classCallCheck(this, Filter);
    _defineProperty(this, "kernels", void 0);
    this.kernels = [new _kernel.Kernel(), new _kernel.Kernel(), new _kernel.Kernel()];
  }
  _createClass(Filter, [{
    key: "subtractKerne",
    value: function subtractKerne(pixels, colorChannel, kernel) {
      var data = pixels.data;
      var w = pixels.width;
      var h = pixels.height;
      var blurredPixels = new Array(pixels.length);
      var dim = kernel.kernelSize;
      var half = parseInt((dim - !(dim & 1)) / 2);

      // Blur the pixels using a box filter
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var _i = y * w + x;
          var color = 0,
            n = 0;

          // Sum the values of the neighboring pixels
          for (var dy = -half; dy <= half; dy++) {
            for (var dx = -half; dx <= half; dx++) {
              var y2 = y + dy,
                x2 = x + dx;
              if (y2 >= 0 && y2 < h && x2 >= 0 && x2 < w) {
                var i2 = y2 * w + x2;
                color += data[i2 * 4 + colorChannel];
                n++;
              }
            }
          }

          // Average the values of the neighboring pixels
          color /= n;

          // Store the blurred pixel values
          blurredPixels[_i * 4 + colorChannel] = color;
        }
      }

      // Subtract the blurred pixels from the original pixels
      for (var i = 0; i < w * h; i += 1) {
        data[i * 4 + colorChannel] = data[i * 4 + colorChannel] + (data[i * 4 + colorChannel] - blurredPixels[i * 4 + colorChannel]) * amount;
      }
    }
  }, {
    key: "applyToImage",
    value: function applyToImage(pixels) {
      var _this = this;
      this.kernels.forEach(function (kernel, i) {
        if (kernel.sigma != 0) _this.applyKernel(pixels, i, kernel.self, kernel.subtract);
      });
    }
  }, {
    key: "applyKernel",
    value: function applyKernel(pixels, colorChannel, kernel, subtract) {
      var data = pixels.data;
      var w = pixels.width;
      var h = pixels.height;
      var buff = new Uint8Array(w * h);
      var mk = Math.floor(kernel.length / 2);
      var kl = kernel.length;

      // First step process columns
      for (var j = 0, hw = 0; j < h; j++, hw += w) {
        for (var i = 0; i < w; i++) {
          var sum = 0;
          for (var k = 0; k < kl; k++) {
            var col = i + (k - mk);
            col = col < 0 ? 0 : col >= w ? w - 1 : col;
            sum += data[(hw + col) * 4 + colorChannel] * kernel[k];
          }
          buff[hw + i] = sum;
        }
      }

      // Second step process rows
      for (var j = 0, offset = 0; j < h; j++, offset += w) {
        for (var i = 0; i < w; i++) {
          var sum = 0;
          for (k = 0; k < kl; k++) {
            var row = j + (k - mk);
            row = row < 0 ? 0 : row >= h ? h - 1 : row;
            sum += buff[row * w + i] * kernel[k];
          }
          var off = (j * w + i) * 4;
          if (!subtract) data[off + colorChannel] = sum;else {
            data[off + colorChannel] = data[off + colorChannel] + (data[off + colorChannel] - sum);
          }
        }
      }
    }
  }]);
  return Filter;
}();
exports.Filter = Filter;
},{"./kernel.js":"js/kernel.js"}],"js/illustrations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Illustrator = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Illustrator = /*#__PURE__*/function () {
  function Illustrator() {
    _classCallCheck(this, Illustrator);
    _defineProperty(this, "plotColors", void 0);
    _defineProperty(this, "plotNames", void 0);
    _defineProperty(this, "plotDefaultConfig", void 0);
    _defineProperty(this, "plotDefaultKernelLayout", void 0);
    _defineProperty(this, "plotDefaultFrequencyLayout", void 0);
    this.plotColors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(148,0,211)'];
    this.plotNames = ['Red', 'Green', 'Blue', 'Alpha'];
    this.plotDefaultConfig = {
      displayModeBar: false
    };
    this.plotDefaultKernelLayout = {
      xaxis: {
        range: [0, 1]
      },
      yaxis: {
        range: [0, 1]
      }
    };
    this.plotDefaultFrequencyLayout = {
      yaxis: {
        range: [-10, 256]
      }
    };
  }
  _createClass(Illustrator, [{
    key: "initKernelGraph",
    value: function initKernelGraph() {
      var plotting_data = [[null], [null], [null]];
      var plotting_labels = [[null], [null], [null]];
      var plotData = [];
      for (var i = 0; i < plotting_data.length; i++) {
        plotData.push({
          x: plotting_labels[i],
          y: plotting_data[i],
          name: this.plotNames[i],
          line: {
            shape: 'spline',
            color: this.plotColors[i]
          },
          type: 'scatter'
        });
      }
      Plotly.newPlot('myDiv', plotData, this.plotDefaultKernelLayout, this.plotDefaultConfig);
    }
  }, {
    key: "initFrequencyGraph",
    value: function initFrequencyGraph() {
      var plotting_data = [[null], [null], [null], [null]];
      var plotting_labels = [[null], [null], [null], [null]];
      var plotData = [];
      for (var i = 0; i < plotting_data.length; i++) {
        plotData.push({
          x: plotting_labels[i],
          y: plotting_data[i],
          name: this.plotNames[i],
          line: {
            shape: 'spline',
            color: this.plotColors[i]
          },
          type: 'scatter'
        });
      }
      Plotly.newPlot('myPlot2', plotData, this.plotDefaultFrequencyLayout, this.plotDefaultConfig);
    }
  }, {
    key: "generatKernelGraph",
    value: function generatKernelGraph(kernels) {
      var _this = this;
      var plotting_data = [];
      var plotting_labels = [];
      kernels.forEach(function (kernel_) {
        var kernel = kernel_.self;
        if (kernel.length == 0) {
          plotting_data.push([null]);
          plotting_labels.push([null]);
          return;
        }
        var xyValues = [];
        var xValues = [];
        var yValues = [];
        for (var i = 0; i < kernel.length; i++) {
          xyValues.push({
            x: i / (kernel.length - 1),
            y: kernel[i]
          });
          xValues.push(i / (kernel.length - 1));
          yValues.push(kernel[i]);
        }
        var k = [];
        for (var i = 0; i < kernel.length; i++) {
          k.push(kernel[i] / kernel[0]);
        }
        var k_t = [];
        for (var i = 0; i < k.length; i++) {
          k_t.push([k[i]]);
        }
        ;
        var k_m = _this.multiply(k_t, [k]);
        var k_m_sum = k_m.reduce(function (a, b) {
          return a.concat(b);
        }).reduce(function (a, b) {
          return a + b;
        });
        for (var row = 0; row < k_m.length; row++) {
          for (var col = 0; col < k_m[0].length; col++) {
            k_m[row][col] = k_m[row][col] / k_m_sum;
          }
        }
        plotting_data.push(yValues);
        plotting_labels.push(xValues);
      });
      var plotData = [];
      var allTraces = document.getElementById("myDiv").data;
      var trace = allTraces.filter(function (trace) {
        return trace.visible === true;
      });
      for (var i = 0; i < plotting_data.length; i++) {
        var isTraceVisible = true;
        if (trace.length != 0) isTraceVisible = trace.some(function (trace) {
          return trace.name === _this.plotNames[i];
        });
        plotData.push({
          x: plotting_labels[i],
          y: plotting_data[i],
          name: this.plotNames[i],
          line: {
            shape: 'spline',
            color: this.plotColors[i]
          },
          type: 'scatter',
          visible: isTraceVisible ? true : "legendonly"
        });
      }
      Plotly.react('myDiv', plotData, this.plotDefaultKernelLayout, this.plotDefaultConfig);
    }
  }, {
    key: "multiply",
    value: function multiply(a, b) {
      var aNumRows = a.length,
        aNumCols = a[0].length,
        bNumRows = b.length,
        bNumCols = b[0].length,
        m = new Array(aNumRows); // initialize array of rows
      for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
          m[r][c] = 0; // initialize the current cell
          for (var i = 0; i < aNumCols; ++i) {
            m[r][c] += a[r][i] * b[i][c];
          }
        }
      }
      return m;
    }
  }, {
    key: "generatFrequencyGraph",
    value: function generatFrequencyGraph(pixels, row) {
      var _this2 = this;
      var data = pixels.data;
      var w = pixels.width;
      var red = new Array();
      var green = new Array();
      var blue = new Array();
      var alpha = new Array();
      var xValues = [];
      //Read image and make changes on the fly as it's read  
      for (var i = 0 + w * row; i < w * (row + 1); i += 1) {
        xValues.push(i - w * row);
        red[i - w * row] = data[i * 4];
        green[i - w * row] = data[i * 4 + 1];
        blue[i - w * row] = data[i * 4 + 2]; // no change, blue == 0 for black and for yellow
        alpha[i - w * row] = data[i * 4 + 3]; // Again, no change
      }

      var plotData = [];
      var plotting_data = [red, green, blue, alpha];
      var plotting_labels = [xValues, xValues, xValues, xValues];
      var allTraces = document.getElementById("myPlot2").data;
      var trace = allTraces.filter(function (trace) {
        return trace.visible === true;
      });
      for (var i = 0; i < plotting_data.length; i++) {
        var isTraceVisible = true;
        if (trace.length != 0) isTraceVisible = trace.some(function (trace) {
          return trace.name === _this2.plotNames[i];
        });
        plotData.push({
          x: plotting_labels[i],
          y: plotting_data[i],
          name: this.plotNames[i],
          line: {
            color: this.plotColors[i]
          },
          type: 'scatter',
          visible: isTraceVisible ? true : "legendonly"
        });
      }
      Plotly.react('myPlot2', plotData, this.plotDefaultFrequencyLayout, this.plotDefaultConfig);

      // Write the image back to the canvas
      for (var i = 0 + w * (row - 1); i < w * row; i += 1) {
        data[i * 4] = 0;
        data[i * 4 + 1] = 0;
        data[i * 4 + 2] = 0;
        data[i * 4 + 3] = 255;
      }
      for (var i = 0 + w * (row + 2); i < w * (row + 3); i += 1) {
        data[i * 4] = 0;
        data[i * 4 + 1] = 0;
        data[i * 4 + 2] = 0;
        data[i * 4 + 3] = 255;
      }
    }
  }]);
  return Illustrator;
}();
exports.Illustrator = Illustrator;
},{}],"js/index.js":[function(require,module,exports) {
"use strict";

var _importFile = require("./importFile.js");
var _filter = require("./filter.js");
var _illustrations = require("./illustrations.js");
// #region imports

// #endregion
// #region variables
var resetButton = document.getElementById('reset-all');
var kernelSizes = document.querySelectorAll('[id=kernal-size]');
var sigmas = document.querySelectorAll('[id=sigma]');
var sigmas2 = document.querySelectorAll('[id=sigma2]');
var timeFiltersApllied = document.querySelectorAll('[id=time-filter-applied]');
var filterTypes = document.querySelectorAll('[id=filterType]');
var imageRowSlice = document.getElementById('image-row-slice');
var blurOrSharpenCheckboxs = document.querySelectorAll('[id=blurOrSharpenCheckbox]');
var kernalSizesValues = document.querySelectorAll('[id=kernal-size-value]');
var sigmaValues = document.querySelectorAll('[id=sigma-value]');
var sigmaValues2 = document.querySelectorAll('[id=sigma-value2]');
var timeFiltersAplliedValues = document.querySelectorAll('[id=time-filter-applied-value]');
var imageRowSliceValue = document.getElementById('image-row-slice-value');
var saveButton = document.getElementById('save');
var filter = new _filter.Filter();
var illustrator = new _illustrations.Illustrator();

// #endregion

function init() {
  (0, _importFile.importFileInit)(imageRowSlice);
  resetButton.addEventListener("click", function () {
    resetAllOptions();
  });
  var _loop = function _loop(i) {
    kernelSizes[i].addEventListener('input', function () {
      kernalSizesValues[i].value = kernelSizes[i].value;
      update();
    }, false);
  };
  for (var i = 0; i < kernelSizes.length; i++) {
    _loop(i);
  }
  ;
  var _loop2 = function _loop2(_i) {
    sigmas[_i].addEventListener('input', function () {
      sigmaValues[_i].value = sigmas[_i].value;
      update();
    }, false);
  };
  for (var _i = 0; _i < sigmas.length; _i++) {
    _loop2(_i);
  }
  ;
  var _loop3 = function _loop3(_i2) {
    sigmas2[_i2].addEventListener('input', function () {
      sigmaValues2[_i2].value = sigmas2[_i2].value;
      update();
    }, false);
  };
  for (var _i2 = 0; _i2 < sigmas2.length; _i2++) {
    _loop3(_i2);
  }
  ;
  var _loop4 = function _loop4(_i3) {
    timeFiltersApllied[_i3].addEventListener('input', function () {
      timeFiltersAplliedValues[_i3].value = timeFiltersApllied[_i3].value;
      update();
    }, false);
  };
  for (var _i3 = 0; _i3 < timeFiltersApllied.length; _i3++) {
    _loop4(_i3);
  }
  ;
  for (var _i4 = 0; _i4 < filterTypes.length; _i4++) {
    filterTypes[_i4].addEventListener("change", function (event) {
      update();
    });
  }
  ;
  for (var _i5 = 0; _i5 < blurOrSharpenCheckboxs.length; _i5++) {
    blurOrSharpenCheckboxs[_i5].addEventListener("change", function (event) {
      update();
    });
  }
  ;
  imageRowSlice.addEventListener('input', function () {
    imageRowSliceValue.value = imageRowSlice.value;
    update();
  }, false);
  saveButton.addEventListener('click', function (e) {
    var canvas = document.getElementById("Mycanvas");
    var filename = window.prompt('Enter a filename', 'image.png');
    if (filename) {
      var downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', filename);
      var dataURL = canvas.toDataURL('image/png');
      downloadLink.setAttribute('href', dataURL);
      downloadLink.click();
    }
  });
  illustrator.initKernelGraph();
  illustrator.initFrequencyGraph();
}
function update() {
  createKernels();
  applyKernel();
}
function createKernels() {
  filter.kernels.forEach(function (kernel, i) {
    kernel.subtract = blurOrSharpenCheckboxs[i].checked;
    switch (filterTypes[i].value) {
      case "gauss":
        kernel.initGauss(sigmas[i].value, sigmas2[i].value, parseInt(kernelSizes[i].value));
        break;
      case "boxBlur":
        kernel.initBoxKernel(parseInt(kernelSizes[i].value));
        break;
      default:
        console.log("Invalid filter type");
        break;
    }
  });
}
function applyKernel() {
  // Get data from imported image
  var canvas = document.getElementById("Mycanvas");
  var context = canvas.getContext('2d');
  var pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  filter.applyToImage(pixels);
  illustrator.generatKernelGraph(filter.kernels);
  illustrator.generatFrequencyGraph(pixels, parseInt(imageRowSlice.value));

  // Show the processed image
  var canvas2 = document.getElementById("ProcessCanvas");
  var context = canvas2.getContext('2d');
  context.putImageData(pixels, 0, 0);
}
function resetAllOptions() {
  for (var i = 0; i < kernelSizes.length; i++) {
    kernalSizesValues[i].value = 0;
    kernelSizes[i].value = 0;
  }
  ;
  for (var _i6 = 0; _i6 < sigmas.length; _i6++) {
    sigmaValues[_i6].value = 0;
    sigmas[_i6].value = 0;
  }
  ;
  for (var _i7 = 0; _i7 < timeFiltersApllied.length; _i7++) {
    timeFiltersAplliedValues[_i7].value = 0;
    timeFiltersApllied[_i7].value = 0;
  }
  ;
  imageRowSliceValue.value = 0;
  imageRowSlice.value = 0;

  // Get data from imported image
  var canvas = document.getElementById("Mycanvas");
  var context = canvas.getContext('2d');
  var pixels = context.getImageData(0, 0, canvas.width, canvas.height);

  // Show the processed image
  var canvas2 = document.getElementById("ProcessCanvas");
  var context = canvas2.getContext('2d');
  context.putImageData(pixels, 0, 0);
}
init();
},{"./importFile.js":"js/importFile.js","./filter.js":"js/filter.js","./illustrations.js":"js/illustrations.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "36029" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map