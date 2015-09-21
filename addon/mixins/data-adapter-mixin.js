import Ember from 'ember';

const { service } = Ember.inject;

/**
  This mixin is for Ember Data Adapters and will inject an authorization header
  into API requests. It works with all authorizers that call the authorization
  callback (see
  {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) with header
  name and header content arguments.

  The `DataAdapterMixin` will also invalidate the session when it receives a
  401 response for an API request.

  ```js
  // app/adapters/application.js
  import DS from 'ember-data';
  import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

  export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:application'
  });
  ```

  @class DataAdapterMixin
  @module ember-simple-auth/mixins/data-adapter-mixin
  @extends Ember.Mixin
  @static
  @public
*/

export default Ember.Mixin.create({
  /**
    The session service.

    @property session
    @type SessionService
    @public
  */
  session: service('session'),

  /**
    The authorizer that is used to authorize API requests.

    @property session
    @type SessionService
    @default null
    @public
  */
  authorizer: null,

  /**
    Authorizes an API request by adding an authorization header. The specific
    header name and contents depend on the actual auhorizer that is used.
  
    @method ajaxOptions
    @protected
  */
  ajaxOptions() {
    const authorizer = this.get('authorizer');
    Ember.assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", Ember.isPresent(authorizer));

    let hash = this._super(...arguments);
    let { beforeSend } = hash;

    hash.beforeSend = (xhr) => {
      this.get('session').authorize(authorizer, (headerName, headerValue) => {
        xhr.setRequestHeader(headerName, headerValue);
      });
      if (beforeSend) {
        beforeSend(xhr);
      }
    };
    return hash;
  },

  /**
    This method is called for every response that the adapter receives from the
    API. If this method encounters a 401 response it will invalidate the
    session.
  
    @method handleResponse
    @param {Number} status The response status as received from the API
    @protected
  */
  handleResponse(status) {
    if (status === 401) {
      this.get('session').invalidate();
      return true;
    } else {
      return this._super(...arguments);
    }
  }
});
