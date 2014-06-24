import Cookie from 'simple-auth-cookie-store/stores/cookie';
import itBehavesLikeAStore from 'simple-auth/tests/stores/shared/store-behavior';

describe('Stores.Cookie', function() {
  beforeEach(function() {
    this.store = Cookie.create();
    this.store.clear();
  });

  itBehavesLikeAStore({
    syncExternalChanges: function() {
      this.store.syncData();
    }
  });

  describe('initilization', function() {
    describe('when no global environment object is defined', function() {
      it('defaults cookieNamePrefix to "ember_simple_auth:"', function() {
        expect(Cookie.create().cookieNamePrefix).to.eq('ember_simple_auth:');
      });

      it('defaults cookieExpirationTime to null', function() {
        expect(Cookie.create().cookieExpirationTime).to.be.null;
      });
    });

    describe('when global environment object is defined', function() {
      beforeEach(function() {
        window.ENV = window.ENV || {};
        window.ENV['simple-auth-cookie-store'] = {
          cookieNamePrefix:     'cookieNamePrefix',
          cookieExpirationTime: 1
        };
      });

      it('uses the defined value for cookieNamePrefix', function() {
        expect(Cookie.create().cookieNamePrefix).to.eq('cookieNamePrefix');
      });

      it('uses the defined value for cookieExpirationTime', function() {
        expect(Cookie.create().cookieExpirationTime).to.eq(1);
      });

      afterEach(function() {
        delete window.ENV['simple-auth-cookie-store'];
      });
    });
  });

  describe('#persist', function() {
    it('respects the configured cookieNamePrefix', function() {
      this.store = Cookie.create();
      this.store.cookieNamePrefix = 'test:';
      this.store.persist({ key: 'value' });

      expect(document.cookie).to.contain('test:key=value');
    });
  });

  describe('the "updated" event', function() {
    beforeEach(function() {
      var _this = this;
      _this.triggered = false;
      this.store.persist({ key: 'value' });
      _this.store.one('sessionDataUpdated', function() {
        _this.triggered = true;
      });
    });

    it('is not triggered when the cookie has not actually changed', function(done) {
      document.cookie = 'ember_simple_auth:key=value;';
      this.store.syncData();

      Ember.run.next(this, function() {
        expect(this.triggered).to.be.false;
        done();
      });
    });

    it('is triggered when the cookie changed', function(done) {
      document.cookie = 'ember_simple_auth:key=other value;';
      this.store.syncData();

      Ember.run.next(this, function() {
        expect(this.triggered).to.be.true;
        done();
      });
    });
  });
});
