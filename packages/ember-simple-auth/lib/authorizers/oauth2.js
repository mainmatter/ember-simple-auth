'use strict';

Ember.SimpleAuth.Authorizers.OAuth2 = Ember.Object.extend({
  authorize: function(jqXHR, requestOptions) {
    if (!Ember.isEmpty(this.get('session.authToken'))) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.get('session.authToken'));
    }
  }
});
