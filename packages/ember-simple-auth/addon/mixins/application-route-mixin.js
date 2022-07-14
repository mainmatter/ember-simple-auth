/* eslint-disable ember/no-new-mixins */

import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { inject } from '@ember/service';
import Ember from 'ember';
import { deprecate } from '@ember/debug';
import Configuration from './../configuration';

import isFastBoot from 'ember-simple-auth/utils/is-fastboot';

deprecate('Ember Simple Auth: The ApplicationRouteMixin is now deprecated; it can be safely removed.', false, {
  id: 'ember-simple-auth.mixins.application-route-mixin',
  until: '4.0.0',
  for: 'ember-simple-auth',
  since: {
    enabled: '3.1.0'
  }
});

/**
  The mixin for the application route, __defining methods that are called when
  the session is successfully authenticated (see
  {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}})
  or invalidated__ (see
  {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}).

  __Using this mixin is optional.__ The session events can also be handled
  manually, e.g. in an instance initializer:

  ```js
  // app/instance-initializers/session-events.js
  export function initialize(instance) {
    const applicationRoute = instance.lookup('route:application');
    const session          = instance.lookup('service:session');
    session.on('authenticationSucceeded', function() {
      applicationRoute.transitionTo('index');
    });
    session.on('invalidationSucceeded', function() {
      applicationRoute.transitionTo('bye');
    });
  };

  export default {
    initialize,
    name:  'session-events',
    after: 'ember-simple-auth'
  };
  ```

  __When using the `ApplicationRouteMixin` you need to specify
  `needs: ['service:session']` in the application route's unit test.__

  @class ApplicationRouteMixin
  @deprecated Call the session service's setup method in the application route's constructor instead
  @module ember-simple-auth/mixins/application-route-mixin
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
  session: inject('session'),

  /**
    The route to transition to after successful authentication.

    @property routeAfterAuthentication
    @type String
    @default 'index'
    @public
  */
  routeAfterAuthentication: 'index',

  init() {
    this._super(...arguments);
    this.__usesApplicationRouteMixn__ = true;

    this._isFastBoot = this.hasOwnProperty('_isFastBoot') ? this._isFastBoot : isFastBoot(getOwner(this));
    this._subscribeToSessionEvents();
  },

  _subscribeToSessionEvents() {
    A([
      ['authenticationSucceeded', 'sessionAuthenticated'],
      ['invalidationSucceeded', 'sessionInvalidated']
    ]).forEach(([event, method]) => {
      this.get('session').on(event, (...args) => this[method](...args));
    });
  },

  /**
    This method handles the session's
    {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
    event. If there is a transition that was previously intercepted by the
    {{#crossLink "AuthenticatedRouteMixin/beforeModel:method"}}
    AuthenticatedRouteMixin's `beforeModel` method{{/crossLink}} it will retry
    it. If there is no such transition, the `ember_simple_auth-redirectTarget`
    cookie will be checked for a url that represents an attemptedTransition
    that was aborted in Fastboot mode, otherwise this action transitions to the
    {{#crossLink "AuthenticatedRouteMixin/routeAfterAuthentication:property"}}{{/crossLink}}.


    @method sessionAuthenticated
    @public
  */
  sessionAuthenticated() {
    this.get('session').handleAuthentication(this.get('routeAfterAuthentication'));
  },

  /**
    This method handles the session's
    {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
    event. __It reloads the Ember.js application__ by redirecting the browser
    to the application's root URL so that all in-memory data (such as Ember
    Data stores etc.) gets cleared.

    If the Ember.js application will be used in an environment where the users
    don't have direct access to any data stored on the client (e.g.
    [cordova](http://cordova.apache.org)) this action can be overridden to e.g.
    simply transition to the index route.

    @method sessionInvalidated
    @public
  */
  sessionInvalidated() {
    if (!Ember.testing) {
      this.get('session').handleInvalidation(Configuration.rootURL);
    }
  }
});
