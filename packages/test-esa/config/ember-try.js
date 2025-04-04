'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = function () {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then(urls => {
    const releaseUrl = urls[0];
    const betaUrl = urls[1];
    const canaryUrl = urls[2];
    return {
      usePnpm: true,
      scenarios: [
        {
          name: 'ember-lts-4.12',
          npm: {
            devDependencies: {
              'ember-cli': '~4.12.0',
              'ember-source': '~4.12.0',
              'ember-data': '~4.12.1',
            },
          },
        },
        {
          name: 'ember-lts-5.4',
          npm: {
            devDependencies: {
              'ember-cli': '~5.4.0',
              'ember-source': '~5.4.0',
              'ember-data': '~5.3.0',
            },
          },
        },
        {
          name: 'ember-lts-5.8',
          npm: {
            devDependencies: {
              'ember-cli': '~5.8.0',
              'ember-source': '~5.8.0',
              'ember-data': '~5.3.0',
            },
          },
        },
        {
          name: 'ember-lts-5.12',
          npm: {
            devDependencies: {
              'ember-cli': '~5.12.0',
              'ember-source': '~5.12.0',
              'ember-data': '~5.3.0',
            },
          },
        },
        {
          name: 'ember-6.0',
          npm: {
            devDependencies: {
              'ember-cli': '~6.0.0',
              'ember-source': '~6.0.0',
              'ember-data': '~5.3.0',
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
              torii: null,
            },
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {
              torii: null,
            },
          },
        },
        embroiderSafe({
          npm: {
            devDependencies: {
              torii: null,
            },
          },
        }),
        embroiderOptimized({
          npm: {
            devDependencies: {
              torii: null,
            },
          },
        }),
      ],
    };
  });
};
