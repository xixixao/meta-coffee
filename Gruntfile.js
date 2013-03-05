module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        expand: true,
        cwd: 'src',
        src: ['*.coffee'],
        dest: 'lib/metacoffee',
        ext: '.js'
      }
    },
    metacoffee: {
      compile: {
        expand: true,
        cwd: 'src',
        src: ['*.mc'],
        dest: 'lib/metacoffee',
        ext: '.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  require('./lib/metacoffee/grunt-contrib-metacoffee.js')(grunt);
  grunt.registerTask('default', ['coffee', 'metacoffee']);
};