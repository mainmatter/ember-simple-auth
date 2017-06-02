import Ember from 'ember';

const { service } = Ember.inject;

/**

  __The `DeviseTokenAuthDataAdapterMixin` will update the session store with the new
  access-tokens and expiry after each call. It will also invalidate the session whenever it
  receives a 401 response for an API request.__

  __This mixin must be used in conjunction with DataAdapterMixin so the other standard
  methods are run properly.__

  ```js
  // app/adapters/application.js
  import DS from 'ember-data';
  import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
  import DeviseTokenAuthDataAdapterMixin from 'ember-simple-auth/mixins/devise-token-auth-data-adapter-mixin';

  export default DS.JSONAPIAdapter.extend(DeviseTokenAuthDataAdapterMixin, DataAdapterMixin, {
    authorizer: 'authorizer:devise-token-auth'
  });
  ```

  __The `DeviseTokenAuthDataAdapterMixin` requires Ember Data 1.13 or later.__

  @class DeviseTokenAuthDataAdapterMixin
  @module ember-simple-auth/mixins/devise-token-auth-data-adapter-mixin
  @extends Ember.Mixin
  @public
*/

export default Ember.Mixin.create({
  /**
    This method is called for every response that the adapter receives from the
    API. If the response has a 401 status code it invalidates the session (see
    {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).

    @method handleResponse
    @param {Number} status The response status as received from the API
    @param {Array} headers The response headers as received from the API
    @protected
  */
  handleResponse(status, headers) {
    if ((status === 401 && this.get('session.isAuthenticated'))
        || (this.get('session.data.authenticated.uid') != headers['uid'] || this.get('session.data.authenticated.client') != headers['client'] )
       ) {
      this.get('session').invalidate();
    } else {

      this.get('session').set('data.authenticated.access-token', headers['access-token']);
      this.get('session').set('data.authenticated.expiry', headers['expiry']);

      // this line is a little hack to force the session store to persist the change
      // detailed here: https://github.com/simplabs/ember-simple-auth/issues/375#issuecomment-197533608
      this.get('session').set('data.foo', 'bar');
    }
    return this._super(...arguments);
  }
});
