//convienence function(src, [options]);
function uglify(orig_code, options){
  options || (options = {});
  var jsp = uglify.parser;
  var pro = uglify.uglify;


  options.sv_options.mangle = true;
  // orig_code = "var _css; _css = { fontSize: 3 }"

  // orig_code = "var _ = { embed: top !== self }"
  // orig_code = "function test(fs) { var window = {}; window.isFullscreen() }"
  // orig_code = "AClass.prototype.test = function(fs) { var window = {}; window.isFullscreen() }"
  // orig_code = "function a(_element) { return this._element._sciao }"

  // orig_code = "_canvas.getContext('2d')._resize()"
  // orig_code = 'ciao(function() { if (fd) {var gggga = 2;}})'
  // orig_code = "ciao.test('a', [], function a() {if (window[d]) {var CANVAS_RENDERING_CONTEXT_2D = 2;}})"
  // orig_code = 'sublime_.module("Tz", [], function() {var ADD_COLOR_STOP; if (window[a]) {ADD_COLOR_STOP=3}})'
  var ast = jsp.parse(orig_code, options.strict_semicolons); // parse code and get the initial AST
  // ast = pro.ast_logger(ast, options.sv_options); // get a new AST with logging messages stripped

  // ast = pro.ast_logger(ast, {log_level:'fatal'}); // get an AST with compression optimizations


  if (options.sv_options &&  options.sv_options.removeLogs) {
    ast = pro.ast_logger(ast, {log_level:'fatal'}); // get an AST with compression optimizations
  }
  if (options.sv_options && options.sv_options.mangle) {
    ast = pro.ast_mangle_string(ast, options.sv_options); // get a new AST with mangled strings wrapped by the MANGLE() macro
    ast = pro.ast_aggressive_mangle(ast, options.sv_options); // get a new AST with super mangled names
    ast = pro.ast_mangle(ast, options.mangle_options); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast, options.squeeze_options); // get an AST with compression optimizations

  }

  var final_code = pro.gen_code(ast, options.gen_options); // compressed code here
  final_code = pro.split_lines(final_code, 1000);
  return final_code;
};

uglify.parser = require("./lib/parse-js");
uglify.uglify = require("./lib/process");
uglify.consolidator = require("./lib/consolidator");

uglify.mangler = require("./lib/mangler");
uglify.inspector = require("./lib/inspector");
module.exports = uglify
