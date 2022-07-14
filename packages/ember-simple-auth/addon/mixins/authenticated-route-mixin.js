/* eslint-disable ember/no-new-mixins */

import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { assert, deprecate } from '@ember/debug';
import { getOwner } from '@ember/application';
import { requireAuthentication, triggerAuthentication } from '../-internals/routing';

deprecate("Ember Simple Auth: The AuthenticatedRouteMixin is now deprecated; call the session service's requireAuthentication method in the respective route's beforeModel method instead.", false, {
  id: 'ember-simple-auth.mixins.authenticated-route-mixin',
  until: '4.0.0',
  for: 'ember-simple-auth',
  since: {
    enabled: '3.1.0'
  }
});

/**
  __This mixin is used to make routes accessible only if the session is
  authenticated.__ It defines a `beforeModel` method that aborts the current
  transition and instead transitions to the
  {{#crossLink "AuthenticatedRouteMixin/authenticationRoute:property"}}{{/crossLink}} if
  the session is not authenticated.

  ```js
  // app/routes/protected.js
  import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

  export default class ProtectedRoute extends Route.extend(AuthenticatedRouteMixin) {}
  ```

  @class AuthenticatedRouteMixin
  @deprecated Call the session service's requireAuthentication method in the respective route's beforeModel method instead
  @module ember-simple-auth/mixins/authenticated-route-mixin
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
    The route to transition to for authentication. The
    {{#crossLink "AuthenticatedRouteMixin"}}{{/crossLink}} will transition to
    this route when a route that implements the mixin is accessed when the
    route is not authenticated.

    @property authenticationRoute
    @type String
    @default 'login'
    @public
  */
  authenticationRoute: 'login',

  /**
    Checks whether the session is authenticated and if it is not aborts the
    current transition and instead transitions to the
    {{#crossLink "AuthenticatedRouteMixin/authenticationRoute:property"}}{{/crossLink}}.
    If the current transition is aborted, this method will save it in the
    session service's
    {{#crossLink "SessionService/attemptedTransition:property"}}{{/crossLink}}
    property so that  it can be retried after the session is authenticated
    (see
    {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
    If the transition is aborted in Fastboot mode, the transition's target
    URL will be saved in a `ember_simple_auth-redirectTarget` cookie for use by
    the browser after authentication is complete.

    __If `beforeModel` is overridden in a route that uses this mixin, the route's
   implementation must call `super.beforeModel(...arguments)`__ so that the mixin's
   `beforeModel` method is actually executed.

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
    @public
  */
  beforeModel(transition) {
    let isAuthenticated = requireAuthentication(getOwner(this), transition);
    if (!isAuthenticated) {
      this.triggerAuthentication();
    } else {
      return this._super(...arguments);
    }
  },

  /**
    Triggers authentication; by default this method transitions to the
    `authenticationRoute`. In case the application uses an authentication
    mechanism that does not use an authentication route, this method can be
    overridden.

    @method triggerAuthentication
    @protected
  */
  triggerAuthentication() {
    let authenticationRoute = this.get('authenticationRoute');
    assert('The route configured as AuthenticatedRouteMixin.authenticationRoute cannot implement the AuthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== authenticationRoute);

    triggerAuthentication(getOwner(this), authenticationRoute);
  },
});
