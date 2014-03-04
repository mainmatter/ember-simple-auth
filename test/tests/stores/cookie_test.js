import { Cookie } from 'ember-simple-auth/stores/cookie';
import { itBehavesLikeAStore } from './common/store_behavior';

describe('Stores.Cookie', function() {
  beforeEach(function() {
    this.store = Cookie.create();
    this.store.clear();
  });

  itBehavesLikeAStore({
    syncExternalChanges: function() {
      this.store.syncProperties();
    }
  });

  describe('the "ember-simple-auth:session-updated" event', function() {
    beforeEach(function() {
      var _this = this;
      _this.triggered = false;
      this.store.persist({ key: 'value' });
      _this.store.one('ember-simple-auth:session-updated', function() {
        _this.triggered = true;
      });
    });

    it('is not triggered when the cookie has not actually changed', function(done) {
      document.cookie = 'ember_simple_auth:key=value;';
      this.store.syncProperties();

      Ember.run.next(this, function() {
        expect(this.triggered).to.be(false);
        done();
      });
    });

    it('is triggered when the cookie changed', function(done) {
      document.cookie = 'ember_simple_auth:key=other value;';
      this.store.syncProperties();

      Ember.run.next(this, function() {
        expect(this.triggered).to.be(true);
        done();
      });
    });
  });
});
