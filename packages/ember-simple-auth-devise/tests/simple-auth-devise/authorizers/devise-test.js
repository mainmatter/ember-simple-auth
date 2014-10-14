import Devise from 'simple-auth-devise/authorizers/devise';
import Session from 'simple-auth/session';
import EphemeralStore from 'simple-auth/stores/ephemeral';
import Configuration from 'simple-auth-devise/configuration';

describe('Devise', function() {
  beforeEach(function() {
    this.authorizer = Devise.create();
    this.request    = { setRequestHeader: function() {} };
    this.session     = Session.create();
    this.session.setProperties({ store: EphemeralStore.create() });
    this.authorizer.set('session', this.session);
    sinon.spy(this.request, 'setRequestHeader');
  });

  describe('initilization', function() {
    it('assigns tokenAttributeName from the configuration object', function() {
      Configuration.tokenAttributeName = 'tokenAttributeName';

      expect(Devise.create().tokenAttributeName).to.eq('tokenAttributeName');
    });

    it('assigns identificationAttributeName from the configuration object', function() {
      Configuration.identificationAttributeName = 'identificationAttributeName';

      expect(Devise.create().identificationAttributeName).to.eq('identificationAttributeName');
    });

    afterEach(function() {
      Configuration.load({}, {});
    });
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not add the "user-token" header to the request', function() {
        this.authorizer.authorize(this.request, {});

        expect(this.request.setRequestHeader).to.not.have.been.called;
      });
    }

    describe('when the session is authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', true);
      });

      describe('when the session contains a non empty user_token and user_email', function() {
        beforeEach(function() {
          this.authorizer.set('session.user_token', 'secret token!');
          this.authorizer.set('session.user_email', 'user@email.com');
        });

        it('adds the "user_token" and "user_email" query string fields to the request', function() {
          this.authorizer.authorize(this.request, {});

          expect(this.request.setRequestHeader).to.have.been.calledWith('Authorization', 'Token user_token="secret token!", user_email="user@email.com"');
        });
      });

      describe('when the session contains a non empty custom token and email attributes', function() {
        beforeEach(function() {
          Configuration.tokenAttributeName = 'employee_token';
          Configuration.identificationAttributeName = 'employee_email';

          this.customAttributesAuthenticator = Devise.create();
          this.customAttributesAuthenticator.set('session', this.session);
          this.customAttributesAuthenticator.set('session.employee_token', 'secret token!');
          this.customAttributesAuthenticator.set('session.employee_email', 'user@email.com');

          Configuration.load({}, {});
        });

        it('adds the "employee_token" and "employee_email" query string fields to the request', function() {
          this.customAttributesAuthenticator.authorize(this.request, {});

          expect(this.request.setRequestHeader).to.have.been.calledWith('Authorization', 'Token employee_token="secret token!", employee_email="user@email.com"');
        });
      });

      describe('when the session does not contain an user_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.user_token', null);
        });

        itDoesNotAuthorizeTheRequest();
      });

      describe('when the session does not contain an user_email', function() {
        beforeEach(function() {
          this.authorizer.set('session.user_email', null);
        });

        itDoesNotAuthorizeTheRequest();
      });
    });

    describe('when the session is not authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', false);
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
