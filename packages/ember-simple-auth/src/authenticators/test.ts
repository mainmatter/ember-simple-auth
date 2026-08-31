import BaseAuthenticator from './base';

export default class TestAuthenticator extends BaseAuthenticator {
  static id = 'test';

  restore(data: any) {
    return Promise.resolve(data);
  }

  authenticate(data: any) {
    return Promise.resolve(data);
  }

  invalidate() {
    return Promise.resolve();
  }
}
