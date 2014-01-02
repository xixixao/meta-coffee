React = require 'React'
{_div, _p, _h2, _textarea, _pre, _button} = require 'hyper'

{runtime} = require 'metacoffee/metacoffee'
MetaCoffee = require 'metacoffee/prettyfier'

module.exports = React.createClass

  getInitialState: ->
    value: ''
    result: ''

  handleChange: (event) ->
    @setState
      value: event.target.value

  _compile: ->
    MetaCoffee.compile @state.value, bare: true

  translate: ->
    @setState
      result:
        try
          @_compile()
        catch e
          e.message

  run: ->
    @setState
      result:
        try
          translation = @_compile()
          MetaCoffee.runtime.install window
          eval translation
        catch e
          e.message

  render: ->
    _div {},
      _h2 'Source'
      _textarea cols: 152, rows: 6, onChange: @handleChange
      _p {},
        _button onClick: @translate, 'Traslate'
        _button onClick: @run, 'Run'
      _h2 'Translation'
      _pre @state.result
