function objectNameForDotStat(stat) {
  if (stat instanceof Array) {
    if (stat[0] === 'dot' && stat[1][0] === 'name') {
      return {name:stat[1][1], property:stat[2]};
    }
    else {
      return objectNameForDotStat(stat[1])
    }
    
    // if (stat[0] === 'name') {
    //   return stat[1];
    // }
    // else {
    //   return objectNameForDotStat(stat[1])
    // }
  }
};

var recursivePropertiesForGlobalVar = function(stat, name, currentProperties) {
  if (stat instanceof Array) {
    
    if (stat[0] === 'dot') {
          
      obj = objectNameForDotStat(stat)
      if (obj && obj.name == name) {
        if (currentProperties.indexOf(obj.property) == -1) {
          currentProperties.push(obj.property)
        }
      }
    }
    else {
      for (var k = 0; k < stat.length; k++) {
        // console.log('stat', stat[k])
            
        recursivePropertiesForGlobalVar(stat[k], name, currentProperties)
      }
    }
    
    
    // for (var i = 0; i < ast.length; i++) {
    //   var stat = ast[i];
    //   
    //   if (stat instanceof Array) {
    //     recursivePropertiesForGlobalVar(stat[0], name, currentProperties);
    // 
    //   }
    // 
    // }
  }
  return currentProperties
};


var propertiesForGlobalVar = function(ast, name) {
  return recursivePropertiesForGlobalVar(ast, name, [])
};

exports.propertiesForGlobalVar = propertiesForGlobalVar