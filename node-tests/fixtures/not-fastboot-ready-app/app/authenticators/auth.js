import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

const { RSVP: { resolve, reject }, inject: { service } } = Ember;

export default BaseAuthenticator.extend({
  session: service(),

  authenticate() {
    return resolve({ account_id: '123' });
  },

  invalidate() {
    return resolve();
  },

  restore(data) {
    if (this.get('session.shouldError')) {
      return reject();
    } else {
      return resolve(data);
    }
  }

});
