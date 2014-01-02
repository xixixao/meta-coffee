(function() {
  var ErrorHandler, MetaCoffee, beautify, js_beautify;

  js_beautify = require('js-beautify');

  beautify = js_beautify.js_beautify;

  MetaCoffee = require('./index');

  ErrorHandler = require('../errorhandler');

  module.exports = {
    compile: function(code, options) {
      var beautified, handled, js;
      code = code.replace(/\r\n/g, '\n');
      try {
        js = MetaCoffee.compile(code, options);
        beautified = beautify(js, {
          indent_size: 2
        });
      } catch (e) {
        if (e.position) {
          handled = ErrorHandler.handle(e.interpreter, e.position);
          throw "Parse error at line: " + handled.lineNumber + "\n\n" + ErrorHandler.bottomErrorArrow(handled);
        } else {
          throw "Translation error";
        }
      }
      return beautified;
    }
  };

}).call(this);
