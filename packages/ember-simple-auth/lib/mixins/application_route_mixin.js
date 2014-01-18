'use strict';

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
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    /**
      This action triggers transition to the `authenticationRoute` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). It can be used in
      templates as shown above. It is also triggered automatically by
      [Ember.SimpleAuth.AuthenticatedRouteMixin](#Ember-SimpleAuth-AuthenticatedRouteMixin)
      whenever a route that requries authentication is accessed but the session
      is not currently authenticated.

      __For an application that works without an authentication route (e.g.
      because it opens a new window to handle authentication there), this is
      the method to override, e.g.:__

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
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
      this.transitionTo(Ember.SimpleAuth.authenticationRoute);
    },

    /**
      This action is triggered whenever the session is successfully
      authenticated. It retries a transition that was previously intercepted in
      [AuthenticatedRouteMixin#beforeModel](#Ember-SimpleAuth-AuthenticatedRouteMixin-beforeModel).
      If there is no intercepted transition, this action redirects to the
      `routeAfterAuthentication` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.sessionAuthenticationSucceeded
    */
    sessionAuthenticationSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        this.transitionTo(Ember.SimpleAuth.routeAfterAuthentication);
      }
    },

    /**
      This action in triggered whenever session authentication fails. The
      arguments the action is invoked with depend on the used authenticator
      (see
      [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base)).

      It can be overridden to display error messages etc.:

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
        actions: {
          sessionAuthenticationFailed: function(error) {
            this.controllerFor('application').set('loginErrorMessage', error.message);
          }
        }
      });
      ```

      @method actions.sessionAuthenticationFailed
      @param {any} arguments Any error argument the promise returned by the authenticator rejects with, see [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
    */
    sessionAuthenticationFailed: function() {
    },

    /**
      This action invalidates the session (see
      [Ember.SimpleAuth.Session#invalidate](#Ember-SimpleAuth-Session-invalidate)).
      If invalidation succeeds, it transitions to `routeAfterInvalidation`
      specified in [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

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
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.sessionInvalidationSucceeded
    */
    sessionInvalidationSucceeded: function() {
      this.transitionTo(Ember.SimpleAuth.routeAfterInvalidation);
    },

    /**
      This action is invoked whenever session invalidation fails.

      @method actions.sessionInvalidationFailed
    */
    sessionInvalidationFailed: function(error) {
    },

    /**
      This action is invoked when an authorization error occurs (which is
      __when a server responds with HTTP status 401 or 403__). This will invalidate
      the session and transitions to the `routeAfterInvalidation` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.authorizationFailed
    */
    authorizationFailed: function() {
      var _this = this;
      this.get('session').invalidate().then(function() {
        _this.transitionTo(Ember.SimpleAuth.routeAfterInvalidation);
      });
    },

    /**
      @method actions.error
      @private
    */
    error: function(reason) {
      if (reason.status === 401 || reason.status === 403) {
        this.send('authorizationFailed');
      }
    }
  }
});
