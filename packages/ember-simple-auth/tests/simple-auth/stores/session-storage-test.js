import SessionStorage from 'simple-auth/stores/session-storage';
import Configuration from 'simple-auth/configuration';
import itBehavesLikeAStore from './shared/store-behavior';

describe('Stores.SessionStorage', function() {
  beforeEach(function() {
    this.store = SessionStorage.create();
    this.store.clear();
  });

  itBehavesLikeAStore();

  describe('initilization', function() {
    it('defaults key to "ember_simple_auth:session"', function() {
      expect(SessionStorage.create().key).to.eq('ember_simple_auth:session');
    });

    it('assigns sessionStorageKey from the configuration object', function() {
      Configuration.sessionStorageKey = 'sessionStorageKey';

      expect(SessionStorage.create().key).to.eq('sessionStorageKey');
    });
  });
});
