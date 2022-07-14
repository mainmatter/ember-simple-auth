'use strict';

/* eslint-env node */
/* eslint-disable no-var, object-shorthand, prefer-template */

var path = require('path');
var Funnel = require('broccoli-funnel');
var writeFile = require('broccoli-file-creator');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-simple-auth',

  included() {
    this._super.included.apply(this, arguments);
    this._ensureThisImport();

    const app = this._findHost();
    const config = app.options['ember-simple-auth'] || {};
    this.addonConfig = config;

    this.import('vendor/base64.js');
  },

  treeForVendor() {
    return new Funnel(path.dirname(require.resolve('base-64')), {
      files: ['base64.js']
    });
  },

  treeForAddon(tree) {
    let useSessionSetupMethodConfig = writeFile(
      'use-session-setup-method.js',
      `export default ${Boolean(this.addonConfig.useSessionSetupMethod)};`
    );

    return this._super.treeForAddon.call(this, MergeTrees([tree, useSessionSetupMethodConfig]));
  },

  treeForApp(tree) {
    if (this.addonConfig.useSessionSetupMethod) {
      return new Funnel(tree, {
        exclude: ['routes/application.js']
      });
    }

    return this._super.treeForApp.apply(this, arguments);
  },

  _ensureThisImport: function() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        var current = this;
        var app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
      this.import = function importShim(asset, options) {
        var app = this._findHost();
        app.import(asset, options);
      };
    }
  }
};

