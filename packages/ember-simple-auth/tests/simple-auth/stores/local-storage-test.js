import LocalStorage from 'simple-auth/stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';

describe('Stores.LocalStorage', function() {
  beforeEach(function() {
    this.store = LocalStorage.create();
    this.store.clear();
  });

  itBehavesLikeAStore();

  describe('initilization', function() {
    describe('when no global environment object is defined', function() {
      it('defaults key to "ember_simple_auth:session"', function() {
        expect(LocalStorage.create().key).to.eq('ember_simple_auth:session');
      });
    });

    describe('when global environment object is defined', function() {
      beforeEach(function() {
        window.ENV = window.ENV || {};
        window.ENV['simple-auth'] = {
          localStorageKey: 'aDifferentKey'
        };
      });

      it('uses the defined value for serverTokenEndpoint', function() {
        expect(LocalStorage.create().key).to.eq('aDifferentKey');
      });

      afterEach(function() {
        delete window.ENV['simple-auth'];
      });
    });
  });
});
