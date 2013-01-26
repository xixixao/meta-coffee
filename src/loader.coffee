define [
  './ometa-base'
  './ometa-lib'
  './bs-dentparser'
  './bs-semactionparser'
  './bs-ometa-optimizer'
  './bs-ometa-compiler'
  './bs-metacoffee-compiler'
 ], (OMeta, OMLib, BSDentParser,
                   BSSemActionParser,
                   BSOmetaCompiler,
                   BSOmetaOptimizer,
                   BSMetaCoffeeCompiler) ->
  OMeta: OMeta
  OMLib: OMLib
  BSMetaCoffeeParser: BSMetaCoffeeCompiler.BSMetaCoffeeParser
  BSMetaCoffeeTranslator: BSMetaCoffeeCompiler.BSMetaCoffeeTranslator