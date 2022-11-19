'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

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
          npm: {
            devDependencies: {
              'ember-data': '~3.12.0',
              'ember-source': '~3.12.0',
            },
          },
        },
        {
          name: 'ember-lts-3.16',
          npm: {
            devDependencies: {
              'ember-data': '~3.16.0',
              'ember-source': '~3.16.0',
            },
          },
        },
        {
          name: 'ember-lts-3.20',
          npm: {
            devDependencies: {
              'ember-data': '~3.20.0',
              'ember-source': '~3.20.0',
            },
          },
        },
        {
          name: 'ember-lts-3.24',
          npm: {
            devDependencies: {
              'ember-data': '~3.24.0',
              'ember-source': '~3.24.0',
            },
          },
        },
        {
          name: 'ember-lts-3.28',
          npm: {
            devDependencies: {
              'ember-cli': '~3.28.0',
              'ember-data': '~3.28.0',
              'ember-source': '~3.28.0',
              torii: null,
            },
          },
        },
        {
          name: 'ember-4.0',
          npm: {
            devDependencies: {
              'ember-cli': '~3.28.0',
              'ember-data': '~4.0.0',
              'ember-source': '~4.0.0',
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
              '@ember/test-helpers': '^2.4.2',
              'ember-qunit': '^5.1.4',
              qunit: '^2.17.2',
              torii: null,
              'ember-cli-app-version': '~5.0.0',
              '@ember/legacy-built-in-components': "~0.4.0",
            },
          },
        },
        {
          name: 'ember-lts-4.4',
          npm: {
            devDependencies: {
              'ember-cli': '~3.28.0',
              'ember-data': '~4.4.0',
              'ember-source': '~4.4.0',
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
              '@ember/test-helpers': '^2.4.2',
              'ember-qunit': '^5.1.4',
              qunit: '^2.17.2',
              torii: null,
              'ember-cli-app-version': '~5.0.0',
              '@ember/legacy-built-in-components': "~0.4.0",
            },
          },
        },
        {
          name: 'ember-release',
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
              'ember-cli-app-version': '~5.0.0',
              '@ember/legacy-built-in-components': "~0.4.0",
              torii: null,
            },
          },
        },
        {
          name: 'ember-beta',
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
              'ember-cli-app-version': '~5.0.0',
              '@ember/legacy-built-in-components': "~0.4.0",
              torii: null,
            },
          },
        },
        {
          name: 'ember-canary',
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
              'ember-cli-app-version': '~5.0.0',
              '@ember/legacy-built-in-components': "~0.4.0",
              torii: null,
            },
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {}
          }
        },
        embroiderSafe({
          npm: {
            devDependencies: {
              torii: null,
              'ember-data': '~4.4.0',
            }
          }
        }),
        embroiderOptimized({
          npm: {
            devDependencies: {
              'ember-data': '~4.4.0',
            }
          }
        })
      ]
    };
  });
};
