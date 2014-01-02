React = require 'React'
_MainComponent = require './MainComponent'

React.renderComponent (
  _MainComponent()
), document.getElementById 'mainComponent'
