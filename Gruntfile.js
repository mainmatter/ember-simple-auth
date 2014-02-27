module.exports = function(grunt) {
  this.registerTask('default', ['test']);

  this.registerTask('dist', 'Builds a distributable version of EmberSimpleAuth', [
    'jshint',
    'build',
    'uglify:library',
    'uglify:browser',
    'copy:dist',
    'docs',
    'copy:docs'
  ]);

  this.registerTask('build', 'Builds EmberSimpleAuth', [
    'clean',
    'transpile:amd',
    'concat:amd',
    'concat:browser'
  ]);

  this.registerTask('build_tests', "Builds EmberSimpleAuth's tests", [
    'build',
    'transpile:tests',
    'concat:tests',
  ]);

  this.registerTask('dev_server', 'Runs a development server', [
    'build_tests',
    'connect:dev',
    'watch'
  ]);

  this.registerTask('test', 'Executes the tests', [
    'jshint',
    'build_tests',
    'connect:dev',
    'mocha'
  ]);

  this.registerTask('docs', 'Builds the documentation', [
    'yuidoc',
    'compile-handlebars:docs'
  ]);

  this.registerTask('examples', 'Runs the examples server', [
    'build',
    'connect:examples'
  ]);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      dev:{
        server: {},
        options: {
          hostname: '0.0.0.0',
          port: grunt.option('port') || 8000,
          base: '.',
          middleware: function(connect, options) {
            return [
              require('connect-redirection')(),
              function(request, response, next) {
                if (request.url === '/') {
                  response.redirect('/test');
                } else {
                  next();
                }
              },
              connect.static(options.base)
            ];
          }
        }
      },
      examples: {
        server: {},
        options: {
          hostname: '0.0.0.0',
          port: grunt.option('port') || 8000,
          keepalive: true,
          base: '.',
          middleware: function(connect, options) {
            return [
              connect.logger('short'),
              connect.json(),
              connect.query(),
              require('body-parser')(),
              require('connect-redirection')(),
              function(request, response, next) {
                if (request.url === '/') {
                  response.redirect('/examples');
                } else {
                  next();
                }
              },
              require('./examples/middleware'),
              connect.static(options.base)
            ];
          }
        }
      }
    },

    watch: {
      files: ['lib/**', 'test/**/*'],
      tasks: ['build_tests', 'jshint']
    },

    transpile: {
      amd: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'lib/',
          src: ['**/*.js'],
          dest: 'tmp/'
        }]
      },
      tests: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'test/',
          src: ['test_helpers.js', 'tests.js', 'tests/**/*.js'],
          dest: 'tmp/'
        }]
      }
    },

    concat: {
      amd: {
        src: ['tmp/<%= pkg.name %>.js', 'tmp/<%= pkg.name %>/**/*.js'],
        dest: 'tmp/<%= pkg.name %>.amd.js'
      },
      browser: {
        src: [
          'wrap/browser.start',
          'vendor/loader.js',
          'tmp/<%= pkg.name %>.js',
          'tmp/<%= pkg.name %>/**/*.js',
          'wrap/browser.end'
        ],
        dest: 'tmp/<%= pkg.name %>.js'
      },
      tests: {
        src: ['tmp/tests/**/*.js'],
        dest: 'tmp/<%= pkg.name %>-tests.amd.js'
      }
    },

    copy: {
      dist: {
        files: [
          {
            src: ['tmp/<%= pkg.name %>.min.js'],
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
          },{
            src: ['tmp/<%= pkg.name %>.amd.min.js'],
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.amd.min.js'
          }
        ]
      },
      docs: {
        files: [{
          src: ['docs/build/api.html'],
          dest: 'dist/<%= pkg.name %>-<%= pkg.version %>-api-docs.html'
        }]
      }
    },

    uglify: {
      library: {
        files: {
          'tmp/<%= pkg.name %>.amd.min.js': ['tmp/<%= pkg.name %>.amd.js']
        }
      },
      browser: {
        files: {
          'tmp/<%= pkg.name %>.min.js': ['tmp/<%= pkg.name %>.js']
        }
      }
    },

    jshint: {
      library: 'lib/**/*.js',
      tests: 'test/tests/**/*.js',
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: ['dist', 'tmp', 'docs/build'],

    mocha: {
      test: {
        options: {
          run: true,
          reporter: process.env.REPORTER || 'Spec',
          urls: function() {
            var bundle = process.env.BUNDLE || '';
            return [
              'http://localhost:8000/test/index.html?' + bundle
            ]
          }()
        }
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          parseOnly: true,
          paths: 'lib',
          outdir: 'docs/build'
        }
      }
    },

    'compile-handlebars': {
      docs: {
        template: 'docs/theme/main.hbs',
        templateData: 'docs/build/data.json',
        globals: ['docs/config.json'],
        helpers: 'docs/theme/helpers/**/*.js',
        output: 'docs/build/api.html'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-compile-handlebars');
};
