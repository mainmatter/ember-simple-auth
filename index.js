/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-simple-auth',

  included: function(app) {
    this._super.included(app);

    app.import('vendor/ember-simple-auth/register-version.js');
  }
};
