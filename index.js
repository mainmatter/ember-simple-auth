/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-simple-auth',

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/ember-simple-auth/register-version.js');
  }
};
