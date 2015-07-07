import Ember from 'ember';

const { alias, oneWay } = Ember.computed;

export default Ember.Service.extend({
  isAuthenticated: oneWay('session.isAuthenticated'),
  content:         alias('session.content'),

  authenticate() {
    const session = this.get('session');
    return session.authenticate.apply(session, arguments);
  },

  invalidate() {
    const session = this.get('session');
    return session.invalidate.apply(session, arguments);
  },
});
