path        = require 'path'
fs          = require 'fs'
metacoffee  = require './compiler'

metacoffee (ometa) ->
  targetDirectory = process.argv[2]
  fileName = process.argv[3]
  targetFileName = path.basename fileName, '.metacoffee'
  partSource = fs.readFileSync fileName, "utf-8"
  compiled = ometa.compileSource partSource
  fs.writeFileSync "#{targetDirectory}/#{targetFileName}.js", compiled, "utf-8"