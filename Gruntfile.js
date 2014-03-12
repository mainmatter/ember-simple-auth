module.exports = function(grunt) {
  this.registerTask('default', ['test']);

  this.registerTask('dist', 'Builds a distributable version of Ember.SimpleAuth', [
    'lint',
    'build',
    'uglify:library',
    'uglify:browser',
    'copy:dist'
  ]);

  this.registerTask('build', 'Builds Ember.SimpleAuth', [
    'clean',
    'transpile:amd',
    'concat:amd',
    'concat:browser'
  ]);

  this.registerTask('build_tests', "Builds Ember.SimpleAuth's tests", [
    'build',
    'transpile:tests',
    'concat:tests',
  ]);

  this.registerTask('lint', 'Applies all the JSHint/spacing rules', [
    'jshint',
    'lintspaces'
  ]);

  this.registerTask('dev_server', 'Runs a development server', [
    'build_tests',
    'connect:dev',
    'watch'
  ]);

  this.registerTask('test', 'Executes the tests', [
    'lint',
    'build_tests',
    'connect:dev',
    'mocha'
  ]);

  this.registerTask('docs', 'Builds the documentation', [
    'yuidoc',
    'compile-handlebars:docs',
    'copy:docs'
  ]);

  this.registerTask('copy:dist', 'Copies all distribution files to /dist', [
    'copy:plain',
    'copy:min',
    'copy:amd'
  ]);

  this.registerTask('examples', 'Runs the examples server', [
    'build',
    'connect:examples'
  ]);

  var packages = grunt.file.expand({ filter: 'isDirectory', cwd: 'packages' }, '*');

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
      files: ['packages/**/*'],
      tasks: ['build_tests', 'lint']
    },

    transpile: {
      amd: {
        type: 'amd',
        files: packages.map(function(pkg) {
          return {
            expand: true,
            cwd: 'packages/' + pkg + '/lib/',
            src: ['**/*.js'],
            dest: 'tmp/libs'
          };
        })
      },
      tests: {
        type: 'amd',
        files: packages.map(function(pkg) {
          return {
            expand: true,
            cwd: 'packages/' + pkg,
            src: ['tests/**/*.js'],
            dest: 'tmp/tests/' + pkg
          };
        })
      }
    },

    concat: {
      amd: {
        files: (function() {
          var files = {};
          packages.forEach(function(pkg) {
            files['tmp/' + pkg + '.amd.js'] = ['tmp/libs/' + pkg + '.js', 'tmp/libs/' + pkg + '/**/*.js'];
          });
          return files;
        })()
      },
      browser: {
        files: (function() {
          var files = {};
          packages.forEach(function(pkg) {
            files['tmp/' + pkg + '.js'] = ['packages/' + pkg + '/wrap/browser.start', 'vendor/loader.js', 'tmp/libs/' + pkg + '.js', 'tmp/libs/' + pkg + '/**/*.js', 'packages/' + pkg + '/wrap/browser.end'];
          });
          return files;
        })()
      },
      tests: {
        files: (function() {
          var files = {};
          packages.forEach(function(pkg) {
            files['tmp/' + pkg + '-tests.amd.js'] = ['tmp/tests/' + pkg + '/**/*.js'];
          });
          return files;
        })()
      }
    },

    uglify: {
      library: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg + '.amd.js'],
            dest: 'tmp/' + pkg + '.amd.min.js'
          };
        })
      },
      browser: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg + '.js'],
            dest: 'tmp/' + pkg + '.min.js'
          };
        })
      }
    },

    copy: {
      plain: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg + '.js'],
            dest: 'dist/' + pkg + '-<%= pkg.version %>.js'
          };
        })
      },
      min: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg + '.min.js'],
            dest: 'dist/' + pkg + '-<%= pkg.version %>.min.js'
          };
        })
      },
      amd: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg + '.amd.min.js'],
            dest: 'dist/' + pkg + '-<%= pkg.version %>.amd.min.js'
          };
        })
      },
      docs: {
        files: [{
          src: ['tmp/api.html'],
          dest: 'dist/<%= pkg.name %>-<%= pkg.version %>-api-docs.html'
        }]
      }
    },

    jshint: {
      library: 'packages/*/lib/**/*.js',
      options: {
        jshintrc: '.jshintrc'
      },
      tests: {
        files: {
          src: ['packages/*/tests/**/*.js']
        },
        options: {
          jshintrc: '.jshintrc-tests'
        }
      }
    },

    clean: ['dist', 'tmp'],

    lintspaces: {
      all: {
        src: [
          'docs/theme/**/*',
          'examples/**/*',
          'packages/**/*',
          'test/lib/**/*',
          'test/index.html',
          'wrap/**/*'
        ],
        options: {
          newline: true,
          trailingspaces: true,
          indentation: 'spaces',
          spaces: 2
        }
      }
    },

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
          paths: 'packages',
          outdir: 'tmp'
        }
      }
    },

    'compile-handlebars': {
      docs: {
        template: 'docs/theme/main.hbs',
        templateData: 'tmp/data.json',
        globals: ['docs/config.json'],
        partials: 'docs/theme/partials/**/*.hbs',
        helpers: 'docs/theme/helpers/**/*.js',
        output: 'tmp/api.html'
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
  grunt.loadNpmTasks('grunt-lintspaces');
};
