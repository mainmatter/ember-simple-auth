Ember.Test.registerAsyncHelper('authenticateSession', function(app, sessionData) {
  var session = app.__container__.lookup('simple-auth-session:main');
  session.authenticate('simple-auth-authenticator:test', sessionData);
  return wait();
});

Ember.Test.registerHelper('currentSession', function(app) {
  var session = app.__container__.lookup('simple-auth-session:main');
  return session;
});

Ember.Test.registerAsyncHelper('invalidateSession', function(app) {
  var session = app.__container__.lookup('simple-auth-session:main');
  if (session.get('isAuthenticated')) {
    session.invalidate();
  }
  return wait();
});