import EmberObject from '@ember/object';
import { registerDeprecationHandler } from '@ember/debug';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

describe('DataAdapterMixin', () => {
  let sinon;
  let adapter;
  let sessionService;
  let hash;
  let Adapter;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
    hash = {};
    sessionService = EmberObject.create({
      authorize() {},
      invalidate() {}
    });

    const BaseAdapter = EmberObject.extend({
      ajaxOptions() {
        return hash;
      },
      headersForRequest() {
        return {
          'X-Base-Header': 'is-still-respected'
        };
      },
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

  describe('#ajaxOptions', function() {
    it('registers a beforeSend hook', function() {
      adapter.ajaxOptions();

      expect(hash).to.have.ownProperty('beforeSend');
    });

    it('asserts `authorize` is overridden', function() {
      expect(function() {
        adapter.ajaxOptions();
        hash.beforeSend();
      }).to.throw(/Assertion Failed/);
    });

    it('calls `authorize` when request is made', function() {
      const authorize = sinon.spy();
      adapter.authorize = authorize;
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(authorize).to.have.been.called;
    });

    it('shows a deprecation warning when `authorize` is called', function() {
      let warnings = [];
      registerDeprecationHandler((message, options, next) => {
        warnings.push(message);
        next(message, options);
      });

      adapter.authorize = () => {};
      adapter.set('authorizer', null);
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(warnings[0]).to.eq('Ember Simple Auth: The authorize method should no longer be used. Instead, set the headers property or implement it as a computed property.');
    });

    it('preserves an existing beforeSend hook', function() {
      const existingBeforeSend = sinon.spy();
      const authorize = sinon.spy();
      hash.beforeSend = existingBeforeSend;
      adapter.authorize = authorize;
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(existingBeforeSend).to.have.been.called;
    });
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
