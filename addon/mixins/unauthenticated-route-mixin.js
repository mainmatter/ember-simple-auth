import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import Configuration from './../configuration';

const { inject: { service }, Mixin, assert, computed } = Ember;

/**
  __This mixin is used to make routes accessible only if the session is
  not authenticated__ (e.g. login and registration routes). It defines a
  `beforeModel` method that aborts the current transition and instead
  transitions to the
  {{#crossLink "Configuration/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}
  if the session is authenticated.

  ```js
  // app/routes/login.js
  import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

  export default Ember.Route.extend(UnauthenticatedRouteMixin);
  ```

  @class UnauthenticatedRouteMixin
  @module ember-simple-auth/mixins/unauthenticated-route-mixin
  @extends Ember.Mixin
  @public
*/
export default Mixin.create({
  /**
    The session service.

    @property session
    @readOnly
    @type SessionService
    @public
  */
  session: service('session'),

  _isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');

    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  /**
    The route to transition to if a route that implements the
    {{#crossLink "UnauthenticatedRouteMixin"}}{{/crossLink}} is accessed when
    the session is authenticated.

    @property routeIfAlreadyAuthenticated
    @type String
    @default 'index'
    @public
  */
  routeIfAlreadyAuthenticated: computed(function() {
    return Configuration.routeIfAlreadyAuthenticated;
  }),

  /**
    Checks whether the session is authenticated and if it is aborts the current
    transition and instead transitions to the
    {{#crossLink "Configuration/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}.

    __If `beforeModel` is overridden in a route that uses this mixin, the route's
   implementation must call `this._super(...arguments)`__ so that the mixin's
   `beforeModel` method is actually executed.

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
    @public
  */
  beforeModel(transition) {
    if (this.get('session').get('isAuthenticated')) {
      let routeIfAlreadyAuthenticated = this.get('routeIfAlreadyAuthenticated');
      assert('The route configured as Configuration.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== routeIfAlreadyAuthenticated);

      if (!this.get('_isFastBoot')) {
        transition.abort();
      }

      return this.transitionTo(routeIfAlreadyAuthenticated);
    } else {
      return this._super(...arguments);
    }
  }
});
