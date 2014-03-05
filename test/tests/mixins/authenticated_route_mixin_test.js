import { ApplicationRouteMixin } from 'ember-simple-auth/mixins/application_route_mixin';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';

describe('AuthenticatedRouteMixin', function() {
  describe('#beforeModel', function() {
    beforeEach(function() {
      this.transition = { abort: function() {}, send: function() {} };
      this.route      = Ember.Route.extend(AuthenticatedRouteMixin);
      sinon.spy(this.transition, 'abort');
      sinon.spy(this.transition, 'send');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        this.session.set('isAuthenticated', true);
      });

      it('does not abort the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort.calledOnce).to.be(false);
      });

      it('does not invoke the "authenticateSession" action', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.send.withArgs('authenticateSession').calledOnce).to.be(false);
      });
    });

    describe('if the session is not authenticated', function() {
      it('aborts the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort.calledOnce).to.be(true);
      });

      it('invokes the "authenticateSession" action', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.send.withArgs('authenticateSession').calledOnce).to.be(true);
      });
    });
  });
});

/*import { AuthenticatedRouteMixin } from 'ember-simple-auth/mixins/authenticated_route_mixin';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral } from 'ember-simple-auth/stores/ephemeral';

var testRoute;
var TestRoute = Ember.Route.extend(AuthenticatedRouteMixin);

var containerMock;
var ContainerMock = Ember.Object.extend({
  lookup: function(name) {
    return null;
  }
});

var attemptedTransitionMock;
var AttemptedTransitionMock = Ember.Object.extend({
  abort: function() {
    this.aborted = true;
  },
  send: function(name) {
    this.invokedAuthenticateSession = (name === 'authenticateSession');
  }
});

module('AuthenticatedRouteMixin', {
  setup: function() {
    testRoute               = TestRoute.create();
    attemptedTransitionMock = AttemptedTransitionMock.create();
    containerMock           = ContainerMock.create();
    var session             = Session.create({ store: Ephemeral.create(), container: containerMock });
    testRoute.set('session', session);
  }
});

test('triggers authentication', function() {
  testRoute.triggerSessionAuthentication(attemptedTransitionMock);

  equal(testRoute.get('session.attemptedTransition'), attemptedTransitionMock, 'AuthenticatedRouteMixin saves the attempted transition in the session when session authentication is triggered.');
  ok(attemptedTransitionMock.invokedAuthenticateSession, 'AuthenticatedRouteMixin invokes the authenticateSession action on the attempted transition when session authentication is triggered.');
});

test('triggers authentication when the session is not authenticated', function() {
  testRoute.set('session.isAuthenticated', false);
  testRoute.beforeModel(attemptedTransitionMock);

  ok(attemptedTransitionMock.invokedAuthenticateSession, 'AuthenticatedRouteMixin triggers authenticateSession in beforeModel when the session is not authenticated.');

  testRoute.set('session.isAuthenticated', true);
  attemptedTransitionMock.invokedAuthenticateSession = false;
  testRoute.beforeModel(attemptedTransitionMock);

  ok(!attemptedTransitionMock.invokedAuthenticateSession, 'AuthenticatedRouteMixin does not trigger authenticateSession in beforeModel when the session is authenticated.');
});

test('aborts the attempted transaction when the session is not authenticated', function() {
  testRoute.set('session.isAuthenticated', false);
  testRoute.beforeModel(attemptedTransitionMock);

  ok(attemptedTransitionMock.aborted, 'AuthenticatedRouteMixin aborts the attempted transition in beforeModel when the session is not authenticated.');

  testRoute.set('session.isAuthenticated', true);
  attemptedTransitionMock.aborted = false;
  testRoute.beforeModel(attemptedTransitionMock);

  ok(!attemptedTransitionMock.aborted, 'AuthenticatedRouteMixin does not abort the attempted transition in beforeModel when the session is authenticated.');
});
*/