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

  it('does not allow data to be stored for the key "secure"', function() {
    expect(function() {
      this.session.set('secure', 'test');
    }).to.throw(Error);
  });

  function itHandlesAuthenticatorEvents(preparation) {
    context('when the authenticator triggers the "sessionDataUpdated" event', function() {
      beforeEach(function(done) {
        preparation.apply(this, [done]);
      });

      it('stores the data the event is triggered with in its secure section', function(done) {
        this.authenticator.trigger('sessionDataUpdated', { some: 'property' });

        Ember.run.next(this, function() {
          expect(this.session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
          done();
        });
      });
    });

    context('when the authenticator triggers the "invalidated" event', function() {
      beforeEach(function(done) {
        preparation.apply(this, [done]);
      });

      it('is not authenticated', function(done) {
        this.authenticator.trigger('sessionDataInvalidated');

        Ember.run.next(this, function() {
          expect(this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its secure section', function(done) {
        this.session.set('content', { some: 'property', secure: { some: 'other property' } });
        this.authenticator.trigger('sessionDataInvalidated');

        Ember.run.next(this, function() {
          expect(this.session.get('content.secure')).to.eql({});
          done();
        });
      });

      it('updates the store', function(done) {
        this.authenticator.trigger('sessionDataInvalidated');

        Ember.run.next(this, function() {
          expect(this.store.restore().secure).to.eql({});
          done();
        });
      });

      it('triggers the "sessionInvalidationSucceeded" event', function(done) {
        this.session.one('sessionInvalidationSucceeded', function() {
          expect(true).to.be.true;
          done();
        });

        this.authenticator.trigger('sessionDataInvalidated');
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

      it('clears its secure section', function(done) {
        var _this = this;
        this.session.set('content', { secure: { some: 'other property' } });

        this.session.restore().then(null, function() {
          expect(_this.session.get('content.secure')).to.eql({});
          done();
        });
      });

      it('does not trigger the "sessionAuthenticationFailed" event', function(done) {
        var triggered = false;
        this.session.one('sessionAuthenticationFailed', function() { triggered = true; });

        this.session.restore().then(null, function() {
          expect(triggered).to.be.false;
          done();
        });
      });
    }

    context('when the restored data contains an authenticator factory', function() {
      beforeEach(function() {
        this.store.persist({ secure: { authenticator: 'authenticator' } });
      });

      context('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'property' }));
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

        it('stores the data the authenticator resolves with in its secure section', function(done) {
          var _this = this;
          this.store.persist({ secure: { authenticator: 'authenticator' } });

          this.session.restore().then(function() {
            var properties = _this.store.restore();
            delete properties.authenticator;

            expect(_this.session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
            done();
          });
        });

        it('persists its content in the store', function(done) {
          var _this = this;
          this.store.persist({ secure: { authenticator: 'authenticator' }, someOther: 'property' });
          this.session.restore().then(function() {
            var properties = _this.store.restore();
            delete properties.authenticator;

            expect(properties).to.eql({ secure: { some: 'property', authenticator: 'authenticator' }, someOther: 'property' });
            done();
          });
        });

        it('persists the authenticator factory in the store', function(done) {
          var _this = this;

          this.session.restore().then(function() {
            expect(_this.store.restore().secure.authenticator).to.eql('authenticator');
            done();
          });
        });

        it('does not trigger the "sessionAuthenticationSucceeded" event', function(done) {
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

      context('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject());
        });

        itDoesNotRestore();
      });
    });

    context('when the restored data does not contain an authenticator factory', function() {
      itDoesNotRestore();
    });
  });

  describe('authentication', function() {
    beforeEach(function() {
      this.session = Session.create();
      this.session.set('content', {});
      this.session.setProperties({ store: this.store, container: this.container });
    });

    context('when the authenticator resolves authentication', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'property' }));
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

      it('stores the data the authenticator resolves with in its secure section', function(done) {
        var _this = this;

        this.session.authenticate('authenticator').then(function() {
          expect(_this.session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
          done();
        });
      });

      it('persists its content in the store', function(done) {
        var _this = this;

        this.session.authenticate('authenticator').then(function() {
          var properties = _this.store.restore();
          delete properties.authenticator;

          expect(properties).to.eql({ secure: { some: 'property', authenticator: 'authenticator' } });
          done();
        });
      });

      it('persists the authenticator factory in the store', function(done) {
        var _this = this;

        this.session.authenticate('authenticator').then(function() {
          expect(_this.store.restore().secure.authenticator).to.eql('authenticator');
          done();
        });
      });

      it('triggers the "sessionAuthenticationSucceeded" event', function(done) {
        this.session.one('sessionAuthenticationSucceeded', function() {
          expect(true).to.be.true;
          done();
        });

        this.session.authenticate('authenticator');
      });

      it('does not trigger the "sessionAuthenticationFailed" event', function(done) {
        var triggered = false;
        this.session.one('sessionAuthenticationFailed', function() { triggered = true; });
        this.session.authenticate('authenticator');

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

    context('when the authenticator rejects authentication', function() {
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

      it('clears its secure section', function(done) {
        var _this = this;
        this.session.set('content', { some: 'property', secure: { some: 'other property' } });

        this.session.authenticate('authenticator').then(null, function() {
          expect(_this.session.get('content')).to.eql({ some: 'property', secure: {} });
          done();
        });
      });

      it('updates the store', function(done) {
        var _this = this;
        this.session.set('content', { some: 'property', secure: { some: 'other property' } });

        this.session.authenticate('authenticator').then(null, function() {
          expect(_this.store.restore()).to.eql({ some: 'property', secure: {} });
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
        this.session.one('sessionAuthenticationFailed', function(error) {
          expect(error).to.eql('error');
          done();
        });

        this.session.authenticate('authenticator');
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

    context('when the authenticator resolves invaldiation', function() {
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

      it('clears its secure section', function(done) {
        var _this = this;
        this.session.set('content', { some: 'property', secure: { some: 'other property' } });

        this.session.invalidate().then(function() {
          expect(_this.session.get('content')).to.eql({ some: 'property', secure: {} });
          done();
        });
      });

      it('updates the store', function(done) {
        var _this = this;
        this.session.set('content', { some: 'property', secure: { some: 'other property' } });

        this.session.invalidate().then(function() {
          expect(_this.store.restore()).to.eql({ some: 'property', secure: {} });
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
        this.session.one('sessionInvalidationSucceeded', function() {
          expect(true).to.be.true;
          done();
        });

        this.session.invalidate();
      });
    });

    context('when the authenticator rejects invalidation', function() {
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
          expect(_this.session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
          done();
        });
      });

      it('does not update the store', function(done) {
        var _this = this;

        this.session.invalidate().then(null, function() {
          expect(_this.store.restore()).to.eql({ secure: { some: 'property', authenticator: 'authenticator' } });
          done();
        });
      });

      it('triggers the "sessionInvalidationFailed" event', function(done) {
        this.session.one('sessionInvalidationFailed', function(error) {
          expect(error).to.eql('error');
          done();
        });

        this.session.invalidate();
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
    context('when a single property is set', function() {
      beforeEach(function() {
        this.session = Session.create({ store: this.store });
        this.session.set('some', 'property');
      });

      it('persists its content in the store', function(done) {
        Ember.run.next(this, function() {
          var properties = this.store.restore();
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'property', secure: {} });
          done();
        });
      });
    });

    context('when multiple properties are set at once', function() {
      beforeEach(function() {
        this.session = Session.create({ store: this.store });
        this.session.set('some', 'property');
        this.session.setProperties({ multiple: 'properties' });
      });

      it('persists its content in the store', function(done) {
        Ember.run.next(this, function() {
          var properties = this.store.restore();
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'property', multiple: 'properties', secure: {} });
          done();
        });
      });
    });
  });

  context('when the store triggers the "sessionDataUpdated" event', function() {
    beforeEach(function() {
      this.session = Session.create();
      this.session.setProperties({ store: this.store, container: this.container });
    });

    context('when there is an authenticator factory in the event data', function() {
      context('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'other property' }));
        });

        it('is authenticated', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(this, function() {
            expect(this.session.get('isAuthenticated')).to.be.true;
            done();
          });
        });

        it('stores the data the authenticator resolves with in its secure section', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(this, function() {
            expect(this.session.get('secure')).to.eql({ some: 'other property', authenticator: 'authenticator' });
            done();
          });
        });

        it('persists its content in the store', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(this, function() {
            var properties = this.store.restore();

            expect(properties).to.eql({ some: 'property', secure: { some: 'other property', authenticator: 'authenticator' } });
            done();
          });
        });

        context('when the session is already authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', true);
          });

          it('does not trigger the "sessionAuthenticationSucceeded" event', function(done) {
            var triggered = false;
            this.session.one('sessionAuthenticationSucceeded', function() { triggered = true; });
            this.store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

            Ember.run.next(this, function() {
              expect(triggered).to.be.false;
              done();
            });
          });
        });

        context('when the session is not already authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', false);
          });

          it('triggers the "sessionAuthenticationSucceeded" event', function(done) {
            this.session.one('sessionAuthenticationSucceeded', function() {
              expect(true).to.be.true;
              done();
            });

            this.store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });
          });
        });
      });

      context('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject());
        });

        it('is not authenticated', function(done) {
          this.store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(this, function() {
            expect(this.session.get('isAuthenticated')).to.be.false;
            done();
          });
        });

        it('clears its secure section', function(done) {
          this.session.set('content', { some: 'property', secure: { some: 'other property' } });
          this.store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(this, function() {
            expect(this.session.get('content.secure')).to.eql({});
            done();
          });
        });

        it('updates the store', function(done) {
          this.session.set('content', { some: 'property', secure: { some: 'other property' } });
          this.store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(this, function() {
            expect(this.store.restore()).to.eql({ some: 'other property', secure: {} });
            done();
          });
        });

        context('when the session is authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', true);
          });

          it('triggers the "sessionInvalidationSucceeded" event', function(done) {
            this.session.one('sessionInvalidationSucceeded', function() {
              expect(true).to.be.true;
              done();
            });

            this.store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });
          });
        });

        context('when the session is not authenticated', function() {
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

    context('when there is no authenticator factory in the store', function() {
      it('is not authenticated', function(done) {
        this.store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its secure section', function(done) {
        this.session.set('content', { some: 'property', secure: { some: 'other property' } });
        this.store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({ some: 'other property', secure: {} });
          done();
        });
      });

      it('updates the store', function(done) {
        this.session.set('content', { some: 'property', secure: { some: 'other property' } });
        this.store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({ some: 'other property', secure: {} });
          done();
        });
      });

      context('when the session is authenticated', function() {
        beforeEach(function() {
          this.session.set('isAuthenticated', true);
        });

        it('triggers the "sessionInvalidationSucceeded" event', function(done) {
          this.session.one('sessionInvalidationSucceeded', function() {
            expect(true).to.be.true;
            done();
          });

          this.store.trigger('sessionDataUpdated', { some: 'other property' });
        });
      });

      context('when the session is not authenticated', function() {
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
