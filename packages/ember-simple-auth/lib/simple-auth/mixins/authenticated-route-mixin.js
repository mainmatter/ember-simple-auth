import Configuration from './../configuration';

/**
  This mixin is for routes that require the session to be authenticated to be
  accessible. Including this mixin in a route automatically adds a hook that
  enforces the session to be authenticated and redirects to the
  [`Configuration.authenticationRoute`](#SimpleAuth-Configuration-authenticationRoute)
  if it is not.

  ```javascript
  // app/routes/protected.js
  import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

  export default Ember.Route.extend(AuthenticatedRouteMixin);
  ```

  `AuthenticatedRouteMixin` performs the redirect in the `beforeModel` method
  so that in all methods executed after that the session is guaranteed to be
  authenticated. __If `beforeModel` is overridden, ensure that the custom
  implementation calls `this._super(transition)`__ so that the session
  enforcement code is actually executed.

  @class AuthenticatedRouteMixin
  @namespace SimpleAuth
  @module simple-auth/mixins/authenticated-route-mixin
  @extends Ember.Mixin
  @static
*/
export default Ember.Mixin.create({
  /**
    This method implements the enforcement of the session being authenticated.
    If the session is not authenticated, the current transition will be aborted
    and a redirect will be triggered to the
    [`Configuration.authenticationRoute`](#SimpleAuth-Configuration-authenticationRoute).
    The method also saves the intercepted transition so that it can be retried
    after the session has been authenticated (see
    [`ApplicationRouteMixin#sessionAuthenticationSucceeded`](#SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
  */
  beforeModel: function(transition) {
    this._super(transition);
    if (!this.get(Configuration.sessionPropertyName).get('isAuthenticated')) {
      transition.abort();
      this.get(Configuration.sessionPropertyName).set('attemptedTransition', transition);
      transition.send('authenticateSession');
    }
  }
});
