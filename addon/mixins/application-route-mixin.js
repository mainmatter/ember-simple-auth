import Ember from 'ember';
import Configuration from './../configuration';

const { inject, on } = Ember;

/**
  The mixin for the application route; defines methods that are called when the
  session was successfully authenticated (see
  {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}})
  or invalidated (see
  {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}).

  Using this mixin is optional. The session events could also be handled
  manually, e.g. in an instance initializer:

  ```js
  // app/instance-initializers/session-events.js
  Ember.Application.initializer({
    name:       'session-events',
    after:      'ember-simple-auth',
    initialize: function(container, application) {
      var applicationRoute = container.lookup('route:application');
      var session          = container.lookup('service:session');
      session.on('authenticationSucceeded', function() {
        applicationRoute.transitionTo('index');
      });
      session.on('invalidationSucceeded', function() {
        window.location.reload();
      });
    }
  });
  ```

  @class ApplicationRouteMixin
  @module ember-simple-auth/mixins/application-route-mixin
  @extends Ember.Mixin
  @public
*/
export default Ember.Mixin.create({
  /**
    The session service.

    @property session
    @readOnly
    @type SessionService
    @public
  */
  session: inject.service('session'),

  _subscribeToSessionEvents: on('init', function() {
    Ember.A([
      ['authenticationSucceeded', 'sessionAuthenticated'],
      ['invalidationSucceeded', 'sessionInvalidated']
    ]).forEach(([event, method]) => {
      this.get('session').on(event, Ember.run.bind(this, () => {
        this[method](...arguments);
      }));
    });
  }),

  /**
    This method handles the session's
    {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
    event. If there is a transition that was previously intercepted by
    {{#crossLink "AuthenticatedRouteMixin/beforeModel:method"}}{{/crossLink}}
    it will retry it. If there is no such transition, this action transitions
    to the
    {{#crossLink "Configuration/routeAfterAuthentication:property"}}{{/crossLink}}.

    @method sessionAuthenticated
    @public
  */
  sessionAuthenticated() {
    let attemptedTransition = this.get('session.attemptedTransition');
    if (attemptedTransition) {
      attemptedTransition.retry();
      this.set('session.attemptedTransition', null);
    } else {
      this.transitionTo(Configuration.routeAfterAuthentication);
    }
  },

  /**
    This method handles the session's
    {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
    event. It reloads the Ember.js application by redirecting the browser to
    the application's root URL so that all in-memory data (such as Ember Data
    stores etc.) gets cleared.

    If the Ember.js application will be used in an environment where the users
    don't have direct access to any data stored on the client (e.g.
    [cordova](http://cordova.apache.org)) this action can be overridden to
    simply transition to the `'index'` route.

    @method sessionInvalidated
    @public
  */
  sessionInvalidated() {
    if (!Ember.testing) {
      window.location.replace(Configuration.baseURL);
    }
  }
});
