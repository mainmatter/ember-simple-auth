/**
  The base for all authenticators. __This serves as a starting point for
  implementing custom authenticators and must not be used directly.__

  The authenticator authenticates the session. The actual mechanism used to do
  this might e.g. be posting a set of credentials to a server and in exchange
  retrieving an access token, initiating authentication against an external
  provider like Facebook etc. and depends on the specific authenticator. Any
  data that the authenticator receives upon successful authentication and
  resolves with from the
  [`Authenticators.Base#authenticate`](#SimpleAuth-Authenticators-Base-authenticate)
  method is stored in the session and can then be used by the authorizer (see
  [`Authorizers.Base`](#SimpleAuth-Authorizers-Base)).

  The authenticator also decides whether a set of data that was restored from
  the session store (see
  [`Stores.Base`](#SimpleAuth-Stores-Base)) is sufficient for the session to be
  authenticated or not.

  __Custom authenticators have to be registered with Ember's dependency
  injection container__ so that the session can retrieve an instance, e.g.:

  ```javascript
  import Base from 'simple-auth/authenticators/base';

  var CustomAuthenticator = Base.extend({
    ...
  });

  Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
      container.register('authenticator:custom', CustomAuthenticator);
    }
  });
  ```

  ```javascript
  // app/controllers/login.js
  import AuthenticationControllerMixin from 'simple-auth/mixins/authentication-controller-mixin';

  export default Ember.Controller.extend(AuthenticationControllerMixin, {
    authenticator: 'authenticator:custom'
  });
  ```

  @class Base
  @namespace SimpleAuth.Authenticators
  @module simple-auth/authenticators/base
  @extends Ember.Object
  @uses Ember.Evented
*/
export default Ember.Object.extend(Ember.Evented, {
  /**
    __Triggered when the data that constitutes the session is updated by the
    authenticator__. This might happen e.g. because the authenticator refreshes
    it or an event from is triggered from an external authentication provider.
    The session automatically catches that event, passes the updated data back
    to the authenticator's
    [SimpleAuth.Authenticators.Base#restore](#SimpleAuth-Authenticators-Base-restore)
    method and handles the result of that invocation accordingly.

    @event sessionDataUpdated
    @param {Object} data The updated session data
  */
  /**
    __Triggered when the data that constitutes the session is invalidated by
    the authenticator__. This might happen e.g. because the date expires or an
    event is triggered from an external authentication provider. The session
    automatically catches that event and invalidates itself.

    @event sessionDataInvalidated
    @param {Object} data The updated session data
  */

  /**
    Restores the session from a set of properties. __This method is invoked by
    the session either after the application starts up and session data was
    restored from the store__ or when properties in the store have changed due
    to external events (e.g. in another tab) and the new set of properties
    needs to be re-checked for whether it still constitutes an authenticated
    session.

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any properties the promise resolves with
    will be saved in and accessible via the session. In most cases the `data`
    argument will simply be forwarded through the promise. A rejecting promise
    indicates that authentication failed and the session will remain unchanged.

    `SimpleAuth.Authenticators.Base`'s implementation always returns a
    rejecting promise.

    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(data) {
    return new Ember.RSVP.reject();
  },

  /**
    Authenticates the session with the specified `options`. These options vary
    depending on the actual authentication mechanism the authenticator
    implements (e.g. a set of credentials or a Facebook account id etc.). __The
    session will invoke this method when an action in the appliaction triggers
    authentication__ (see
    [SimpleAuth.AuthenticationControllerMixin.actions#authenticate](#SimpleAuth-AuthenticationControllerMixin-authenticate)).

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any properties the promise resolves with
    will be saved in and accessible via the session. A rejecting promise
    indicates that authentication failed and the session will remain unchanged.

    `SimpleAuth.Authenticators.Base`'s implementation always returns a
    rejecting promise and thus never authenticates the session.

    @method authenticate
    @param {Object} options The options to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  authenticate: function(options) {
    return new Ember.RSVP.reject();
  },

  /**
    This callback is invoked when the session is invalidated. While the session
    will invalidate itself and clear all session properties, it might be
    necessary for some authenticators to perform additional tasks (e.g.
    invalidating an access token on the server), which should be done in this
    method.

    __This method returns a promise. A resolving promise will result in the
    session being invalidated.__ A rejecting promise will result in the session
    invalidation being intercepted and the session being left authenticated.

    `SimpleAuth.Authenticators.Base`'s implementation always returns a
    resolving promise and thus never intercepts session invalidation.

    @method invalidate
    @param {Object} data The data that the session currently holds
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
  */
  invalidate: function(data) {
    return new Ember.RSVP.resolve();
  }
});
