var jsp = require("./parse-js"),
    pro = require("./process"),
    slice = jsp.slice,
    member = jsp.member,
    curry = jsp.curry,
    MAP = pro.MAP,
    PRECEDENCE = jsp.PRECEDENCE,
    OPERATORS = jsp.OPERATORS;

function renameProperties(ast, properties) {
        var w = pro.ast_walker(), walk = w.walk, scope;
        function with_scope(s, cont) {
                var save = scope, ret;
                scope = s;
                ret = cont();
                scope = save;
                return ret;
        };
        return w.with_walkers({
          "dot": function(expr, name) {
            if (properties.hasOwnProperty(name)) {
              console.log(name, '=>', properties[name])
              name = properties[name]
            }
            return [ "dot", walk(expr), name ];
          }
          ,

          "object": function(props) {
            return [ this[0], MAP(props, function(p) {
              var name = p[0]
              if (matches = name.match(/^([a-zA-Z]*)#(.*)$/)) {
                name = matches[2]
              }
              if (properties.hasOwnProperty(name)) {
                console.log(name, '=>', properties[name])
                name = properties[name]
              }
              return p.length == 2
                      ? [ name, walk(p[1]) ]
                      : [ name, walk(p[1]), p[2] ]; // get/set-ter
            }) ];
          }

        }, function() {
                return walk(pro.ast_add_scope(ast));
        });
};

exports.renameProperties = renameProperties;
