define [
  './ometa-base'
  './ometa-lib'
  'coffee-script'
  './bs-ometa-compiler'
], (OMeta, OMLib, BSCoffeeScriptCompiler, BSOMetaCompiler) ->
  {subclass, extend} = OMLib

  BSDentParser = OMeta.interpreters.BSDentParser;

  BSOMetaParser = BSOMetaCompiler.BSOMetaParser;
  BSOMetaTranslator = BSOMetaCompiler.BSOMetaTranslator;

  ometa BSMetaCoffeeParser extends BSDentParser
    ometa :first  = (&{first} | '\n') inspace*:ss prepend(ss)
                    BSOMetaParser.grammar:g                   -> ['OMeta', ss.join(''), g]
    coffee      = anything:x (!ometa(no) anything)*:xs        -> ['CoffeeScript', x + xs.join '']
    topLevel    = (blankLine* ometa(yes) | coffee):x 
                             (ometa(no)  | coffee)*:xs        -> [x].concat xs
                | end                                         -> [['CoffeeScript', '']]

  compileCoffeeScript = (source) ->
    try
      result = BSCoffeeScriptCompiler.compile source, bare:true
    catch e
      throw "#{source}\n\n#{e.toString()}"
    return result

  ometa BSMetaCoffeeTranslator
    trans = ([:t apply(t):ans] -> ans)*:xs            -> compileCoffeeScript xs.join('')
    CoffeeScript anything
    OMeta        :ss :t BSOMetaTranslator.trans(t):js -> "\n#{ss}\`#{js}\`\n"

  api =
    BSMetaCoffeeParser: BSMetaCoffeeParser
    BSMetaCoffeeTranslator: BSMetaCoffeeTranslator

  extend(OMeta.interpreters, api);

  api