/* jshint expr:true */
import { it } from 'ember-mocha';
import Ember from 'ember';

export default function(options) {
  var syncExternalChanges = (options || {}).syncExternalChanges || Ember.K;
  var store;

  describe('#persist', function() {
    beforeEach(() => {
       store = (options || {}).store();
    });

    it('persists an object', function() {
      store.persist({ key: 'value' });

      expect(store.restore()).to.eql({ key: 'value' });
    });

    it('overrides existing data', function() {
      store.persist({ key1: 'value1' });
      store.persist({ key2: 'value2' });

      expect(store.restore()).to.eql({ key2: 'value2' });
    });

    it('does not trigger the "sessionDataUpdated" event', function(done) {
      var triggered = false;
      store.one('sessionDataUpdated', function() { triggered = true; });
      store.persist({ key: 'other value' });
      syncExternalChanges.call();

      Ember.run.next(function() {
        expect(triggered).to.be.false;
        done();
      });
    });
  });

  describe('#restore', function() {
    context('when the store is empty', function() {
      it('returns an empty object', function() {
        expect(store.restore()).to.eql({});
      });
    });

    context('when the store has data', function() {
      beforeEach(function() {
        store.persist({ key1: 'value1', key2: 'value2' });
      });

      it('returns all data in the store', function() {
        expect(store.restore()).to.eql({ key1: 'value1', key2: 'value2' });
      });

      it('returns a copy of the stored data', function() {
        var data = store.restore();
        data.key1 = 'another value!';

        expect(store.restore()).to.eql({ key1: 'value1', key2: 'value2' });
      });
    });
  });

  describe('#clear', function() {
    it('empties the store', function() {
      store.persist({ key1: 'value1', key2: 'value2' });
      store.clear();

      expect(store.restore()).to.eql({});
    });
  });
}
