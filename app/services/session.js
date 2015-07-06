import Ember from 'ember';

export default Ember.Service.extend({
  authenticate() {
    const session = this.get('session');
    return session.authenticate.apply(session, arguments);
  },

  invalidate() {
    const session = this.get('session');
    return session.invalidate.apply(session, arguments);
  },
});
