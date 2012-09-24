//require.config({
//});
require({
  paths: {
    cs:              '../lib/requirejs/cs',
    'coffee-script': '../lib/cs/coffee-script-iced'
  }
},
 ['../bin/bs-js-compiler',
 '../bin/bs-ometa-compiler',
 '../bin/bs-ometa-optimizer',
 '../bin/bs-ometa-js-compiler',
 'cs!./ErrorHandler'
 ],
 function (jsc, oc, oo, BSOmetaJSCompiler, ErrorHandler) {

  $("#doIt").click(function (e){
    var sourceCode = $("#source").val();    
    try {
      var tree = BSOmetaJSCompiler.BSOMetaJSParser.matchAll(
        sourceCode, "topLevel", undefined, function(m, i) {        
          handled = ErrorHandler.handle(m, i);
          $("#result").text(
            "Error at line: " + handled.lineNumber + "\n\n" + 
            ErrorHandler.bottomErrorArrow(handled)
          );
          throw new Error("Error at m: " + m + " i: " + i);
        }
      );
      var result = BSOmetaJSCompiler.BSOMetaJSTranslator.match(
        tree, "trans", undefined, function(m, i) {
        alert("Translation error - please tell Alex about this!"); 
          throw new Error("fail");
        }
      );   
    } catch (e) {
      console.log(e);
      //$("#result").text(e.toString());
    }
    
    $("#result").text(result);
  });
 }
);