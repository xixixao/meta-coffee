module.exports = (grunt) ->
  grunt.registerMultiTask 'metacoffee', 'Compile MetaCoffee files into JavaScript', ->
    options = @options
      bare: false,
      separator: grunt.util.linefeed

    grunt.verbose.writeflags options, 'Options'

    @files.forEach (f) ->
      output = f.src.filter (filepath) ->
        # Warn on and remove invalid source files (if nonull was set).
        if !grunt.file.exists(filepath)
          grunt.log.warn('Source file "' + filepath + '" not found.')
          false
        else
          true
      .map (filepath) ->
        compileMetaCoffee(filepath, options)
      .join grunt.util.normalizelf(options.separator)

      if output.length < 1
        grunt.log.warn('Destination not written because compiled files were empty.')
      else
        grunt.file.write(f.dest, output)
        grunt.log.writeln('File ' + f.dest + ' created.')


  compileMetaCoffee = (srcFile, options) ->
    srcCode = grunt.file.read srcFile

    try
      (require('./prettyfier') require('./index')).compile srcCode
    catch e
      grunt.log.error(e)
      grunt.fail.warn('MetaCoffee failed to compile.')
