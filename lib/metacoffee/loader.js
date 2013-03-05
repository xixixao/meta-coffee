(function() {

  define(['./ometa-base', './ometa-lib', './bs-dentparser', './bs-semactionparser', './bs-ometa-optimizer', './bs-ometa-compiler', './bs-metacoffee-compiler'], function(OMeta, OMLib, BSDentParser, BSSemActionParser, BSOmetaCompiler, BSOmetaOptimizer, BSMetaCoffeeCompiler) {
    return {
      OMeta: OMeta,
      OMLib: OMLib,
      BSMetaCoffeeParser: BSMetaCoffeeCompiler.BSMetaCoffeeParser,
      BSMetaCoffeeTranslator: BSMetaCoffeeCompiler.BSMetaCoffeeTranslator
    };
  });

}).call(this);
