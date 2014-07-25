export default function(options) {
  var syncExternalChanges = (options || {}).syncExternalChanges || Ember.K;

  describe('#persist', function() {
    it('persists an object', function() {
      this.store.persist({ key: 'value' });

      expect(this.store.restore()).to.eql({ key: 'value' });
    });

    it('overrides existing data', function() {
      this.store.persist({ key1: 'value1' });
      this.store.persist({ key2: 'value2' });

      expect(this.store.restore()).to.eql({ key2: 'value2' });
    });

    it('does not trigger the "updated" event', function(done) {
      var triggered = false;
      this.store.one('sessionDataUpdated', function() {
        triggered = true;
      });
      this.store.persist({ key: 'other value' });
      syncExternalChanges.apply(this);

      Ember.run.next(function() {
        expect(triggered).to.be.false;
        done();
      });
    });
  });

  describe('#restore', function() {
    describe('when the store is empty', function() {
      it('returns an empty object', function() {
        expect(this.store.restore()).to.eql({});
      });
    });

    describe('when the store has data', function() {
      beforeEach(function() {
        this.store.persist({ key1: 'value1', key2: 'value2' });
      });

      it('returns all data in the store', function() {
        expect(this.store.restore()).to.eql({ key1: 'value1', key2: 'value2' });
      });

      it('returns a copy of the stored data', function() {
        var data = this.store.restore();
        data.key1 = 'another value!';

        expect(this.store.restore()).to.eql({ key1: 'value1', key2: 'value2' });
      });
    });
  });

  describe('#clear', function() {
    it('empties the store', function() {
      this.store.persist({ key1: 'value1', key2: 'value2' });
      this.store.clear();

      expect(this.store.restore()).to.eql({});
    });
  });
}
