/**
  The mixin for the application controller. This defines the `login` and `logout` actions so that
  you can simply add buttons or links in every template you want:

  ```handlebars
    {{#if session.isAuthenticated}}
      <a {{ action 'logout' }}>Logout</a>
    {{else}}
      <a {{ action 'login' }}>Login</a>
    {{/if}}
  ```

  @class ApplicationRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    /**
      The login action by default redirects to the login route. When integrating with an external
      authentication provider you would override this action to open the external provider's UI
      in a new window:

      ```js
        App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
          actions: {
            login: function() {
              window.open('https://www.facebook.com/dialog/oauth...');
            }
          }
        });
      ```

      @method login
    */
    login: function() {
      this.transitionTo(Ember.SimpleAuth.loginRoute);
    },

    /**
      This action is invoked when a user successfully logged in. By default this method will retry a potentially
      intercepted transition (see Ember.SimpleAuth.AuthenticatedRouteMixin.beforeModel) or if none was intercepted
      redirect to the route defined as `routeAfterLogin` in Ember.SimpleAuth.setup (or `index` by default).

      @method loginSucceeded
    */
    loginSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', undefined);
      } else {
        this.transitionTo(Ember.SimpleAuth.routeAfterLogin);
      }
    },

    /**
      This action is invoked when login fails. This does nothing by default but if you're using an external authentication
      provider you might want to override it to display the external provider's error message:

      ```js
        App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
          actions: {
            loginFailed: function(error) {
              this.controllerFor('application').set('loginErrorMessage', error.message);
            }
          }
        });
      ```

      @method loginFailed
    */
    loginFailed: function() {
    },

    /**
      The logout action destroys the current session and redirects to the route defined as `routeAfterLogout`
      in Ember.SimpleAuth.setup (or `index` by default).

      @method logout
    */
    logout: function() {
      this.get('session').destroy();
      this.transitionTo(Ember.SimpleAuth.routeAfterLogout);
    }
  }
});
