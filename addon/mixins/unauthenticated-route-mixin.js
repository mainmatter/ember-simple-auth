import Ember from 'ember';
import Configuration from './../configuration';

const { service } = Ember.inject;

/**
  This mixin is for routes that are only accessible if the session is not
  authenticated. This is e.g. the case for the login route that is not
  accessible when the session is already authenticated. Including this mixin
  in a route automatically adds a hook that redirects to the
  {{#crossLink "Configuration/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}
  if the session is already authenticated.

  The `UnauthenticatedRouteMixin` performs the check for whether the session is
  already authenticated in the `beforeModel` method. __If `beforeModel` is
  overridden in a route that also uses this mixin, ensure that the custom
  implementation calls `this._super(...arguments)`__.

  ```js
  // app/routes/login.js
  import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

  export default Ember.Route.extend(UnauthenticatedRouteMixin);
  ```

  @class UnauthenticatedRouteMixin
  @module ember-simple-auth/mixins/unauthenticated-route-mixin
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
    This method implements the enforcement of the session not being
    authenticated. If the session is authenticated, the current transition will
    be aborted and a redirect to the
    {{#crossLink "Configuration/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}
    will be triggered.

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
    @public
  */
  beforeModel(transition) {
    if (this.get('session').get('isAuthenticated')) {
      transition.abort();
      Ember.assert('The route configured as Configuration.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== Configuration.routeIfAlreadyAuthenticated);
      this.transitionTo(Configuration.routeIfAlreadyAuthenticated);
    } else {
      return this._super(...arguments);
    }
  }
});
