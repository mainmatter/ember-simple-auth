/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

describe('DataAdapterMixin', () => {
  let adapter;
  let sessionService;
  let hash;

  beforeEach(() => {
    hash = {};
    sessionService = Ember.Object.create({
      authorize() {
        return Ember.RSVP.resolve();
      },
      invalidate() {}
    });

    const BaseAdapter = Ember.Object.extend({
      ajax() {
        return Ember.RSVP.resolve();
      },
      ajaxOptions() {
        return hash;
      },
      handleResponse() {
        return '_super return value';
      }
    });
    const Adapter = BaseAdapter.extend(DataAdapterMixin, {
      authorizer: 'authorizer:some'
    });
    adapter = Adapter.create({ session: sessionService });
  });

  describe('#ajax', () => {
    it('authorizes with the given authorizer', () => {
      sinon.spy(sessionService, 'authorize');
      adapter.ajax();

      expect(sessionService.authorize).to.have.been.calledWith('authorizer:some');
    });

    it('returns a promise', () => {
      const result = adapter.ajax();
      expect(result.then).to.be.a('function');
    });

    it('session.authorize receives ajaxOptions', () => {
      sinon.spy(sessionService, 'authorize');
      adapter.ajax('/', 'get', { mykey: 'myval' });
      expect(sessionService.authorize).to.have.been.calledWith('authorizer:some', { type: 'get', url: '/', mykey: 'myval' });
    });

    it('adds beforeSend hook when session returns headers', (done) => {
      sinon.stub(sessionService, 'authorize').returns(Ember.RSVP.resolve({ headerName: 'myname', headerValue: 'myvalue' }));
      sinon.spy(adapter, 'ajax');

      const options = {};
      adapter.ajax('/', 'get', options).then(() => {
        expect(options).to.have.property('beforeSend');
        expect(adapter.ajax).to.have.been.calledWith('/', 'get', {
          beforeSend: sinon.match.func
        });
        done();
      });
    });

    it("doesn't add beforeSend hook when session doesn't return headers", (done) => {
      // sinon.stub(sessionService, 'authorize').returns(Ember.RSVP.resolve({ headerName: 'myname', headerValue: 'myvalue' }));
      sinon.spy(adapter, 'ajax');

      const options = {};
      adapter.ajax('/', 'get', options).then(() => {
        expect(adapter.ajax).to.have.been.calledWith('/', 'get', {});
        done();
      });
    });

    describe('the beforeSend hook', () => {
      let xhr;

      beforeEach((done) => {
        xhr = {
          setRequestHeader() {}
        };
        sinon.stub(sessionService, 'authorize').returns(Ember.RSVP.resolve({ headerName: 'header', headerValue: 'value' }));
        sinon.spy(xhr, 'setRequestHeader');
        return adapter.ajax('/', 'get', hash).then(done, done);
      });

      describe('when the authorizer calls the block', () => {
        beforeEach(() => {
          hash.beforeSend(xhr);
        });

        it('adds a request header as given by the authorizer', () => {
          expect(xhr.setRequestHeader).to.have.been.calledWith('header', 'value');
        });
      });
    });
  });

  describe('#ajaxOptions', () => {
    it('registers a beforeSend hook', () => {
      adapter.ajaxOptions();

      expect(hash).to.have.ownProperty('beforeSend');
    });

    it('asserts the presence of authorizer', () => {
      adapter.set('authorizer', null);
      expect(function() {
        adapter.ajaxOptions();
      }).to.throw(/Assertion Failed/);
    });

    it('preserves an existing beforeSend hook', () => {
      const existingBeforeSend = sinon.spy();
      hash.beforeSend = existingBeforeSend;
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(existingBeforeSend).to.have.been.called;
    });
  });

  describe('#handleResponse', () => {
    beforeEach(() => {
      sinon.spy(sessionService, 'invalidate');
    });

    describe('when the response status is 401', () => {
      describe('when the session is authenticated', () => {
        beforeEach(() => {
          sessionService.set('isAuthenticated', true);
        });

        it('invalidates the session', () => {
          adapter.handleResponse(401);

          expect(sessionService.invalidate).to.have.been.calledOnce;
        });

        it('returns true', () => {
          expect(adapter.handleResponse(401)).to.be.true;
        });
      });

      describe('when the session is not authenticated', () => {
        beforeEach(() => {
          sessionService.set('isAuthenticated', false);
        });

        it('does not invalidate the session', () => {
          adapter.handleResponse(401);

          expect(sessionService.invalidate).to.not.have.been.called;
        });

        it('returns true', () => {
          expect(adapter.handleResponse(401)).to.be.true;
        });
      });
    });

    describe('when the response status is not 401', () => {
      it('does not invalidate the session', () => {
        adapter.handleResponse(200);

        expect(sessionService.invalidate).to.not.have.been.called;
      });

      it("returns _super's return value", () => {
        expect(adapter.handleResponse(200)).to.eq('_super return value');
      });
    });
  });
});
