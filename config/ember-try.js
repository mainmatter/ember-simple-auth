'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary')
  ]).then(urls => {
    const releaseUrl = urls[0];
    const betaUrl = urls[0];
    const canaryUrl = urls[0];
    return {
      useYarn: true,
      scenarios: [
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
          name: 'ember-lts-2.18',
          bower: {
            dependencies: {
              ember: null,
              'ember-cli-shims': null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': '~2.18.0',
              'ember-source': '~2.18.0',
            },
          },
        },
        {
          name: 'ember-3.0',
          bower: {
            dependencies: {
              ember: null,
              'ember-cli-shims': null,
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
          name: 'ember-release',
          bower: {
            dependencies: {
              'ember-cli-shims': null,
              'ember-data': null,
            }
          },
          npm: {
            devDependencies: {
              'ember-data': 'emberjs/data#release',
              'ember-source': releaseUrl,
            },
          },
        },
        {
          name: 'ember-beta',
          bower: {
            dependencies: {
              'ember-cli-shims': null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': 'emberjs/data#beta',
              'ember-source': betaUrl,
            },
          },
        },
        {
          name: 'ember-canary',
          bower: {
            dependencies: {
              'ember-cli-shims': null,
              'ember-data': null,
            },
          },
          npm: {
            devDependencies: {
              'ember-data': 'emberjs/data#master',
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
