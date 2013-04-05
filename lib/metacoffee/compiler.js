(function() {
  var BSMetaCoffeeParser, BSMetaCoffeeTranslator, ErrorHandler, MetaCoffee, UglifyJS, compressor, requirejs;

  requirejs = require('requirejs');

  UglifyJS = require('uglify-js');

  requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
  });

  MetaCoffee = requirejs('./loader');

  ErrorHandler = requirejs('./errorhandler');

  BSMetaCoffeeParser = MetaCoffee.BSMetaCoffeeParser, BSMetaCoffeeTranslator = MetaCoffee.BSMetaCoffeeTranslator;

  MetaCoffee.OMLib.errorHandler = ErrorHandler;

  compressor = UglifyJS.Compressor({
    sequences: false,
    unused: false
  });

  module.exports = {
    compileSource: function(sourceCode) {
      var ast, js, message, tree, _ref;
      sourceCode = sourceCode.replace(/\r\n/g, '\n');
      try {
        tree = BSMetaCoffeeParser.matchAll(sourceCode, "topLevel", void 0, function(m, i) {
          var handled;
          handled = ErrorHandler.handle(m, i);
          throw new Error("Error at line: " + handled.lineNumber + "\n\n" + ErrorHandler.bottomErrorArrow(handled));
        });
        js = BSMetaCoffeeTranslator.matchAll(tree, "trans", void 0, function(m, i) {
          throw new Error("Translation error");
        });
        ast = UglifyJS.parse(js);
        ast.figure_out_scope();
        ast = ast.transform(compressor);
        js = ast.print_to_string({
          beautify: true,
          indent_level: 2
        });
      } catch (e) {
        message = (_ref = e.toString()) != null ? _ref : e;
        throw message;
      }
      return js;
    },
    OMeta: MetaCoffee.OMeta,
    OMLib: MetaCoffee.OMLib
  };

}).call(this);
