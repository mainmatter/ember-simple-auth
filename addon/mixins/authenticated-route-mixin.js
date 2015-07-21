import Ember from 'ember';
import Configuration from './../configuration';

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
    @public
  */
  beforeModel(transition) {
    let superResult = this._super(transition);

    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      this.get('session').set('attemptedTransition', transition);
      Ember.assert('The route configured as Configuration.authenticationRoute cannot implement the AuthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== Configuration.base.authenticationRoute);
      this.transitionTo(Configuration.base.authenticationRoute);
    }

    return superResult;
  }
});
