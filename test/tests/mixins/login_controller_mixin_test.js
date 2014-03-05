import { LoginControllerMixin } from 'ember-simple-auth/mixins/login_controller_mixin';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';

describe('LoginControllerMixin', function() {
  beforeEach(function() {
    this.session    = Session.create({ store: EphemeralStore.create() });
    this.controller = Ember.Controller.extend(LoginControllerMixin).create({ session: this.session });
  });

  describe('#authenticator', function() {
    it('defaults to "ember-simple-auth:authenticators:oauth2"', function() {
      expect(this.controller.get('authenticator')).to.eql('ember-simple-auth:authenticators:oauth2');
    });
  });

  describe('the "authenticate" action', function() {
    describe('when both identification and password are set on the controller', function() {
      beforeEach(function() {
        this.controller.setProperties({
          identification: 'identification',
          password:       'password'
        });
      });

      it('unsets the password', function() {
        this.controller._actions.authenticate.apply(this.controller);

        expect(this.controller.get('password')).to.be(null);
      });

      it('authenticates the session', function() {
        sinon.spy(this.session, 'authenticate');
        this.controller._actions.authenticate.apply(this.controller);

        expect(this.session.authenticate.withArgs('ember-simple-auth:authenticators:oauth2', { identification: 'identification', password: 'password' }).calledOnce).to.be(true);
      });
    });

    describe('when both identification and password are set on the controller', function() {
      it('does not authenticate the session', function() {
        sinon.spy(this.session, 'authenticate');
        this.controller._actions.authenticate.apply(this.controller);

        expect(this.session.authenticate.called).to.be(false);
      });
    });
  });
});
