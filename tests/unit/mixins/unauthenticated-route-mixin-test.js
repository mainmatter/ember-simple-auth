/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Session from 'ember-simple-auth/session';
import Configuration from 'ember-simple-auth/configuration';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('UnauthenticatedRouteMixin', function() {
  describe('#beforeModel', function() {
    beforeEach(function() {
      this.session    = Session.create({ store: EphemeralStore.create() });
      this.transition = {
        abort() {},
        send() {}
      };

      let container = {
        lookup() {}
      };
      let lookupStub = sinon.stub(container, 'lookup');
      lookupStub.withArgs('service:session').returns(this.session);

      this.route   = Ember.Route.extend(UnauthenticatedRouteMixin, {
        transitionTo() {}
      }).create({ container });
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

        expect(this.route.transitionTo).to.have.been.calledWith(Configuration.base.routeIfAlreadyAuthenticated);
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
