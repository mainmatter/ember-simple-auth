var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Configuration from '../configuration';

export default Ember.Test.registerAsyncHelper('invalidateSession', function(app) {
  var session = app.__container__.lookup(Configuration.session);
  if (session.get('isAuthenticated')) {
    session.invalidate();
  }
  return wait();
});
