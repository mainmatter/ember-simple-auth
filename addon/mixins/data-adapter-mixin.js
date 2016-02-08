import Ember from 'ember';

const { service } = Ember.inject;

/**
  __This mixin can be used to make Ember Data adapters authorize all outgoing
  API requests by injecting a header.__ It works with all authorizers that call
  the authorization callback (see
  {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) with header
  name and header content arguments.

  __The `DataAdapterMixin` will also invalidate the session whenever it
  receives a 401 response for an API request.__

  ```js
  // app/adapters/application.js
  import DS from 'ember-data';
  import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

  export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:application'
  });
  ```

  __The `DataAdapterMixin` requires Ember Data 1.13 or later.__

  @class DataAdapterMixin
  @module ember-simple-auth/mixins/data-adapter-mixin
  @extends Ember.Mixin
  @public
*/

export default Ember.Mixin.create({
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
    Return parameters for the
    {{#crossLink "SessionService/authorize:method"}}{{/crossLink}} method.

    This function should return an array or "extra" parameters for the
    `authorize()` method. By default an empty array is returned. If your
    authorizer needs more information about the issued HTTP request, you should
    override this method in your authorizer implementation and return any
    data from the `xhr` and `ajaxSetup` objects.

    @param {Object} xhr the jQuery xhr object.
    @param {Object} ajaxSetup the jQuery ajaxSetup object.
   */
  getAuthorizerParams(/*xhr, ajaxSetup*/) {
    return [];
  },

  /**
    Defines a `beforeSend` hook (see http://api.jquery.com/jQuery.ajax/) that
    injects a request header containing the authorization data as constructed
    by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}
    (see
    {{#crossLink "SessionService/authorize:method"}}{{/crossLink}}). The
    specific header name and contents depend on the actual auhorizer that is
    used.

    @method ajaxOptions
    @protected
  */
  ajaxOptions() {
    const authorizer = this.get('authorizer');
    Ember.assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", Ember.isPresent(authorizer));

    let hash = this._super(...arguments);
    let { beforeSend } = hash;

    hash.beforeSend = (xhr, ajaxSetup) => {
      const authorizerParams = [authorizer].concat(this.getAuthorizerParams(xhr, ajaxSetup));
      authorizerParams.push((headerName, headerValue) => {
        xhr.setRequestHeader(headerName, headerValue);
      });
      this.get('session').authorize(...authorizerParams);
      if (beforeSend) {
        beforeSend(xhr);
      }
    };
    return hash;
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
    if (status === 401) {
      if (this.get('session.isAuthenticated')) {
        this.get('session').invalidate();
      }
      return true;
    } else {
      return this._super(...arguments);
    }
  }
});
