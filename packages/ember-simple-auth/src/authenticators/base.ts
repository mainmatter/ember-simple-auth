import EmberObject from '@ember/object';
import EsaEventTarget, { type EventListener } from '../-internals/event-target';

export interface AuthenticatorEvents {
  sessionDataUpdated: CustomEvent<any>;
  sessionDataInvalidated: CustomEvent;
}

class AuthenticatorEventTarget extends EsaEventTarget<AuthenticatorEvents> {}

/**
  The base class for all authenticators. __This serves as a starting point for
  implementing custom authenticators and must not be used directly.__

  The authenticator authenticates the session. The actual mechanism used to do
  this might, e.g., post a set of credentials to a server and in exchange
  retrieve an access token, initiating authentication against an external
  provider like Facebook, etc. The details depend on the specific authenticator.
  Upon successful authentication, any data that the authenticator receives and
  resolves via the promise returned from the
  {@linkplain BaseAuthenticator.authenticate}
  method is stored in the session's {@linkplain SessionService.data}.

  The authenticator also decides whether a set of data that was restored from
  the session store (see {@linkplain BaseStore.restore}) makes up an
  authenticated session or not.

  __Authenticators for an application are defined in the `app/authenticators`
  directory__, e.g.:

  ```js
  // app/authenticators/oauth2.js
  import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

  export default class OAuth2Authenticator extends OAuth2PasswordGrantAuthenticator {
    ...
  }
  ```

  and can then be used via the name Ember CLI automatically registers for them
  within the Ember container.

  ```js
  // app/components/login-form.js
  import Component from '@ember/component';
  import { service } from '@ember/service';
  import { action } from '@ember/object';

  export default class LoginFormComponent extends Component {
    &#64;service session;

    &#64;action
    authenticate() {
      this.session.authenticate('authenticator:oauth2');
    }
  }
  ```

  @class BaseAuthenticator
  @extends Ember.Object
  @public
*/
export default class EsaBaseAuthenticator extends EmberObject {
  authenticatorEvents = new AuthenticatorEventTarget();

  /**
    __Triggered when the authentication data is updated by the authenticator
    due to an external or scheduled event__. This might happen, e.g., if the
    authenticator refreshes an expired token or an event is triggered from an
    external authentication provider that the authenticator uses. The session
    handles that event, passes the updated data back to the authenticator's
    {@linkplain BaseAuthenticator.restore}
    method and handles the result of that invocation accordingly.

    @memberof BaseAuthenticator
    @event sessionDataUpdated
    @param {Object} data The updated session data
    @public
  */

  /**
    __Triggered when the authentication data is invalidated by the authenticator
    due to an external or scheduled event__. This might happen, e.g., if a token
    expires or an event is triggered from an external authentication provider
    that the authenticator uses. The session handles the event and will
    invalidate itself when it is triggered.

    @memberof BaseAuthenticator
    @event sessionDataInvalidated
    @public
  */

  /**
    Restores the session from a session data object. __This method is invoked
    by the session either on application startup if session data is restored
    from the session store__ or when properties in the store change due to
    external events (e.g. in another tab) and the new session data needs to be
    validated for whether it constitutes an authenticated session.

    __This method returns a promise. A resolving promise results in the session
    becoming or remaining authenticated.__ Any data the promise resolves with
    will be saved in and accessible via the session service's
    `data.authenticated` property (see
    {@linkplain SessionService.data}. A rejecting
    promise indicates that `data` does not constitute a valid session and will
    result in the session being invalidated or remaining unauthenticated.

    The `BaseAuthenticator`'s implementation always returns a rejecting
    promise. __This method must be overridden in subclasses.__

    @memberof BaseAuthenticator
    @method restore
    @param {Object} data The data to restore the session from
    @return {Promise} A promise that when it resolves results in the session becoming or remaining authenticated
    @member
    @public
  */
  restore(..._args: any[]): Promise<unknown> {
    return Promise.reject();
  }

  /**
    Authenticates the session with the specified `args`. These options vary
    depending on the actual authentication mechanism the authenticator
    implements (e.g. a set of credentials or a Facebook account id etc.). __The
    session will invoke this method in order to authenticate itself__ (see
    {@linkplain SessionService.authenticate}).

    __This method returns a promise. A resolving promise will result in the
    session becoming authenticated.__ Any data the promise resolves with will
    be saved in and accessible via the session service's `data.authenticated`
    property (see {@linkplain SessionService.data}).
    A rejecting promise indicates that authentication failed and will result in
    the session remaining unauthenticated.

    The `BaseAuthenticator`'s implementation always returns a rejecting promise
    and thus never authenticates the session. __This method must be overridden
    in subclasses__.

    @memberof BaseAuthenticator
    @method authenticate
    @param {Any} [...args] The arguments that the authenticator requires to authenticate the session
    @return {Promise} A promise that when it resolves results in the session becoming authenticated
    @member
    @public
  */
  authenticate(..._args: any[]): Promise<unknown> {
    return Promise.reject();
  }

  /**
    This method is invoked as a callback when the session is invalidated. While
    the session will invalidate itself and clear all authenticated session data,
    it might be necessary for some authenticators to perform additional tasks
    (e.g. invalidating an access token on the server side).
    This method returns a promise. A resolving promise will result in the
    session becoming unauthenticated.__ A rejecting promise will result in
    invalidation being intercepted and the session remaining authenticated.
    The `BaseAuthenticator`'s implementation always returns a resolving promise
    and thus never intercepts session invalidation. __This method doesn't have
    to be overridden in custom authenticators if no actions need to be
    performed on session invalidation.

    @memberof BaseAuthenticator
    @method invalidate
    @param {Object} data The current authenticated session data
    @param {Array} ...args additional arguments as required by the authenticator
    @return {Promise} A promise that when it resolves results in the session being invalidated
    @member
    @public
  */
  invalidate(..._args: any[]): Promise<unknown> {
    return Promise.resolve();
  }

  on<Event extends keyof AuthenticatorEvents>(
    event: Event,
    cb: EventListener<AuthenticatorEvents, Event>
  ) {
    this.authenticatorEvents.addEventListener(event, cb as any);
  }

  off<Event extends keyof AuthenticatorEvents>(
    event: Event,
    cb: EventListener<AuthenticatorEvents, Event>
  ) {
    this.authenticatorEvents.removeEventListener(event, cb as any);
  }

  trigger<Event extends keyof AuthenticatorEvents>(
    event: Event,
    value: AuthenticatorEvents[Event]['detail']
  ) {
    this.authenticatorEvents.dispatchEvent(event, value);
  }
}
