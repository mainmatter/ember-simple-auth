import BaseAuthenticator from './base';

export default class TestAuthenticator extends BaseAuthenticator {
  restore(data) {
    return Promise.resolve(data);
  }

  authenticate(data) {
    return Promise.resolve(data);
  }

  invalidate() {
    return Promise.resolve();
  }
}
