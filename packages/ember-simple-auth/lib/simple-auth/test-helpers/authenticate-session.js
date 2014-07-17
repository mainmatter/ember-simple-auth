var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

export default Ember.Test.registerAsyncHelper('authenticateSession', function(app) {
  var session = app.__container__.lookup('simple-auth-session:main');
  session.authenticate('simple-auth-authenticator:test');
  return wait();
});
