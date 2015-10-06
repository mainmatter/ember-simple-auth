import Ember from 'ember';
import BaseAuthenticator from './base';

const { RSVP } = Ember;

export default BaseAuthenticator.extend({
  restore(data) {
    return RSVP.resolve(data);
  },

  authenticate(data) {
    return RSVP.resolve(data);
  },

  invalidate() {
    return RSVP.resolve();
  }
});
