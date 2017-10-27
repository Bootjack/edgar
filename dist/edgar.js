/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testEdges = testEdges;
function pixelColor(pixel) {
  return {
    red: pixel & 255,
    green: pixel >> 8 & 255,
    blue: pixel >> 16 & 255,
    alpha: pixel >> 24 & 255
  };
}

function walkHorizontallyFn(start, imgData) {
  return function (index) {
    var end = start + imgData.width;
    var nextIndex = (index || start) + 1;
    return nextIndex < end && nextIndex;
  };
}

function walkVerticallyFn(start, imgData) {
  return function (index) {
    var end = start + imgData.height * imgData.width;
    var nextIndex = (index || start) + imgData.width;
    return nextIndex < end && nextIndex;
  };
}

function isEdgeClippedFn(data) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function (getNextIndex) {
    var pixel = void 0;
    var index = getNextIndex();
    var alphaThreshold = options.alphaThreshold || 0;
    while (false !== index) {
      pixel = pixelColor(data[index]);
      if (pixel.alpha > alphaThreshold) {
        return pixel;
      }
      index = getNextIndex(index);
    }
    return false;
  };
}

function populateEdges() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (img) {
    var canvas = document.createElement('canvas');
    canvas.height = options.height || image.height;
    canvas.width = options.width || image.width;

    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    var imgData8Bit = context.getImageData(0, 0, canvas.width, canvas.height);
    var imgData = {
      data: new Uint32Array(imgData8Bit.data.buffer),
      height: imgData8Bit.height,
      width: imgData8Bit.width
    };

    var bottomLeft = (canvas.height - 1) * canvas.width;
    var topRight = canvas.width - 1;

    var isEdgeClipped = isEdgeClippedFn(imgData.data, options);

    return {
      top: isEdgeClipped(walkHorizontallyFn(0, imgData)),
      bottom: isEdgeClipped(walkHorizontallyFn(bottomLeft, imgData)),
      left: isEdgeClipped(walkVerticallyFn(0, imgData)),
      right: isEdgeClipped(walkVerticallyFn(topRight, imgData))
    };
  };
}

function testEdges(src, options) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.addEventListener('load', function (evt) {
      return resolve(populateEdges(options)(img));
    });
    img.addEventListener('error', function (evt) {
      return reject(img);
    });
    img.src = src;
  });
}

/***/ })
/******/ ]);