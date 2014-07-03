var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Configuration from './../configuration';

/**
  This mixin is for routes that should only be accessible if the session is
  not authenticated. For example, you might want the login page to redirect to the
  index page if the session is authenticated. Including this mixin in a route
  automatically adds a hook that redirects to the
  [`Configuration.alreadyAuthenticatedRoute`](#SimpleAuth-Configuration-alreadyAuthenticatedRoute),
  which defaults to the
  [`Configuration.routeAfterAuthentication`](#SimpleAuth-Configuration-routeAfterAuthentication).

  ```javascript
  // app/routes/login.js
  import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

  export default Ember.Route.extend(UnauthenticatedRouteMixin);
  ```

  `UnauthenticatedRouteMixin` performs the redirect in the `beforeModel` method.
  __If `beforeModel` is overridden, ensure that the custom
  implementation calls `this._super(transition)`__.

  @class UnauthenticatedRouteMixin
  @namespace SimpleAuth
  @module simple-auth/mixins/unauthenticated-route-mixin
  @extends Ember.Mixin
  @static
*/
export default Ember.Mixin.create({
  /**
    This method implements the enforcement of the session being unauthenticated.
    If the session is authenticated, the current transition will be aborted
    and a redirect will be triggered to the
    [`Configuration.alreadyAuthenticatedRoute`](#SimpleAuth-Configuration-alreadyAuthenticatedRoute).

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
  */
  beforeModel: function(transition) {
    if (this.get(Configuration.sessionPropertyName).get('isAuthenticated')) {
      transition.abort();
      this.transitionTo(Configuration.alreadyAuthenticatedRoute);
    }
  }
});
