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

    paths:
      cs:              '../lib/requirejs/cs'
      'coffee-script': '../lib/cs/coffee-script'

requirejs [
  'cs!../src/metacoffee'
  'cs!../workspace/ErrorHandler'
], (MetaCoffee, ErrorHandler) ->

  BSMetaCoffeeParser = MetaCoffee.BSMetaCoffeeParser
  BSMetaCoffeeTranslator = MetaCoffee.BSMetaCoffeeTranslator

  module.exports =  compileSource = (sourceCode) ->
    try
      tree = BSMetaCoffeeParser.matchAll(
        sourceCode, "topLevel", undefined, (m, i) ->
          handled = ErrorHandler.handle(m, i)
          throw new Error("Error at line: " + handled.lineNumber + "\n\n" +
            ErrorHandler.bottomErrorArrow handled)
      )
      result = BSMetaCoffeeTranslator.matchAll(
        tree, "trans", undefined, (m, i) ->
        throw new Error("Translation error - please tell Alex about this!")
      )
    catch e
      return e.toString()
    return result