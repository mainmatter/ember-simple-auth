module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release',
        'ember-data': 'components/ember-data#release'
      },
      resolutions: {
        'ember': 'release',
        'ember-data': 'beta'
      }
    },
    {
      name: 'ember-earliest',
      dependencies: {
        'ember': 'components/ember#1.12',
        'ember-data': 'components/ember-data#1.13',
        'ember-cli-shims': '0.0.6'
      },
      resolutions: {
        'ember': '1.12',
        'ember-data': '1.13',
        'ember-cli-shims': '0.0.6'
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
      }
    }
  ]
};
