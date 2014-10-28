import Session from 'simple-auth/session';
import EphemeralStore from 'simple-auth/stores/ephemeral';
import Authenticator from 'simple-auth/authenticators/base';

describe('Session', function() {
  beforeEach(function() {
    this.store         = EphemeralStore.create();
    this.container     = { lookup: function() {} };
    this.authenticator = Authenticator.create();
    sinon.stub(this.container, 'lookup').returns(this.authenticator);
  });

  function itHandlesAuthenticatorEvents(preparation) {
    describe('when the authenticator triggers the "updated" event', function() {
      beforeEach(function(done) {
        preparation.apply(this, [done]);
      });

      it('merges its content to the data the event is triggered with', function(done) {
        this.session.set('existing', 'property');
        this.authenticator.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({ existing: 'property', some: 'other property' });
          done();
        });
      });
    });

    describe('when the authenticator triggers the "invalidated" event', function() {
      beforeEach(function(done) {
        preparation.apply(this, [done]);
      });

      it('is not authenticated', function(done) {
        this.authenticator.trigger('sessionDataInvalidated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its content', function(done) {
        this.authenticator.trigger('sessionDataInvalidated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        this.authenticator.trigger('sessionDataInvalidated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      it('triggers the "sessionInvalidationSucceeded" event', function(done) {
        var triggered = false;
        this.session.one('sessionInvalidationSucceeded', function() { triggered = true; });
        this.authenticator.trigger('sessionDataInvalidated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          done();
        });
      });
    });
  }

  describe('restore', function() {
    beforeEach(function() {
      this.session = Session.create();
      this.session.set('content', {});
      this.session.setProperties({ store: this.store, container: this.container });
    });

    function itDoesNotRestore() {
      it('returns a rejecting promise', function(done) {
        this.session.restore().then(null, function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('is not authenticated', function(done) {
        var _this = this;

        this.session.restore().then(null, function() {
          expect(_this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears the store', function(done) {
        var _this = this;
        this.store.persist({ some: 'properties' });

        this.session.restore().then(null, function() {
          expect(_this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "sessionAuthenticationFailed" event', function(done) {
        var _this = this;
        var triggered = false;
        this.session.one('sessionAuthenticationFailed', function() { triggered = true; });

        this.session.restore().then(null, function() {
          expect(triggered).to.be.false;
          done();
        });
      });
    }

    describe('when the restored data contains an authenticator factory', function() {
      beforeEach(function() {
        this.store.persist({ authenticator: 'authenticator' });
      });

      describe('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'properties' }));
        });

        it('returns a resolving promise', function(done) {
          this.session.restore().then(function() {
            expect(true).to.be.true;
            done();
          });
        });

        it('is authenticated', function(done) {
          var _this = this;

          this.session.restore().then(function() {
            expect(_this.session.get('isAuthenticated')).to.be.true;
            done();
          });
        });

        it('merges its content to the data the authenticator resolves with', function(done) {
          var _this = this;
          this.session.set('existing', 'property');
          this.store.persist({ authenticator: 'authenticator' });

          this.session.restore().then(function() {
            var properties = _this.store.restore();
            delete properties.authenticator;

            expect(_this.session.get('content')).to.eql({ existing: 'property', some: 'properties' });
            done();
          });
        });

        it('persists its content in the store', function(done) {
          var _this = this;

          this.session.restore().then(function() {
            var properties = _this.store.restore();
            delete properties.authenticator;

            expect(properties).to.eql({ some: 'properties' });
            done();
          });
        });

        it('persists the authenticator factory in the store', function(done) {
          var _this = this;

          this.session.restore().then(function() {
            expect(_this.store.restore().authenticator).to.eql('authenticator');
            done();
          });
        });

        it('does not trigger the "sessionAuthenticationSucceeded" event', function(done) {
          var _this     = this;
          var triggered = false;
          this.session.one('sessionAuthenticationSucceeded', function() { triggered = true; });

          this.session.restore().then(function() {
            expect(triggered).to.be.false;
            done();
          });
        });

        itHandlesAuthenticatorEvents(function(done) {
          var _this = this;
          this.session.restore().then(function() {
            _this.authenticator.restore.restore();
            done();
          });
        });
      });

      describe('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject());
        });

        itDoesNotRestore();
      });
    });

    describe('when the restored data does not contain an authenticator factory', function() {
      itDoesNotRestore();
    });
  });

  describe('authentication', function() {
    beforeEach(function() {
      this.session = Session.create();
      this.session.set('content', {});
      this.session.setProperties({ store: this.store, container: this.container });
    });

    describe('when the authenticator resolves authentication', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'properties' }));
      });

      it('is authenticated', function(done) {
        var _this = this;

        this.session.authenticate('authenticator').then(function() {
          expect(_this.session.get('isAuthenticated')).to.be.true;
          done();
        });
      });

      it('returns a resolving promise', function(done) {
        this.session.authenticate('authenticator').then(function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('merges its content to the data the authenticator resolves with', function(done) {
        var _this = this;
        this.session.set('existing', 'property');

        this.session.authenticate('authenticator').then(function() {
          expect(_this.session.get('content')).to.eql({ existing: 'property', some: 'properties' });
          done();
        });
      });

      it('persists its content in the store', function(done) {
        var _this = this;

        this.session.authenticate('authenticator').then(function() {
          var properties = _this.store.restore();
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'properties' });
          done();
        });
      });

      it('persists the authenticator factory in the store', function(done) {
        var _this = this;

        this.session.authenticate('authenticator').then(function() {
          expect(_this.store.restore().authenticator).to.eql('authenticator');
          done();
        });
      });

      it('triggers the "sessionAuthenticationSucceeded" event', function(done) {
        this.session.one('sessionAuthenticationSucceeded', function() { triggered = true; });
        this.session.authenticate('authenticator');
        var triggered = false;

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          done();
        });
      });

      it('does not trigger the "sessionAuthenticationFailed" event', function(done) {
        this.session.one('sessionAuthenticationFailed', function() { triggered = true; });
        this.session.authenticate('authenticator');
        var triggered = false;

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      itHandlesAuthenticatorEvents(function(done) {
        this.session.authenticate('authenticator').then(function() {
          done();
        });
      });
    });

    describe('when the authenticator rejects authentication', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.reject('error'));
      });

      it('is not authenticated', function(done) {
        var _this = this;

        this.session.authenticate('authenticator').then(null, function() {
          expect(_this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('returns a rejecting promise', function(done) {
        this.session.authenticate('authenticator').then(null, function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('clears its content', function(done) {
        var _this = this;
        this.session.set('some', 'property');

        this.session.authenticate('authenticator').then(null, function() {
          expect(_this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        var _this = this;
        this.store.persist({ some: 'property' });

        this.session.authenticate('authenticator').then(null, function() {
          expect(_this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "sessionAuthenticationSucceeded" event', function(done) {
        var triggered = false;
        this.session.one('sessionAuthenticationSucceeded', function() { triggered = true; });
        this.session.authenticate('authenticator');

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      it('triggers the "sessionAuthenticationFailed" event', function(done) {
        var triggered     = false;
        var triggeredWith = null;
        this.session.one('sessionAuthenticationFailed', function(error) { triggered = true; triggeredWith = error; });
        this.session.authenticate('authenticator');

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          expect(triggeredWith).to.eql('error');
          done();
        });
      });
    });
  });

  describe('invalidation', function() {
    beforeEach(function(done) {
      this.session = Session.create();
      this.session.set('content', {});
      this.session.setProperties({ store: this.store, container: this.container });
      sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'property' }));
      this.session.authenticate('authenticator').then(function() {
        done();
      });
    });

    describe('when the authenticator resolves to invaldiation', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'invalidate').returns(Ember.RSVP.resolve());
      });

      it('is not authenticated', function(done) {
        var _this = this;

        this.session.invalidate().then(function() {
          expect(_this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('returns a resolving promise', function(done) {
        this.session.invalidate().then(function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('clears its content', function(done) {
        var _this = this;
        this.session.set('some', 'property');

        this.session.invalidate().then(function() {
          expect(_this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        var _this = this;
        this.store.persist({ some: 'property' });

        this.session.invalidate().then(function() {
          expect(_this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "sessionInvalidationFailed" event', function(done) {
        var triggered = false;
        this.session.one('sessionInvalidationFailed', function() { triggered = true; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      it('triggers the "sessionInvalidationSucceeded" event', function(done) {
        var triggered = false;
        this.session.one('sessionInvalidationSucceeded', function() { triggered = true; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          done();
        });
      });
    });

    describe('when the authenticator rejects invalidation', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));
      });

      it('stays authenticated', function(done) {
        var _this = this;

        this.session.invalidate().then(null, function() {
          expect(_this.session.get('isAuthenticated')).to.be.true;
          done();
        });
      });

      it('returns a rejecting promise', function(done) {
        this.session.invalidate().then(null, function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('keeps its content', function(done) {
        var _this = this;

        this.session.invalidate().then(null, function() {
          expect(_this.session.get('content')).to.eql({ some: 'property' });
          done();
        });
      });

      it('does not update the store', function(done) {
        var _this = this;

        this.session.invalidate().then(null, function() {
          expect(_this.store.restore()).to.eql({ some: 'property', authenticator: 'authenticator' });
          done();
        });
      });

      it('triggers the "sessionInvalidationFailed" event', function(done) {
        var triggered     = false;
        var triggeredWith = null;
        this.session.one('sessionInvalidationFailed', function(error) { triggered = true; triggeredWith = error; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          expect(triggeredWith).to.eql('error');
          done();
        });
      });

      it('does not trigger the "sessionInvalidationSucceeded" event', function(done) {
        var triggered = false;
        this.session.one('sessionInvalidationSucceeded', function() { triggered = true; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      itHandlesAuthenticatorEvents(function(done) {
        done();
      });
    });
  });

  describe("when the session's content changes", function() {
    describe('when a single property is set', function() {
      beforeEach(function() {
        this.session = Session.create({ store: this.store });
        this.session.set('some', 'property');
      });

      it('persists its content in the store', function(done) {
        Ember.run.next(this, function() {
          var properties = this.store.restore();
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'property' });
          done();
        });
      });
    });

    describe('when multiple properties are set at once', function() {
      beforeEach(function() {
        this.session = Session.create({ store: this.store });
        this.session.set('some', 'property');
        this.session.setProperties({ multiple: 'properties' });
      });

      it('persists its content in the store', function(done) {
        Ember.run.next(this, function() {
          var properties = this.store.restore();
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'property', multiple: 'properties' });
          done();
        });
      });
    });
  });

  describe('when the store triggers the "updated" event', function() {
    beforeEach(function() {
      this.session = Session.create();
      this.session.setProperties({ store: this.store, container: this.container });
    });

    describe('when there is an authenticator factory in the event data', function() {
      describe('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'other property' }));
        });

        it('is authenticated', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

          Ember.run.next(this, function() {
            expect(this.session.get('isAuthenticated')).to.be.true;
            done();
          });
        });

        it('merges its content to the data the authenticator resolves with', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

          Ember.run.next(this, function() {
            var properties = this.store.restore();
            delete properties.authenticator;

            expect(this.session.get('content')).to.eql({ some: 'other property', multiple: 'properties' });
            done();
          });
        });

        it('persists its content in the store', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

          Ember.run.next(this, function() {
            var properties = this.store.restore();
            delete properties.authenticator;

            expect(properties).to.eql({ some: 'other property', multiple: 'properties' });
            done();
          });
        });

        describe('when the session is already authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', true);
          });

          it('does not trigger the "sessionAuthenticationSucceeded" event', function(done) {
            var triggered = false;
            this.session.one('sessionAuthenticationSucceeded', function() { triggered = true; });
            this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

            Ember.run.next(this, function() {
              expect(triggered).to.be.false;
              done();
            });
          });
        });

        describe('when the session is not already authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', false);
          });

          it('triggers the "sessionAuthenticationSucceeded" event', function(done) {
            var triggered = false;
            this.session.one('sessionAuthenticationSucceeded', function() { triggered = true; });
            this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

            Ember.run.next(this, function() {
              expect(triggered).to.be.true;
              done();
            });
          });
        });
      });

      describe('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject());
        });

        it('is not authenticated', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

          Ember.run.next(this, function() {
            expect(this.session.get('isAuthenticated')).to.be.false;
            done();
          });
        });

        it('clears its content', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

          Ember.run.next(this, function() {
            expect(this.session.get('content')).to.eql({});
            done();
          });
        });

        it('clears the store', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

          Ember.run.next(this, function() {
            expect(this.store.restore()).to.eql({});
            done();
          });
        });

        describe('when the session is authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', true);
          });

          it('triggers the "sessionInvalidationSucceeded" event', function(done) {
            var triggered = false;
            this.session.one('sessionInvalidationSucceeded', function() { triggered = true; });
            this.store.trigger('sessionDataUpdated', { some: 'other property', authenticator: 'authenticator' });

            Ember.run.next(this, function() {
              expect(triggered).to.be.true;
              done();
            });
          });
        });

        describe('when the session is not authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', false);
          });

          it('does not trigger the "sessionInvalidationSucceeded" event', function(done) {
            var triggered = false;
            this.session.one('sessionInvalidationSucceeded', function() { triggered = true; });

            Ember.run.next(this, function() {
              expect(triggered).to.be.false;
              done();
            });
          });
        });
      });
    });

    describe('when there is no authenticator factory in the store', function() {
      it('is not authenticated', function(done) {
        this.store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its content', function(done) {
        this.store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        this.store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      describe('when the session is authenticated', function() {
        beforeEach(function() {
          this.session.set('isAuthenticated', true);
        });

        it('triggers the "sessionInvalidationSucceeded" event', function(done) {
          var triggered = false;
          this.session.one('sessionInvalidationSucceeded', function() { triggered = true; });
          this.store.trigger('sessionDataUpdated', { some: 'other property' });

          Ember.run.next(this, function() {
            expect(triggered).to.be.true;
            done();
          });
        });
      });

      describe('when the session is not authenticated', function() {
        beforeEach(function() {
          this.session.set('isAuthenticated', false);
        });

        it('does not trigger the "sessionInvalidationSucceeded" event', function(done) {
          var triggered = false;
          this.session.one('sessionInvalidationSucceeded', function() { triggered = true; });

          Ember.run.next(this, function() {
            expect(triggered).to.be.false;
            done();
          });
        });
      });
    });
  });
});
