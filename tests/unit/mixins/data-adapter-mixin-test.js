/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import EmberObject from '@ember/object';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

describe('DataAdapterMixin', () => {
  let sinon;
  let adapter;
  let sessionService;
  let Adapter;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
    sessionService = EmberObject.create({
      authorize() {},
      invalidate() {}
    });

    const BaseAdapter = EmberObject.extend({
      handleResponse() {
        return '_super return value';
      }
    });
    Adapter = BaseAdapter.extend(DataAdapterMixin, {});
    adapter = Adapter.create({ session: sessionService });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('#handleResponse', function() {
    beforeEach(function() {
      sinon.spy(sessionService, 'invalidate');
    });

    describe('when the response status is 401', function() {
      describe('when the session is authenticated', function() {
        beforeEach(function() {
          sessionService.set('isAuthenticated', true);
        });

        it('invalidates the session', function() {
          adapter.handleResponse(401);

          expect(sessionService.invalidate).to.have.been.calledOnce;
        });
      });

      describe('when the session is not authenticated', function() {
        beforeEach(function() {
          sessionService.set('isAuthenticated', false);
        });

        it('does not invalidate the session', function() {
          adapter.handleResponse(401);

          expect(sessionService.invalidate).to.not.have.been.called;
        });
      });
    });

    describe('when the response status is not 401', function() {
      it('does not invalidate the session', function() {
        adapter.handleResponse(200);

        expect(sessionService.invalidate).to.not.have.been.called;
      });
    });

    describe('when called via _super, and ensureResponseAuthorized is overridden', function() {
      let returnValue;
      beforeEach(function() {
        const DoesntInvalidateOn401 = Adapter.extend({
          ensureResponseAuthorized() {
            // no op, doesn't call this.get('session').invalidate();
          },
          handleResponse() {
            return this._super();
          }
        });
        adapter = DoesntInvalidateOn401.create();
        returnValue = adapter.handleResponse(401);
      });

      it("doesn't invalidate the session (ensureResponseAuthorized can be overridden)", function() {
        expect(sessionService.invalidate).to.not.have.been.called;
      });

      it("returns _super's return value", function() {
        expect(returnValue).to.eq('_super return value');
      });
    });

    it("returns _super's return value", function() {
      expect(adapter.handleResponse(401)).to.eq('_super return value');
    });
  });
});
