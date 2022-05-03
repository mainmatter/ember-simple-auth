/* eslint-env node */

module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  overrides: [
    // node files
    {
      files: [
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/utils.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**',
        'tests/dummy/lib/my-engine/**',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015,
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        'node/no-extraneous-require': 'off',
        'node/no-unpublished-require': 'off',
        // add your custom rules and overrides for node files here
      }),
    },
    {
      files: ['node-tests/blueprints/**/*.js'],
      env: {
        node: true,
        mocha: true,
      },
    },
    {
      files: ['tests/**/*.js'],
      extends: ['plugin:qunit/recommended'],
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
      },
      rules: {
        'qunit/no-assert-equal': 'off',
      },
    },
  ],
};
