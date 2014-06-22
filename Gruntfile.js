module.exports = function(grunt) {
  this.registerTask('default', ['test']);

  this.registerTask('dist', 'Builds a distributable version of SimpleAuth', [
    'lint',
    'build',
    'uglify:library',
    'uglify:browser',
    'copy:dist',
    'docs'
  ]);

  this.registerTask('build', 'Builds SimpleAuth', [
    'clean',
    'transpile:amd',
    'concat:amd',
    'concat:browser'
  ]);

  this.registerTask('build_tests', "Builds SimpleAuth's tests", [
    'build',
    'transpile:tests',
    'concat:tests',
  ]);

  this.registerTask('lint', 'Applies all the JSHint/spacing rules', [
    'jshint',
    'lintspaces'
  ]);

  this.registerTask('server', 'Runs a development server', [
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
    'compile-handlebars',
    'copy:docs'
  ]);

  this.registerTask('copy:dist', 'Copies all distribution files to /dist', [
    'copy:plain',
    'copy:min',
    'copy:amd',
    'copy:amd_min'
  ]);

  var packages = grunt.file.expand('packages/*/package.json').reduce(function(acc, package) {
    var packageContents = grunt.file.readJSON(package);
    acc.push(packageContents);
    return acc;
  }, []);

  grunt.initConfig({
    connect: {
      dev:{
        server: {},
        options: {
          hostname: '0.0.0.0',
          port: grunt.option('port') || 8000,
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
            cwd: 'packages/' + pkg.name + '/lib/',
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
            cwd: 'packages/',
            src: [pkg.name + '/tests/**/*.js'],
            dest: 'tmp/tests/' + pkg.name
          };
        })
      }
    },

    concat: {
      amd: {
        files: (function() {
          var files = {};
          packages.forEach(function(pkg) {
            files['tmp/' + pkg.name + '.amd.js'] = ['tmp/libs/' + pkg.name + '.js', 'tmp/libs/' + pkg.name + '/**/*.js'];
          });
          return files;
        })()
      },
      browser: {
        files: (function() {
          var files = {};
          packages.forEach(function(pkg) {
            files['tmp/' + pkg.name + '.js'] = ['packages/' + pkg.name + '/wrap/browser.start', 'vendor/loader.js', 'tmp/libs/' + pkg.name + '.js', 'tmp/libs/' + pkg.name + '/**/*.js', 'packages/' + pkg.name + '/wrap/browser.end'];
          });
          return files;
        })()
      },
      tests: {
        files: (function() {
          var files = {};
          packages.forEach(function(pkg) {
            files['tmp/' + pkg.name + '-tests.amd.js'] = ['tmp/tests/' + pkg.name + '/**/*.js'];
          });
          return files;
        })()
      }
    },

    uglify: {
      library: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg.name + '.amd.js'],
            dest: 'tmp/' + pkg.name + '.amd.min.js'
          };
        })
      },
      browser: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg.name + '.js'],
            dest: 'tmp/' + pkg.name + '.min.js'
          };
        })
      }
    },

    copy: {
      plain: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg.name + '.js'],
            dest: 'dist/' + pkg.name + '-' + pkg.version + '.js'
          };
        })
      },
      min: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg.name + '.min.js'],
            dest: 'dist/' + pkg.name + '-' + pkg.version + '.min.js'
          };
        })
      },
      amd: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg.name + '.amd.js'],
            dest: 'dist/' + pkg.name + '-' + pkg.version + '.amd.js'
          };
        })
      },
      amd_min: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/' + pkg.name + '.amd.min.js'],
            dest: 'dist/' + pkg.name + '-' + pkg.version + '.amd.min.js'
          };
        })
      },
      docs: {
        files: packages.map(function(pkg) {
          return {
            src: ['tmp/docs/' + pkg.name + '/api.html'],
            dest: 'dist/' + pkg.name + '-' + pkg.version + '-api-docs.html'
          };
        })
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

    yuidoc: packages.reduce(function(acc, pkg) {
      acc[pkg.name] = {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        options: {
          parseOnly: true,
          paths: 'packages/' + pkg.name,
          outdir: 'tmp/docs/' + pkg.name
        }
      };
      return acc;
    }, {}),

    'compile-handlebars': packages.reduce(function(acc, pkg) {
      acc[pkg.name] = {
        template: 'docs/theme/main.hbs',
        templateData: 'tmp/docs/' + pkg.name +  '/data.json',
        globals: ['docs/config.json', 'packages/' + pkg.name + '/package.json'],
        partials: 'docs/theme/partials/**/*.hbs',
        helpers: 'docs/theme/helpers/**/*.js',
        output: 'tmp/docs/' + pkg.name + '/api.html'
      }
      return acc;
    }, {})
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
