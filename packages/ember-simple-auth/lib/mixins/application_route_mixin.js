'use strict';

/**
  The mixin for the application controller. This defines actions to
  authenticate the session as well as to invalidate it. These actions can be
  used in all templates e.g. like this:

  ```handlebars
  {{#if session.isAuthenticated}}
    <a {{ action 'invalidateSession' }}>Logout</a>
  {{else}}
    <a {{ action 'authenticateSession' }}>Login</a>
  {{/if}}
  ```

  This mixin also defines actions that are triggered whenever the session is
  successfully authenticated or invalidated and whenever authentication or
  invalidation fail as well.

  @class ApplicationRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    /**
      This action redirects to the `authenticationRoute` specified in
      [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup). It is invoked
      automatically by Ember.SimpleAuth.AuthenticatedRouteMixin whenever a user
      tries to access a page that requries an authenticated session but can
      also be invoked manually.

      @method actions.login
    */
    authenticateSession: function() {
      this.transitionTo(Ember.SimpleAuth.authenticationRoute);
    },

    /**
      This action is invoked whenever a session is successfully authenticated.
      By default it will simply retry a transition that was previously
      intercepted in
      [AuthenticatedRouteMixin#beforeModel](#Ember.SimpleAuth.AuthenticatedRouteMixin_beforeModel).
      If there is not intercepted transition, this action redirects to the
      `routeAfterAuthentication` specified in
      [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup).

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
      This action in invoked whenever session authentication fails. The
      arguments the action in invoked with depend on the used authenticator
      (see [Ember.SimpleAuth.Authenticators.Base](#Ember.SimpleAuth.Authenticators.Base)).

      It can be overridden to display error messages, e.g.:

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
    */
    sessionAuthenticationFailed: function() {
    },

    /**
      This action invalidates the current session (see
      [Session#destroy](#Ember.SimpleAuth.Session_destroy)). If that succeeds,
      it will redirect to `routeAfterInvalidation` specified in
      [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup).

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
      The default implementation does nothing.

      @method actions.sessionInvalidationSucceeded
    */
    sessionInvalidationSucceeded: function() {
      this.transitionTo(Ember.SimpleAuth.routeAfterInvalidation);
    },

    /**
      This action is invoked whenever session invalidation fails. The default
      implementation does nothing.

      @method actions.sessionInvalidationFailed
    */
    sessionInvalidationFailed: function(error) {
    }
  }
});
