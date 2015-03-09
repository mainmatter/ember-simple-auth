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

    context('when the session is authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', true);
      });

      context('when the session contains a non empty token and email', function() {
        beforeEach(function() {
          this.authorizer.set('session.secure.token', 'secret token!');
          this.authorizer.set('session.secure.email', 'user@email.com');
        });

        it('adds the "token" and "email" query string fields to the request', function() {
          this.authorizer.authorize(this.request, {});

          expect(this.request.setRequestHeader).to.have.been.calledWith('Authorization', 'Token token="secret token!", email="user@email.com"');
        });
      });

      context('when custom identification and token attribute names are configured', function() {
        beforeEach(function() {
          Configuration.tokenAttributeName          = 'employee_token';
          Configuration.identificationAttributeName = 'employee_email';

          this.authorizer = Devise.create();
        });

        context('when the session contains a non empty employee_token and employee_email', function() {
          beforeEach(function() {
            this.authorizer.set('session', this.session);
            this.authorizer.set('session.secure.employee_token', 'secret token!');
            this.authorizer.set('session.secure.employee_email', 'user@email.com');
          });

          it('adds the "employee_token" and "employee_email" query string fields to the request', function() {
            this.authorizer.authorize(this.request, {});

            expect(this.request.setRequestHeader).to.have.been.calledWith('Authorization', 'Token employee_token="secret token!", employee_email="user@email.com"');
          });
        });

        afterEach(function() {
          Configuration.load({}, {});
        });
      });

      context('when the session does not contain an token', function() {
        beforeEach(function() {
          this.authorizer.set('session.secure.token', null);
        });

        itDoesNotAuthorizeTheRequest();
      });

      context('when the session does not contain an email', function() {
        beforeEach(function() {
          this.authorizer.set('session.secure.email', null);
        });

        itDoesNotAuthorizeTheRequest();
      });
    });

    context('when the session is not authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', false);
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
