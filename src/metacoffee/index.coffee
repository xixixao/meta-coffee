OMeta = require './ometa-base'
OMLib = require './ometa-lib'

{BSMetaCoffeeParser, BSMetaCoffeeTranslator} = require './bs-metacoffee-compiler'

runtime = OMLib.extend OMeta: OMeta, OMLib

module.exports =
  runtime: runtime
  installRuntime: (to) ->
    OMLib.extend to, runtime
  compile: (code, options = {}) ->
    tree = BSMetaCoffeeParser.matchAll code, "topLevel", undefined, (m, i) ->
      error = new SyntaxError "Parse error"
      error.position = i
      throw error
    result = BSMetaCoffeeTranslator.matchAll tree, "trans", [options.bare], (m, i) ->
      throw new SyntaxError "Translation error"
