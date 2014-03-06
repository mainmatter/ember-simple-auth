import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';
import { Base as BaseAuthenticator } from 'ember-simple-auth/authenticators/base';

describe('Session', function() {
  beforeEach(function() {
    this.store         = EphemeralStore.create();
    this.container     = { lookup: function() {} };
    this.authenticator = BaseAuthenticator.create();
    sinon.stub(this.container, 'lookup').returns(this.authenticator);
  });

  describe('initialization', function() {
    function itDoesNotRestore() {
      it('is not authenticated', function(done) {
        this.session = Session.create({ store: this.store, container: this.container });

        Ember.run.next(this, function() {
          expect(this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears the store', function(done) {
        this.store.persist({ some: 'properties' });
        this.session = Session.create({ store: this.store, container: this.container });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-failed" event', function(done) {
        var triggered = false;
        Session.create(
          { store: this.store, container: this.container }
        ).one('ember-simple-auth:session-authentication-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });
    }

    describe('when the restored data contains an authenticator factory', function() {
      beforeEach(function() {
        this.store.persist({ authenticatorFactory: 'authenticatorFactory' });
      });

      describe('when the authenticator resolves to restore', function() {
        beforeEach(function() {
          this.authenticatorStub = sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'properties' }));
        });

        it('is authenticated', function(done) {
          this.session = Session.create({ store: this.store, container: this.container });

          Ember.run.next(this, function() {
            expect(this.session.get('isAuthenticated')).to.be.true;
            done();
          });
        });

        it('sets its content to the data the authenticator resolves with', function(done) {
          this.session = Session.create({ store: this.store, container: this.container });

          Ember.run.next(this, function() {
            var properties = this.store.restore();
            delete properties.authenticatorFactory;

            expect(this.session.get('content')).to.eql({ some: 'properties' });
            done();
          });
        });

        it('persists its content in the store', function(done) {
          this.session = Session.create({ store: this.store, container: this.container });

          Ember.run.next(this, function() {
            var properties = this.store.restore();
            delete properties.authenticatorFactory;

            expect(properties).to.eql({ some: 'properties' });
            done();
          });
        });

        it('persists the authenticator factory in the store', function(done) {
          this.session = Session.create({ store: this.store, container: this.container });

          Ember.run.next(this, function() {
            expect(this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
            done();
          });
        });

        it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
          var triggered = false;
          Session.create(
            {store: this.store, container: this.container }
          ).one('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

          Ember.run.next(this, function() {
            expect(triggered).to.be.false;
            done();
          });
        });

        describe('when the authenticator triggers the "ember-simple-auth:session-updated" event', function() {
          it('updates its content', function(done) {
            this.session = Session.create({ store: this.store, container: this.container });

            Ember.run.next(this, function() {
              this.authenticator.trigger('ember-simple-auth:session-updated', { some: 'other property' });

              Ember.run.next(this, function() {
                expect(this.session.get('content')).to.eql({ some: 'other property' });
                done();
              });
            });
          });
        });
      });

      describe('when the authenticator rejects to restore', function() {
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
      this.session = Session.create({ store: this.store, container: this.container });
    });

    describe('when the authenticator resolves to authenticate', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'properties' }));
      });

      it('is authenticated', function(done) {
        var _this = this;

        this.session.authenticate('authenticatorFactory').then(function() {
          expect(_this.session.get('isAuthenticated')).to.be.true;
          done();
        });
      });

      it('returns a resolving promise', function(done) {
        this.session.authenticate('authenticatorFactory').then(function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('sets its content to the data the authenticator resolves with', function(done) {
        var _this = this;

        this.session.authenticate('authenticatorFactory').then(function() {
          expect(_this.session.get('content')).to.eql({ some: 'properties' });
          done();
        });
      });

      it('persists its content in the store', function(done) {
        var _this = this;

        this.session.authenticate('authenticatorFactory').then(function() {
          var properties = _this.store.restore();
          delete properties.authenticatorFactory;

          expect(properties).to.eql({ some: 'properties' });
          done();
        });
      });

      it('persists the authenticator factory in the store', function(done) {
        var _this = this;

        this.session.authenticate('authenticatorFactory').then(function() {
          expect(_this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
        this.session.one('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });
        this.session.authenticate('authenticatorFactory');
        var triggered = false;

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-failed" event', function(done) {
        this.session.one('ember-simple-auth:session-authentication-failed', function() { triggered = true; });
        this.session.authenticate('authenticatorFactory');
        var triggered = false;

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      describe('when the authenticator triggers the "ember-simple-auth:session-updated" event', function() {
        it('updates its content', function(done) {
          var _this = this;

          this.session.authenticate('authenticatorFactory').then(function() {
            _this.authenticator.trigger('ember-simple-auth:session-updated', { some: 'other property' });

            Ember.run.next(_this, function() {
              expect(_this.session.get('content')).to.eql({ some: 'other property' });
              done();
            });
          });
        });
      });
    });

    describe('when the authenticator rejects to authenticate', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.reject());
      });

      it('is not authenticated', function(done) {
        var _this = this;

        this.session.authenticate('authenticatorFactory').then(null, function() {
          expect(_this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('returns a rejecting promise', function(done) {
        this.session.authenticate('authenticatorFactory').then(null, function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('clears its content', function(done) {
        var _this = this;
        this.session.set('some', 'property');

        this.session.authenticate('authenticatorFactory').then(null, function() {
          expect(_this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        var _this = this;
        this.store.persist({ some: 'property' });

        this.session.authenticate('authenticatorFactory').then(null, function() {
          expect(_this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
        var triggered = false;
        this.session.one('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });
        this.session.authenticate('authenticatorFactory');

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-authentication-failed" event', function(done) {
        var triggered = false;
        this.session.one('ember-simple-auth:session-authentication-failed', function() { triggered = true; });
        this.session.authenticate('authenticatorFactory');

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          done();
        });
      });
    });
  });

  describe('invalidation', function() {
    beforeEach(function(done) {
      this.session = Session.create({ store: this.store, container: this.container });
      sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'property' }));
      this.session.authenticate('authenticatorFactory').then(function() {
        done();
      });
    });

    describe('when the authenticator resolves to invaldiate', function() {
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

      it('does not trigger the "ember-simple-auth:session-invalidation-failed" event', function(done) {
        var triggered = false;
        this.session.one('ember-simple-auth:session-invalidation-failed', function() { triggered = true; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
        var triggered = false;
        this.session.one('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          done();
        });
      });
    });

    describe('when the authenticator rejects to invalidate', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'invalidate').returns(Ember.RSVP.reject());
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
          expect(_this.store.restore()).to.eql({ some: 'property', authenticatorFactory: 'authenticatorFactory' });
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-invalidation-failed" event', function(done) {
        var triggered = false;
        this.session.one('ember-simple-auth:session-invalidation-failed', function() { triggered = true; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.true;
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
        var triggered = false;
        this.session.one('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });
        this.session.invalidate();

        Ember.run.next(this, function() {
          expect(triggered).to.be.false;
          done();
        });
      });

      describe('when the authenticator triggers the "ember-simple-auth:session-updated" event', function() {
        it('updates its content', function(done) {
          var _this = this;
          this.session.invalidate().then(null, function() {
            _this.authenticator.trigger('ember-simple-auth:session-updated', { some: 'other property' });

            Ember.run.next(_this, function() {
              expect(_this.session.get('content')).to.eql({ some: 'other property' });
              done();
            });
          });
        });
      });
    });
  });

  describe('when the store triggers the "ember-simple-auth:session-updated" event', function() {
    beforeEach(function() {
      this.session = Session.create({ store: this.store, container: this.container });
    });

    describe('when there is an authenticator factory in the event data', function() {
      describe('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'other property' }));
        });

        it('is authenticated', function(done) {
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

          Ember.run.next(this, function() {
            expect(this.session.get('isAuthenticated')).to.be.true;
            done();
          });
        });

        it('sets its content to the data the authenticator resolves with', function(done) {
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

          Ember.run.next(this, function() {
            var properties = this.store.restore();
            delete properties.authenticatorFactory;

            expect(this.session.get('content')).to.eql({ some: 'other property' });
            done();
          });
        });

        it('persists its content in the store', function(done) {
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

          Ember.run.next(this, function() {
            var properties = this.store.restore();
            delete properties.authenticatorFactory;

            expect(properties).to.eql({ some: 'other property' });
            done();
          });
        });

        it('persists the authenticator factory in the store', function(done) {
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

          Ember.run.next(this, function() {
            var properties = this.store.restore();
            delete properties.authenticatorFactory;

            expect(this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
            done();
          });
        });

        describe('when the session is already authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', true);
          });

          it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
            var triggered = false;
            this.session.one('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });
            this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

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

          it('triggers the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
            var triggered = false;
            this.session.one('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });
            this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

            Ember.run.next(this, function() {
              expect(triggered).to.be.true;
              done();
            });
          });
        });
      });

      describe('when the authenticator rejects to restore', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject({ some: 'other property' }));
        });

        it('is not authenticated', function(done) {
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

          Ember.run.next(this, function() {
            expect(this.session.get('isAuthenticated')).to.be.false;
            done();
          });
        });

        it('clears its content', function(done) {
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

          Ember.run.next(this, function() {
            expect(this.session.get('content')).to.eql({});
            done();
          });
        });

        it('clears the store', function(done) {
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

          Ember.run.next(this, function() {
            expect(this.store.restore()).to.eql({});
            done();
          });
        });

        describe('when the session is authenticated', function() {
          beforeEach(function() {
            this.session.set('isAuthenticated', true);
          });

          it('triggers the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
            var triggered = false;
            this.session.one('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });
            this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

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

          it('does not trigger the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
            var triggered = false;
            this.session.one('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

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
        this.store.trigger('ember-simple-auth:session-updated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its content', function(done) {
        this.store.trigger('ember-simple-auth:session-updated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        this.store.trigger('ember-simple-auth:session-updated', { some: 'other property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      describe('when the session is authenticated', function() {
        beforeEach(function() {
          this.session.set('isAuthenticated', true);
        });

        it('triggers the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
          var triggered = false;
          this.session.one('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property' });

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

        it('does not trigger the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
          var triggered = false;
          this.session.one('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

          Ember.run.next(this, function() {
            expect(triggered).to.be.false;
            done();
          });
        });
      });
    });
  });
});
