/* eslint-disable ember/no-new-mixins */
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { deprecate } from '@ember/application/deprecations';

import { prohibitAuthentication } from '../-internals/routing';

deprecate("Ember Simple Auth: The UnauthenticatedRouteMixin is now deprecated; call the session service's prohibitAuthentication method in the respective route's beforeModel method instead.", false, {
  id: 'ember-simple-auth.mixins.unauthenticated-route-mixin',
  until: '4.0.0'
});

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
  @deprecated Call the session service's prohibitAuthentication method in the respective route's beforeModel method instead
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

    let owner = getOwner(this);
    let sessionService = owner.lookup('service:session');
    if (sessionService.get('isAuthenticated')) {
      prohibitAuthentication(owner, routeIfAlreadyAuthenticated);
    } else {
      return this._super(...arguments);
    }
  }
});
