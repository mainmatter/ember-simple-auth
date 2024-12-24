import BaseAuthenticator from './base';

export default BaseAuthenticator.extend({
  restore(data) {
    return Promise.resolve(data);
  },

  authenticate(data) {
    return Promise.resolve(data);
  },

  invalidate() {
    return Promise.resolve();
  },
});
