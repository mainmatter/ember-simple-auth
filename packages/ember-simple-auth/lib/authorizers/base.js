'use strict';

Ember.SimpleAuth.Authorizers.Base = Ember.Object.extend({
  session: null,

  authorize: function(jqXHR, requestOptions) {
  }
});
