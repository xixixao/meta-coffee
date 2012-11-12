//require.config({
//});
require({
  paths: {
    cs:              '../lib/requirejs/cs',
    'coffee-script': '../lib/cs/coffee-script-iced'
  }
},
 ['cs!../src/metacoffee',
 'cs!./ErrorHandler'
 ],
 function (MetaCoffee, ErrorHandler) {

  console.log("initializing");

  BSMetaCoffeeParser: MetaCoffee.BSMetaCoffeeParser
  BSMetaCoffeeTranslator: MetaCoffee.BSMetaCoffeeTranslator

  function compileSource(sourceCode) {
    try {
      var tree = BSMetaCoffeeParser.matchAll(
        sourceCode, "topLevel", undefined, function(m, i) {
          handled = ErrorHandler.handle(m, i);
          throw new Error("Error at line: " + handled.lineNumber + "\n\n" +
            ErrorHandler.bottomErrorArrow(handled));
        }
      );
      var result = BSMetaCoffeeTranslator.matchAll(
        tree, "trans", undefined, function(m, i) {
        throw new Error("Translation error - please tell Alex about this!");
        }
      );
    } catch (e) {
      console.log(e);
      return e.toString();
    }

    return result;

  }

  $("#doIt").click(function (e){
    var result = compileSource($("#source").val());
    $("#result").text(result);
  });


  $("#runIt").click(function (e){
    var translation = compileSource($("#source").val());

    window.MetaCoffee = MetaCoffee
    lib = "$.extend(window, MetaCoffee);" + "$.extend(window, OMLib);"
    console.log(lib + translation);
    var result = eval(lib + translation);
    $("#result").text(result);
 });
});