OMeta = require './ometa-base'
{subclass, trim} = require './ometa-lib'
BSCoffeeScriptCompiler = require 'coffee-script'

BSDentParser = require './bs-dentparser'

compileAction = (input, args) ->
  try
    wrapped = "((#{args.join()}) ->\n  #{input.replace(/\n/g, '\n  ')}).call(this)"
    compiled = BSCoffeeScriptCompiler.compile wrapped, bare: true
    result = trim(compiled).replace(/^\s*(var[^]*?)?(\(function[^]*?\{)([^]*)/, "(function(){$1$3")
                                 .replace(/;$/, '')
  catch e
    throw "#{input}\n\n#{e.toString()}"
  return result

ometa BSCSParser
  action :input :args    = compile(input, args):compiled (simplify(compiled) | -> compiled)
  simpleExp :input :args = compile(input, args):compiled simplify(compiled)
  compile :input :args   -> compileAction input, args
  simplify :compiled     -> lines = compiled.split('\n')
                            if lines.length < 2 || !lines[1].match(/^ +return/)
                              throw @fail
                            exp = lines[1...-1]
                            exp[0] = exp[0].replace /^ +return /, ''
                            exp.join('\n').replace /;$/, ''

ometa BSSemActionParser extends BSDentParser
  initialize     = {@dentlevel = 0; @sep = 'none'} ^initialize
  none           = !empty
  comma          = ','
  between :s :e  = seq(s) text(true):t seq(e) -> t
  pairOf :s :e   = between(s, e):t -> s + t + e
  delims         = '{' | '(' | '['
                 | '}' | ')' | ']'
  pair           = pairOf('{', '}')
                 | pairOf('(', ')')
                 | pairOf('[', ']')
  text3          = dent:d stripdent(d, @dentlevel)
                 | !exactly('\n') anything
  fromTo :s :e   = <seq(s) (seq('\\\\') | seq('\\') seq(e) | !seq(e) char)* seq(e)>
  text2 :inside  = fromTo('###', '###')
                 | fromTo('"', '"')
                 | fromTo('\'', '\'')
                 | <'/' (seq('\\\\') | seq('\\') '/' | !exactly('\n') !'/' char)+ '/'>
                 | &{inside} !delims text3
                 | !exactly('\n') !delims !apply(@sep) anything
                 | pair
  text :inside   = text2(inside)*:ts          -> ts.join ''
  line           = text(false)
  nextLine :p    = moredent(p):d line:l       -> d + l
  exp :p         = line:fl nextLine(p)*:ls    -> fl + ls.join ''
  simpleExp :args      = spaces {@sep = 'comma'} text(false):t BSCSParser.simpleExp(t, args)
  delimSemAction :args = spaces between('{', '}'):e BSCSParser.action(e, args)
  semAction :p :args   = {@dentlevel = p}
                         (delimSemAction
                         | spaces exp(p):e BSCSParser.action(e, args))

module.exports = BSSemActionParser
