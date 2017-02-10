'use strict';

/* eslint-env node */
/* eslint-disable no-var, object-shorthand, prefer-template */

var writeFile = require('broccoli-file-creator');
var version = require('./package.json').version;

module.exports = {
  name: 'ember-simple-auth',

  included: function() {
    this._super.included.apply(this, arguments);
    this._ensureThisImport();

    this.import('vendor/ember-simple-auth/register-version.js');
  },

  treeForVendor: function() {
    var content = 'Ember.libraries.register(\'Ember Simple Auth\', \'' + version + '\');';
    return writeFile('ember-simple-auth/register-version.js', content);
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
