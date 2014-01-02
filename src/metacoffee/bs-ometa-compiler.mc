OMeta = require './ometa-base'
{subclass, propertyNames, unescape, programString, Set} = require './ometa-lib'

BSDentParser = require './bs-dentparser'
BSSemActionParser = require './bs-semactionparser'
BSOMetaOptimizer = require './bs-ometa-optimizer'

ometa BSOMetaParser extends BSDentParser
  lineComment    = fromTo('# ', '\n')
  blockComment   = fromTo('#>', '<#')
  space          = ' ' | spacedent | lineComment | blockComment
  blankLine      = ' '* (lineComment | blockComment ' '* '\n')
                 | ^blankLine
  nameFirst      = '_' | '$' | letter
  bareName       = <nameFirst (nameFirst | digit)*>
  name           = spaces bareName
  hexValue :ch                                                         -> '0123456709abcdef'.indexOf ch.toLowerCase()
  hexDigit       = char:x {this.hexValue(x)}:v &{v >= 0}               -> v
  escapedChar    = <'\\' ( 'u' hexDigit hexDigit hexDigit hexDigit
                         | 'x' hexDigit hexDigit
                         | char                                   )>:s -> unescape s
                 | char
  charSequence   = '"'  ( !'"' escapedChar)*:xs  '"'                   -> ['App', 'token',   programString xs.join '']
  string         = '\'' (!'\'' escapedChar)*:xs '\''                   -> ['App', 'exactly', programString xs.join '']
  number         = <'-'? digit+>:n                                     -> ['App', 'exactly', n]
  keyword :xs    = token(xs) !letterOrDigit                            -> xs
  args           = '(' listOf('hostExpr', ','):xs ")"                  -> xs
                 | empty                                               -> []
  application    = "^"          name:rule args:as                      -> ['App', "super",        "'" + rule + "'"].concat as
                 | name:grm "." name:rule args:as                      -> ['App', "foreign", grm, "'" + rule + "'"].concat as
                 |              name:rule args:as                      -> ['App', rule].concat as
  hostExpr        = BSSemActionParser.simpleExp(@locals.values())
  closedHostExpr  = BSSemActionParser.delimSemAction(@locals.values())
  openHostExpr :p = BSSemActionParser.semAction(p, @locals.values())
  semAction      = closedHostExpr:x                                    -> ['Act', x]
  arrSemAction   = "->" linePos:p openHostExpr(p):x                    -> ['Act', x]
  semPred        = "&" closedHostExpr:x                                -> ['Pred', x]
                 | "!" closedHostExpr:x                                -> ['Not', ['Pred', x]]
  expr :p        = setdent(p) expr5:x {this.redent()}                  -> x
  expr5          = expr4(true):x ("|" expr4(true))+:xs                 -> ['Or',  x].concat xs
                 | expr4(true):x ("||" expr4(true))+:xs                -> ['XOr', x].concat xs
                 | expr4(false)
  expr4 :ne      =       expr3*:xs arrSemAction:act                    -> ['And'].concat(xs).concat([act])
                 | &{ne} expr3+:xs                                     -> ['And'].concat xs
                 | !{ne} expr3*:xs                                     -> ['And'].concat xs
  optIter :x     = '*'                                                 -> ['Many',  x]
                 | '+'                                                 -> ['Many1', x]
                 | '?'                                                 -> ['Opt',   x]
                 | empty                                               -> x
  optBind :x     = ':' name:n                                          -> @locals.add n; ['Set', n, x]
                 | empty                                               -> x
  expr3          = ":" name:n                                          -> @locals.add n; ['Set', n, ['App', 'anything']]
                 | (expr2:x optIter(x) | semAction):e optBind(e)
                 | semPred
  expr2          = "!" expr2:x                                         -> ['Not',       x]
                 | "&" expr1:x                                         -> ['Lookahead', x]
                 | expr1
  expr1          = application
                 | ( keyword('undefined') | keyword('nil')
                   | keyword('true')      | keyword('false') ):x       -> ['App', 'exactly', x]
                 | spaces (charSequence | string | number)
                 | "["  expr(0):x "]"                                  -> ['Form',      x]
                 | "<"  expr(0):x ">"                                  -> ['ConsBy',    x]
                 | "@<" expr(0):x ">"                                  -> ['IdxConsBy', x]
                 | "("  expr(0):x ")"                                  -> x
  ruleName       = bareName
  rule           = &(ruleName:n) {@locals = new Set}
                    linePos:p setdent(p + 1) rulePart(n):x
                     (nodent(p) rulePart(n))*:xs {this.redent()}       -> ['Rule', n, this.locals.values(),
                                                                           ['Or', x].concat xs]
  rulePart :rn   = ruleName:n &{n == rn} expr4(false):b1
                   ( spaces linePos:p '=' expr(p):b2 -> ['And', b1, b2]
                   | empty                           -> b1
                   )
  grammar        = (inspace*:ss -> 1 + ss.length):ip
                   keyword('ometa') name:n
                   ( keyword('extends') name | empty -> 'OMeta' ):sn
                   moredent(ip)
                     linePos:p rule:r
                     (nodent(p) rule)*:rs                               BSOMetaOptimizer.optimizeGrammar(
                                                                            ['Grammar', n, sn, r].concat rs
                                                                        )

ometa BSOMetaTranslator
  App        'super' anything+:args        -> [@sName, '._superApplyWithArgs(this,', args.join(), ')'].join('')
  App        :rule   anything+:args        -> ['this._applyWithArgs("', rule, '",',  args.join(), ')'].join('')
  App        :rule                         -> ['this._apply("', rule, '")']                           .join('')
  Act        :expr                         -> expr
  Pred       :expr                         -> ['this._pred(', expr, ')']                              .join('')
  Or         transFn*:xs                   -> ['this._or(',  xs.join(), ')']                          .join('')
  XOr        transFn*:xs                       {xs.unshift(programString(@name + "." + @rName))}
                                           -> ['this._xor(', xs.join(), ')']                          .join('')
  And        notLast('trans')*:xs trans:y
             {xs.push('return ' + y)}      -> ['(function(){', xs.join(';'), '}).call(this)']         .join('')
  And                                      -> 'undefined'
  Opt        transFn:x                     -> ['this._opt(',           x, ')']                        .join('')
  Many       transFn:x                     -> ['this._many(',          x, ')']                        .join('')
  Many1      transFn:x                     -> ['this._many1(',         x, ')']                        .join('')
  Set        :n trans:v                    -> [n, '=', v]                                             .join('')
  Not        transFn:x                     -> ['this._not(',           x, ')']                        .join('')
  Lookahead  transFn:x                     -> ['this._lookahead(',     x, ')']                        .join('')
  Form       transFn:x                     -> ['this._form(',          x, ')']                        .join('')
  ConsBy     transFn:x                     -> ['this._consumedBy(',    x, ')']                        .join('')
  IdxConsBy  transFn:x                     -> ['this._idxConsumedBy(', x, ')']                        .join('')
  JumpTable  jtCase*:cases                 -> @jumpTableCode(cases)
  Interleave intPart*:xs                   -> ['this._interleave(', xs.join(), ')']                   .join('')

  Rule       :name {@rName = name}
             locals:ls trans:body          -> ['\n"', name, '":function(){', ls, 'return ', body, '}'].join('')
  Grammar    :name :sName
             {@name = name}
             {@sName = sName}
             trans*:rules                  -> [name, '=subclass(', sName, ',{', rules.join(), '});']   .join('')
  intPart  = [:mode transFn:part]          -> (programString(mode)  + "," + part)
  jtCase   = [:x trans:e]                  -> [programString(x), e]
  locals   = [string+:vs]                  -> ['var ', vs.join(), ';']                                 .join('')
           | []                            -> ''
  trans    = [:t apply(t):ans]             -> ans
  transFn  = trans:x                       -> ['(function(){return ', x, '})']                         .join('')

BSOMetaTranslator::jumpTableCode = (cases) ->
  "(function(){switch(this._apply(\'anything\')){" +
  ("case #{key}:return #{val};" for [key, val] in cases).join('') +
  "default: throw this.fail}}).call(this)"

module.exports =
  BSOMetaParser:     BSOMetaParser
  BSOMetaTranslator: BSOMetaTranslator
