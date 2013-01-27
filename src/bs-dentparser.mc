define [
  './ometa-base'
  './ometa-lib'
], (OMeta, OMLib) ->
  {subclass, Stack, extend} = OMLib

  ometa BSDentParser
    initialize     = {this.mindent = new Stack().push(-1)}
    exactly        = '\n' apply("nl")
                   | :other ^exactly(other)
    inspace        = !exactly('\n') space
    nl             = ^exactly('\n') pos:p {this.lineStart = p} -> '\n'
    blankLine      = inspace* '\n'
    dent           = inspace* '\n' blankLine* ' '*:ss -> ss.length
    linePos        = pos:p -> (p - (this.lineStart || 0))
    stripdent :d :p -> ('\n' + Array(d - p).join(' '))
    nodent :p      = dent:d &{d == p}
    moredent :p    = dent:d &{d >= p} stripdent(d, p)
    lessdent :p    = dent:d &{d <= p}
                   | inspace* end
    setdent :p     = {this.mindent.push(p)}
    redent         = {this.mindent.pop()}
    spacedent      = &{this.mindent.top() >= 0} moredent(this.mindent.top())

  api =
    BSDentParser: BSDentParser

  extend OMeta.interpreters, api

  api