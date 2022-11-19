import RSVP from 'rsvp';
import BaseAuthenticator from './base';

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
