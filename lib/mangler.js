var fs = require('fs');
path = require('path');

var contexts = {
  main: createContext(),
  modules: createContext(),
  modfiles: createContext(),
  plugins: createContext()
}
var mapFile = null;

function createContext() {
  return {
    mangles: {},
    reverse_mangles: {},
    mangle_id: 0
  }
}

var base54 = (function(){
        var DIGITS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
        return function(num) {
                var ret = "", base = 54;
                do {
                        ret += DIGITS.charAt(num % base);
                        num = Math.floor(num / base);
                        base = 64;
                } while (num > 0);
                return ret;
        };
})();


function isReservedJSName_(name) {
  return /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/.test(name)
}

function isReservedName_(name) {
  methods = [
    // just for GOOG files
    'toUpperCase',
    'unshift',
    'test',
    'userAgent',
    'navigator',
    'documentMode',
    'push',
    'width',
    'height',
    'cssText',
    'htmlFor',
    'style',
    'clientLeft',
    'clientTop',
    'round',
    'createElement',
    'concat',
    'document',
    'toLowerCase',
    'defaultView',
    'getComputedStyle',
    'getPropertyValue',
    'currentStyle',
    'getBoundingClientRect',
    'ownerDocument',
    'documentElement',
    'clientTop',
    'body',
    'scrollHeight',
    'clientWidth',
    'clientHeight',
    'scrollWidth',
    'offsetParent',
    'compareDocumentPosition',
    'querySelector',
    'querySelectorAll',
    'floor',
    'random',
    'bind',
    'product',
    'handleEvent',
    'setTimeout',
    'getBoxObjectFor',
    'screenX',
    'screenY',
    'compatMode',
    'pageXOffset',
    'scrollLeft',
    'pageYOffset',
    'scrollTop',
    'offsetLeft',
    'offsetTop',
    'parentWindow',
    'tagName',
    'top',
    'left',
    'bottom',
    'right',
    'display',
    'visibility',
    'position',
    'createStyleSheet',
    'cssText',
    'innerHTML',
    'slice',
    'join',
    'substr',
    'toUpperCase',
    'lastIndexOf',
    'product',
    'opera',
    'exec',
    'querySelector',
    'querySelectorAll',
    'toUpperCase',
    'getElementsByClassName',
    'nodeName',
    'getElementsByTagName',
    'className',


    'parse',
    'stringify',
    'propertyIsEnumerable',
    'Object',
    'prototype',
    'toString',
    'call',
    'length',
    'indexOf',
    'replace',
    'max',
    'exec',
    'forEach',
    'filter',
    'navigator',
    'userAgent',
    'product',
    'version',
    'opera',
    'documentMode',
    'document',
    'className',
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf',
    'style',
    'cssText',
    'setAttribute',
    'lastIndexOf',
    'setAttribute',
    'htmlFor',
    'cellpadding',
    'cellspacing',
    'colspan',
    'rowspan',
    'valign',
    'height',
    'width',
    'usemap',
    'frameborder',
    'maxlength',
    'type',
    'appendChild',
    'createTextNode',
    'nodeType',
    'item',
    'previousElementSibling',
    'previousSibling',
    'parentNode',
    'insertBefore',
    'nextSibling',
    'appendChild',
    'name',
    'type',
    'push',
    'createElement',
    'apply',
    'concat',
    'contains',
    'compareDocumentPosition',
    'compareDocumentPosition',
    'childNodes',
    'removeChild',
    'children',
    'childNodes',
    'textContent',
    'outerHTML',
    'appendChild',
    'getAttribute',
    'dataset',
    'attributes',
    'name',
    'nodeName',
    'nodeValue',
    'match',
    'eval',



    // base
    'constructor',
    'toString',
    'valueOf',

    // Object
    'create',
    'defineProperties',
    'defineProperty',
    'freeze',
    'getOwnPropertyDescriptor',
    'getOwnPropertyNames',
    'getOwnPropertyOf',
    'isExentisible',
    'isFrozen',
    'isSealed',
    'keys',
    // 'name', TO REMOVE?!
    'preventExtensions',
    'prototype',
    'seal',
    'apply',
    'call',
    'bind',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    '__defineGetter__',
    '__lookupGetter__',
    '__defineSetter__',
    '__lokupSetter__',

    // Array
    'indexOf',
    'join',
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift',

    // String
    'charAt',
    'charCodeAt',
    'fromCharCode',
    'indexOf',
    'lastIndexOf',
    'match',
    'replace',
    'search',
    'split',
    'substr',
    'substring',
    'toLowerCase',
    'toUpperCase',
    'encodeURI',
    'unescape',
    'GetVariable',
    'enabledPlugin',
    'encodeURIComponent',
    'description',

    // Array, String
    'length',
    'slice',
    'concat',

    // Date
    'getDate',
    'getDay',
    'getFullYear',
    'getHours',
    'getMilliseconds',
    'getMinutes',
    'getMonth',
    'getSeconds',
    'getTime',
    'getTimezoneOffset',
    'getUTCDate',
    'getUTCDay',
    'getUTCFullYear',
    'getUTCHours',
    'getUTCMilliseconds',
    'getUTCMinutes',
    'getUTCMonth',
    'getUTCSeconds',
    'getYear',
    'parse',
    'setDate',
    'setFullYear',
    'setHours',
    'setMilliseconds',
    'setMinutes',
    'setMonth',
    'setSeconds',
    'setTime',
    'setUTCDate',
    'setUTCFullYear',
    'setUTCHours',
    'setUTCMilliseconds',
    'setUTCMinutes',
    'setUTCMonth',
    'setUTCSeconds',
    'setYear',
    'toDateString',
    'toGMTString',
    'toLocaleDateString',
    'toLocaleTimeString',
    'toLocaleString',
    'toString',
    'toTimeString',
    'toUTCString',
    'UTC',

    // Math
    'abs',
    'acos',
    'asin',
    'atan',
    'atan2',
    'ceil',
    'cos',
    'exp',
    'floor',
    'log',
    'max',
    'min',
    'pow',
    'random',
    'round',
    'sin',
    'sqrt',
    'tan',
    'E',
    'LN2',
    'LN10',
    'LOG2E',
    'LOG10E',
    'PI',
    'SQRT1_2',
    'SQRT',

    // Number
    'toExponential',
    'toFixed',
    'toPrecision',
    'MAX_VALUE',
    'MIN_VALUE',
    'NEGATIVE_INFINITY',
    'POSITIVE_INFINIT',

    // RegExp
    'global',
    'ignoreCase',
    'lastIndex',
    'multiline',
    'source',
    'RegExp',
    'compile',
    'exec',
    'test',

    // Console
    'log',
    'warn',
    'error',

    // Other
    'insertBefore',
    'appendChild',
    'firstChild',
    'type',
    'getAttribute',
    'setTimeout',
    'setInterval',
    'clearTimeout',
    'clearInterval',
    'alert'
  ];
  return (new RegExp('^(' + methods.join('|') + ')$')).test(name);
}

module.exports = {
  isReservedName: isReservedName_,
  setDictionary: function(dictionaryPath) {
    if (dictionaryPath && fs.existsSync(dictionaryPath)) {
      try {
        string = fs.readFileSync(dictionaryPath).toString();
        // remove comments
        string = string.replace(/\/\/([^\n]*)\n/g, '');
        dictionary = JSON.parse(string);

        // run sanity check: no two key with same value
        var assignedKey, key, value, values;
        values = {};
        for (key in dictionary) {
          if (isReservedJSName_(key) || isReservedName_(key)) {
            throw "ERROR: Sanity check FAILED, '" + value + "' can't be assigned to '" + key + "' because it's a reserved name";
          }
          value = dictionary[key];
          if (assignedKey = values[value]) {
            throw "ERROR: Sanity check FAILED, '" + value + "' has been assigned to both " + assignedKey + " and " + key + ".";
          }
          else {
            values[value] = key;
          }
        }


        contexts.main = createContext();
        for (var key in dictionary) {
          if (dictionary.hasOwnProperty(key)) {
             value = dictionary[key];
             contexts.main.mangles[key] = value;
             contexts.main.reverse_mangles[value] = key;
          }
        }
        return contexts.main;
      } catch (error) {
        // console.log(e)
        throw error;
      }
    }
  },


  // unused?
  setMap: function(map) {
    if (map === undefined) {
      map = {};
    }
    for (var scope in contexts) {
      if (contexts.hasOwnProperty(scope)) {
        if (map[scope] != undefined) {
          contexts[scope] = map[scope];
        }
      }
    }
  },

  setMapFile: function(file) {
    // console.log("MAP FILE", this.setMap)
    mapFile = file;
    if (path.existsSync(file)) {
      try {
        data = fs.readFileSync(file, "utf8")
        json = JSON.parse(data)
        for (var scope in contexts) {
          if (contexts.hasOwnProperty(scope)) {
            if (json[scope] != undefined) {
              contexts[scope] = json[scope];
            }
          }
        }
      }
      catch (error) {
        console.log('ERROR ' + error);
      }
    }
  },

  revertMangle: function(name, contextName) {
    context = contexts[contextName];
    return (context) ? context.reverse_mangles[name] : null;
  },

  isReservedJSName: isReservedJSName_,
  startsWidthDigit: function (m) {
    return /^[0-9].*/.test(m);
  },
  mangle: function(name, contextName) {
    context = contexts[contextName];
    if (context) {
      if (context.mangles[name]) {
          return context.mangles[name];
      }
      else {
        var m = base54(context.mangle_id++);

        while(Object.prototype.hasOwnProperty.call(context.reverse_mangles, m) || this.isReservedJSName(m) || this.startsWidthDigit(m)) {
            m = base54(context.mangle_id++);
        }
        context.reverse_mangles[m] = name;
        return context.mangles[name] = m;
      }
    }
    else {
      throw new Error('Invalid context ' + contextName);
    }
  },

  manglesForContext: function(context) {
    return contexts[context].mangles;
  },

  save: function() {
    if (mapFile) {
      fs.writeFileSync(mapFile, JSON.stringify(contexts), 'utf8');
    }
    else {
      throw new Error('Cant save without map file!')
    }
  }
}
