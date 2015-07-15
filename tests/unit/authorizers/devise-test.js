/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Devise from 'ember-simple-auth/authorizers/devise';
import Session from 'ember-simple-auth/session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';
import Configuration from 'ember-simple-auth/configuration';

describe('Devise', function() {
  beforeEach(function() {
    this.authorizer = Devise.create();
    this.request    = {
      setRequestHeader() {}
    };
    this.session    = Session.create();
    this.session.setProperties({ store: EphemeralStore.create() });
    this.authorizer.set('session', this.session);
    sinon.spy(this.request, 'setRequestHeader');
  });

  describe('initilization', function() {
    it('assigns tokenAttributeName from the configuration object', function() {
      Configuration.devise.tokenAttributeName = 'tokenAttributeName';

      expect(Devise.create().tokenAttributeName).to.eq('tokenAttributeName');
    });

    it('assigns identificationAttributeName from the configuration object', function() {
      Configuration.devise.identificationAttributeName = 'identificationAttributeName';

      expect(Devise.create().identificationAttributeName).to.eq('identificationAttributeName');
    });

    afterEach(function() {
      // TODO: make resetting the config easier
      Configuration.load({
        lookup() {
          return Ember.Object.create();
        }
      }, {});
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

      describe('when the session contains a non empty token and email', function() {
        beforeEach(function() {
          this.authorizer.set('session.secure.token', 'secret token!');
          this.authorizer.set('session.secure.email', 'user@email.com');
        });

        it('adds the "token" and "email" query string fields to the request', function() {
          this.authorizer.authorize(this.request, {});

          expect(this.request.setRequestHeader).to.have.been.calledWith('Authorization', 'Token token="secret token!", email="user@email.com"');
        });
      });

      describe('when custom identification and token attribute names are configured', function() {
        beforeEach(function() {
          Configuration.devise.tokenAttributeName          = 'employee_token';
          Configuration.devise.identificationAttributeName = 'employee_email';

          this.authorizer = Devise.create();
        });

        describe('when the session contains a non empty employee_token and employee_email', function() {
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
          // TODO: make resetting the config easier
          Configuration.load({
            lookup() {
              return Ember.Object.create();
            }
          }, {});
        });
      });

      describe('when the session does not contain an token', function() {
        beforeEach(function() {
          this.authorizer.set('session.secure.token', null);
        });

        itDoesNotAuthorizeTheRequest();
      });

      describe('when the session does not contain an email', function() {
        beforeEach(function() {
          this.authorizer.set('session.secure.email', null);
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
