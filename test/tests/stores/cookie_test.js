import { Cookie } from 'ember-simple-auth/stores/cookie';
import { itBehavesLikeAStore } from './common/store_behavior';

describe('Stores.Cookie', function() {
  beforeEach(function() {
    this.store = Cookie.create();
    this.store.clear();
  });

  itBehavesLikeAStore();

  describe('the "ember-simple-auth:session-updated" event', function() {
    beforeEach(function() {
      var _this = this;
      _this.triggered = false;
      this.store.persist({ key: 'value' });
      _this.store.one('ember-simple-auth:session-updated', function() {
        _this.triggered = true;
      });
    });

    it('is not triggered by #persist', function() {
      this.store.persist({ key: 'other value' });
      this.store.syncProperties();

      expect(this.triggered).to.be(false);
    });

    describe('when the cookie does not actually change', function() {
      beforeEach(function() {
        document.cookie = 'ember_simple_auth:key=value;';
      });

      it('is not triggered', function() {
        this.store.syncProperties();

        expect(this.triggered).to.be(false);
      });
    });

    describe('when the cookie changes', function() {
      beforeEach(function() {
        document.cookie = 'ember_simple_auth:key=other value;';
      });

      it('is triggered', function() {
        this.store.syncProperties();

        expect(this.triggered).to.be(true);
      });
    });
  });
});
