/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    '../../.eslintrc.js',
  ],
  rules: {
    'ember/no-get': 'error',
    'ember/avoid-leaking-state-in-ember-objects': 'error',

    // Legacy Ember features
    'ember/no-actions-hash': 'error',
    'ember/no-classic-classes': 'error',
    'ember/no-classic-components': 'error',
    'ember/no-private-routing-service': 'error',
    'ember/require-tagless-components': 'error',

    // TODO: REMOVE
    'no-implicit-coercion': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-trailing-spaces': 'error',
    'no-unused-vars': 'error',
    'no-var': 'error',
    'prefer-template': 'error',
    'quotes': 'error',
    'semi': 'error'
  },
};
