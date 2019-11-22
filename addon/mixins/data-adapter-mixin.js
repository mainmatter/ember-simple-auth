import { inject as service } from '@ember/service';
import { deprecate } from '@ember/application/deprecations';
import Mixin from '@ember/object/mixin';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';
import { symbol } from '../utils/symbol';

const { VERSION } = DS;
const AUTHORIZE_SYMBOL = symbol('ORIGINAL_AUTHORIZE');

/**
  __This mixin can be used to make Ember Data adapters authorize all outgoing
  API requests by injecting a header.__ The adapter's `headers` property can be
  set using data read from the `session` service that is injected by this
  mixin.

  __The `DataAdapterMixin` will also invalidate the session whenever it
  receives a 401 response for an API request.__

  ```js
  // app/adapters/application.js
  import DS from 'ember-data';
  import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

  export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    headers: computed('session.data.authenticated.token', function() {
      let headers = {};
      if (this.session.isAuthenticated) {
        headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
      }

      return headers;
    })
  });
  ```

  __The `DataAdapterMixin` requires Ember Data 1.13 or later.__

  @class DataAdapterMixin
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
    The authorizer that is used to authorize API requests. The authorizer has
    to call the authorization callback (see
    {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) with header
    name and header content arguments. __This property must be overridden in
    adapters using this mixin.__

    When used with `ember-fetch` the `authorize` method will not be called and
    the `headers` computed property must be used instead, e.g.:

    ```js
    export default DS.JSONAPIAdapter.extend(AdapterFetch, DataAdapterMixin, {
      headers: computed('session.data.authenticated.token', function() {
        const headers = {};
        if (this.session.isAuthenticated) {
          headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
        }

        return headers;
      }),
    });
    ```

    @property authorizer
    @deprecated DataAdapterMixin/authorizer:property
    @type String
    @default null
    @public
  */
  authorizer: null,

  /**
    Defines a `beforeSend` hook (see http://api.jquery.com/jQuery.ajax/) that
    injects a request header containing the authorization data as constructed
    by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}
    (see
    {{#crossLink "SessionService/authorize:method"}}{{/crossLink}}). The
    specific header name and contents depend on the actual authorizer that is
    used.

    Until [emberjs/rfcs#171](https://github.com/emberjs/rfcs/pull/171)
    gets resolved and [ds-improved-ajax](https://github.com/emberjs/data/pull/3099)
    [feature flag](https://github.com/emberjs/data/blob/master/FEATURES.md#feature-flags)
    is enabled, this method will be called for **every** ember-data version.
    `headersForRequest` *should* replace it after the resolution of the RFC.

    @method ajaxOptions
    @deprecated DataAdapterMixin/ajaxOptions:method
    @protected
  */
  ajaxOptions() {
    let hash = this._super(...arguments);
    let { beforeSend } = hash;

    hash.beforeSend = xhr => {
      if (this.get('authorizer')) {
        const authorizer = this.get('authorizer');
        this.get('session').authorize(authorizer, (headerName, headerValue) => {
          xhr.setRequestHeader(headerName, headerValue);
        });
      } else {
        if (this.authorize(xhr) !== AUTHORIZE_SYMBOL) {
          deprecate('Ember Simple Auth: The authorize method should no longer be used. Instead, set the headers property or implement it as a computed property.', false, {
            id: `ember-simple-auth.data-adapter-mixin.authorize`,
            until: '3.0.0'
          });
        }
      }

      if (beforeSend) {
        beforeSend(xhr);
      }
    };
    return hash;
  },

  authorize() {
    let [major_version] = VERSION.split('.');

    assert('The `authorize` method should be overridden in your application adapter. It should accept a single argument, the request object.', major_version >= 2);

    return AUTHORIZE_SYMBOL;
  },

  /**
    Adds request headers containing the authorization data as constructed
    by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}.

    Until [emberjs/rfcs#171](https://github.com/emberjs/rfcs/pull/171)
    gets resolved and [ds-improved-ajax](https://github.com/emberjs/data/pull/3099)
    [feature flag](https://github.com/emberjs/data/blob/master/FEATURES.md#feature-flags)
    is enabled, this method will **not** be used.
    See `ajaxOptions` instead.

    @method headersForRequest
    @deprecated DataAdapterMixin/headersForRequest:method
    @protected
   */
  headersForRequest() {
    deprecate('Ember Simple Auth: The headersForRequest method should no longer be used. Instead, set the headers property or implement it as a computed property.', false, {
      id: `ember-simple-auth.data-adapter-mixin.headers-for-request`,
      until: '3.0.0'
    });

    const authorizer = this.get('authorizer');
    assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", isPresent(authorizer));

    let headers = this._super(...arguments);
    headers = Object(headers);
    this.get('session').authorize(authorizer, (headerName, headerValue) => {
      headers[headerName] = headerValue;
    });
    return headers;
  },

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
