import Ember from 'ember';

const { computed, on }  = Ember;
const { alias, oneWay } = computed;

export default Ember.Service.extend(Ember.Evented, {
  isAuthenticated: oneWay('session.isAuthenticated'),
  data:            alias('session.content'),

  _forwardSessionEvents: on('init', function() {
    Ember.A([
      'sessionAuthenticationSucceeded',
      'sessionAuthenticationFailed',
      'sessionInvalidationSucceeded',
      'sessionInvalidationFailed',
      'authorizationFailed'
    ]).forEach((event) => {
      this.get('session').on(event, () => {
        this.trigger(event, ...arguments);
      });
    });
  }),

  authenticate() {
    const session = this.get('session');
    return session.authenticate.apply(session, arguments);
  },

  invalidate() {
    const session = this.get('session');
    return session.invalidate.apply(session, arguments);
  }
});
