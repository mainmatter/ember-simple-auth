/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Session from 'ember-simple-auth/session';
import Configuration from 'ember-simple-auth/configuration';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('AuthenticatedRouteMixin', function() {
  describe('#beforeModel', function() {
    beforeEach(function() {
      let Route = Ember.Route.extend({
        beforeModel() {
          let routeContext = this;

          return new Ember.RSVP.Promise((resolve) => {
            Ember.run.next(() => {
              resolve(routeContext.beforeModelReturnValue);
            });
          });
        },

        transitionTo() {}
      }, AuthenticatedRouteMixin);

      this.session = Session.create();
      this.session.setProperties({ store: EphemeralStore.create() });
      this.transition = {
        abort() {},
        send() {}
      };

      let container = {
        lookup() {}
      };
      let lookupStub = sinon.stub(container, 'lookup');
      lookupStub.withArgs('service:session').returns(this.session);

      this.route = Route.create({ container });
      sinon.spy(this.transition, 'abort');
      sinon.spy(this.transition, 'send');
      sinon.spy(this.route, 'transitionTo');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        this.session.set('isAuthenticated', true);
      });

      it('returns the upstream promise', function() {
        this.route.beforeModelReturnValue = 'authenticated';

        return this.route.beforeModel(this.transition)
          .then(function(result) {
            expect(result).to.equal('authenticated');
          });
      });

      it('does not abort the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort).to.not.have.been.called;
      });

      it('does not transition to the authentication route', function() {
        this.route.beforeModel(this.transition);

        expect(this.route.transitionTo).to.not.have.been.calledWith(Configuration.base.authenticationRoute);
      });
    });

    describe('if the session is not authenticated', function() {
      it('returns the upstream promise', function() {
        this.route.beforeModelReturnValue = 'unauthenticated';

        return this.route.beforeModel(this.transition)
          .then(function(result) {
            expect(result).to.equal('unauthenticated');
          });
      });

      it('aborts the transition', function() {
        this.route.beforeModel(this.transition);

        expect(this.transition.abort).to.have.been.called;
      });

      it('transitions to the authentication route', function() {
        this.route.beforeModel(this.transition);

        expect(this.route.transitionTo).to.have.been.calledWith(Configuration.base.authenticationRoute);
      });
    });
  });
});
