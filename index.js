'use strict';

/* eslint-env node */
/* eslint-disable no-var, object-shorthand */

module.exports = {
  name: 'ember-simple-auth',

  included: function() {
    this._super.included.apply(this, arguments);
    this._ensureThisImport();

    this.import('vendor/ember-simple-auth/register-version.js');
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
