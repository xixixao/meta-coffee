# Require.js config
require
  urlArgs: "b=#{(new Date()).getTime()}"
  paths:
    hyper: 'vendor/hyper/hyper'
    React: 'vendor/react/react'
    metacoffee: 'vendor/metacoffee'
    'coffee-script': 'vendor/coffee-script/coffee-script'
    'js-beautify': 'vendor/js-beautify/beautify'
  , ['app/main']
