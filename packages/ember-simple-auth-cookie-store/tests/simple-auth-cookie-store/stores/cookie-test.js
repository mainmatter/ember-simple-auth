import Cookie from 'simple-auth-cookie-store/stores/cookie';
import Configuration from 'simple-auth-cookie-store/configuration';
import itBehavesLikeAStore from 'tests/simple-auth/stores/shared/store-behavior';

describe('Stores.Cookie', function() {
  beforeEach(function() {
    this.store = Cookie.create();
  });

  itBehavesLikeAStore({
    syncExternalChanges: function() {
      this.store.syncData();
    }
  });

  describe('initilization', function() {
    it('assigns cookieDomain from the configuration object', function() {
      Configuration.cookieDomain = '.example.com';

      expect(Cookie.create().cookieDomain).to.eq('.example.com');
    });

    it('assigns cookieName from the configuration object', function() {
      Configuration.cookieName = 'cookieName';

      expect(Cookie.create().cookieName).to.eq('cookieName');
    });

    it('assigns cookieExpirationTime from the configuration object', function() {
      Configuration.cookieExpirationTime = 123;

      expect(Cookie.create().cookieExpirationTime).to.eq(123);
    });

    afterEach(function() {
      Configuration.load({}, {});
    });
  });

  describe('#persist', function() {
    it('respects the configured cookieName', function() {
      this.store = Cookie.create();
      this.store.cookieName = 'test:session';
      this.store.persist({ key: 'value' });

      expect(document.cookie).to.contain('test:session=%7B%22key%22%3A%22value%22%7D');
    });

    it('respects the configured cookieDomain', function() {
      this.store = Cookie.create();
      this.store.cookieDomain = 'example.com';
      this.store.persist({ key: 'value' });

      expect(document.cookie).to.eq('');
    });
  });

  describe('#renew', function() {
    beforeEach(function() {
      this.store.clear();
      this.store = Cookie.create();
      this.store.cookieName = 'test:session';
      this.store.cookieExpirationTime = 1; // 1 second
      this.store.persist({key: 'value' });
    });

    it('cookie exists after renew', function(done) {
      this.store.renew({key: 'value'});
      Ember.run.later(function() {
        try {
          expect(document.cookie).to.contain('test:session=%7B%22key%22%3A%22value%22%7D');
        } catch (error) {
          done(error);
        }
      },100);
    });

    it('cookie expires after cookie lifetime finish', function(done) {
      Ember.run.later(function() {
        try {
          expect(document.cookie).to.eq('');
        } catch (error) {
          done(error);
        }
      }, 600);
    });
  });

  describe('the "sessionDataUpdated" event', function() {
    beforeEach(function() {
      var _this = this;
      _this.triggered = false;
      this.store.persist({ key: 'value' });
      _this.store.one('sessionDataUpdated', function() {
        _this.triggered = true;
      });
    });

    it('is not triggered when the cookie has not actually changed', function(done) {
      document.cookie = 'ember_simple_auth:session=%7B%22key%22%3A%22value%22%7D;path=/;';
      this.store.syncData();

      Ember.run.next(this, function() {
        expect(this.triggered).to.be.false;
        done();
      });
    });

    it('is triggered when the cookie changed', function(done) {
      document.cookie = 'ember_simple_auth:session=%7B%22key%22%3A%22other%20value%22%7D;path=/;';
      this.store.syncData();

      Ember.run.next(this, function() {
        expect(this.triggered).to.be.true;
        done();
      });
    });
  });

  afterEach(function() {
    this.store.clear();
  });
});
