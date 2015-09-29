import Ember from 'ember';

const SESSION_DATA_KEY_PREFIX = /^data\./;

const { computed, on }  = Ember;

export default Ember.Service.extend(Ember.Evented, {
  isAuthenticated: computed.oneWay('session.isAuthenticated'),
  data:            computed.oneWay('session.content'),

  set(key, value) {
    const setsSessionData = SESSION_DATA_KEY_PREFIX.test(key);
    if (setsSessionData) {
      const sessionDataKey = `session.${key.replace(SESSION_DATA_KEY_PREFIX, '')}`;
      return this._super(sessionDataKey, value);
    } else {
      return this._super(...arguments);
    }
  },

  _forwardSessionEvents: on('init', function() {
    Ember.A([
      'authenticationSucceeded',
      'invalidationSucceeded'
    ]).forEach((event) => {
      this.get('session').on(event, () => {
        this.trigger(event, ...arguments);
      });
    });
  }),

  authenticate() {
    const session = this.get('session');
    return session.authenticate(...arguments);
  },

  invalidate() {
    const session = this.get('session');
    return session.invalidate(...arguments);
  },

  authorize(authorizerFactory, block) {
    if (this.get('isAuthenticated')) {
      const authorizer = this.container.lookup(authorizerFactory);
      const sessionData = this.get('data.authenticated');
      authorizer.authorize(sessionData, block);
    }
  }
});
