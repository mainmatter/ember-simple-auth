import AuthenticationControllerMixin from 'simple-auth/mixins/authentication-controller-mixin';
import Session from 'simple-auth/session';
import EphemeralStore from 'simple-auth/stores/ephemeral';

describe('AuthenticationControllerMixin', function() {
  describe('the "authenticate" action', function() {
    beforeEach(function() {
      this.session = Session.create();
      this.session.setProperties({ store: EphemeralStore.create() });
      this.controller = Ember.Controller.extend(AuthenticationControllerMixin, {
        authenticator: 'authenticator'
      }).create({ session: this.session });
    });

    it('authenticates the session', function() {
      sinon.stub(this.session, 'authenticate');
      this.controller._actions.authenticate.apply(this.controller, [{ some: 'options' }]);

      expect(this.session.authenticate).to.have.been.calledWith('authenticator', { some: 'options' });
    });

    it('returns the promise returned by the session', function() {
      var promise = new Ember.RSVP.Promise(function() {});
      sinon.stub(this.session, 'authenticate').returns(promise);

      expect(this.controller._actions.authenticate.apply(this.controller, [{ some: 'options' }])).to.eq(promise);
    });
  });
});
