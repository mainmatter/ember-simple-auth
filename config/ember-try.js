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
        'ember-data': 'components/ember-data#1.13'
      },
      resolutions: {
        'ember': '1.12',
        'ember-data': '1.13'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta',
        'ember-data': 'components/ember-data#beta'
      },
      resolutions: {
        'ember': 'beta',
        'ember-data': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary',
        'ember-data': 'components/ember-data#canary'
      },
      resolutions: {
        'ember': 'canary',
        'ember-data': 'canary'
      }
    }
  ]
};
