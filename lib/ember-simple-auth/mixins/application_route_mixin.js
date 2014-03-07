var global = (typeof window !== 'undefined') ? window : {},
    Ember  = global.Ember;

import { Configuration } from './../core';

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
  @namespace $mainModule
  @extends Ember.Mixin
  @static
*/
var ApplicationRouteMixin = Ember.Mixin.create({
  activate: function() {
    var _this = this;
    this._super();
    this.get('session').on('ember-simple-auth:session-authentication-succeeded', function() {
      _this.send('sessionAuthenticationSucceeded');
    });
    this.get('session').on('ember-simple-auth:session-authentication-failed', function(error) {
      _this.send('sessionAuthenticationFailed', error);
    });
    this.get('session').on('ember-simple-auth:session-invalidation-succeeded', function() {
      _this.send('sessionInvalidationSucceeded');
    });
    this.get('session').on('ember-simple-auth:session-invalidation-failed', function(error) {
      _this.send('sessionInvalidationFailed', error);
    });
  },

  actions: {
    /**
      This action triggers transition to the `authenticationRoute` specified in
      [EmberSimpleAuth.setup](#EmberSimpleAuth-setup). It can be used in
      templates as shown above. It is also triggered automatically by
      [EmberSimpleAuth.AuthenticatedRouteMixin](#EmberSimpleAuth-AuthenticatedRouteMixin)
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
      this.transitionTo(Configuration.authenticationRoute);
    },

    /**
      This action is triggered whenever the session is successfully
      authenticated. It retries a transition that was previously intercepted in
      [AuthenticatedRouteMixin#beforeModel](#EmberSimpleAuth-AuthenticatedRouteMixin-beforeModel).
      If there is no intercepted transition, this action redirects to the
      `routeAfterAuthentication` specified in
      [EmberSimpleAuth.setup](#EmberSimpleAuth-setup).

      @method actions.sessionAuthenticationSucceeded
    */
    sessionAuthenticationSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        this.transitionTo(Configuration.routeAfterAuthentication);
      }
    },

    /**
      This action in triggered whenever session authentication fails. The
      arguments the action is invoked with depend on the used authenticator
      (see
      [EmberSimpleAuth.Authenticators.Base](#EmberSimpleAuth-Authenticators-Base)).

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
      @param {any} arguments Any error argument the promise returned by the authenticator rejects with, see [EmberSimpleAuth.Authenticators.Base#authenticate](#EmberSimpleAuth-Authenticators-Base-authenticate)
    */
    sessionAuthenticationFailed: function(error) {
    },

    /**
      This action invalidates the session (see
      [EmberSimpleAuth.Session#invalidate](#EmberSimpleAuth-Session-invalidate)).
      If invalidation succeeds, it redirects to the `applicationRootUrl`
      specified in [EmberSimpleAuth.setup](#EmberSimpleAuth-setup).

      @method actions.invalidateSession
    */
    invalidateSession: function() {
      this.get('session').invalidate();
    },

    /**
      This action is invoked whenever the session is successfully invalidated.
      It redirects to `applicationRootUrl` specified in
      [EmberSimpleAuth.setup](#EmberSimpleAuth-setup) so that the Ember.js
      application is reloaded and all in-memory data (such as Ember Data stores
      etc. are cleared).

      @method actions.sessionInvalidationSucceeded
    */
    sessionInvalidationSucceeded: function() {
      window.location.replace(Configuration.applicationRootUrl);
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
      the session and redirect to the `applicationRootUrl` specified in
      [EmberSimpleAuth.setup](#EmberSimpleAuth-setup).

      @method actions.authorizationFailed
    */
    authorizationFailed: function() {
      this.get('session').invalidate();
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
