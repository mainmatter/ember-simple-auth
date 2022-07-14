/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import sinonjs from 'sinon';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

module('DataAdapterMixin', function(hooks) {
  let sinon;
  let adapter;
  let sessionService;
  let Adapter;

  hooks.beforeEach(function() {
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

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('#handleResponse', function(hooks) {
    hooks.beforeEach(function() {
      sinon.spy(sessionService, 'invalidate');
    });

    module('when the response status is 401', function() {
      module('when the session is authenticated', function(hooks) {
        hooks.beforeEach(function() {
          sessionService.set('isAuthenticated', true);
        });

        test('invalidates the session', function(assert) {
          adapter.handleResponse(401);

          assert.ok(sessionService.invalidate.calledOnce);
        });
      });

      module('when the session is not authenticated', function(hooks) {
        hooks.beforeEach(function() {
          sessionService.set('isAuthenticated', false);
        });

        test('does not invalidate the session', function(assert) {
          adapter.handleResponse(401);

          assert.notOk(sessionService.invalidate.called);
        });
      });
    });

    module('when the response status is not 401', function() {
      test('does not invalidate the session', function(assert) {
        adapter.handleResponse(200);

        assert.notOk(sessionService.invalidate.called);
      });
    });

    module('when called via _super, and ensureResponseAuthorized is overridden', function(hooks) {
      let returnValue;
      hooks.beforeEach(function() {
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

      test("doesn't invalidate the session (ensureResponseAuthorized can be overridden)", function(assert) {
        assert.notOk(sessionService.invalidate.called);
      });

      test("returns _super's return value", function(assert) {
        assert.equal(returnValue, '_super return value');
      });
    });

    test("returns _super's return value", function(assert) {
      assert.equal(adapter.handleResponse(401), '_super return value');
    });
  });
});
