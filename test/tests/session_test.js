import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';
import { Base as BaseAuthenticator } from 'ember-simple-auth/authenticators/base';
import { async } from './support/async';

describe('Session', function() {
  beforeEach(function() {
    this.store         = EphemeralStore.create();
    this.container     = { lookup: function() {} };
    this.authenticator = BaseAuthenticator.create();
    sinon.stub(this.container, 'lookup').returns(this.authenticator);
    this.session = Session.create({ store: this.store, container: this.container });
  });

  function itListensToAuthenticatorEvents() {
    describe('when the authenticator triggers the "ember-simple-auth:session-updated" event', function() {
      beforeEach(async(function() {
        this.authenticator.trigger('ember-simple-auth:session-updated', { some: 'other property' });
      }));

      it('updates its content', async(function() {
        expect(this.session.get('content')).to.eql({ some: 'other property' });
      }));
    });
  }

  describe('initialization', function() {
    beforeEach(function() {
      this.store = EphemeralStore.create();
    });

    function itFailsToRestore() {
      it('is not authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(false);
      }));

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
        this.session.on('ember-simple-auth:session-authentication-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });
    }

    describe('when the restored properties contain an authenticator factory', function() {
      beforeEach(function() {
        this.store.persist({ authenticatorFactory: 'authenticatorFactory' });
      });

      describe('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          this.authenticatorStub = sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'properties' }));
          this.session = Session.create({ store: this.store, container: this.container });
        });

        it('is authenticated', async(function() {
          expect(this.session.get('isAuthenticated')).to.be(true);
        }));

        it('sets its content to the properties the auhneticator resolves with', async(function() {
          var properties = this.store.restore();
          delete properties.authenticatorFactory;

          expect(this.session.get('content')).to.eql({ some: 'properties' });
        }));

        it('persists its content in the store', async(function() {
          var properties = this.store.restore();
          delete properties.authenticatorFactory;

          expect(properties).to.eql({ some: 'properties' });
        }));

        it('persists the authenticator factory in the store', async(function(done) {
          expect(this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
        }));

        it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
          var triggered = false;
          this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

          Ember.run.next(this, function() {
            expect(triggered).to.be(false);
            done();
          });
        });

        itListensToAuthenticatorEvents();
      });

      describe('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject());
          this.session = Session.create({ store: this.store, container: this.container });
        });

        itFailsToRestore();
      });
    });

    describe('when the restored properties do not contain an authenticator factory', function() {
      itFailsToRestore();
    });
  });

  describe('authentication', function() {
    describe('when the authenticator resolves authnetication', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'properties' }));
        this.session.authenticate('authenticatorFactory');
      });

      it('is authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(true);
      }));

      it('returns a resolving promise', function(done) {
        this.session.authenticate('authenticatorFactory').then(function() {
          expect(true).to.be.ok();
          done();
        }, function() {
          expect().fail();
          done();
        });
      });

      it('sets its content to the properties the auhneticator resolves with', async(function() {
        expect(this.session.get('content')).to.eql({ some: 'properties' });
      }));

      it('persists its content in the store', async(function() {
        var properties = this.store.restore();
        delete properties.authenticatorFactory;

        expect(properties).to.eql({ some: 'properties' });
      }));

      it('persists the authenticator factory in the store', async(function(done) {
        expect(this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
      }));

      it('triggers the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      itListensToAuthenticatorEvents();
    });

    describe('when the authenticator rejects authnetication', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.reject());
        this.session.authenticate('authenticatorFactory');
      });

      it('is not authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(false);
      }));

      it('returns a rejecting promise', function(done) {
        this.session.authenticate('authenticatorFactory').then(function() {
          expect().fail();
          done();
        }, function() {
          expect(true).to.be.ok();
          done();
        });
      });

      it('clears its content', function(done) {
        this.session.set('some', 'property');

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        this.store.persist({ some: 'property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-authentication-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });
    });
  });

  describe('invalidation', function() {
    beforeEach(function() {
      sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'property' }));
      this.session.authenticate('authenticatorFactory');
    });

    describe('when the authenticator resolves invalidation', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'invalidate').returns(Ember.RSVP.resolve());
        this.session.invalidate();
      });

      it('is not authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(false);
      }));

      it('returns a resolving promise', function(done) {
        this.session.invalidate().then(function() {
          expect(true).to.be.ok();
          done();
        }, function() {
          expect().fail();
          done();
        });
      });

      it('clears its content', function(done) {
        this.session.set('some', 'property');

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        this.store.persist({ some: 'property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-invalidation-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });
    });

    describe('when the authenticator rejects invalidation', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'invalidate').returns(Ember.RSVP.reject());
        this.session.invalidate();
      });

      it('stays authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(true);
      }));

      it('returns a rejecting promise', function(done) {
        this.session.invalidate().then(function() {
          expect().fail();
          done();
        }, function() {
          expect(true).to.be.ok();
          done();
        });
      });

      it('keeps its content', async(function() {
        expect(this.session.get('content')).to.eql({ some: 'property' });
      }));

      it('keeps the store', async(function() {
        expect(this.store.restore()).to.eql({ some: 'property', authenticatorFactory: 'authenticatorFactory' });
      }));

      it('triggers the "ember-simple-auth:session-invalidation-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      itListensToAuthenticatorEvents();
    });
  });

  describe('when the store triggers the "ember-simple-auth:session-updated" event', function() {
    describe('when there is an authenticator factory in the event data', function() {
      describe('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'other property' }));
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });
        });

        it('is authenticated', async(function() {
          expect(this.session.get('isAuthenticated')).to.be(true);
        }));

        it('sets its content to the properties the auhneticator resolves with', async(function() {
          var properties = this.store.restore();
          delete properties.authenticatorFactory;

          expect(this.session.get('content')).to.eql({ some: 'other property' });
        }));

        it('persists its content in the store', async(function() {
          var properties = this.store.restore();
          delete properties.authenticatorFactory;

          expect(properties).to.eql({ some: 'other property' });
        }));

        it('persists the authenticator factory in the store', async(function(done) {
          expect(this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
        }));

        describe('when the session is already authenticated', function() {
          beforeEach(async(function() {
            this.session.set('isAuthenticated', true);
          }));

          it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
            var triggered = false;
            this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

            Ember.run.next(this, function() {
              expect(triggered).to.be(false);
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
            this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });
            this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

            Ember.run.next(this, function() {
              expect(triggered).to.be(true);
              done();
            });
          });
        });
      });

      describe('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject({ some: 'other property' }));
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });
        });

        it('is not authenticated', async(function() {
          expect(this.session.get('isAuthenticated')).to.be(false);
        }));

        it('clears its content', async(function() {
          expect(this.session.get('content')).to.eql({});
        }));

        it('clears the store', async(function() {
          expect(this.store.restore()).to.eql({});
        }));

        describe('when the session is authenticated', function() {
          beforeEach(async(function() {
            this.session.set('isAuthenticated', true);
          }));

          it('triggers the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
            var triggered = false;
            this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });
            this.store.trigger('ember-simple-auth:session-updated', { some: 'other property', authenticatorFactory: 'authenticatorFactory' });

            Ember.run.next(this, function() {
              expect(triggered).to.be(true);
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
            this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

            Ember.run.next(this, function() {
              expect(triggered).to.be(false);
              done();
            });
          });
        });
      });
    });

    describe('when there is no authenticator factory in the store', function() {
      beforeEach(async(function() {
        this.store.trigger('ember-simple-auth:session-updated', { some: 'other property' });
      }));

      it('is not authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(false);
      }));

      it('clears its content', async(function() {
        expect(this.session.get('content')).to.eql({});
      }));

      it('clears the store', async(function() {
        expect(this.store.restore()).to.eql({});
      }));

      describe('when the session is authenticated', function() {
        beforeEach(function() {
          this.session.set('isAuthenticated', true);
        });

        it('triggers the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
          var triggered = false;
          this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });
          this.store.trigger('ember-simple-auth:session-updated', { some: 'other property' });

          Ember.run.next(this, function() {
            expect(triggered).to.be(true);
            done();
          });
        });
      });

      describe('when the session is not authenticated', function() {
        beforeEach(async(function() {
          var _this = this;
          this.session.invalidate().then(function() {
            _this.store.trigger('ember-simple-auth:session-updated', { some: 'other property' });
          });
        }));

        it('does not trigger the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
          var triggered = false;
          this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

          Ember.run.next(this, function() {
            expect(triggered).to.be(false);
            done();
          });
        });
      });
    });
  });
});
