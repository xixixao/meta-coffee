(function() {

  define(function() {
    var positionAt;
    positionAt = function(string, n) {
      var i, result, _i;
      result = "";
      for (i = _i = 1; _i < n; i = _i += 1) {
        result += " ";
      }
      return result += string;
    };
    return {
      handle: function(interpreter, position) {
        var currentPosition, i, input, line, lines, _i, _len;
        input = interpreter.input.lst;
        lines = input.split('\n');
        currentPosition = position;
        for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
          line = lines[i];
          if (currentPosition > line.length + 1) {
            currentPosition -= line.length + 1;
          } else {
            break;
          }
        }
        return {
          position: currentPosition,
          lineNumber: i,
          line: line
        };
      },
      bottomErrorArrow: function(handledError) {
        var line, lineLimit, offset, pos;
        pos = handledError.position;
        line = handledError.line;
        lineLimit = 80;
        offset = Math.max(0, pos - lineLimit);
        return line.slice(offset, +(offset + lineLimit) + 1 || 9e9) + "\n" + positionAt("^", pos - offset);
      }
    };
  });

}).call(this);
