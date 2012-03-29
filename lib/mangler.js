var fs = require('fs');
path = require('path');

var contexts = {
  main: createContext(),
  modules: createContext(),
  modfiles: createContext()
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
        var DIGITS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
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


module.exports = {
  setMapFile: function(file) {
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
  
  mangle: function(name, contextName) {
    context = contexts[contextName];
    if (context) {
      if (context.mangles[name]) {
          return context.mangles[name];
      } 
      else {
        var m = base54(context.mangle_id++);
        while(Object.prototype.hasOwnProperty.call(context.mangles, m)) {
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
