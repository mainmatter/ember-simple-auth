import { Cookie } from 'ember-simple-auth/stores/cookie';
import { storeBehavior } from './common/store-behavior';

describe('Stores.Cookie', function() {
  beforeEach(function() {
    this.store = Cookie.create();
    this.store.clear();
  });

  storeBehavior();

  describe('the "ember-simple-auth:session-updated" event', function() {
    beforeEach(function() {
      var _this = this;
      _this.triggered = false;
      this.store.persist({ key: 'value' });
      _this.store.one('ember-simple-auth:session-updated', function() {
        _this.triggered = true;
      });
    });

    it('is not triggered when the store changes the cookie itself', function() {
      this.store.syncProperties();

      expect(this.triggered).to.be(false);
    });

    it('is not triggered when nothing actually changes in the cookie', function() {
      this.store.syncProperties();

      expect(this.triggered).to.be(false);
    });

    it('is triggered when the cookie is changed outside of the store', function() {
      document.cookie = 'ember_simple_auth:key=other value;';
      this.store.syncProperties();

      expect(this.triggered).to.be(true);
    });
  });
});
