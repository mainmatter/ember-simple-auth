var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  The base for all authenticators. __This serves as a starting point for
  implementing custom authenticators and must not be used directly.__

  The authenticator acquires all data that makes up the session. The actual
  mechanism used to do this might e.g. be posting a set of credentials to a
  server and in exchange retrieving an access token, initiating authentication
  against an external provider like Facebook etc. and depends on the specific
  authenticator. Any data that the authenticator receives upon successful
  authentication and resolves with grom the
  [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
  method is stored in the session and can then be used by the authorizer (see
  [Ember.SimpleAuth.Authorizers.Base](#Ember-SimpleAuth-Authorizers-Base)).

  Authenticators may trigger the `'ember-simple-auth:session-updated'` event
  when any of the session properties change. The session listens to that event
  and will handle the changes accordingly.

  __Custom authenticators have to be registered with Ember's dependency
  injection container__ so that the session can retrieve an instance, e.g.:

  ```javascript
  var CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
    ...
  });
  Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
      container.register('app:authenticators:custom', CustomAuthenticator);
      Ember.SimpleAuth.setup(container, application);
    }
  });
  ```

  @class Authenticator
  @namespace Authenticators
  @extends Ember.Object
  @uses Ember.Evented
*/
var Authenticator = Ember.Object.extend(Ember.Evented, {
  /**
    Restores the session from a set of properties. __This method is invoked by
    the session either after the applciation starts up and session data was
    restored from the store__ or when properties in the store have changed due
    to external events (e.g. in another tab).

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any properties the promise resolves with
    will be saved by and accessible via the session. In most cases the
    `properties` argument will simply be forwarded through the promise. A
    rejecting promise indicates that authentication failed and the session
    will remain unchanged.

    `Ember.SimpleAuth.Authenticators.Base`'s always rejects as there's no
    reasonable default implementation.

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
    [Ember.SimpleAuth.AuthenticationControllerMixin.actions#authenticate](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticate)).

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any properties the promise resolves with
    will be saved by and accessible via the session. A rejecting promise
    indicates that authentication failed and the session will remain unchanged.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
    rejecting promise and thus never authenticates the session as there's no
    reasonable default behavior (for Ember.SimpleAuth's default authenticator
    see
    [Ember.SimpleAuth.Authenticators.OAuth2](#Ember-SimpleAuth-Authenticators-OAuth2)).

    @method authenticate
    @param {Object} options The options to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  authenticate: function(options) {
    return new Ember.RSVP.reject();
  },

  /**
    Invalidation callback that is invoked when the session is invalidated.
    While the session will invalidate itself and clear all session properties,
    it might be necessary for some authenticators to perform additional tasks
    (e.g. invalidating an access token on the server), which should be done in
    this method.

    __This method returns a promise. A resolving promise will result in the
    session being invalidated.__ A rejecting promise will result in the session
    invalidation being intercepted and the session being left authenticated.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
    resolving promise and thus never intercepts session invalidation.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
  */
  invalidate: function() {
    return new Ember.RSVP.resolve();
  }
});

export { Authenticator };
