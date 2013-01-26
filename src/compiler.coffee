requirejs = require 'requirejs'

requirejs.config
    # Use node's special variable __dirname to
    # get the directory containing this file.
    # Useful if building a library that will
    # be used in node but does not require the
    # use of node outside
    baseUrl: __dirname

    # Pass the top-level main.js/index.js require
    # function to requirejs so that node modules
    # are loaded relative to the top-level JS file.
    nodeRequire: require


MetaCoffee = requirejs './loader'
ErrorHandler = requirejs './errorhandler'

{BSMetaCoffeeParser, BSMetaCoffeeTranslator} = MetaCoffee

MetaCoffee.OMLib.errorHandler = ErrorHandler

module.exports =
  compileSource: (sourceCode) ->
    try
      tree = BSMetaCoffeeParser.matchAll(
        sourceCode, "topLevel", undefined, (m, i) ->
          handled = ErrorHandler.handle(m, i)
          throw new Error("Error at line: " + handled.lineNumber + "\n\n" +
            ErrorHandler.bottomErrorArrow handled)
      )
      result = BSMetaCoffeeTranslator.matchAll(
        tree, "trans", undefined, (m, i) ->
          throw new Error("Translation error")
      )
    catch e
      message = e.toString() ? e
      throw message
    return result
  OMeta: MetaCoffee.OMeta
  OMLib: MetaCoffee.OMLib
