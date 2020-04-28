/* eslint-disable ember/no-new-mixins */
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

/**
 *
 * @param {ApplicationInstance} owner The ApplicationInstance that owns the session service
 * @param {(...args: [any]) => any} callback Callback that will be invoked if the user is authenticated
 */
function runIfAuthenticated(owner, callback) {
  const sessionSvc = owner.lookup('service:session');
  return sessionSvc.get('isAuthenticated');
}

export function prohibitAuthentication(owner, route) {
  let isAuthenticated = runIfAuthenticated(owner);
  if (isAuthenticated) {
    let authRouter = owner.lookup('service:router') || owner.lookup('router:main');
    console.log(authRouter);
    authRouter.transitionTo(route);
  }
  return !isAuthenticated;
}

/**
  __This mixin is used to make routes accessible only if the session is
  not authenticated__ (e.g., login and registration routes). It defines a
  `beforeModel` method that aborts the current transition and instead
  transitions to the
  {{#crossLink "UnauthenticatedRouteMixin/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}
  if the session is authenticated.

  ```js
  // app/routes/login.js
  import Route from '@ember/routing/route';
  import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

  export default class LoginRoute extends Route.extend(UnauthenticatedRouteMixin) {}
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

  /**
    The route to transition to if a route that implements the
    {{#crossLink "UnauthenticatedRouteMixin"}}{{/crossLink}} is accessed when
    the session is authenticated.

    @property routeIfAlreadyAuthenticated
    @type String
    @default 'index'
    @public
  */
  routeIfAlreadyAuthenticated: 'index',

  /**
    Checks whether the session is authenticated and if it is aborts the current
    transition and instead transitions to the
    {{#crossLink "UnauthenticatedRouteMixin/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}.

    __If `beforeModel` is overridden in a route that uses this mixin, the route's
   implementation must call `this._super(...arguments)`__ so that the mixin's
   `beforeModel` method is actually executed.

    @method beforeModel
    @public
  */
  beforeModel() {
    let routeIfAlreadyAuthenticated = this.get('routeIfAlreadyAuthenticated');
    assert('The route configured as UnauthenticatedRouteMixin.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== routeIfAlreadyAuthenticated);

    let isUnauthencited = prohibitAuthentication(getOwner(this), routeIfAlreadyAuthenticated);
    if (isUnauthencited) {
      return this._super(...arguments);
    }
  }
});
