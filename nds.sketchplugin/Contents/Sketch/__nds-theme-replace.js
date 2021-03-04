var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

var exports =
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/nds-theme-replace.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/context.js":
/*!****************************!*\
  !*** ./src/lib/context.js ***!
  \****************************/
/*! exports provided: VariableSizeContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VariableSizeContext", function() { return VariableSizeContext; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VariableSizeContext = /*#__PURE__*/function () {
  function VariableSizeContext(str) {
    _classCallCheck(this, VariableSizeContext);

    this._arr = this._arrayFromString(str);
  }

  _createClass(VariableSizeContext, [{
    key: "_arrayFromString",
    value: function _arrayFromString(str) {
      return str.split("/").map(function (entry) {
        if (entry.charAt(0) == "_") return entry.substr(1);
        return entry;
      });
    }
  }, {
    key: "toString",
    value: function toString() {
      return this._arr.join("/");
    }
  }, {
    key: "append",
    value: function append(str) {
      return new VariableSizeContext(this.toString() + "/" + str);
    }
  }, {
    key: "appendLast",
    value: function appendLast(str) {
      var arr = this._arrayFromString(str);

      return this.append(arr[arr.length - 1]);
    }
  }]);

  return VariableSizeContext;
}();

/***/ }),

/***/ "./src/lib/identifier.js":
/*!*******************************!*\
  !*** ./src/lib/identifier.js ***!
  \*******************************/
/*! exports provided: getIdentifiersIn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIdentifiersIn", function() { return getIdentifiersIn; });
/* harmony import */ var _nested__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nested */ "./src/lib/nested.js");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context */ "./src/lib/context.js");
/* harmony import */ var _library__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./library */ "./src/lib/library.js");



var getIdentifiersIn = function getIdentifiersIn(layer, lookup) {
  var res = [];
  layer.forEach(function (sublayer) {
    var context = getContextFromName(null, sublayer); // Get Artboard Section name only

    context._arr = context._arr.map(function (e) {
      return e.split(" - ")[0];
    });
    var nested = getNestedContexts(sublayer, context, lookup);
    res = res.concat(nested);
  });
  return res;
};

var getNestedContexts = function getNestedContexts(layer, context, lookup) {
  var res = [];
  if (layer.layers == undefined) return;
  layer.layers.forEach(function (sublayer) {
    var newContext = getContextFromName(context, sublayer);

    if (sublayer.type == "Group") {
      // If it's a group, re-run with the new context
      // Ignore the Group name from the context
      // eg. 'artboard-name/Group' > 'artboard-name'
      newContext._arr.pop();

      var nested = getNestedContexts(sublayer, newContext, lookup);
      res = res.concat(nested);
    } else if (sublayer.type == "SymbolInstance" && sublayer.hidden == false && sublayer.locked == false) {
      // If it's a Symbol, igonre hidden or locked layers
      if (sublayer.overrides.length > 0) {
        // If the Symbol has Overrides
        // Check to see if this is a component or not.
        // If it is not a compoennt, we need to match this as well.
        // Then we need to get it's overrides
        var symbolName = "".concat(sublayer.name);

        if (symbolName.charAt(0) == "_") {
          // If it's a component
          // If it's a component, we need to see if we
          // can get a match from the components library
          // Probably not going to happen, ever
          var _nested = getContextsFromOverrides(sublayer.overrides, newContext, lookup);

          res = res.concat(_nested);
        } else {
          // If it isn't a Component
          // Context of the layer
          // Since we're on an Artboard, and not inside a symbol, the context must be the artboard name.
          // eg. `artboard-name/symbol-name/layer-name` > 'artboard-name'
          newContext._arr.splice(1); // Get Token name
          // Get the actual shared style name
          // eg. 'symbol-name/token-name' > 'token-name'


          var thisToken;

          if (lookup[sublayer.symbolId] == undefined) {
            // If symbol is not found in any Library
            // Go look for a reference in the current document
            thisToken = Object(_library__WEBPACK_IMPORTED_MODULE_2__["getSymbolFromDocument"])(sublayer.symbolId);
          } else {
            thisToken = lookup[sublayer.symbolId].name.split('/').slice(-1);
          } // Create the new Token


          newContext._arr.push(thisToken);

          res.push({
            context: newContext,
            layer: sublayer
          }); // Now, go get the Overrides

          var _nested2 = getContextsFromOverrides(sublayer.overrides, newContext, lookup);

          res = res.concat(_nested2);
        }
      } else {
        // If the Symbol does NOT have Overrides
        // Context of the layer
        // Since we're on an Artboard, and not inside a symbol, the context must be the artboard name.
        // eg. `artboard-name/symbol-name/layer-name` > 'artboard-name'
        newContext._arr.splice(1); // Get Token name
        // Get the actual shared style name
        // eg. 'symbol-name/token-name' > 'token-name'


        var _thisToken;

        if (lookup[sublayer.symbolId] == undefined) {
          // If symbol is not found in any Library
          // Go look for a reference in the current document
          _thisToken = Object(_library__WEBPACK_IMPORTED_MODULE_2__["getSymbolFromDocument"])(sublayer.symbolId);
        } else {
          _thisToken = lookup[sublayer.symbolId].name.split('/').slice(-1);
        } // Create the new Token


        newContext._arr.push(_thisToken);

        res.push({
          context: newContext,
          layer: sublayer
        });
      }
    } else if ((sublayer.type == 'Text' || sublayer.type == 'ShapePath') && sublayer.hidden == false && sublayer.locked == false) {
      // If it's a Layer or Text style, igonre hidden or locked layers
      // console.log(sublayer)
      // only add layers that have shared styles
      if (sublayer.sharedStyle != null) {
        // Context of the layer
        // Remove the layer name because we only need the context.
        // eg. `artboard-name/symbol-name/layer-name` > 'artboard-name/symbol-name'
        newContext._arr.pop(); // Get Token name
        // Get the actual shared style name
        // eg. 'artboard-name/symbol-name/token-name' > 'token-name'


        var _thisToken2;

        _thisToken2 = sublayer.sharedStyle.name.split('/').slice(-1); // Create the new Token

        newContext._arr.push(_thisToken2);

        res.push({
          context: newContext,
          layer: sublayer
        });
      }
    }
  });
  return res;
};

var getContextsFromOverrides = function getContextsFromOverrides(overrides, context, lookup) {
  var baseContext = context;
  var nestedContexts = [];
  var res = [];
  overrides.forEach(function (override) {
    var id = override.value;
    var sharedSymbol = lookup[id];

    if (override.property == "symbolID" && id != '') {
      nestedContexts = Object(_nested__WEBPACK_IMPORTED_MODULE_0__["updateNestedContextsFromOverride"])(nestedContexts, override, lookup);

      if (override.affectedLayer && override.affectedLayer.master) {
        var symbolName = "".concat(override.affectedLayer.master.name); // Only operate if it's not got an '_' at the start
        // note: anything with an '_' is considered a component

        if (symbolName.charAt(0) != "_") {
          var symbolContext = Object(_nested__WEBPACK_IMPORTED_MODULE_0__["contextFromNestedContexts"])(baseContext, nestedContexts);
          var result = {
            context: symbolContext,
            layer: override
          };
          res.push(result);
        }
      }
    } else if (override.property == "textStyle" || override.property == "layerStyle") {
      nestedContexts = Object(_nested__WEBPACK_IMPORTED_MODULE_0__["updateNestedContextsFromOverride"])(nestedContexts, override, lookup);

      if (override.affectedLayer && override.affectedLayer.name) {
        var styleName = "".concat(override.affectedLayer.name);
        var styleContext = Object(_nested__WEBPACK_IMPORTED_MODULE_0__["contextFromNestedContexts"])(baseContext, nestedContexts).appendLast(styleName);
        var _result = {
          context: styleContext,
          layer: override
        };
        res.push(_result);
      }
    }
  });
  return res;
};

var getContextFromName = function getContextFromName(existing, layer) {
  var name = layer.name;
  if (layer.master) name = layer.master.name;

  if (existing == null) {
    return new _context__WEBPACK_IMPORTED_MODULE_1__["VariableSizeContext"](name);
  }

  return existing.append(name);
};

/***/ }),

/***/ "./src/lib/identifierMatcher.js":
/*!**************************************!*\
  !*** ./src/lib/identifierMatcher.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//lhs => specific
//rhs => general
var matchScore = function matchScore(lhs, rhs) {
  var _getPathAndToken = getPathAndToken(lhs),
      _getPathAndToken2 = _slicedToArray(_getPathAndToken, 2),
      lhsPath = _getPathAndToken2[0],
      lhsToken = _getPathAndToken2[1];

  var _getPathAndToken3 = getPathAndToken(rhs),
      _getPathAndToken4 = _slicedToArray(_getPathAndToken3, 2),
      rhsPath = _getPathAndToken4[0],
      rhsToken = _getPathAndToken4[1];

  if (lhsToken !== rhsToken) {
    return 0;
  }

  if (rhsPath.length === 0) {
    return 1;
  }

  if (lhsPath.length === 0) {
    return 0;
  }

  if (lhs === rhs) {
    return Number.MAX_SAFE_INTEGER;
  }

  var rhsIterator = rhsPath[Symbol.iterator]();
  var rhsComponent = rhsIterator.next().value;
  var score = 0; // The score value of the current component - this goes down each time i.e. starts at the maximum and works its way down

  var nextScore = 1 << lhsPath.length * 2;

  var _iterator = _createForOfIteratorHelper(lhsPath),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var lhsComponent = _step.value;

      // If the lhs doesn't match the rhs component, move on to the next one
      if (getComponentWithoutVariant(lhsComponent) !== getComponentWithoutVariant(rhsComponent)) {
        nextScore /= 4;
        continue;
      }

      score += nextScore / 2; // Check for variants

      var lhsVariant = getVariant(lhsComponent);
      var rhsVariant = getVariant(rhsComponent);

      if (lhsVariant == null && rhsVariant == null) {// Do nothing variants not present
      } else if (lhsVariant != null && rhsVariant == null) {// To nothing, specific has variant, general doesn't care
      } else if (lhsVariant != null && rhsVariant != null && lhsVariant === rhsVariant) {
        score += nextScore;
      } else {
        // If there are variants which don't match, this is a hard fail
        return 0;
      } // Move on to the next rhs component - and if we are at the end, we have matched and just return the score


      rhsComponent = rhsIterator.next().value;

      if (rhsComponent == null) {
        return score;
      } // Each component in the lhs which matches is more important than the last one.
      // Increase it's score to take that into account


      nextScore /= 4;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return 0;
};

var getPathAndToken = function getPathAndToken(from) {
  var elements = from.split("/");
  var token = elements.pop();
  return [elements.reverse(), token];
};

var getVariant = function getVariant(component) {
  var matches = component.match(/\[.+\]/g);

  if (matches && matches.length) {
    return matches[0];
  }

  return null;
};

var getComponentWithoutVariant = function getComponentWithoutVariant(component) {
  if (component.includes("[")) {
    return component.split("[")[0];
  }

  return component;
};

module.exports = {
  matchScore: matchScore
};

/***/ }),

/***/ "./src/lib/layers.js":
/*!***************************!*\
  !*** ./src/lib/layers.js ***!
  \***************************/
/*! exports provided: getSelectedLayers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectedLayers", function() { return getSelectedLayers; });
var getSelectedLayers = function getSelectedLayers(document) {
  var selectedLayers;

  if (document.selectedLayers && document.selectedLayers.length !== 0 && selectedLayersAreArtboard(document.selectedLayers)) {
    selectedLayers = document.selectedLayers;
  } else {
    selectedLayers = document.selectedPage;
  }

  return selectedLayers;
};

var selectedLayersAreArtboard = function selectedLayersAreArtboard(selectedLayers) {
  if (selectedLayers.layers.length > 0 && selectedLayers.layers[0].layers != undefined) {
    return true;
  }

  return false;
};

/***/ }),

/***/ "./src/lib/library.js":
/*!****************************!*\
  !*** ./src/lib/library.js ***!
  \****************************/
/*! exports provided: getAllLibraries, getLibraryByName, getSymbolFromDocument, swapTokens, findTokenMatch, resizeTokens, createTextLayerSymbolLookup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllLibraries", function() { return getAllLibraries; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLibraryByName", function() { return getLibraryByName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSymbolFromDocument", function() { return getSymbolFromDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "swapTokens", function() { return swapTokens; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findTokenMatch", function() { return findTokenMatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resizeTokens", function() { return resizeTokens; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTextLayerSymbolLookup", function() { return createTextLayerSymbolLookup; });
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _identifierMatcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./identifierMatcher */ "./src/lib/identifierMatcher.js");
/* harmony import */ var _identifierMatcher__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_identifierMatcher__WEBPACK_IMPORTED_MODULE_1__);


var getAllLibraries = function getAllLibraries() {
  //  array that will be populated with available libaries to import
  var options = []; // Check to see if Library is enabled

  var libraries = sketch__WEBPACK_IMPORTED_MODULE_0__["Library"].getLibraries();
  libraries.forEach(function (lib) {
    // @TODO filter out inactive libraries
    options.push(lib.name);
  });
  return options;
};
var getLibraryByName = function getLibraryByName(name) {
  var selectedLibrary = null;
  var libraries = sketch__WEBPACK_IMPORTED_MODULE_0__["Library"].getLibraries();
  libraries.forEach(function (lib) {
    if (lib.name.includes(name)) {
      selectedLibrary = lib;
    }
  });
  return selectedLibrary;
};
var getSymbolFromDocument = function getSymbolFromDocument(id) {
  var thisDocument = sketch__WEBPACK_IMPORTED_MODULE_0__["Document"].getSelectedDocument();
  var getSymbols = thisDocument.getSymbols();
  var thisSymbol = getSymbols.find(function (el) {
    return el.symbolId == id;
  });
  var thisToken;

  if (thisSymbol.name.charAt(0) == "_") {
    thisToken = thisSymbol.name.substring(1).split('/').slice(-1);
  } else {
    thisToken = thisSymbol.name.split('/').slice(-1);
  }

  return thisToken;
};
var swapTokens = function swapTokens(token, newToken) {
  var imported = newToken["import"]();

  if (token.layer.type == "Override" && token.layer.property == "layerStyle") {
    token.layer.value = imported.id;
  }

  if (token.layer.type == "Override" && token.layer.property == "textStyle") {
    token.layer.value = imported.id;
  }

  if (token.layer.type == "Override" && token.layer.property == "symbolID") {
    token.layer.value = imported.symbolId;
  }

  if (token.layer.type == "ShapePath") {
    token.layer.sharedStyleId = imported.id;
    token.layer.name = imported.name;
    token.layer.style.syncWithSharedStyle(imported);
  }

  if (token.layer.type == "Text") {
    token.layer.sharedStyleId = imported.id;
    token.layer.name = imported.name;
    token.layer.style.syncWithSharedStyle(imported);
  }

  if (token.layer.type == "SymbolInstance") {
    token.layer.symbolId = imported.symbolId;
    token.layer.name = imported.name;
    token.layer.resizeWithSmartLayout();
  }
};
var findTokenMatch = function findTokenMatch(token, lookupAgainst) {
  var styleValue;
  var currentScore = 0;
  var newToken = {};

  for (var styleName in lookupAgainst) {
    styleValue = lookupAgainst[styleName];
    var getScore = Object(_identifierMatcher__WEBPACK_IMPORTED_MODULE_1__["matchScore"])(token.context.toString(), styleValue.name);

    if (getScore > currentScore) {
      // Only look for the highest scoring result
      currentScore = getScore;
      newToken = styleValue;
    }
  }

  return newToken;
};
var resizeTokens = function resizeTokens(token) {
  console.log("Resize: ".concat(token.layer.name));

  if (token.layer.type == "SymbolInstance") {
    token.resizeWithSmartLayout();
  }
}; // an method that gets all the references (symbols, text styles, layer styles)
// from every library and put them in one object.

var createTextLayerSymbolLookup = function createTextLayerSymbolLookup(libraries, document) {
  var lookup = {};
  libraries.forEach(function (library) {
    var textStyles = library.getImportableTextStyleReferencesForDocument(document);
    textStyles.forEach(function (text) {
      lookup[text.id] = text;
    });
    var layerStyles = library.getImportableLayerStyleReferencesForDocument(document);
    layerStyles.forEach(function (layer) {
      lookup[layer.id] = layer;
    });
    var symbols = library.getImportableSymbolReferencesForDocument(document);
    symbols.forEach(function (symbol) {
      lookup[symbol.id] = symbol;
    });
  });
  return lookup;
};

/***/ }),

/***/ "./src/lib/nested.js":
/*!***************************!*\
  !*** ./src/lib/nested.js ***!
  \***************************/
/*! exports provided: NestedContext, manageNesting, updateNestedContextsFromOverride, contextFromNestedContexts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NestedContext", function() { return NestedContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "manageNesting", function() { return manageNesting; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateNestedContextsFromOverride", function() { return updateNestedContextsFromOverride; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "contextFromNestedContexts", function() { return contextFromNestedContexts; });
/* harmony import */ var _library__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./library */ "./src/lib/library.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

 // export is only for jest
// @TODO switch to use rewire to expose this

var NestedContext = function NestedContext(level, info) {
  _classCallCheck(this, NestedContext);

  this.level = level;
  this.info = info;
}; // export is only for jest
// @TODO switch to use rewire to expose this

var manageNesting = function manageNesting(arr, nestedcontext) {
  // if the level is higher then add it
  // if the level is the same as an existing then replace
  // if the level is lower then remove until the arr
  // AKA remove any that are below or on same level
  var target = nestedcontext.level;

  for (var i = arr.length - 1; i >= 0; i--) {
    var item = arr[i];

    if (item.level >= target) {
      arr.splice(i, 1);
    }
  }

  arr.push(nestedcontext);
  return arr;
};
var updateNestedContextsFromOverride = function updateNestedContextsFromOverride(nestedContexts, override, lookup) {
  var levels = override.path.split("/").length;
  var contextName = '';

  if (override.affectedLayer && override.affectedLayer.master) {
    // 1. We lookup the current value of the Override
    // 2. If there is a value, we need to find it's name
    // 3. We do a 'Split' because we only need the token name
    // console.log(lookup[override.value])
    if (lookup[override.value] != undefined) {
      contextName = lookup[override.value].name.split('/').slice(-1);
    } else {
      // console.log('[Style Not found]')
      // If symbol is not found in any Library
      // Go look for a reference in the current document
      if (override.value == '') {
        contextName = Object(_library__WEBPACK_IMPORTED_MODULE_0__["getSymbolFromDocument"])(override.affectedLayer.symbolId);
      } else {
        contextName = Object(_library__WEBPACK_IMPORTED_MODULE_0__["getSymbolFromDocument"])(override.value);
      }
    }
  } // const context = new Context(contextName)
  // if (context.type == ContextType.INVALID) return nestedContexts


  var ncontext = new NestedContext(levels, contextName);
  return manageNesting(nestedContexts, ncontext);
};
var contextFromNestedContexts = function contextFromNestedContexts(baseContext, nestedContexts) {
  var context = baseContext;
  nestedContexts.forEach(function (nc) {
    if (nc.info != "") context = context.append(nc.info);
  });
  return context;
};

/***/ }),

/***/ "./src/nds-theme-replace.js":
/*!**********************************!*\
  !*** ./src/nds-theme-replace.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return onRun; });
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_library__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/library */ "./src/lib/library.js");
/* harmony import */ var _lib_identifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/identifier */ "./src/lib/identifier.js");
/* harmony import */ var _lib_layers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/layers */ "./src/lib/layers.js");




function onRun() {
  console.log("------------------------------");
  console.log("[Initialise Plugin]");

  try {
    showSelectLibrary();
  } catch (e) {
    if (e instanceof ReferenceError) {
      console.log("exception thrown: ".concat(e.message, " in ").concat(e.fileName, " on ").concat(e.lineNumber));
      console.log(e.stack.split("\n")); // formats it better as an array :-/
    } else {
      console.log("exception thrown: ".concat(e));
    }
  }
}

var showSelectLibrary = function showSelectLibrary() {
  console.log("[Get Enabled Libraries]");
  var libs = sketch__WEBPACK_IMPORTED_MODULE_0__["Library"].getLibraries();
  var libNames = [];
  libs.forEach(function (lib) {
    if (lib.enabled) {
      libNames.push({
        name: lib.name,
        id: lib.id,
        type: lib.libraryType,
        lastModified: lib.lastModifiedAt
      });
    }
  });
  console.log("[Show Select Library Window]"); // If we use a custom UI, we can remove the trailing characters from the ID.

  sketch__WEBPACK_IMPORTED_MODULE_0__["UI"].getInputFromUser("NDS Theme Replacer", {
    description: "Swap out the current theme for a new one.",
    type: sketch__WEBPACK_IMPORTED_MODULE_0__["UI"].INPUT_TYPE.selection,
    possibleValues: libNames.map(function (el) {
      return el.name + " (" + el.id.slice(-6) + ")";
    })
  }, function (err, value) {
    if (err) {
      console.log("[Canceled]");
      return;
    } else {
      var found = libNames.find(function (el) {
        return el.name + " (" + el.id.slice(-6) + ")" == value;
      });
      console.log("[Selected Library] - \"".concat(found.name, " (").concat(found.id.slice(-6), ")\""));
      getIdentifiers(found.id, found.name);
    }
  });
};

var getIdentifiers = function getIdentifiers(libraryLookupId, libraryName) {
  var document = sketch__WEBPACK_IMPORTED_MODULE_0__["Document"].getSelectedDocument();
  var targetLayer = Object(_lib_layers__WEBPACK_IMPORTED_MODULE_3__["getSelectedLayers"])(document);
  var getArtboards = targetLayer.layers.filter(function (tgt) {
    return tgt.type == "Artboard";
  });
  var lookup = Object(_lib_library__WEBPACK_IMPORTED_MODULE_1__["createTextLayerSymbolLookup"])(sketch__WEBPACK_IMPORTED_MODULE_0__["Library"].getLibraries(), document); // Create Lookup for all Libraries

  var lookupAgainst = Object(_lib_library__WEBPACK_IMPORTED_MODULE_1__["createTextLayerSymbolLookup"])(sketch__WEBPACK_IMPORTED_MODULE_0__["Library"].getLibraries().filter(function (library) {
    return library.id == libraryLookupId;
  }), document); // Create Lookup for the Selected Library

  var tokenCount = 0; // Reset Token count

  var tokenMissingCount = 0; // Reset Missing Token count

  var tokenMissingNames = [];
  console.log("[Get Identifiers]");
  var tokens = Object(_lib_identifier__WEBPACK_IMPORTED_MODULE_2__["getIdentifiersIn"])(getArtboards, lookup);
  console.log("[Items to replace]");
  var symbolTokens = tokens.filter(function (tk) {
    return tk.layer.type == "SymbolInstance" || tk.layer.type == "Override" && tk.layer.property == "symbolID";
  });
  var styleTokens = tokens.filter(function (tk) {
    return tk.layer.type == "ShapePath" || tk.layer.type == "Text" || tk.layer.type == "Override" && tk.layer.property == "layerStyle" || tk.layer.type == "Override" && tk.layer.property == "textStyle";
  });
  styleTokens.forEach(function (token) {
    var newToken;
    newToken = Object(_lib_library__WEBPACK_IMPORTED_MODULE_1__["findTokenMatch"])(token, lookupAgainst); //
    // Token we want to replace

    if (token.layer.type == "Override") {
      console.log('\x1b[37m', "  [".concat(token.layer.type, ": ").concat(token.layer.affectedLayer.type, "] [").concat(token.context.toString(), "]")); // token [object Object]
    } else {
      console.log('\x1b[37m', "  [".concat(token.layer.type, "] [").concat(token.context.toString(), "]")); // token [object Object]
    } // Token we found that matches


    if (newToken.name != undefined) {
      console.log('\x1b[37m', "   \u221F [".concat(newToken.name, "]")); // newToken [object Object]

      Object(_lib_library__WEBPACK_IMPORTED_MODULE_1__["swapTokens"])(token, newToken);
      tokenCount++;
    } else {
      console.log('\x1b[31m', "   \u221F [Not Match Found!]");
      tokenMissingCount++;
      tokenMissingNames.push(token.context.toString()); // console.log(`   ∟ ${token.context.toString()}`)
    }
  });
  symbolTokens.forEach(function (token) {
    var newToken;
    newToken = Object(_lib_library__WEBPACK_IMPORTED_MODULE_1__["findTokenMatch"])(token, lookupAgainst); //
    // Token we want to replace

    if (token.layer.type == "Override") {
      console.log('\x1b[37m', "  [".concat(token.layer.type, ": ").concat(token.layer.affectedLayer.type, "] [").concat(token.context.toString(), "]")); // token [object Object]
    } else {
      console.log('\x1b[37m', "  [".concat(token.layer.type, "] [").concat(token.context.toString(), "]")); // token [object Object]
    } // Token we found that matches


    if (newToken.name != undefined) {
      console.log('\x1b[37m', "   \u221F [".concat(newToken.name, "]")); // newToken [object Object]

      Object(_lib_library__WEBPACK_IMPORTED_MODULE_1__["swapTokens"])(token, newToken);
      tokenCount++;
    } else {
      console.log('\x1b[31m', "   \u221F [Not Match Found!]");
      tokenMissingCount++;
      tokenMissingNames.push(token.context.toString()); // console.log(`   ∟ ${token.context.toString()}`)
    }
  }); //
  // Sketch UI Message

  var notFound = '';

  if (tokenCount > 0) {
    if (tokenMissingCount == 1) {
      notFound = " \uD83D\uDEA8 ".concat(tokenMissingCount, " Token match not found!");
    } else if (tokenMissingCount > 1) {
      notFound = " \uD83D\uDEA8 ".concat(tokenMissingCount, " Token matches not found!");
    }

    sketch__WEBPACK_IMPORTED_MODULE_0__["UI"].message("\u2705 Found ".concat(tokenCount, " Tokens to swap from \"").concat(libraryName, "\"!").concat(notFound));
    console.log('\x1b[37m', "\n", "\u2705 Found ".concat(tokenCount, " Tokens to swap from \"").concat(libraryName, "\"!").concat(notFound));
  } else {
    sketch__WEBPACK_IMPORTED_MODULE_0__["UI"].message("\uD83D\uDE31 No Tokens found in \"".concat(libraryName, "\"!"));
    console.log('\x1b[37m', "\n", "\uD83D\uDE31 No Tokens found in \"".concat(libraryName, "\"!"));
  } // if (tokenMissingNames.length > 0) {
  //   UI.alert('Done, but!', `I did not find these tokens: /n ${tokenMissingNames}`)
  // }
  // TODO:
  // Consider adding extensive error message
  // eg. If 'notFound', which Tokens where not found?

};

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ })

/******/ });
    if (key === 'default' && typeof exports === 'function') {
      exports(context);
    } else if (typeof exports[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
    } else {
      exports[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default');
globalThis['onShutdown'] = __skpm_run.bind(this, 'onShutdown')

//# sourceMappingURL=__nds-theme-replace.js.map