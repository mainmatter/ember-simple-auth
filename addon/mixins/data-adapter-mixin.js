import Ember from 'ember';

const { isEmpty } = Ember;
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
    First authorizes the request and then calls base class' `ajax()`.

    @param {String} url The requested URL.
    @param {String} type The method of the HTTP request.
    @param {Object} options Additional XHR options.
  */
  ajax(url, type, options) {
    // tests benefit from doing it like this (instead of just `options = options || {}`).
    if (!options) {
      options = {};
    }
    const authorizer = this.get('authorizer');
    Ember.assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", Ember.isPresent(authorizer));

    // Because of the way _super() works, we need to store references to base
    // class implementation here in order to be able to use it in the callback below.
    const me = this;
    const supr = this._super;  // for ember 2.x
    const nextsuper = this.__nextSuper;  // for ember 1.x

    return this.get('session').authorize(authorizer, Ember.merge({ url, type }, options))
      .then((result) => {
        let { headerName, headerValue } = result || {};
        if (!isEmpty(headerName) && !isEmpty(headerValue)) {
          options.beforeSend = (xhr) => {
            xhr.setRequestHeader(headerName, headerValue);
          };
        }

        if (Ember.VERSION < '2.0.0') {
          return nextsuper.call(me, url, type, options);
        } else {
          return supr.call(me, url, type, options);
        }
      });
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
  ajaxOptions(url, type, options) {
    const authorizer = this.get('authorizer');
    Ember.assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", Ember.isPresent(authorizer));

    options = options || {};
    const mixinBeforeSend = options.beforeSend;
    let hash = this._super(url, type, options);
    let { beforeSend } = hash;

    hash.beforeSend = (xhr) => {
      if (mixinBeforeSend) {
        mixinBeforeSend(xhr);
      }
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
