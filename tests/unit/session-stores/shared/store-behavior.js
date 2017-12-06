import { next } from '@ember/runloop';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

export default function(options) {
  let syncExternalChanges = options.syncExternalChanges || function() {};
  let store;

  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(function() {
    store = options.store();
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  afterEach(function() {
    store.clear();
  });

  describe('#persist', function() {
    it('persists an object', function() {
      return store.persist({ key: 'value' }).then(() => {
        return store.restore().then((restoredContent) => {
          expect(restoredContent).to.eql({ key: 'value' });
        });
      });
    });

    it('overrides existing data', function() {
      return store.persist({ key1: 'value1' }).then(() => {
        return store.persist({ key2: 'value2' }).then(() => {
          return store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({ key2: 'value2' });
          });
        });
      });
    });

    it('does not trigger the "sessionDataUpdated" event', function(done) {
      let triggered = false;
      store.one('sessionDataUpdated', () => (triggered = true));
      store.persist({ key: 'other value' });
      syncExternalChanges();

      next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });
  });

  describe('#restore', function() {
    describe('when the store is empty', function() {
      it('returns an empty object', function() {
        return store.clear().then(() => {
          return store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({});
          });
        });
      });
    });

    describe('when the store has data', function() {
      beforeEach(function() {
        return store.persist({ key1: 'value1', key2: 'value2' });
      });

      it('returns all data in the store', function() {
        return store.restore().then((restoredContent) => {
          expect(restoredContent).to.eql({ key1: 'value1', key2: 'value2' });
        });
      });

      it('returns a copy of the stored data', function() {
        return store.restore().then((data) => {
          data.key1 = 'another value!';

          return store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({ key1: 'value1', key2: 'value2' });
          });
        });
      });
    });
  });

  describe('#clear', function() {
    it('empties the store', function() {
      return store.persist({ key1: 'value1', key2: 'value2' }).then(() => {
        return store.clear().then(() => {
          return store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({});
          });
        });
      });
    });
  });
}
