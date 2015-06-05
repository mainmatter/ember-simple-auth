import Configuration from './../configuration';

/**
  The mixin for the application route; defines actions that are triggered
  when authentication is required, when the session has successfully been
  authenticated or invalidated or when authentication or invalidation fails or
  authorization is rejected by the server. These actions provide a good
  starting point for adding custom behavior to these events.

  __When this mixin is used and the application's `ApplicationRoute` defines
  the `beforeModel` method, that method has to call `_super`.__

  Using this mixin is optional. Without using it, the session's events will not
  be automatically translated into route actions but would have to be handled
  inidivially, e.g. in an initializer:

  ```js
  Ember.Application.initializer({
    name:       'authentication',
    after:      'simple-auth',
    initialize: function(container, application) {
      var applicationRoute = container.lookup('route:application');
      var session          = container.lookup('simple-auth-session:main');
      // handle the session events
      session.on('sessionAuthenticationSucceeded', function() {
        applicationRoute.transitionTo('index');
      });
    }
  });
  ```

  @class ApplicationRouteMixin
  @namespace SimpleAuth
  @module simple-auth/mixins/application-route-mixin
  @extends Ember.Mixin
  @static
*/
export default Ember.Mixin.create({
  /**
    @method activate
    @private
  */
  activate: function () {
    /*
      Used to detect the first time the application route is entered so that
      the transition can be used as the target of send before entering the
      application route and the route can be used once it has been entered.
    */
    this.set('_authRouteEntryComplete', true);
    this._super();
  },

  /**
    @method beforeModel
    @private
  */
  beforeModel: function(transition) {
    this._super(transition);
    if (!this.get('_authEventListenersAssigned')) {
      this.set('_authEventListenersAssigned', true);
      var _this = this;
      Ember.A([
        'sessionAuthenticationSucceeded',
        'sessionAuthenticationFailed',
        'sessionInvalidationSucceeded',
        'sessionInvalidationFailed',
        'authorizationFailed'
      ]).forEach(function(event) {
        _this.get(Configuration.sessionPropertyName).on(event, function(error) {
          Array.prototype.unshift.call(arguments, event);
          var target = _this.get('_authRouteEntryComplete') ? _this : transition;
          target.send.apply(target, arguments);
        });
      });
    }
  },

  actions: {
    /**
      This action triggers a transition to the
      [`Configuration.authenticationRoute`](#SimpleAuth-Configuration-authenticationRoute).
      It is triggered automatically by the
      [`AuthenticatedRouteMixin`](#SimpleAuth-AuthenticatedRouteMixin) whenever
      a route that requires authentication is accessed but the session is not
      currently authenticated.

      __For an application that works without an authentication route (e.g.
      because it opens a new window to handle authentication there), this is
      the action to override, e.g.:__

      ```js
      App.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin, {
        actions: {
          sessionRequiresAuthentication: function() {
            this.get('session').authenticate('authenticator:custom', {});
          }
        }
      });
      ```

      @method actions.sessionRequiresAuthentication
    */
    sessionRequiresAuthentication: function() {
      this.transitionTo(Configuration.authenticationRoute);
    },

    /**
      This action triggers a transition to the
      [`Configuration.authenticationRoute`](#SimpleAuth-Configuration-authenticationRoute).
      It can be used in templates as shown above. It is also triggered
      automatically by the
      [`AuthenticatedRouteMixin`](#SimpleAuth-AuthenticatedRouteMixin) whenever
      a route that requries authentication is accessed but the session is not
      currently authenticated.

      __For an application that works without an authentication route (e.g.
      because it opens a new window to handle authentication there), this is
      the action to override, e.g.:__

      ```js
      App.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin, {
        actions: {
          authenticateSession: function() {
            this.get('session').authenticate('authenticator:custom', {});
          }
        }
      });
      ```

      @method actions.authenticateSession
      @deprecated use [`ApplicationRouteMixin#sessionRequiresAuthentication`](#SimpleAuth-ApplicationRouteMixin-sessionRequiresAuthentication) instead
    */
    authenticateSession: function() {
      Ember.deprecate('The authenticateSession action is deprecated. Use sessionRequiresAuthentication instead.');
      this.send('sessionRequiresAuthentication');
    },

    /**
      This action is triggered whenever the session is successfully
      authenticated. If there is a transition that was previously intercepted
      by
      [`AuthenticatedRouteMixin#beforeModel`](#SimpleAuth-AuthenticatedRouteMixin-beforeModel)
      it will retry it. If there is no such transition, this action transitions
      to the
      [`Configuration.routeAfterAuthentication`](#SimpleAuth-Configuration-routeAfterAuthentication).

      @method actions.sessionAuthenticationSucceeded
    */
    sessionAuthenticationSucceeded: function() {
      var attemptedTransition = this.get(Configuration.sessionPropertyName).get('attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.get(Configuration.sessionPropertyName).set('attemptedTransition', null);
      } else {
        this.transitionTo(Configuration.routeAfterAuthentication);
      }
    },

    /**
      This action is triggered whenever session authentication fails. The
      `error` argument is the error object that the promise the authenticator
      returns rejects with. (see
      [`Authenticators.Base#authenticate`](#SimpleAuth-Authenticators-Base-authenticate)).

      It can be overridden to display error messages etc.:

      ```js
      App.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin, {
        actions: {
          sessionAuthenticationFailed: function(error) {
            this.controllerFor('application').set('loginErrorMessage', error.message);
          }
        }
      });
      ```

      @method actions.sessionAuthenticationFailed
      @param {any} error The error the promise returned by the authenticator rejects with, see [`Authenticators.Base#authenticate`](#SimpleAuth-Authenticators-Base-authenticate)
    */
    sessionAuthenticationFailed: function(error) {
    },

    /**
      This action invalidates the session (see
      [`Session#invalidate`](#SimpleAuth-Session-invalidate)).
      If invalidation succeeds, it reloads the application (see
      [`ApplicationRouteMixin#sessionInvalidationSucceeded`](#SimpleAuth-ApplicationRouteMixin-sessionInvalidationSucceeded)).

      @method actions.invalidateSession
      @deprecated use [`Session#invalidate`](#SimpleAuth-Session-invalidate) instead
    */
    invalidateSession: function() {
      Ember.deprecate("The invalidateSession action is deprecated. Use the session's invalidate method directly instead.");
      this.get(Configuration.sessionPropertyName).invalidate();
    },

    /**
      This action is invoked whenever the session is successfully invalidated.
      It reloads the Ember.js application by redirecting the browser to the
      application's root URL so that all in-memory data (such as Ember Data
      stores etc.) gets cleared. The root URL is automatically retrieved from
      the Ember.js application's router (see
      http://emberjs.com/guides/routing/#toc_specifying-a-root-url).

      If your Ember.js application will be used in an environment where the
      users don't have direct access to any data stored on the client (e.g.
      [cordova](http://cordova.apache.org)) this action can be overridden to
      simply transition to the `'index'` route.

      @method actions.sessionInvalidationSucceeded
    */
    sessionInvalidationSucceeded: function() {
      if (!Ember.testing) {
        window.location.replace(Configuration.applicationRootUrl);
      }
    },

    /**
      This action is invoked whenever session invalidation fails. This mainly
      serves as an extension point to add custom behavior and does nothing by
      default.

      @method actions.sessionInvalidationFailed
      @param {any} error The error the promise returned by the authenticator rejects with, see [`Authenticators.Base#invalidate`](#SimpleAuth-Authenticators-Base-invalidate)
    */
    sessionInvalidationFailed: function(error) {
    },

    /**
      This action is invoked when an authorization error occurs (which is
      the case __when the server responds with HTTP status 401__). It
      invalidates the session and reloads the application (see
      [`ApplicationRouteMixin#sessionInvalidationSucceeded`](#SimpleAuth-ApplicationRouteMixin-sessionInvalidationSucceeded)).

      @method actions.authorizationFailed
    */
    authorizationFailed: function() {
      if (this.get(Configuration.sessionPropertyName).get('isAuthenticated')) {
        this.get(Configuration.sessionPropertyName).invalidate();
      }
    }
  }
});
