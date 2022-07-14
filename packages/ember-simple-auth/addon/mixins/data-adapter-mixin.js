/* eslint-disable ember/no-new-mixins */

import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { deprecate } from '@ember/debug';

deprecate("Ember Simple Auth: The DataAdapterMixin is now deprecated; call the session service's invalidate method in the adapter's handleResponse method instead in case of a 401 response.", false, {
  id: 'ember-simple-auth.mixins.data-adapter-mixin',
  until: '4.0.0',
  for: 'ember-simple-auth',
  since: {
    enabled: '3.1.0'
  }
});

/**
  __This mixin can be used to make Ember Data adapters authorize all outgoing
  API requests by injecting a header.__ The adapter's `headers` property can be
  set using data read from the `session` service that is injected by this
  mixin.

  __The `DataAdapterMixin` will also invalidate the session whenever it
  receives a 401 response for an API request.__

  ```js
  // app/adapters/application.js
  import JSONAPIAdapter from '@ember-data/adapter/json-api';
  import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
  import { computed } from '@ember/object';

  export default class ApplicationAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
    @computed('session.data.authenticated.token')
    get headers() {
      let headers = {};
      if (this.session.isAuthenticated) {
        headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
      }

      return headers;
    }
  }
  ```

  __The `DataAdapterMixin` requires Ember Data 1.13 or later.__

  @class DataAdapterMixin
  @deprecated Call the session service's invalidate method in the adapter's handleResponse method instead in case of a 401 response
  @module ember-simple-auth/mixins/data-adapter-mixin
  @extends Ember.Mixin
  @public
*/

export default Mixin.create({
  /**
    The session service.

    @property session
    @readOnly
    @type SessionService
    @public
  */
  session: service('session'),

  /**
    This method is called for every response that the adapter receives from the
    API. If the response has a 401 status code it invalidates the session (see
    {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).

    @method handleResponse
    @param {Number} status The response status as received from the API
    @param  {Object} headers HTTP headers as received from the API
    @param {Any} payload The response body as received from the API
    @param {Object} requestData the original request information
    @protected
  */
  handleResponse(status, headers, payload, requestData) {
    this.ensureResponseAuthorized(status, headers, payload, requestData);
    return this._super(...arguments);
  },

  /**
   The default implementation for handleResponse.
   If the response has a 401 status code it invalidates the session (see
    {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).

   Override this method if you want custom invalidation logic for incoming responses.
   @method ensureResponseAuthorized
   @param {Number} status The response status as received from the API
   @param  {Object} headers HTTP headers as received from the API
   @param {Any} payload The response body as received from the API
   @param {Object} requestData the original request information
  */
  ensureResponseAuthorized(status/* ,headers, payload, requestData */) {
    if (status === 401 && this.get('session.isAuthenticated')) {
      this.get('session').invalidate();
    }
  }
});
