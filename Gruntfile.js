module.exports = function(grunt) {
  var emberSimpleAuthConfig = require('grunt-microlib').init.bind(this)(grunt);
  grunt.loadNpmTasks('grunt-microlib');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  this.registerTask(
    'test:phantom',
    'Runs tests through the command line using PhantomJS',
    ['build', 'tests']
  );

  this.registerTask('test', ['build', 'tests']);

  var config = {
    cfg: {
      name: 'ember-simple-auth.js',
      barename: 'ember-simple-auth',
      namespace: 'EmberSimpleAuth'
    },
    env: process.env,
    pkg: grunt.file.readJSON('package.json')/*,
    browserify: require('./options/browserify.js'),
    mocha_phantomjs: require('./options/mocha_phantom.js')*/
  };

  grunt.initConfig(grunt.util._.merge(emberSimpleAuthConfig, config));

  grunt.loadNpmTasks('grunt-browserify');
};
