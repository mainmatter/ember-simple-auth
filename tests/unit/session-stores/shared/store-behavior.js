/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';

export default function(options) {
  let syncExternalChanges = options.syncExternalChanges || Ember.K;
  let store;

  beforeEach(() => {
    store = options.store();
  });

  describe('#persist', () => {
    it('persists an object', (done) => {
      store.persist({ key: 'value' }).then(() => {
        store.restore().then((restoredContent) => {
          expect(restoredContent).to.eql({ key: 'value' });
          done();
        });
      });
    });

    it('overrides existing data', (done) => {
      store.persist({ key1: 'value1' }).then(() => {
        store.persist({ key2: 'value2' }).then(() => {
          store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({ key2: 'value2' });
            done();
          });
        });
      });
    });

    it('does not trigger the "sessionDataUpdated" event', (done) => {
      let triggered = false;
      store.one('sessionDataUpdated', () => triggered = true);
      store.persist({ key: 'other value' });
      syncExternalChanges();

      Ember.run.next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });
  });

  describe('#restore', () => {
    describe('when the store is empty', () => {
      it('returns an empty object', (done) => {
        store.clear().then(() => {
          store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({});
            done();
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

      it('returns a copy of the stored data', (done) => {
        store.restore().then((data) => {
          data.key1 = 'another value!';

          store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({ key1: 'value1', key2: 'value2' });
            done();
          });
        });
      });
    });
  });

  describe('#clear', () => {
    it('empties the store', (done) => {
      store.persist({ key1: 'value1', key2: 'value2' }).then(() => {
        store.clear().then(() => {
          store.restore().then((restoredContent) => {
            expect(restoredContent).to.eql({});
            done();
          });
        });
      });
    });
  });
}
