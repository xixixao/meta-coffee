define ->

  positionAt = (string, n) ->
    result = ""
    for i in [1...n]
      result += " "
    result += string

  # +1 for the erased newline character
  handle: (interpreter, position) ->
    input = interpreter.input.lst
    lines = input.split('\n')
    currentPosition = position
    for line, i in lines
      if currentPosition > line.length + 1
        currentPosition -= line.length + 1
      else
        break

    position: currentPosition
    lineNumber: i
    line: line

  bottomErrorArrow: (handledError) ->
    pos = handledError.position
    line = handledError.line
    lineLimit = 80
    offset = Math.max 0, pos - lineLimit
    line[offset..offset + lineLimit] + "\n" +
    positionAt "⤴", pos - offset