define [
  './ometa-base'
  './ometa-lib'
], (OMeta, OMLib) ->

  {subclass, propertyNames, programString, extend} = OMLib

  # TODO: turn off the "seq" inliner when G.seq !== OMeta.seq (will require some refactoring)
  # TODO: add a factorizing optimization (will make jumptables more useful)

  ometa BSNullOptimization
    setHelped = {@_didSomething = yes}
    helped    = &{@_didSomething}
    trans     = [:t &{@[t]?} apply(t):ans]   -> ans
    optimize  = trans:x helped               -> x

    App        :rule anything*:args          -> ['App', rule].concat(args)
    Act        :expr                         -> ['Act', expr]
    Pred       :expr                         -> ['Pred', expr]
    Or         trans*:xs                     -> ['Or'].concat(xs)
    XOr        trans*:xs                     -> ['XOr'].concat(xs)
    And        trans*:xs                     -> ['And'].concat(xs)
    Opt        trans:x                       -> ['Opt',  x]
    Many       trans:x                       -> ['Many',  x]
    Many1      trans:x                       -> ['Many1', x]
    Set        :n trans:v                    -> ['Set', n, v]
    Not        trans:x                       -> ['Not',       x]
    Lookahead  trans:x                       -> ['Lookahead', x]
    Form       trans:x                       -> ['Form',      x]
    ConsBy     trans:x                       -> ['ConsBy',    x]
    IdxConsBy  trans:x                       -> ['IdxConsBy', x]
    JumpTable  ([:c trans:e] -> [c, e])*:ces -> ['JumpTable'].concat(ces)
    Interleave ([:m trans:p] -> [m, p])*:xs  -> ['Interleave'].concat(xs)
    Rule       :name :ls trans:body          -> ['Rule', name, ls, body]
    initialize                               -> @_didSomething = no

  ometa BSAssociativeOptimization extends BSNullOptimization
    And trans:x end           setHelped -> x
    And transInside('And'):xs           -> ['And'].concat(xs)
    Or  trans:x end           setHelped -> x
    Or  transInside('Or'):xs            -> ['Or'].concat(xs)
    XOr trans:x end           setHelped -> x
    XOr transInside('XOr'):xs           -> ['XOr'].concat(xs)

    transInside :t = [exactly(t) transInside(t):xs] transInside(t):ys setHelped -> xs.concat(ys)
                   | trans:x                        transInside(t):xs           -> [x].concat(xs)
                   |                                                            -> []

  ometa BSSeqInliner extends BSNullOptimization
    App        = 'seq' :s end seqString(s):cs setHelped -> ['And'].concat(cs).concat([['Act', s]])
               | :rule anything*:args                   -> ['App', rule].concat(args)
    inlineChar = {OMeta.interpreters.BSOMetaParser}:BSOMetaParser
                 BSOMetaParser.escapedChar:c !end       -> ['App', 'exactly', programString c]
    seqString  = &(:s &{typeof s == 'string'})
                  ( ['"'  inlineChar*:cs '"' ]          -> cs
                  | ['\'' inlineChar*:cs '\'']          -> cs
                  )

  class JumpTable
    constructor: (@choiceOp, choice) ->
      @choices = {}
      @add choice
      return

    add: (choice) ->
      [c, t] = choice
      if @choices[c]
        if @choices[c][0] == @choiceOp
          @choices[c].push(t)
        else
          @choices[c] = [@choiceOp, @choices[c], t]
      else
        @choices[c] = t
      return

    toTree: ->
      r = ['JumpTable']
      choiceKeys = propertyNames(@choices)
      for choiceKey in choiceKeys
        r.push [choiceKey, @choices[choiceKey]]
      return r

  ometa BSJumpTableOptimization extends BSNullOptimization
    Or  (jtChoices('Or')  | trans)*:cs -> ['Or'].concat(cs)
    XOr (jtChoices('XOr') | trans)*:cs -> ['XOr'].concat(cs)
    quotedString  = {OMeta.interpreters.BSOMetaParser}:BSOMetaParser
                    &string [ '"'  (BSOMetaParser.escapedChar:c !end -> c)*:cs '"'
                            | '\'' (BSOMetaParser.escapedChar:c !end -> c)*:cs '\'']         -> cs.join('')
    jtChoice      = ['And' ['App' 'exactly' quotedString:x] anything*:rest]                  -> [x, ['And'].concat(rest)]
                  |        ['App' 'exactly' quotedString:x]                                  -> [x, ['Act', programString x]]
    jtChoices :op = jtChoice:c {new JumpTable(op, c)}:jt (jtChoice:c {jt.add(c)})* setHelped -> jt.toTree()

  ometa BSOMetaOptimizer
    optimizeGrammar = ['Grammar' :n :sn optimizeRule*:rs]          -> ['Grammar', n, sn].concat(rs)
    optimizeRule    = :r (BSSeqInliner.optimize(r):r | empty)
                         ( BSAssociativeOptimization.optimize(r):r
                         | BSJumpTableOptimization.optimize(r):r
                         )*                                        -> r

  api =
    BSOMetaOptimizer: BSOMetaOptimizer

  extend OMeta.interpreters, api

  api