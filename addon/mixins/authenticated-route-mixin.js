import Ember from 'ember';
import Configuration from './../configuration';

const { service } = Ember.inject;

/**
  This mixin is for routes that require the session to be authenticated to be
  accessible. Including this mixin in a route automatically adds a hook that
  enforces the session to be authenticated and redirects to the
  {{#crossLink "Configuration/authenticationRoute:property"}}{{/crossLink}} if
  it is not.

  The `AuthenticatedRouteMixin` performs the redirect in the `beforeModel`
  method so that in all methods executed after that the session is guaranteed
  to be authenticated. __If `beforeModel` is overridden in a route that also
  uses this mixin, ensure that the custom implementation calls
  `this._super(...arguments)`__ so that the mixin's code is actually executed.

  ```js
  // app/routes/protected.js
  import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

  export default Ember.Route.extend(AuthenticatedRouteMixin);
  ```

  @class AuthenticatedRouteMixin
  @module ember-simple-auth/mixins/authenticated-route-mixin
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
    This method implements the enforcement of an authenticated session. If the
    session is not authenticated, the current transition will be aborted and a
    redirect to the
    {{#crossLink "Configuration/authenticationRoute:property"}}{{/crossLink}}
    will be triggered. The method also saves the intercepted transition so that
    it can be retried after the session has been authenticated (see
    {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}.

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
    @public
  */
  beforeModel(transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      this.get('session').set('attemptedTransition', transition);
      Ember.assert('The route configured as Configuration.authenticationRoute cannot implement the AuthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== Configuration.authenticationRoute);
      this.transitionTo(Configuration.authenticationRoute);
    } else {
      return this._super(...arguments);
    }
  }
});
