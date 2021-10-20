/* eslint-env node */

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'simplabs',
    'simplabs/plugins/ember',
    'eslint:recommended',
  ],
  env: {
    browser: true,
  },
  plugins: ['ember'],
  rules: {
    'ember/local-modules': 'off',
    'ember/no-get': 'off',
    'ember/avoid-leaking-state-in-components': 'off',
    'no-prototype-builtins': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**',
        'tests/dummy/lib/my-engine/**'
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ]
};
