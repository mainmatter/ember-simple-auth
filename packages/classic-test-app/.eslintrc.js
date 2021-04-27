/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    'simplabs',
    'simplabs/plugins/ember',
    'plugin:ember/recommended',
  ],
  rules: {
    'ember/local-modules': 'off',
    'ember/no-get': 'off',
    'ember/avoid-leaking-state-in-components': 'off',
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  overrides: [
    // node files
    {
      files: [
        'ember-cli-build.js',
        'fastboot-server.js',
        'testem.js',
        'config/**/*.js',
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
    }
  ]
};
