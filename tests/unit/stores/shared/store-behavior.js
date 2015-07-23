/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';

export default function(options = {}) {
  let syncExternalChanges = options.syncExternalChanges || Ember.K;
  let store;

  describe('#persist', () => {
    beforeEach(() => {
      store = options.store();
    });

    it('persists an object', () => {
      store.persist({ key: 'value' });

      expect(store.restore()).to.eql({ key: 'value' });
    });

    it('overrides existing data', () => {
      store.persist({ key1: 'value1' });
      store.persist({ key2: 'value2' });

      expect(store.restore()).to.eql({ key2: 'value2' });
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
      it('returns an empty object', () => {
        store.clear();
        expect(store.restore()).to.eql({});
      });
    });

    describe('when the store has data', () => {
      beforeEach(() => {
        store.persist({ key1: 'value1', key2: 'value2' });
      });

      it('returns all data in the store', () => {
        expect(store.restore()).to.eql({ key1: 'value1', key2: 'value2' });
      });

      it('returns a copy of the stored data', () => {
        let data = store.restore();
        data.key1 = 'another value!';

        expect(store.restore()).to.eql({ key1: 'value1', key2: 'value2' });
      });
    });
  });

  describe('#clear', () => {
    it('empties the store', () => {
      store.persist({ key1: 'value1', key2: 'value2' });
      store.clear();

      expect(store.restore()).to.eql({});
    });
  });
}
