/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';

const { run: { next }, K } = Ember;

export default function(options) {
  let syncExternalChanges = options.syncExternalChanges || K;
  let store;

  beforeEach(() => {
    store = options.store();
  });

  describe('#persist', () => {
    it('persists an object', () => {
      return store.persist({ key: 'value' }).then(() => {
        return store.restore().then((restoredContent) => {
          expect(restoredContent).to.eql({ key: 'value' });
        });
      });
    });

    it('overrides existing data', () => {
      return store.persist({ key1: 'value1' }).then(() => {
        return store.persist({ key2: 'value2' }).then(() => {
          return store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({ key2: 'value2' });
          });
        });
      });
    });

    it('does not trigger the "sessionDataUpdated" event', (done) => {
      let triggered = false;
      store.one('sessionDataUpdated', () => triggered = true);
      store.persist({ key: 'other value' });
      syncExternalChanges();

      next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });
  });

  describe('#restore', () => {
    describe('when the store is empty', () => {
      it('returns an empty object', () => {
        return store.clear().then(() => {
          return store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({});
          });
        });
      });
    });

    describe('when the store has data', () => {
      beforeEach(() => {
        return store.persist({ key1: 'value1', key2: 'value2' });
      });

      it('returns all data in the store', () => {
        return store.restore().then((restoredContent) => {
          expect(restoredContent).to.eql({ key1: 'value1', key2: 'value2' });
        });
      });

      it('returns a copy of the stored data', () => {
        return store.restore().then((data) => {
          data.key1 = 'another value!';

          return store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({ key1: 'value1', key2: 'value2' });
          });
        });
      });
    });
  });

  describe('#clear', () => {
    it('empties the store', () => {
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
