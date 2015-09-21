import Ember from 'ember';
import Configuration from './../configuration';

const { service } = Ember.inject;

/**
  The mixin for the application route; defines methods that are called when the
  session has successfully been authenticated or invalidated. These methods
  are called whenever the respective session events are triggered and provide a
  good starting point for adding custom behavior for these situations.

  Using this mixin is optional. The session events could also be handled
  manually of course, e.g. in an instance initializer:

  ```js
  Ember.Application.initializer({
    name:       'authentication',
    after:      'simple-auth',
    initialize: function(container, application) {
      var applicationRoute = container.lookup('route:application');
      var session          = container.lookup('session:main');
      // handle the session events
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
  @static
  @public
*/
export default Ember.Mixin.create({
  /**
    The session service.

    @property session
    @type SessionService
    @public
  */
  session: service('session'),

  /**
    @method _subscribeToSessionEvents
    @private
  */
  _subscribeToSessionEvents: Ember.on('init', function() {
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
    {{#crossLink "Session/authenticationSucceeded:event"}}{{/crossLink}}
    event. If there is a transition that was previously intercepted by
    {{#crossLink "AuthenticatedRouteMixin/beforeModel:method"}}{{/crossLink}}
    it will retry it. If there is no such transition, this action transitions
    to the
    {{#crossLink "Configuration/routeAfterAuthentication:property"}}{{/crossLink}}.

    @method sessionAuthenticated
    @public
  */
  sessionAuthenticated() {
    let attemptedTransition = this.get('session').get('attemptedTransition');
    if (attemptedTransition) {
      attemptedTransition.retry();
      this.get('session').set('attemptedTransition', null);
    } else {
      this.transitionTo(Configuration.routeAfterAuthentication);
    }
  },

  /**
    This method handles the session's
    {{#crossLink "Session/invalidationSucceeded:event"}}{{/crossLink}}
    event. It reloads the Ember.js application by redirecting the browser to
    the application's root URL so that all in-memory data (such as Ember Data
    stores etc.) gets cleared.
  
    If your Ember.js application will be used in an environment where the
    users don't have direct access to any data stored on the client (e.g.
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
