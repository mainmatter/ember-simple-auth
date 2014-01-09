'use strict';

Ember.SimpleAuth.Authorizers.OAuth2 = Ember.SimpleAuth.Authorizers.Base.extend({
  authorize: function(jqXHR, requestOptions) {
    if (!Ember.isEmpty(this.get('session.authToken'))) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.get('session.authToken'));
    }
  }
});
