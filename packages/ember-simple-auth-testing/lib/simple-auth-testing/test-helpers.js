import Configuration from 'simple-auth/configuration';

export default function() {
  Ember.Test.registerAsyncHelper('authenticateSession', function(app) {
    var session = app.__container__.lookup(Configuration.session);
    session.authenticate('simple-auth-authenticator:test');
    return wait();
  });

  Ember.Test.registerHelper('currentSession', function(app) {
    var session = app.__container__.lookup(Configuration.session);
    return session;
  });

  Ember.Test.registerAsyncHelper('invalidateSession', function(app) {
    var session = app.__container__.lookup(Configuration.session);
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  });
}
