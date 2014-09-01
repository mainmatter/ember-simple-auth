import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Session from 'simple-auth/session';
import EphemeralStore from 'simple-auth/stores/ephemeral';

describe('AuthenticatedRouteMixin', function() {
  describe('#beforeModel', function() {
    beforeEach(function() {
      this.session = Session.create();
      this.session.setProperties({ store: EphemeralStore.create() });
      this.transition = { abort: function() {}, send: function() {} };
      this.route      = Ember.Route.extend(AuthenticatedRouteMixin).create({ session: this.session });
      sinon.spy(this.transition, 'abort');
      sinon.spy(this.transition, 'send');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        this.session.set('isAuthenticated', true);
      });

      it('does not abort the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort).to.not.have.been.called;
      });

      it('does not invoke the "authenticateSession" action', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.send).to.not.have.been.called;
      });
    });

    describe('if the session is not authenticated', function() {
      it('aborts the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort).to.have.been.called;
      });

      it('invokes the "authenticateSession" action', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.send).to.have.been.calledWith('authenticateSession');
      });
    });
  });
});
