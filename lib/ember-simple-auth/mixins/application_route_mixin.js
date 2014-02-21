var global = (typeof window !== 'undefined') ? window : {},
    Ember  = global.Ember;

import { Core } from './../core';

/**
  The mixin for the application route. This defines actions to authenticate the
  session as well as to invalidate it. These actions can be used in all
  templates like this:

  ```handlebars
  {{#if session.isAuthenticated}}
    <a {{ action 'invalidateSession' }}>Logout</a>
  {{else}}
    <a {{ action 'authenticateSession' }}>Login</a>
  {{/if}}
  ```

  While this code works it is __preferrable to use the regular `link-to` helper
  for the _'login'_ link__ as that will add the `'active'` class to the link.
  For the _'logout'_ actions of course there is no route.

  ```handlebars
  {{#if session.isAuthenticated}}
    <a {{ action 'invalidateSession' }}>Logout</a>
  {{else}}
    {{#link-to 'login'}}Login{{/link-to}}
  {{/if}}
  ```

  This mixin also defines actions that are triggered whenever the session is
  successfully authenticated or invalidated and whenever authentication or
  invalidation fails.

  @class ApplicationRouteMixin
  @extends Ember.Mixin
  @static
*/
var ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    /**
      This action triggers transition to the `authenticationRoute` specified in
      [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup). It can be used in
      templates as shown above. It is also triggered automatically by
      [EmberSimpleAuth.AuthenticatedRouteMixin](#Ember-SimpleAuth-AuthenticatedRouteMixin)
      whenever a route that requries authentication is accessed but the session
      is not currently authenticated.

      __For an application that works without an authentication route (e.g.
      because it opens a new window to handle authentication there), this is
      the method to override, e.g.:__

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(EmberSimpleAuth.ApplicationRouteMixin, {
        actions: {
          authenticateSession: function() {
            var _this = this;
            this.get('session').authenticate(App.MyCustomAuthenticator.create(), {}).then(function() {
              _this.send('sessionAuthenticationSucceeded');
            }, function(error) {
              _this.send('sessionAuthenticationFailed', error);
            });
          }
        }
      });
      ```

      @method actions.authenticateSession
    */
    authenticateSession: function() {
      this.transitionTo(Core.authenticationRoute);
    },

    /**
      This action is triggered whenever the session is successfully
      authenticated. It retries a transition that was previously intercepted in
      [AuthenticatedRouteMixin#beforeModel](#Ember-SimpleAuth-AuthenticatedRouteMixin-beforeModel).
      If there is no intercepted transition, this action redirects to the
      `routeAfterAuthentication` specified in
      [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.sessionAuthenticationSucceeded
    */
    sessionAuthenticationSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        this.transitionTo(Core.routeAfterAuthentication);
      }
    },

    /**
      This action in triggered whenever session authentication fails. The
      arguments the action is invoked with depend on the used authenticator
      (see
      [EmberSimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base)).

      It can be overridden to display error messages etc.:

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(EmberSimpleAuth.ApplicationRouteMixin, {
        actions: {
          sessionAuthenticationFailed: function(error) {
            this.controllerFor('application').set('loginErrorMessage', error.message);
          }
        }
      });
      ```

      @method actions.sessionAuthenticationFailed
      @param {any} arguments Any error argument the promise returned by the authenticator rejects with, see [EmberSimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
    */
    sessionAuthenticationFailed: function() {
    },

    /**
      This action invalidates the session (see
      [EmberSimpleAuth.Session#invalidate](#Ember-SimpleAuth-Session-invalidate)).
      If invalidation succeeds, it transitions to `routeAfterInvalidation`
      specified in [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.invalidateSession
    */
    invalidateSession: function() {
      var _this = this;
      this.get('session').invalidate().then(function() {
        _this.send('sessionInvalidationSucceeded');
      }, function(error) {
        _this.send('sessionInvalidationFailed', error);
      });
    },

    /**
      This action is invoked whenever the session is successfully invalidated.
      It transitions to `routeAfterInvalidation` specified in
      [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.sessionInvalidationSucceeded
    */
    sessionInvalidationSucceeded: function() {
      this.transitionTo(Core.routeAfterInvalidation);
    },

    /**
      This action is invoked whenever session invalidation fails.

      @method actions.sessionInvalidationFailed
    */
    sessionInvalidationFailed: function(error) {
    },

    /**
      This action is invoked when an authorization error occurs (which is
      __when a server responds with HTTP status 401__). This will invalidate
      the session and transitions to the `routeAfterInvalidation` specified in
      [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.authorizationFailed
    */
    authorizationFailed: function() {
      var _this = this;
      this.get('session').invalidate().then(function() {
        _this.transitionTo(Core.routeAfterInvalidation);
      });
    },

    /**
      @method actions.error
      @private
    */
    error: function(reason) {
      if (reason.status === 401) {
        this.send('authorizationFailed');
      }
      return true;
    }
  }
});

export { ApplicationRouteMixin };
