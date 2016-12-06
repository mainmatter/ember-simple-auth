import Ember from 'ember';

const { inject: { service }, Mixin, assert, isPresent } = Ember;

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
    @property authorizer
    @type String
    @default null
    @public
   */
  authorizer: null,

  /**
    Defines a `beforeSend` hook (see http://api.jquery.com/jQuery.ajax/) that
    injects a request header containing the authorization data as constructed
    by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}
    (see {{#crossLink "SessionService/authorize:method"}}{{/crossLink}}). The
      specific header name and contents depend on the actual auhorizer that is
        used.
    @method ajaxOptions
    @protected
  */
  ajaxOptions() {
    const authorizer = this.get('authorizer');
    assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", isPresent(authorizer));

    let hash = this._super(...arguments);
    let { beforeSend } = hash;

    hash.beforeSend = (xhr) => {
      this.get('session').authorize(authorizer, (authHeaders) => {
        for (let headerName in authHeaders) {
          if (authHeaders.hasOwnProperty(headerName)) {
            xhr.setRequestHeader(headerName, authHeaders[headerName]);
          }
        }
      });
      if (beforeSend) {
        return beforeSend(xhr);
      }
    };
    return hash;
  },

  /**
    Adds request headers containing the authorization data as constructed
    by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}.

    This method will only be called in Ember Data 2.7 or greater. Older versions
    will rely on `ajaxOptions` for request header injection.

    @method headersForRequest
    @protected
   */
  headersForRequest() {
    const authorizer = this.get('authorizer');
    assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", isPresent(authorizer));

    let headers = this._super(...arguments);
    headers = Object(headers);
    this.get('session').authorize(authorizer, (authHeaders) => {
      for (let headerName in authHeaders) {
        if (authHeaders.hasOwnProperty(headerName)) {
          headers[headerName] = authHeaders[headerName];
        }
      }
    });
    return headers;
  },

  /**
    This method is called for every response that the adapter receives from the
    API. If the response has a 401 status code it invalidates the session (see
    {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).

    @method handleResponse
    @param {Number} status The response status as received from the API
    @protected
  */
  handleResponse(status) {
    if (status === 401 && this.get('session.isAuthenticated')) {
      this.get('session').invalidate();
    }
    return this._super(...arguments);
  }
});
