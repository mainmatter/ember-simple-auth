import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import LocalStorage from 'ember-simple-auth/stores/local-storage';
import Configuration from 'ember-simple-auth/configuration';
import itBehavesLikeAStore from './shared/store-behavior';

describe('LocalStorageStore', () => {
  let store;

  beforeEach(() => {
    store = LocalStorage.create();
  });

  afterEach(() => {
    store.clear();
  });

  itBehavesLikeAStore({
    store() {
      return store;
    }
  });

  describe('initilization', () => {
    it('defaults key to "ember_simple_auth:session"', () => {
      expect(LocalStorage.create().key).to.eq('ember_simple_auth:session');
    });

    it('assigns key from the configuration object', () => {
      Configuration.localStorage.key = 'localStorageKey';

      expect(LocalStorage.create().key).to.eq('localStorageKey');
    });
  });
});
