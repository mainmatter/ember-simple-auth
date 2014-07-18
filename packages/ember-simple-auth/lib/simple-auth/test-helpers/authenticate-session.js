var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Configuration from '../configuration';

export default Ember.Test.registerAsyncHelper('authenticateSession', function(app) {
  var session = app.__container__.lookup(Configuration.session);
  session.authenticate('simple-auth-authenticator:test');
  return wait();
});
