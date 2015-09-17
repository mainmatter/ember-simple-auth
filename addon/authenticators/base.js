import Ember from 'ember';

const { RSVP } = Ember;

/**
  The base for all authenticators. __This serves as a starting point for
  implementing custom authenticators and must not be used directly.__

  The authenticator authenticates the session. The actual mechanism used to do
  this might e.g. be posting a set of credentials to a server and in exchange
  retrieving an access token, initiating authentication against an external
  provider like Facebook etc. and depends on the specific authenticator. Any
  data that the authenticator receives upon successful authentication and
  resolves with from the
  {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}
  method is stored in the session and can then be used by the authorizer (see
  {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}.

  The authenticator also decides whether a set of data that was restored from
  the session store (see
  {{#crossLink "BaseStore/restore:method"}}{{/crossLink}} is sufficient for the
  session to be authenticated or not.

  __Custom authenticators can be defined in the `app/authenticators`
  directory__, e.g.:

  ```js
  // app/authenticators/custom.js
  import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

  export default BaseAuthenticator.extend({
    ...
  });
  ```

  and can then be used with the name Ember CLI automatically registers them
  with in the Ember container:

  ```js
  // app/components/login-form.js
  export default Ember.Controller.extend({
    session: Ember.inject.service(),

    actions: {
      authenticate: function() {
        this.get('session').authenticate('authenticator:custom');
      }
    }
  });
  ```

  @class BaseAuthenticator
  @module ember-simple-auth/authenticators/base
  @extends Ember.Object
  @uses Ember.Evented
  @public
*/
export default Ember.Object.extend(Ember.Evented, {
  /**
    __Triggered when the data that constitutes the session is updated by the
    authenticator__. This might happen e.g. because the authenticator refreshes
    it or an event is triggered from an external authentication provider. The
    session automatically catches that event, passes the updated data back to
    the authenticator's
    {{#crossLink "BaseAuthenticator/restore:method"}}{{/crossLink}}
    method and handles the result of that invocation accordingly.

    @event sessionDataUpdated
    @param {Object} data The updated session data
    @public
  */

  /**
    __Triggered when the data that constitutes the session is invalidated by
    the authenticator__. This might happen e.g. because the date expires or an
    event is triggered from an external authentication provider. The session
    automatically catches that event and invalidates itself.

    @event sessionDataInvalidated
    @public
  */

  /**
    Restores the session from a session data object. __This method is invoked
    by the session either after the application starts up and session data is
    restored from the session store__ or when properties in the store change
    due to external events (e.g. in another tab) and the new session data needs
    to be re-checked for whether it still constitutes an authenticated session.

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any data the promise resolves with will be
    saved in and accessible via the session's `data.authenticated` property. In
    most cases, `data` will simply be forwarded through the promise. A
    rejecting promise indicates that `data` does not constitute a valid session
    and will result in the session being invalidated.

    The `BaseAuthenticator`'s implementation always returns a rejecting
    promise. This method must be overridden in custom authenticators.

    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
    @public
  */
  restore() {
    return RSVP.reject();
  },

  /**
    Authenticates the session with the specified `options`. These options vary
    depending on the actual authentication mechanism the authenticator
    implements (e.g. a set of credentials or a Facebook account id etc.). __The
    session will invoke this method when it is being authenticated__ (see
    {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}}.

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any data the promise resolves with will be
    saved in and accessible via the session's `data.authenticated` property. A
    rejecting promise indicates that authentication failed and the session will
    remain unchanged.

    The `BaseAuthenticator`'s implementation always returns a rejecting promise
    and thus never authenticates the session. This method must be overridden in
    custom authenticators.

    @method authenticate
    @param {Any} [...options] The arguments that the authenticator requires to authenticate the session
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
    @public
  */
  authenticate() {
    return RSVP.reject();
  },

  /**
    This callback is invoked when the session is invalidated. While the session
    will invalidate itself and clear all session properties, it might be
    necessary for some authenticators to perform additional tasks (e.g.
    invalidating an access token on the server), which should be done in this
    method.

    __This method returns a promise. A resolving promise will result in the
    session being invalidated.__ A rejecting promise will result in
    invalidation being intercepted and the session being left authenticated.

    The `BaseAuthenticator`'s implementation always returns a resolving promise
    and thus never intercepts session invalidation. This method doesn't have to
    be overridden in custom authenticators if no actions need to be performed
    on session invalidation.

    @method invalidate
    @param {Object} data The data that the session currently holds
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
    @public
  */
  invalidate() {
    return RSVP.resolve();
  }
});
