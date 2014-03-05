import { AuthenticationControllerMixin } from 'ember-simple-auth/mixins/authentication_controller_mixin';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';

describe('AuthenticationControllerMixin', function() {
  describe('the "authenticate" action', function() {
    beforeEach(function() {
      this.session    = Session.create({ store: EphemeralStore.create() });
      this.controller = Ember.Controller.extend(AuthenticationControllerMixin, {
        authenticator: 'authenticatorFactory'
      }).create({ session: this.session });
    });

    it('authenticates the route', function() {
      sinon.spy(this.session, 'authenticate');
      this.controller._actions.authenticate.apply(this.controller, [{ some: 'options' }]);

      expect(this.session.authenticate.withArgs('authenticatorFactory', { some: 'options' }).calledOnce).to.be(true);
    });
  });
});
