import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';
import Session from 'simple-auth/session';
import Configuration from 'simple-auth/configuration';
import EphemeralStore from 'simple-auth/stores/ephemeral';

describe('UnauthenticatedRouteMixin', function() {
  describe('#beforeModel', function() {
    beforeEach(function() {
      this.session    = Session.create({ store: EphemeralStore.create() });
      this.transition = { abort: function() {}, send: function() {} };
      this.route   = Ember.Route.extend(UnauthenticatedRouteMixin, {
        transitionTo: function() {}
      }).create({ session: this.session });
      sinon.spy(this.transition, 'abort');
      sinon.spy(this.route, 'transitionTo');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        this.session.set('isAuthenticated', true);
      });

      it('aborts the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort).to.have.been.called;
      });

      it('transitions to routeIfAlreadyAuthenticated', function() {
        this.route.beforeModel(this.transition);

        expect(this.route.transitionTo).to.have.been.calledWith(Configuration.routeIfAlreadyAuthenticated);
      });
    });

    describe('if the session is not authenticated', function() {
      it('does not abort the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort).to.not.have.been.called;
      });

      it('does not call route transitionTo', function() {
        this.route.beforeModel(this.transition);

        expect(this.route.transitionTo).to.not.have.been.called;
      });
    });
  });
});
