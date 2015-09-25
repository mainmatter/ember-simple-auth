/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import Cookie from 'ember-simple-auth/stores/cookie';
import itBehavesLikeAStore from './shared/store-behavior';

describe('CookieStore', () => {
  let store;

  beforeEach(() => {
    store = Cookie.create();
  });

  afterEach(() => {
    store.clear();
  });

  itBehavesLikeAStore({
    store() {
      return store;
    },
    syncExternalChanges() {
      store._syncData();
    }
  });

  describe('#persist', () => {
    it('respects the configured cookieName', () => {
      store            = Cookie.create();
      store.cookieName = 'test:session';
      store.persist({ key: 'value' });

      expect(document.cookie).to.contain('test:session=%7B%22key%22%3A%22value%22%7D');
    });

    it('respects the configured cookieDomain', () => {
      store              = Cookie.create();
      store.cookieDomain = 'example.com';
      store.persist({ key: 'value' });

      expect(document.cookie).to.not.contain('test:session=%7B%22key%22%3A%22value%22%7D');
    });
  });

  describe('#renew', () => {
    beforeEach(() => {
      store                      = Cookie.create();
      store.cookieName           = 'test:session';
      store.cookieExpirationTime = 60;
      store.expires              = new Date().getTime() + store.cookieExpirationTime * 1000;
      store.persist({ key: 'value' });
      store._renew();
    });

    it('stores the expiration time in a cookie named "test:session:expiration_time"', () => {
      expect(document.cookie).to.contain(`${store.cookieName}:expiration_time=60`);
    });
  });

  describe('the "sessionDataUpdated" event', () => {
    let triggered;

    beforeEach(() => {
      triggered = false;
      store.persist({ key: 'value' });
      store.one('sessionDataUpdated', () => {
        triggered = true;
      });
    });

    it('is not triggered when the cookie has not actually changed', (done) => {
      document.cookie = 'ember_simple_auth:session=%7B%22key%22%3A%22value%22%7D;path=/;';
      store._syncData();

      Ember.run.next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });

    it('is triggered when the cookie changed', (done) => {
      document.cookie = 'ember_simple_auth:session=%7B%22key%22%3A%22other%20value%22%7D;path=/;';
      store._syncData();

      Ember.run.next(() => {
        expect(triggered).to.be.true;
        done();
      });
    });

    it('is not triggered when the cookie expiration was renewed', (done) => {
      store._renew({ key: 'value' });
      store._syncData();

      Ember.run.next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });
  });
});
