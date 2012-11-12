define [
 'cs!../src/ometa-base',
 'cs!../src/lib',
 '../bin/bs-dentparser',
 '../bin/bs-semactionparser',
 '../bin/bs-ometa-optimizer',
 '../bin/bs-ometa-compiler', 
 '../bin/bs-metacoffee-compiler'
 ], (OMeta, OMLib, BSDentParser, BSOmetaCompiler, BSOmetaOptimizer, BSMetaCoffeeCompiler) ->
  OMeta: OMeta
  OMLib: OMLib
  BSMetaCoffeeParser: BSMetaCoffeeCompiler.BSMetaCoffeeParser
  BSMetaCoffeeTranslator: BSMetaCoffeeCompiler.BSMetaCoffeeTranslator