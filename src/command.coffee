path        = require 'path'
fs          = require 'fs'
metacoffee  = require './compiler'

targetDirectory = process.argv[2]
fileName = process.argv[3]
targetFileName = path.basename fileName, path.extname fileName
partSource = fs.readFileSync fileName, "utf-8"
compiled = metacoffee.compileSource partSource
fs.writeFileSync "#{targetDirectory}/#{targetFileName}.js", compiled, "utf-8"