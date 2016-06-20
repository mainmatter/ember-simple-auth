/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { Object: EmberObject } = Ember;

describe('DataAdapterMixin', () => {
  let adapter;
  let sessionService;
  let hash;

  beforeEach(() => {
    hash = {};
    sessionService = EmberObject.create({
      authorize() {},
      invalidate() {}
    });

    const BaseAdapter = EmberObject.extend({
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

    it('authorizes with the given authorizer', () => {
      sinon.spy(sessionService, 'authorize');
      adapter.ajaxOptions();
      hash.beforeSend();

      expect(sessionService.authorize).to.have.been.calledWith('authorizer:some');
    });

    describe('the beforeSend hook', () => {
      let xhr;

      beforeEach(() => {
        adapter.ajaxOptions();
        xhr = {
          setRequestHeader() {}
        };
        sinon.spy(xhr, 'setRequestHeader');
      });

      describe('when the authorizer calls the block', () => {
        beforeEach(() => {
          sinon.stub(sessionService, 'authorize', (authorizer, block) => {
            block('header', 'value');
          });
          hash.beforeSend(xhr);
        });

        it('adds a request header as given by the authorizer', () => {
          expect(xhr.setRequestHeader).to.have.been.calledWith('header', 'value');
        });
      });

      describe('when the authorizer does not call the block', () => {
        beforeEach(() => {
          sinon.stub(sessionService, 'authorize');
          hash.beforeSend(xhr);
        });

        it('does not add a request header', () => {
          expect(xhr.setRequestHeader).to.not.have.been.called;
        });
      });
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
      });

      describe('when the session is not authenticated', () => {
        beforeEach(() => {
          sessionService.set('isAuthenticated', false);
        });

        it('does not invalidate the session', () => {
          adapter.handleResponse(401);

          expect(sessionService.invalidate).to.not.have.been.called;
        });
      });
    });

    describe('when the response status is not 401', () => {
      it('does not invalidate the session', () => {
        adapter.handleResponse(200);

        expect(sessionService.invalidate).to.not.have.been.called;
      });
    });

    it("returns _super's return value", () => {
      expect(adapter.handleResponse(401)).to.eq('_super return value');
    });
  });
});
