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
          name: 'ember-3.0',
          bower: {
            dependencies: {
              ember: null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~3.0.0',
              'ember-source': '~3.0.0',
            },
          },
        },
        {
          name: 'ember-lts-3.4',
          bower: {
            dependencies: {
              ember: null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~3.4.0',
              'ember-source': '~3.4.0',
            },
          },
        },
        {
          name: 'ember-lts-3.8',
          bower: {
            dependencies: {
              ember: null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~3.8.0',
              'ember-source': '~3.8.0',
            },
          },
        },
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
          name: 'ember-release',
          bower: {
            dependencies: {
              'ember-data': null,
            }
          },
          npm: {
            devDependencies: {
              'ember-data': 'latest',
              'ember-source': releaseUrl,
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
              'ember-data': 'beta',
              'ember-source': betaUrl,
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
              'ember-data': 'canary',
              'ember-source': canaryUrl,
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
