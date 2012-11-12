require {
  paths:
    cs:              '../lib/requirejs/cs'
    'coffee-script': '../lib/cs/coffee-script-iced'
}, [
  'cs!../src/metacoffee'
  'cs!./ErrorHandler'
], (MetaCoffee, ErrorHandler) ->

  BSMetaCoffeeParser = MetaCoffee.BSMetaCoffeeParser
  BSMetaCoffeeTranslator = MetaCoffee.BSMetaCoffeeTranslator

  return compileSource = (sourceCode) ->
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
    catch (e)
      return e.toString()
    return result