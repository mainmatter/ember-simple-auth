import EmberObject from '@ember/object';
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
    sinon = sinonjs.sandbox.create();
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
    Adapter = BaseAdapter.extend(DataAdapterMixin, {
      authorizer: 'authorizer:some'
    });
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
      adapter.set('authorizer', null);

      expect(function() {
        adapter.ajaxOptions();
        hash.beforeSend();
      }).to.throw(/Assertion Failed/);
    });

    it('calls `authorize` when request is made', function() {
      const authorize = sinon.spy();
      adapter.authorize = authorize;
      adapter.set('authorizer', null);
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(authorize).to.have.been.called;
    });

    it('preserves an existing beforeSend hook', function() {
      const existingBeforeSend = sinon.spy();
      hash.beforeSend = existingBeforeSend;
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(existingBeforeSend).to.have.been.called;
    });

    it('authorizes with the given authorizer', function() {
      sinon.spy(sessionService, 'authorize');
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(sessionService.authorize).to.have.been.calledWith('authorizer:some');
    });

    describe('the beforeSend hook', function() {
      let xhr;

      beforeEach(function() {
        adapter.ajaxOptions();
        xhr = {
          setRequestHeader() {}
        };
        sinon.spy(xhr, 'setRequestHeader');
      });

      describe('when the authorizer calls the block', function() {
        beforeEach(function() {
          sinon.stub(sessionService, 'authorize').callsFake((authorizer, block) => {
            block('header', 'value');
          });
          hash.beforeSend(xhr);
        });

        it('adds a request header as given by the authorizer', function() {
          expect(xhr.setRequestHeader).to.have.been.calledWith('header', 'value');
        });
      });

      describe('when the authorizer does not call the block', function() {
        beforeEach(function() {
          sinon.stub(sessionService, 'authorize');
          hash.beforeSend(xhr);
        });

        it('does not add a request header', function() {
          expect(xhr.setRequestHeader).to.not.have.been.called;
        });
      });
    });
  });

  describe('#headersForRequest', function() {
    it('preserves existing headers by parent adapter', function() {
      const headers = adapter.headersForRequest();

      expect(headers).to.have.ownProperty('X-Base-Header');
      expect(headers['X-Base-Header']).to.equal('is-still-respected');
    });

    describe('when the base adapter doesn\'t implement headersForRequest', function() {
      beforeEach(function() {
        hash = {};
        sessionService = EmberObject.create({
          authorize() {},
          invalidate() {}
        });

        const Adapter = EmberObject.extend(DataAdapterMixin, {
          authorizer: 'authorizer:some'
        });
        adapter = Adapter.create({ session: sessionService });
      });

      it('gracefully defaults to empty hash', function() {
        const headers = adapter.headersForRequest();
        expect(headers).to.deep.equal({});
      });
    });

    it('asserts the presence of authorizer', function() {
      adapter.set('authorizer', null);
      expect(function() {
        adapter.headersForRequest();
      }).to.throw(/Assertion Failed/);
    });

    it('authorizes with the given authorizer', function() {
      sinon.spy(sessionService, 'authorize');
      adapter.headersForRequest();

      expect(sessionService.authorize).to.have.been.calledWith('authorizer:some');
    });

    describe('when the authorizer calls the block', function() {
      beforeEach(function() {
        sinon.stub(sessionService, 'authorize').callsFake((authorizer, block) => {
          block('X-Authorization-Header', 'an-auth-value');
        });
      });

      it('adds a request header as given by the authorizer', function() {
        const headers = adapter.headersForRequest();
        expect(headers['X-Authorization-Header']).to.equal('an-auth-value');
      });

      it('still returns the base headers', function() {
        const headers = adapter.headersForRequest();
        expect(headers['X-Base-Header']).to.equal('is-still-respected');
      });
    });

    describe('when the authorizer does not call the block', function() {
      beforeEach(function() {
        sinon.stub(sessionService, 'authorize');
      });

      it('does not add a request header', function() {
        const headers = adapter.headersForRequest();
        expect(headers).to.not.have.ownProperty('X-Authorization-Header');
      });

      it('still returns the base headers', function() {
        const headers = adapter.headersForRequest();
        expect(headers['X-Base-Header']).to.equal('is-still-respected');
      });
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
