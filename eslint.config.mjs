import ember from 'eslint-plugin-ember';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import qunit from 'eslint-plugin-qunit';
import simplabsEmber from 'eslint-config-simplabs';
import n from 'eslint-plugin-n';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: [
      'node-tests/fixtures/',
      'blueprints/*/files/',
      'vendor/',
      'dist/',
      'tmp/',
      'bower_components/',
      'node_modules/',
      'coverage/',
      '!**/.*',
      '.node_modules.ember-try/',
      'bower.json.ember-try',
      'package.json.ember-try',
    ],
  },
  {
    files: [
      '**/app/**/*.js',
      '**/lib/**/*.js'
    ],
    plugins: {
      ember,
      simplabsEmber,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: babelParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        legacyDecorators: true,
      },
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
      quotes: 'off',
      semi: 'off',
    },
  },
  {
    files: [
      '**/.babelrc.js',
      '**/.eslintrc.js',
      '**/.eslintrc.js',
      '**/eslint.config.mjs',
      '**/prettier.config.mjs',
      '**/addon-main.js',
      '**/fastboot-server.js',
      '**/server/**/*.js',
      '**/server/*.js',
      '**/blueprints/*/index.js',
      '**/config/**/*.js',
      '**/config/*.js',
      '**/lib/my-engine/index.js',
      '**/testem.js',
      '**/ember-cli-build.js',
    ],

    ignores: ['src/**'],

    plugins: {
      n,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 6,
      sourceType: 'script',
    },
    rules: {
      'node/no-extraneous-require': 'off',
      'node/no-unpublished-require': 'off',
    },
  },
  {
    files: [
      '**/eslint.config.mjs',
      '**/prettier.config.mjs',
    ],
    languageOptions: {
      sourceType: 'module'
    }
  },
  {
    plugins: {
      qunit,
    },
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    files: ['**/tests/**/*-test.js'],
    rules: {
      'qunit/require-expect': ['error', 'except-simple'],
      quotes: ['error', 'single'],
    },
  },
];
