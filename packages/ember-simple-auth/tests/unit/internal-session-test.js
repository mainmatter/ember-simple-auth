import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import RSVP from 'rsvp';
import { next } from '@ember/runloop';
import sinonjs from 'sinon';
import Authenticator from 'ember-simple-auth/authenticators/base';

module('InternalSession', function(hooks) {
  setupTest(hooks);

  let sinon;
  let session;
  let store;
  let authenticator;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();

    this.owner.register('authenticator:test', Authenticator);
    authenticator = this.owner.lookup('authenticator:test');
    session = this.owner.lookup('session:main');
    store = session.get('store');
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  test('does not allow data to be stored for the key "authenticated"', function(assert) {
    try {
      session.set('authenticated', 'test');
      assert.ok(false);
    }
    catch (e) {
      assert.ok(true);
    }
  });

  function itHandlesAuthenticatorEvents(preparation) {
    module('when the authenticator triggers the "sessionDataUpdated" event', function(hooks) {
      hooks.beforeEach(function() {
        return preparation.call();
      });

      test('stores the data the event is triggered with in its authenticated section', async function(assert) {
        authenticator.trigger('sessionDataUpdated', { some: 'property' });

        await new Promise(resolve => {
          next(() => {
            assert.deepEqual(session.get('authenticated'), { some: 'property', authenticator: 'authenticator:test' });
            resolve();
          });
        });
      });
    });

    module('when the authenticator triggers the "invalidated" event', function(hooks) {
      hooks.beforeEach(function() {
        return preparation.call();
      });

      test('is not authenticated', async function(assert) {
        authenticator.trigger('sessionDataInvalidated');

        await new Promise(resolve => {
          next(() => {
            assert.notOk(session.get('isAuthenticated'));
            resolve();
          });
        });
      });

      test('clears its authenticated section', async function(assert) {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });
        authenticator.trigger('sessionDataInvalidated');

        await new Promise(resolve => {
          next(() => {
            assert.deepEqual(session.get('content'), { some: 'property', authenticated: {} });
            resolve();
          });
        });
      });

      test('updates the store', async function(assert) {
        authenticator.trigger('sessionDataInvalidated');

        await new Promise(resolve => {
          next(async () => {
            let properties = await store.restore();

            assert.deepEqual(properties.authenticated, {});

            resolve();
          });
        });
      });

      test('triggers the "invalidationSucceeded" event', async function(assert) {
        let triggered = false;
        session.one('invalidationSucceeded', () => {
          triggered = true;
        });
        authenticator.trigger('sessionDataInvalidated');

        await new Promise(resolve => {
          next(() => {
            assert.ok(triggered);
            resolve();
          });
        });
      });
    });
  }

  module('restore', function(hooks) {
    function itDoesNotRestore() {
      test('returns a rejecting promise', async function(assert) {
        try {
          await session.restore();
          assert.ok(false);
        } catch (_error) {
          assert.ok(true);
        }
      });

      test('is not authenticated', async function(assert) {
        try {
          await session.restore();
        } catch (_error) {
          assert.notOk(session.get('isAuthenticated'));
        }
      });

      test('clears its authenticated section', async function(assert) {
        store.persist({ some: 'property', authenticated: { some: 'other property' } });

        try {
          await session.restore();
        } catch (_error) {
          assert.deepEqual(session.get('content'), { some: 'property', authenticated: {} });
        }
      });
    }

    module('when the restored data contains an authenticator factory', function(hooks) {
      hooks.beforeEach(function() {
        store.persist({ authenticated: { authenticator: 'authenticator:test' } });
      });

      module('when the authenticator resolves restoration', function(hooks) {
        hooks.beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(RSVP.resolve({ some: 'property' }));
        });

        test('returns a resolving promise', async function(assert) {
          try {
            await session.restore();
            assert.ok(true);
          } catch (_error) {
            assert.ok(false);
          }
        });

        test('is authenticated', async function(assert) {
          await session.restore();

          assert.ok(session.get('isAuthenticated'));
        });

        test('stores the data the authenticator resolves with in its authenticated section', async function(assert) {
          await store.persist({ authenticated: { authenticator: 'authenticator:test' } });
          await session.restore();
          let properties = await store.restore();

          delete properties.authenticator;

          assert.deepEqual(session.get('authenticated'), { some: 'property', authenticator: 'authenticator:test' });
        });

        test('persists its content in the store', async function(assert) {
          await store.persist({ authenticated: { authenticator: 'authenticator:test' }, someOther: 'property' });
          await session.restore();
          let properties = await store.restore();

          delete properties.authenticator;

          assert.deepEqual(properties, { authenticated: { some: 'property', authenticator: 'authenticator:test' }, someOther: 'property' });
        });

        test('persists the authenticator factory in the store', async function(assert) {
          await session.restore();
          let properties = await store.restore();

          assert.equal(properties.authenticated.authenticator, 'authenticator:test');
        });

        test('does not trigger the "authenticationSucceeded" event', async function(assert) {
          let triggered = false;
          session.one('authenticationSucceeded', () => (triggered = true));
          await session.restore();

          assert.notOk(triggered);
        });

        itHandlesAuthenticatorEvents(async () => {
          await session.restore();
        });
      });

      module('when the authenticator rejects restoration', function(hooks) {
        hooks.beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(RSVP.reject());
        });

        itDoesNotRestore();
      });
    });

    module('when the restored data does not contain an authenticator factory', function(hooks) {
      itDoesNotRestore();
    });

    module('when the store rejects restoration', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(store, 'restore').returns(RSVP.Promise.reject());
      });

      test('is not authenticated', async function(assert) {
        try {
          await session.restore();
        }
        catch (e) {
        }

        assert.notOk(session.get('isAuthenticated'));
      });
    });

    module('when the store rejects persistance', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      test('is not authenticated', async function(assert) {
        try {
          await session.restore();
        }
        catch (e) { }

        assert.notOk(session.get('isAuthenticated'));
      });
    });
  });

  module('authentication', function(hooks) {
    module('when the authenticator resolves authentication', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.resolve({ some: 'property' }));
      });

      test('is authenticated', async function(assert) {
        await session.authenticate('authenticator:test');

        assert.ok(session.get('isAuthenticated'));
      });

      test('returns a resolving promise', async function(assert) {
        try {
          await session.authenticate('authenticator:test');
          assert.ok(true);
        } catch (_error) {
          assert.ok(false);
        }
      });

      test('stores the data the authenticator resolves with in its authenticated section', async function(assert) {
        await session.authenticate('authenticator:test');

        assert.deepEqual(session.get('authenticated'), { some: 'property', authenticator: 'authenticator:test' });
      });

      test('persists its content in the store', async function(assert) {
        await session.authenticate('authenticator:test');
        let properties = await store.restore();

        delete properties.authenticator;

        assert.deepEqual(properties, { authenticated: { some: 'property', authenticator: 'authenticator:test' } });
      });

      test('persists the authenticator factory in the store', async function(assert) {
        await session.authenticate('authenticator:test');
        let properties = await store.restore();

        assert.equal(properties.authenticated.authenticator, 'authenticator:test');
      });

      test('triggers the "authenticationSucceeded" event', async function(assert) {
        let triggered = false;
        session.one('authenticationSucceeded', () => (triggered = true));

        await session.authenticate('authenticator:test');

        assert.ok(triggered);
      });

      itHandlesAuthenticatorEvents(async () => {
        await session.authenticate('authenticator:test');
      });
    });

    module('when the authenticator rejects authentication', function(hooks) {
      test('is not authenticated', async function(assert) {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));

        try {
          await session.authenticate('authenticator:test');
        } catch (_error) {
          assert.notOk(session.get('isAuthenticated'));
        }
      });

      test('returns a rejecting promise', async function(assert) {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));

        try {
          await session.authenticate('authenticator:test');
          assert.ok(false);
        } catch (_error) {
          assert.ok(true);
        }
      });

      test('clears its authenticated section', async function(assert) {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        try {
          await session.authenticate('authenticator:test');
        } catch (_error) {
          assert.deepEqual(session.get('content'), { some: 'property', authenticated: {} });
        }
      });

      test('updates the store', async function(assert) {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        try {
          await session.authenticate('authenticator:test');
        } catch (_error) {
          let properties = await store.restore();

          assert.deepEqual(properties, { some: 'property', authenticated: {} });
        }
      });

      test('does not trigger the "authenticationSucceeded" event', async function(assert) {
        let triggered = false;
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.one('authenticationSucceeded', () => (triggered = true));

        try {
          await session.authenticate('authenticator:test');
        } catch (_error) {
          assert.notOk(triggered);
        }
      });
    });

    module('when the store rejects persistance', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      test('is not authenticated', async function(assert) {
        try {
          await session.authenticate('authenticator:test');
        }
        catch (e) { }

        assert.notOk(session.get('isAuthenticated'));
      });
    });
  });

  module('invalidation', function(hooks) {
    hooks.beforeEach(async function() {
      sinon.stub(authenticator, 'authenticate').returns(RSVP.resolve({ some: 'property' }));
      await session.authenticate('authenticator:test');
    });

    test('unsets the attemptedTransition', function(assert) {
      session.set('attemptedTransition', { some: 'transition' });
      session.invalidate();

      assert.equal(session.get('attemptedTransition'), null);
    });


    module('when invalidate gets called with additional params', function(hooks) {
      hooks.beforeEach(function() {
        sinon.spy(authenticator, 'invalidate');
      });

      test('passes the params on to the authenticators invalidate method', function(assert) {
        let param = { some: 'random data' };
        session.invalidate(param);
        assert.ok(authenticator.invalidate.calledWith(session.get('authenticated'), param));
      });
    });

    module('when the authenticator resolves invalidation', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.resolve());
      });

      test('is not authenticated', async function(assert) {
        await session.invalidate();

        assert.notOk(session.get('isAuthenticated'));
      });

      test('returns a resolving promise', async function(assert) {
        try {
          await session.invalidate();
          assert.ok(true);
        } catch (_error) {
          assert.ok(false);
        }
      });

      test('clears its authenticated section', async function(assert) {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        await session.invalidate();

        assert.deepEqual(session.get('content'), { some: 'property', authenticated: {} });
      });

      test('updates the store', async function(assert) {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        await session.invalidate();
        let properties = await store.restore();

        assert.deepEqual(properties, { some: 'property', authenticated: {} });
      });

      test('triggers the "invalidationSucceeded" event', async function(assert) {
        let triggered = false;
        session.one('invalidationSucceeded', () => (triggered = true));

        await session.invalidate();

        assert.ok(triggered);
      });
    });

    module('when the authenticator rejects invalidation', function(hooks) {
      test('stays authenticated', async function(assert) {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        try {
          await session.invalidate();
        } catch (_error) {
          assert.ok(session.get('isAuthenticated'));
        }
      });

      test('returns a rejecting promise', async function(assert) {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        try {
          await session.invalidate();
          assert.ok(false);
        } catch (_error) {
          assert.ok(true);
        }
      });

      test('keeps its content', async function(assert) {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        try {
          await session.invalidate();
        } catch (_error) {
          assert.deepEqual(session.get('authenticated'), { some: 'property', authenticator: 'authenticator:test' });
        }
      });

      test('does not update the store', async function(assert) {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        try {
          await session.invalidate();
        } catch (_error) {
          let properties = await store.restore();

          assert.deepEqual(properties, { authenticated: { some: 'property', authenticator: 'authenticator:test' } });
        }
      });

      test('does not trigger the "invalidationSucceeded" event', async function(assert) {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));
        let triggered = false;
        session.one('invalidationSucceeded', () => (triggered = true));

        try {
          await session.invalidate();
        } catch (_error) {
          assert.notOk(triggered);
        }
      });

      itHandlesAuthenticatorEvents(function() { });
    });

    module('when the store rejects persistance', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      test('rejects but is not authenticated', async function(assert) {
        try {
          await session.invalidate();
        } catch (_error) {
          assert.notOk(session.get('isAuthenticated'));
        }
      });
    });
  });

  module("when the session's content changes", function(hooks) {
    module('when a single property is set', function(hooks) {
      module('when the property is private (starts with an "_")', function(hooks) {
        hooks.beforeEach(function() {
          session.set('_some', 'property');
        });

        test('does not persist its content in the store', async function(assert) {
          let properties = await store.restore();
          delete properties.authenticator;

          assert.deepEqual(properties, {});
        });
      });

      module('when the property is not private (does not start with an "_")', function(hooks) {
        hooks.beforeEach(function() {
          session.set('some', 'property');
        });

        test('persists its content in the store', async function(assert) {
          let properties = await store.restore();
          delete properties.authenticator;

          assert.deepEqual(properties, { some: 'property', authenticated: {} });
        });
      });
    });

    module('when multiple properties are set at once', function(hooks) {
      hooks.beforeEach(function() {
        session.set('some', 'property');
        session.setProperties({ another: 'property', multiple: 'properties' });
      });

      test('persists its content in the store', async function(assert) {
        let properties = await store.restore();
        delete properties.authenticator;

        assert.deepEqual(properties, { some: 'property', another: 'property', multiple: 'properties', authenticated: {} });
      });
    });
  });

  module('when the store triggers the "sessionDataUpdated" event', function(hooks) {
    module('when the session is currently busy', function(hooks) {
      hooks.beforeEach(function() {
        // sinon.stub(authenticator, 'restore').returns(Promise.resolve({}));
        sinon.stub(store, 'restore').returns(new RSVP.Promise((resolve) => {
          next(() => resolve({ some: 'other property', authenticated: { authenticator: 'authenticator:test' } }));
        }));
      });

      test('does not process the event', async function(assert) {
        sinon.spy(authenticator, 'restore');
        let restoration = session.restore();
        store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });
        await restoration;

        assert.notOk(authenticator.restore.called);
      });
    });

    module('when the session is not currently busy', function(hooks) {
      module('when there is an authenticator factory in the event data', function(hooks) {
        module('when the authenticator resolves restoration', function(hooks) {
          hooks.beforeEach(function() {
            sinon.stub(authenticator, 'restore').returns(RSVP.resolve({ some: 'other property' }));
          });

          test('is authenticated', async function(assert) {
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

            await new Promise(resolve => {
              next(() => {
                assert.ok(session.get('isAuthenticated'));
                resolve();
              });
            });
          });

          test('stores the data the authenticator resolves with in its authenticated section', async function(assert) {
            store.trigger('sessionDataUpdated', { some: 'property', authenticated: { authenticator: 'authenticator:test' } });

            await new Promise(resolve => {
              next(() => {
                assert.deepEqual(session.get('authenticated'), { some: 'other property', authenticator: 'authenticator:test' });
                resolve();
              });
            });
          });

          test('persists its content in the store', async function(assert) {
            store.trigger('sessionDataUpdated', { some: 'property', authenticated: { authenticator: 'authenticator:test' } });

            await new Promise(resolve => {
              next(async () => {
                let properties = await store.restore();

                assert.deepEqual(properties, { some: 'property', authenticated: { some: 'other property', authenticator: 'authenticator:test' } });

                resolve();
              });
            });
          });

          module('when the session is already authenticated', function(hooks) {
            hooks.beforeEach(function() {
              session.set('isAuthenticated', true);
            });

            test('does not trigger the "authenticationSucceeded" event', async function(assert) {
              let triggered = false;
              session.one('authenticationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

              await new Promise(resolve => {
                next(() => {
                  assert.notOk(triggered);
                  resolve();
                });
              });
            });
          });

          module('when the session is not already authenticated', function(hooks) {
            hooks.beforeEach(function() {
              session.set('isAuthenticated', false);
            });

            test('triggers the "authenticationSucceeded" event', async function(assert) {
              let triggered = false;
              session.one('authenticationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

              await new Promise(resolve => {
                next(() => {
                  assert.ok(triggered);
                  resolve();
                });
              });
            });
          });
        });

        module('when the authenticator rejects restoration', function(hooks) {
          hooks.beforeEach(function() {
            sinon.stub(authenticator, 'restore').returns(RSVP.reject());
          });

          test('is not authenticated', async function(assert) {
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

            await new Promise(resolve => {
              next(() => {
                assert.notOk(session.get('isAuthenticated'));
                resolve();
              });
            });
          });

          test('clears its authenticated section', async function(assert) {
            session.set('content', { some: 'property', authenticated: { some: 'other property' } });
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

            await new Promise(resolve => {
              next(() => {
                assert.deepEqual(session.get('content'), { some: 'other property', authenticated: {} });
                resolve();
              });
            });
          });

          test('updates the store', async function(assert) {
            session.set('content', { some: 'property', authenticated: { some: 'other property' } });
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

            await new Promise(resolve => {
              next(async () => {
                let properties = await store.restore();

                assert.deepEqual(properties, { some: 'other property', authenticated: {} });

                resolve();
              });
            });
          });

          module('when the session is authenticated', function(hooks) {
            hooks.beforeEach(function() {
              session.set('isAuthenticated', true);
            });

            test('triggers the "invalidationSucceeded" event', async function(assert) {
              let triggered = false;
              session.one('invalidationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

              await new Promise(resolve => {
                next(() => {
                  assert.ok(triggered);
                  resolve();
                });
              });
            });
          });

          module('when the session is not authenticated', function(hooks) {
            hooks.beforeEach(function() {
              session.set('isAuthenticated', false);
            });

            test('does not trigger the "invalidationSucceeded" event', async function(assert) {
              let triggered = false;
              session.one('invalidationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator:test' } });

              await new Promise(resolve => {
                next(() => {
                  assert.notOk(triggered);
                  resolve();
                });
              });
            });
          });
        });
      });

      module('when there is no authenticator factory in the store', function(hooks) {
        test('is not authenticated', async function(assert) {
          store.trigger('sessionDataUpdated', { some: 'other property' });

          await new Promise(resolve => {
            next(() => {
              assert.notOk(session.get('isAuthenticated'));
              resolve();
            });
          });
        });

        test('clears its authenticated section', async function(assert) {
          session.set('content', { some: 'property', authenticated: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property' });

          await new Promise(resolve => {
            next(() => {
              assert.deepEqual(session.get('content'), { some: 'other property', authenticated: {} });
              resolve();
            });
          });
        });

        test('updates the store', async function(assert) {
          session.set('content', { some: 'property', authenticated: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property' });

          await new Promise(resolve => {
            next(async () => {
              let properties = await store.restore();

              assert.deepEqual(properties, { some: 'other property', authenticated: {} });

              resolve();
            });
          });
        });

        module('when the session is authenticated', function(hooks) {
          hooks.beforeEach(function() {
            session.set('isAuthenticated', true);
          });

          test('triggers the "invalidationSucceeded" event', async function(assert) {
            let triggered = false;
            session.one('invalidationSucceeded', () => (triggered = true));
            store.trigger('sessionDataUpdated', { some: 'other property' });

            await new Promise(resolve => {
              next(() => {
                assert.ok(triggered);
                resolve();
              });
            });
          });
        });

        module('when the session is not authenticated', function(hooks) {
          hooks.beforeEach(function() {
            session.set('isAuthenticated', false);
          });

          test('does not trigger the "invalidationSucceeded" event', async function(assert) {
            let triggered = false;
            session.one('invalidationSucceeded', () => (triggered = true));
            store.trigger('sessionDataUpdated', { some: 'other property' });

            await new Promise(resolve => {
              next(() => {
                assert.notOk(triggered);
                resolve();
              });
            });
          });

          test('it does not trigger the "sessionInvalidationFailed" event', async function(assert) {
            let triggered = false;
            session.one('sessionInvalidationFailed', () => (triggered = true));

            await session.invalidate();

            assert.notOk(triggered);
          });

          test('it returns with a resolved Promise', async function(assert) {
            try {
              await session.invalidate();
              assert.ok(true);
            } catch (_error) {
              assert.ok(false);
            }
          });
        });
      });
    });
  });
});
