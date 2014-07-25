import Configuration from 'simple-auth/configuration';

var testHelpers = function() {
  Ember.Test.registerAsyncHelper('authenticateSession', function(app) {
    var session = app.__container__.lookup(Configuration.session);
    session.authenticate('simple-auth-authenticator:test');
    return wait();
  });

  Ember.Test.registerAsyncHelper('invalidateSession', function(app) {
    var session = app.__container__.lookup(Configuration.session);
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  });
}();

export default testHelpers;
