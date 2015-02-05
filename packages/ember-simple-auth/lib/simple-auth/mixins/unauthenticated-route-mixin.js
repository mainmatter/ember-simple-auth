import Configuration from './../configuration';

/**
  This mixin is for routes that should only be accessible if the session is
  not authenticated. This is e.g. the case for the login route that should not
  be accessible when the session is already authenticated. Including this mixin
  in a route automatically adds a hook that redirects to the
  [`Configuration.routeIfAlreadyAuthenticated`](#SimpleAuth-Configuration-routeIfAlreadyAuthenticated),
  which defaults to `'index'`.

  ```js
  // app/routes/login.js
  import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

  export default Ember.Route.extend(UnauthenticatedRouteMixin);
  ```

  `UnauthenticatedRouteMixin` performs the redirect in the `beforeModel`
  method. __If `beforeModel` is overridden, ensure that the custom
  implementation calls `this._super(transition)`__.

  @class UnauthenticatedRouteMixin
  @namespace SimpleAuth
  @module simple-auth/mixins/unauthenticated-route-mixin
  @extends Ember.Mixin
  @static
*/
export default Ember.Mixin.create({
  /**
    This method implements the enforcement of the session not being
    authenticated. If the session is authenticated, the current transition will
    be aborted and a redirect will be triggered to the
    [`Configuration.routeIfAlreadyAuthenticated`](#SimpleAuth-Configuration-routeIfAlreadyAuthenticated).

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
  */
  beforeModel: function(transition) {
    if (this.get(Configuration.sessionPropertyName).get('isAuthenticated')) {
      transition.abort();
      Ember.assert('The route configured as Configuration.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== Configuration.routeIfAlreadyAuthenticated);
      this.transitionTo(Configuration.routeIfAlreadyAuthenticated);
    }
  }
});
