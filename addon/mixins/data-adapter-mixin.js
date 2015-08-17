import Ember from 'ember';

const { service } = Ember.inject;

/**
  This mixin is for routes that require the session to be authenticated to be
  accessible. Including this mixin in a route automatically adds a hook that
  enforces the session to be authenticated and redirects to the
  [`Configuration.authenticationRoute`](#SimpleAuth-Configuration-authenticationRoute)
  if it is not.

  ```js
  // app/routes/protected.js
  import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

  export default Ember.Route.extend(AuthenticatedRouteMixin);
  ```

  `AuthenticatedRouteMixin` performs the redirect in the `beforeModel` method
  so that in all methods executed after that the session is guaranteed to be
  authenticated. __If `beforeModel` is overridden, ensure that the custom
  implementation calls `this._super(transition)`__ so that the session
  enforcement code is actually executed.

  @class AuthenticatedRouteMixin
  @namespace Mixins
  @module ember-simple-auth/mixins/authenticated-route-mixin
  @extends Ember.Mixin
  @static
  @public
*/
export default Ember.Mixin.create({
  session: service('session'),

  ajaxOptions() {
    let hash = this._super(...arguments);
    let { beforeSend } = hash;
    hash.beforeSend = (xhr) => {
      this.get('session').authorize(this.get('authorizer'), (headerName, headerValue) => {
        xhr.setRequestHeader(headerName, headerValue);
      });
      if (beforeSend) {
        beforeSend(xhr);
      }
    };
    return hash;
  },

  handleResponse(status) {
    if (status === 401) {
      this.get('session').invalidate();
      return true;
    } else {
      return this._super(...arguments);
    }
  }
});
