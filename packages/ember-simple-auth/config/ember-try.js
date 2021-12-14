'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary')
  ]).then(urls => {
    const releaseUrl = urls[0];
    const betaUrl = urls[1];
    const canaryUrl = urls[2];
    return {
      useYarn: true,
      scenarios: [
        {
          name: 'ember-lts-3.12',
          bower: {
            dependencies: {
              ember: null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~3.12.0',
              'ember-source': '~3.12.0',
            },
          },
        },
        {
          name: 'ember-lts-3.16',
          bower: {
            dependencies: {
              ember: null,
              'ember-cli-shims': null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~3.16.0',
              'ember-source': '~3.16.0',
            },
          },
        },
        {
          name: 'ember-lts-3.20',
          bower: {
            dependencies: {
              ember: null,
              'ember-cli-shims': null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~3.20.0',
              'ember-source': '~3.20.0',
            },
          },
        },
        {
          name: 'ember-lts-3.24',
          bower: {
            dependencies: {
              ember: null,
              'ember-cli-shims': null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~3.24.0',
              'ember-source': '~3.24.0',
            },
          },
        },
        {
          name: 'ember-lts-3.28',
          bower: {
            dependencies: {
              ember: null,
              'ember-cli-shims': null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-cli': '~3.28.0',
              'ember-data': '~3.28.0',
              'ember-source': '~3.28.0',
            },
          },
        },
        {
          name: 'ember-release',
          bower: {
            dependencies: {
              'ember-data': null,
            }
          },
          npm: {
            devDependencies: {
              'ember-cli': 'latest',
              'ember-data': 'latest',
              'ember-source': releaseUrl,
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
              '@ember/test-helpers': '^2.4.2',
              'ember-qunit': '^5.1.4',
              qunit: '^2.17.2',
            },
          },
        },
        {
          name: 'ember-beta',
          bower: {
            dependencies: {
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-cli': 'beta',
              'ember-data': 'beta',
              'ember-source': betaUrl,
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
              '@ember/test-helpers': '^2.4.2',
              'ember-qunit': '^5.1.4',
              qunit: '^2.17.2',
            },
          },
        },
        {
          name: 'ember-canary',
          bower: {
            dependencies: {
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-cli': 'beta',
              'ember-data': 'canary',
              'ember-source': canaryUrl,
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
              '@ember/test-helpers': '^2.4.2',
              'ember-qunit': '^5.1.4',
              qunit: '^2.17.2',
            },
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {}
          }
        }
      ]
    };
  });
};
