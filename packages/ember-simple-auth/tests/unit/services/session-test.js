import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import { next } from '@ember/runloop';
import EmberObject, { set } from '@ember/object';
import { registerDeprecationHandler } from '@ember/debug';
import sinonjs from 'sinon';
import * as LocationUtil from 'ember-simple-auth/utils/location';
import Configuration from 'ember-simple-auth/configuration';
import RSVP from 'rsvp';

module('SessionService', function(hooks) {
  setupTest(hooks);

  let sinon;
  let sessionService;
  let session;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
    this.owner.register('authorizer:custom', EmberObject.extend({
      authorize() {}
    }));

    sessionService = this.owner.lookup('service:session');
    session = sessionService.get('session');
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  test('forwards the "authenticationSucceeded" event from the session', async function(assert) {
    assert.expect(2);
    let deprecations = [];
    registerDeprecationHandler((message, options, next) => {
      deprecations.push(message);

      next(message, options);
    });
    let triggered = false;
    sinon.stub(sessionService, 'handleAuthentication');
    sessionService.one('authenticationSucceeded', () => (triggered = true));
    session.trigger('authenticationSucceeded');

    await new Promise(resolve => {
      next(() => {
        assert.ok(triggered);
        assert.equal(deprecations.filter(deprecation => deprecation.includes('Ember Simple Auth:')).length, 1); // the call to .one above triggers a deprecation but forwarding the event should *not* trigger a deprecation
        resolve();
      });
    });
  });

  test('forwards the "invalidationSucceeded" event from the session', async function(assert) {
    assert.expect(2);
    let deprecations = [];
    registerDeprecationHandler((message, options, next) => {
      deprecations.push(message);

      next(message, options);
    });
    let triggered = false;
    sessionService.one('invalidationSucceeded', () => (triggered = true));
    session.trigger('invalidationSucceeded');

    await new Promise(resolve => {
      next(() => {
        assert.ok(triggered);
        assert.equal(deprecations.filter(deprecation => deprecation.includes('Ember Simple Auth:')).length, 1); // the call to .one above triggers a deprecation but forwarding the event should *not* trigger a deprecation
        resolve();
      });
    });
  });

  test('deprecates using the "Evented" API', function(assert) {
    assert.expect(6);
    let deprecations = [];
    registerDeprecationHandler((message, options, next) => {
      deprecations.push(message);

      next(message, options);
    });

    let handler = () => {};
    sessionService.trigger('invalidationSucceeded');
    sessionService.on('invalidationSucceeded', handler);
    sessionService.off('invalidationSucceeded', handler);
    sessionService.has('invalidationSucceeded');
    sessionService.one('invalidationSucceeded', handler);

    let emberSimpleAuthDeprecations = deprecations.filter(deprecation => deprecation.includes('Ember Simple Auth:'));
    assert.equal(emberSimpleAuthDeprecations.length, 5);
    for (let deprecation of emberSimpleAuthDeprecations) {
      assert.equal(deprecation, "Ember Simple Auth: The session service's events API is deprecated; to add custom behavior to the authentication or invalidation handling, override the handleAuthentication or handleInvalidation methods.");
    }
  });

  module('isAuthenticated', function() {
    test('is read from the session', function(assert) {
      session.set('isAuthenticated', true);

      assert.ok(sessionService.get('isAuthenticated'));
    });

    test('is read-only', function(assert) {
      assert.expect(1);
      try {
        sessionService.set('isAuthenticated', false);
        assert.ok(false);
      } catch (e) {
        assert.ok(true);
      }
    });
  });

  module('store', function() {
    test('is read from the session', function(assert) {
      session.set('store', 'some store');

      assert.equal(sessionService.get('store'), 'some store');
    });

    test('is read-only', function(assert) {
      assert.expect(1);
      try {
        sessionService.set('store', 'some other store');
        assert.ok(false);
      } catch (e) {
        assert.ok(true);
      }
    });
  });

  module('attemptedTransition', function() {
    test('is read from the session', function(assert) {
      session.set('attemptedTransition', 'some transition');

      assert.equal(sessionService.get('attemptedTransition'), 'some transition');
    });

    test('is written back to the session', function(assert) {
      sessionService.set('attemptedTransition', 'some other transition');

      assert.equal(session.get('attemptedTransition'), 'some other transition');
    });
  });

  module('data', function() {
    test("is read from the session's content", function(assert) {
      session.set('some', 'data');

      assert.deepEqual(sessionService.get('data'), { some: 'data', authenticated: {} });
    });

    test("is written back to the session's content", function(assert) {
      sessionService.set('data.some', { other: 'data' });

      assert.deepEqual(session.content, { some: { other: 'data' }, authenticated: {} });
    });

    test('can be set with Ember.set', function(assert) {
      set(sessionService, 'data.emberSet', 'ember-set-data');

      assert.deepEqual(session.content, { emberSet: 'ember-set-data', authenticated: {} });
    });

    test('is read-only', function(assert) {
      assert.expect(1);
      try {
        sessionService.set('data', false);
        assert.ok(false);
      } catch (e) {
        assert.ok(true);
      }
    });
  });

  module('authenticate', function(hooks) {
    hooks.beforeEach(function() {
      session.reopen({
        authenticate() {
          return 'value';
        }
      });
    });

    test('authenticates the session', function(assert) {
      sinon.spy(session, 'authenticate');
      sessionService.authenticate({ some: 'argument' });

      assert.ok(session.authenticate.calledWith({ some: 'argument' }));
    });

    test("returns the session's authentication return value", function(assert) {
      assert.equal(sessionService.authenticate(), 'value');
    });
  });

  module('invalidate', function(hooks) {
    hooks.beforeEach(function() {
      session.reopen({
        invalidate() {
          return 'value';
        }
      });
    });

    test('invalidates the session', function(assert) {
      sinon.spy(session, 'invalidate');
      sessionService.invalidate({ some: 'argument' });

      assert.ok(session.invalidate.calledWith({ some: 'argument' }));
    });

    test("returns the session's invalidation return value", function(assert) {
      assert.equal(sessionService.invalidate(), 'value');
    });
  });

  module('requireAuthentication', function(hooks) {
    let transition;
    let router;

    hooks.beforeEach(function() {
      transition = {
        intent: {
          url: '/transition/target/url'
        },
        send() {}
      };
      this.owner.register('service:router', Service.extend({
        transitionTo() {}
      }));
      router = this.owner.lookup('service:router');

      sinon.spy(transition, 'send');
      sinon.spy(router, 'transitionTo');
    });

    module('if the session is authenticated', function(hooks) {
      hooks.beforeEach(function() {
        session.set('isAuthenticated', true);
      });

      test('returns true', function(assert) {
        let result = sessionService.requireAuthentication(transition, 'login');

        assert.ok(result);
      });

      module('if a route name is passed as second argument', function() {
        test('does not transition to the authentication route', function(assert) {
          sessionService.requireAuthentication(transition, 'login');

          assert.notOk(router.transitionTo.calledWith('login'));
        });
      });

      module('if a callback function is passed as second argument', function() {
        test('does not invoke the callback', function(assert) {
          let callback = sinon.spy();
          sessionService.requireAuthentication(transition, callback);

          assert.notOk(callback.called);
        });
      });
    });

    module('if the session is not authenticated', function(hooks) {
      hooks.beforeEach(function() {
        session.set('isAuthenticated', false);
      });

      test('returns false', function(assert) {
        let result = sessionService.requireAuthentication(transition, 'login');

        assert.notOk(result);
      });

      module('if a route name is passed as second argument', function() {
        test('transitions to the specified route', function(assert) {
          sessionService.requireAuthentication(transition, 'login');

          assert.ok(router.transitionTo.calledWith('login'));
        });
      });

      module('if a callback function is passed as second argument', function() {
        test('does invokes the callback', function(assert) {
          let callback = sinon.spy();
          sessionService.requireAuthentication(transition, callback);

          assert.ok(callback.calledOnce);
        });
      });

      module('if a transition is passed', function() {
        test('stores it in the session', function(assert) {
          sessionService.requireAuthentication(transition, 'login');

          assert.equal(sessionService.get('attemptedTransition'), transition);
        });

        test('sets the redirectTarget cookie in fastboot', function(assert) {
          this.owner.register('service:fastboot', Service.extend({
            isFastBoot: true,
            init() {
              this._super(...arguments);
              this.request = {
                protocol: 'https'
              };
            },
          }));
          let writeCookieStub = sinon.stub();
          this.owner.register('service:cookies', Service.extend({
            write: writeCookieStub
          }));

          let cookieName = 'ember_simple_auth-redirectTarget';

          sessionService.requireAuthentication(transition, 'login');

          assert.ok(writeCookieStub.calledWith(cookieName, transition.intent.url, {
            path: '/',
            secure: true
          }));
        });
      });

      module('if no transition is passed', function() {
        test("does not set the session's 'attemptedTransition' property", function(assert) {
          sessionService.requireAuthentication(null, 'login');

          assert.equal(sessionService.get('attemptedTransition'), null);
        });

        test('does not set the redirectTarget cookie in fastboot', function(assert) {
          this.owner.register('service:fastboot', Service.extend({
            isFastBoot: true,
            init() {
              this._super(...arguments);
              this.request = {
                protocol: 'https'
              };
            },
          }));
          let writeCookieStub = sinon.stub();
          this.owner.register('service:cookies', Service.extend({
            write: writeCookieStub
          }));

          sessionService.requireAuthentication(null, 'login');

          assert.notOk(writeCookieStub.called);
        });
      });
    });
  });

  module('prohibitAuthentication', function(hooks) {
    let router;

    hooks.beforeEach(function() {
      this.owner.register('service:router', Service.extend({
        transitionTo() {}
      }));
      router = this.owner.lookup('service:router');

      sinon.spy(router, 'transitionTo');
    });

    module('if the session is not authenticated', function(hooks) {
      hooks.beforeEach(function() {
        session.set('isAuthenticated', false);
      });

      test('returns true', function(assert) {
        let result = sessionService.prohibitAuthentication('index');

        assert.ok(result);
      });

      module('if a route name is passed as first argument', function() {
        test('does not transition to the route', function(assert) {
          sessionService.prohibitAuthentication('index');

          assert.notOk(router.transitionTo.called);
        });
      });

      module('if a callback function is passed as first argument', function() {
        test('does not invoke the callback', function(assert) {
          let callback = sinon.spy();
          sessionService.prohibitAuthentication(callback);

          assert.notOk(callback.called);
        });
      });
    });

    module('if the session is authenticated', function(hooks) {
      hooks.beforeEach(function() {
        session.set('isAuthenticated', true);
      });

      test('returns false', function(assert) {
        let result = sessionService.prohibitAuthentication('login');

        assert.notOk(result);
      });

      module('if a route name is passed as first argument', function() {
        test('transitions to the specified route', function(assert) {
          sessionService.prohibitAuthentication('index');

          assert.ok(router.transitionTo.calledWith('index'));
        });
      });

      module('if a callback function is passed as first argument', function() {
        test('invokes the callback', function(assert) {
          let callback = sinon.spy();
          sessionService.prohibitAuthentication(callback);

          assert.ok(callback.calledOnce);
        });
      });
    });
  });

  module('handleAuthentication', function(hooks) {
    let router;

    hooks.beforeEach(function() {
      this.owner.register('service:router', Service.extend({
        transitionTo() {}
      }));
      router = this.owner.lookup('service:router');
      sinon.spy(router, 'transitionTo');
    });

    module('when an attempted transition is stored in the session', function(hooks) {
      let attemptedTransition;

      hooks.beforeEach(function() {
        attemptedTransition = {
          retry: sinon.stub()
        };
        session.set('attemptedTransition', attemptedTransition);
      });

      test('retries that transition', function(assert) {
        sessionService.handleAuthentication();

        assert.ok(attemptedTransition.retry.calledOnce);
      });

      test('removes it from the session', function(assert) {
        sessionService.handleAuthentication();

        assert.equal(session.get('attemptedTransition'), null);
      });
    });

    module('when a redirect target is stored in a cookie', function(hooks) {
      let cookieName = 'ember_simple_auth-redirectTarget';
      let targetUrl = 'transition/target/url';
      let clearStub;

      hooks.beforeEach(function() {
        clearStub = sinon.stub();
        this.owner.register('service:cookies', Service.extend({
          read() {
            return targetUrl;
          },
          clear: clearStub
        }));
      });

      test('transitions to the url', function(assert) {
        sessionService.handleAuthentication();

        assert.ok(router.transitionTo.calledWith(targetUrl));
      });

      test('clears the cookie', function(assert) {
        sessionService.handleAuthentication();

        assert.ok(clearStub.calledWith(cookieName));
      });
    });

    module('when no attempted transition is stored in the session', function() {
      test('transitions to "routeAfterAuthentication"', function(assert) {
        let routeAfterAuthentication = 'index';
        sessionService.handleAuthentication(routeAfterAuthentication);

        assert.ok(router.transitionTo.calledWith(routeAfterAuthentication));
      });
    });
  });

  module('handleInvalidation', function() {
    let router;

    module('when running in FastBoot', function(hooks) {
      hooks.beforeEach(function() {
        this.owner.register('service:fastboot', Service.extend({
          isFastBoot: true
        }));
        this.owner.register('service:router', Service.extend({
          transitionTo() {}
        }));
        router = this.owner.lookup('service:router');
        sinon.spy(router, 'transitionTo');
      });

      test('transitions to the route', function(assert) {
        sessionService.handleInvalidation('index');

        assert.ok(router.transitionTo.calledWith('index'));
      });
    });

    module('when not running in FastBoot', function(hooks) {
      hooks.beforeEach(function() {
        this.owner.register('service:fastboot', Service.extend({
          isFastBoot: false
        }));
        sinon.stub(LocationUtil, 'default').returns({ replace() {} });
        sinon.spy(LocationUtil.default(), 'replace');
        // eslint-disable-next-line ember/no-ember-testing-in-module-scope
        Ember.testing = false;
      });

      hooks.afterEach(function() {
        // eslint-disable-next-line ember/no-ember-testing-in-module-scope
        Ember.testing = true;
      });

      test('replaces the location with the route', function(assert) {
        sessionService.handleInvalidation('index');

        assert.ok(LocationUtil.default().replace.calledWith('index'));
      });
    });
  });

  module('setup', function() {
    test('sets up handlers', async function(assert) {
      const setupHandlersStub = sinon.stub(sessionService, '_setupHandlers');

      await sessionService.setup();
      assert.ok(setupHandlersStub.calledOnce);
    });

    test("doesn't raise an error when restore rejects", async function(assert) {
      assert.expect(1);
      sinon.stub(sessionService, '_setupHandlers');
      sinon.stub(session, 'restore').returns(RSVP.reject());

      try {
        await sessionService.setup();
        assert.ok(true);
      } catch (err) {
        assert.ok(false);
      }
    });

    module('when using session methods', function(hooks) {
      let useSessionSetupMethodDefault;

      hooks.beforeEach(function() {
        useSessionSetupMethodDefault = Configuration.useSessionSetupMethod;
        Configuration.useSessionSetupMethod = false;
      });

      hooks.afterEach(function() {
        Configuration.useSessionSetupMethod = useSessionSetupMethodDefault;
      });

      test('throws assertion when session methods are called before session#setup', async function(assert) {
        Configuration.useSessionSetupMethod = true;
        let error;
        try {
          await sessionService.prohibitAuthentication();
        } catch (assertion) {
          error = assertion;
        }
        assert.equal(error.message, "Assertion Failed: Ember Simple Auth: session#setup wasn't called. Make sure to call session#setup in your application route's beforeModel hook.");
      });

      test("doesn't throw assertion when session methods are called after session#setup", async function(assert) {
        Configuration.useSessionSetupMethod = true;
        let error;

        await sessionService.setup();
        try {
          await sessionService.prohibitAuthentication();
        } catch (assertion) {
          error = assertion;
        }

        assert.equal(error, undefined);
      });
    });
  });
});
