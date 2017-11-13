/* eslint-env node */
module.exports = {
  command: 'yarn test',
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-1.12',
      bower: {
        dependencies: {
          ember: '~1.12.0',
          'ember-cli-shims': '0.0.6',
          'ember-data': '~1.13.0',
        },
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': '~1.13.0',
          'ember-source': null,
        },
      },
    },
    {
      name: 'ember-1.13',
      bower: {
        dependencies: {
          ember: '~1.13.0',
          'ember-cli-shims': '0.0.6',
          'ember-data': '~1.13.0',
        },
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': '~1.13.0',
          'ember-source': null,
        },
      },
    },
    {
      name: 'ember-2.0',
      bower: {
        dependencies: {
          ember: '~2.0.0',
          'ember-cli-shims': '0.0.6',
          'ember-data': '~2.0.0',
        },
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': '~2.0.0',
          'ember-source': null,
        },
      },
    },
    {
      name: 'ember-lts-2.4',
      bower: {
        dependencies: {
          ember: 'components/ember#lts-2-4',
          'ember-cli-shims': '0.1.0',
          'ember-data': null,
        },
        resolutions: {
          ember: 'lts-2-4',
        },
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': '~2.4.0',
          'ember-source': null,
        },
      },
    },
    {
      name: 'ember-lts-2.8',
      bower: {
        dependencies: {
          ember: 'components/ember#lts-2-8',
          'ember-cli-shims': null,
          'ember-data': null,
        },
        resolutions: {
          ember: 'lts-2-8',
        },
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0',
          'ember-source': null,
        },
      },
    },
    {
      name: 'ember-lts-2.12',
      bower: {
        dependencies: {
          ember: null,
          'ember-cli-shims': null,
          'ember-data': null,
        },
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.12.0',
          'ember-source': '~2.12.0',
        },
      },
    },
    {
      name: 'ember-lts-2.16',
      bower: {
        dependencies: {
          ember: null,
          'ember-cli-shims': null,
          'ember-data': null,
        },
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.16.0',
          'ember-source': '~2.16.0',
        },
      },
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          ember: 'components/ember#release',
          'ember-cli-shims': null,
          'ember-data': null,
        },
        resolutions: {
          ember: 'release',
        },
      },
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#release',
          'ember-source': null,
        },
      },
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          ember: 'components/ember#beta',
          'ember-cli-shims': null,
          'ember-data': null,
        },
        resolutions: {
          ember: 'beta',
        },
      },
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#beta',
          'ember-source': null,
        },
      },
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          ember: 'components/ember#canary',
          'ember-cli-shims': null,
          'ember-data': null,
        },
        resolutions: {
          ember: 'canary',
        },
      },
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#master',
          'ember-source': null,
        },
      },
    },
  ]
};
