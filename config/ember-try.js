/* eslint-env node */
/* eslint-disable no-var, object-shorthand */

module.exports = {
  scenarios: [
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
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.8',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-8'
        },
        resolutions: {
          'ember': 'lts-2-8'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0',
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.4',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-4',
          'ember-cli-shims': '0.1.3'
        },
        resolutions: {
          'ember': 'lts-2-4'
        }
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': '~2.4.0',
          'ember-source': null
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
          'ember-data': 'emberjs/data#release',
          'ember-source': null
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
          'ember-data': 'emberjs/data#beta',
          'ember-source': null
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
          'ember-data': 'emberjs/data#master',
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};
