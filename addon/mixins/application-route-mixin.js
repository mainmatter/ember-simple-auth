import Ember from 'ember';
import Configuration from './../configuration';

const { service } = Ember.inject;

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
      var session          = container.lookup('session:main');
      // handle the session events
      session.on('authenticationSucceeded', function() {
        applicationRoute.transitionTo('index');
      });
    }
  });
  ```

  @class ApplicationRouteMixin
  @namespace Mixins
  @module ember-simple-auth/mixins/application-route-mixin
  @extends Ember.Mixin
  @static
  @public
*/
export default Ember.Mixin.create({
  session: service('session'),

  /**
    @method _mapSessionEventsToActions
    @private
  */
  _mapSessionEventsToActions: Ember.on('init', function() {
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
    This action is triggered whenever the session is successfully
    authenticated. If there is a transition that was previously intercepted
    by
    [`AuthenticatedRouteMixin#beforeModel`](#SimpleAuth-AuthenticatedRouteMixin-beforeModel)
    it will retry it. If there is no such transition, this action transitions
    to the
    [`Configuration.routeAfterAuthentication`](#SimpleAuth-Configuration-routeAfterAuthentication).

    @method sessionAuthenticated
    @public
  */
  sessionAuthenticated() {
    let attemptedTransition = this.get('session').get('attemptedTransition');
    if (attemptedTransition) {
      attemptedTransition.retry();
      this.get('session').set('attemptedTransition', null);
    } else {
      this.transitionTo(Configuration.base.routeAfterAuthentication);
    }
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

    @method sessionInvalidated
    @public
  */
  sessionInvalidated() {
    if (!Ember.testing) {
      window.location.reload();
    }
  }
});
