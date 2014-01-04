OMeta = require './ometa-base'
{subclass} = require './ometa-lib'
BSCoffeeScriptCompiler = require 'coffee-script'
BSDentParser = require './bs-dentparser'
{BSOMetaParser, BSOMetaTranslator} = require './bs-ometa-compiler'

ometa BSMetaCoffeeParser extends BSDentParser
  ometa :first  = (&{first} | '\n') inspace*:ss prepend(ss)
                  BSOMetaParser.grammar:g                   -> ['OMeta', ss.join(''), g]
  coffee      = anything:x (!ometa(no) anything)*:xs        -> ['CoffeeScript', x + xs.join '']
  topLevel    = (blankLine* ometa(yes) | coffee):x 
                           (ometa(no)  | coffee)*:xs        -> [x].concat xs
              | end                                         -> [['CoffeeScript', '']]

compileCoffeeScript = (source, bare) ->
  try
    result = BSCoffeeScriptCompiler.compile source, bare: bare
  catch e
    console.log "CoffeeScript SyntaxError in\n\n#{source}"
    throw e
  return result

ometa BSMetaCoffeeTranslator
  trans :bare = ([:t apply(t):ans] -> ans)*:xs      -> compileCoffeeScript xs.join(''), bare
  CoffeeScript anything
  OMeta        :ss :t BSOMetaTranslator.trans(t):js -> "\n#{ss}\`#{js}\`\n"

module.exports =
  BSMetaCoffeeParser: BSMetaCoffeeParser
  BSMetaCoffeeTranslator: BSMetaCoffeeTranslator
