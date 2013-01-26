require [
  "../lib/metacoffee/loader"
  "../lib/metacoffee/errorhandler"
  "jquery"
], (MetaCoffee, ErrorHandler, $) ->

  {BSMetaCoffeeParser, BSMetaCoffeeTranslator} = MetaCoffee

  compile = (sourceCode) ->
    try
      tree = BSMetaCoffeeParser.matchAll sourceCode, "topLevel", undefined, (m, i) ->
        handled = ErrorHandler.handle(m, i)
        throw new Error "Error at line: #{handled.lineNumber}\n\n
                         #{ErrorHandler.bottomErrorArrow(handled)}"
      result = BSMetaCoffeeTranslator.matchAll tree, "trans", `undefined`, (m, i) ->
        throw new Error "Translation error"
    catch e
      console.log e
      return e.toString()
    return result

  displayResult = (text) ->
    $("#result").text text

  compileSource = ->
    compile $("#source").val()

  $ ->
    $("#doIt").click (e) ->
      displayResult compileSource()

    $("#runIt").click (e) ->
      translation = compileSource()
      window.MetaCoffee = MetaCoffee
      lib = "$.extend(window, MetaCoffee);" + "$.extend(window, OMLib);"
      displayResult eval lib + translation

