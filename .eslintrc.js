module.exports = {
  root: true,
  extends: [
    'simplabs',
    'simplabs/plugins/ember',
    'plugin:ember/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  rules: {
    'ember/local-modules': 'off',
    'ember/no-get': 'off',
    'ember/avoid-leaking-state-in-components': 'off',

    // Legacy Ember features
    'ember/no-actions-hash': 'off',
    'ember/no-classic-classes': 'off',
    'ember/no-classic-components': 'off',
    'ember/no-private-routing-service': 'off',
    'ember/require-tagless-components': 'off',

    // TODO: REMOVE
    'no-implicit-coercion': 'off',
    'no-multi-spaces': 'off',
    'no-multi-str': 'off',
    'no-trailing-spaces': 'off',
    'no-unused-vars': 'off',
    'no-var': 'off',
    'prefer-template': 'off',
    'quotes': 'off',
    'semi': 'off'
  },
  overrides: [
    // node files
    {
      files: [
        'ember-cli-build.js',
        'fastboot-server.js',
        'testem.js',
        'config/**/*.js',
        '.eslintrc.js',
      ],
      excludedFiles: [
        'app/**',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        "node/no-extraneous-require": "off",
        "node/no-unpublished-require": "off"
        // add your custom rules and overrides for node files here
      })
    },
    // Tests
    {
      files: ['tests/**/*.js'],
      extends: ['plugin:qunit/recommended'],
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
      },
      rules: {
        'qunit/no-assert-equal': 'off',
      }
    }
  ]
};
