module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    coffee:
      compile:
        expand: true
        cwd: "src"
        src: ["**/*.coffee"]
        dest: "lib"
        ext: ".js"

    metacoffee:
      compile:
        expand: true
        cwd: "src"
        src: ["**/*.mc"]
        dest: "lib"
        ext: ".js"

    urequire:
      metacoffee:
        template: "combined"
        main: "index"
        path: "lib/metacoffee"
        dstPath: "extras/metacoffee.js"
        dependencies: exports: root: 'metacoffee'
      errorhandler:
        template: "combined"
        main: "index"
        path: "lib/errorhandler"
        dstPath: "extras/errorhandler.js"
        dependencies: exports: root: 'errorhandler'
      prettyfier:
        template: "combined"
        main: "index"
        path: "lib/metacoffee"
        dstPath: "extras/prettyfier.js"
        dependencies: exports: root: 'prettyfier'

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-urequire"
  require("./lib/metacoffee/grunt-contrib-metacoffee") grunt
  grunt.registerTask "default", ["coffee", "metacoffee"]
  grunt.registerTask "web", ["default", "urequire"]