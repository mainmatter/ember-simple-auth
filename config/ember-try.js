/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'default',
      bower: {
        dependencies: {}
      }
    },
    {
      name: 'ember-1.12',
      bower: {
        dependencies: {
          'ember': '~1.12.0',
          'ember-data': '~1.13.0',
          'ember-cli-shims': '0.0.6'
        },
        resolutions: {
          'ember': '~1.12.0',
          'ember-data': '~1.13.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release'
        },
        resolutions: {
          'ember': 'release'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#release'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
        },
        resolutions: {
          'ember': 'beta'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#beta'
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary'
        },
        resolutions: {
          'ember': 'canary'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#master'
        }
      }
    }
  ]
};
