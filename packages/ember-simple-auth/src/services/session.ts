import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import Configuration from '../configuration';

import {
  requireAuthentication,
  triggerAuthentication,
  prohibitAuthentication,
  handleSessionAuthenticated,
  handleSessionInvalidated,
} from '../-internals/routing';
import type Transition from '@ember/routing/transition';
import { alias, readOnly } from '@ember/object/computed';

const SESSION_DATA_KEY_PREFIX = /^data\./;

function assertSetupHasBeenCalled(isSetupCalled: boolean) {
  if (!isSetupCalled) {
    assert(
      "Ember Simple Auth: session#setup wasn't called. Make sure to call session#setup in your application route's beforeModel hook.",
      false
    );
  }
}

type RouteOrCallback = string | (() => void);

type InternalSessionMock<Data> = {
  isAuthenticated: boolean;
  content: Data;
  store: unknown;
  attemptedTransition: null;
  on: (event: 'authenticationSucceeded' | 'invalidationSucceeded', cb: () => void) => void;
  authenticate: (authenticator: string, ...args: any[]) => Promise<void>;
  invalidate: (...args: any[]) => Promise<void>;
  requireAuthentication: (transition: Transition, routeOrCallback: RouteOrCallback) => boolean;
  prohibitAuthentication: (routeOrCallback: RouteOrCallback) => boolean;
  restore: () => Promise<void>;
  set(key: string, value: any): void;
};

export type DefaultDataShape = {
  authenticated: {
    authenticator: string;
    [key: string]: string;
  };
};

/**
  __The session service provides access to the current session as well as
  methods to authenticate it, invalidate it, etc.__ It is the main interface for
  the application to Ember Simple Auth's functionality.

  ```js
  // app/components/login-form.js
  import Component from '@ember/component';
  import { service } from '@ember/service';

  export default class LoginFormComponent extends Component {
    &#64;service session;
  }
  ```

  @class SessionService
  @extends Service
  @public
*/
export default class SessionService<Data = DefaultDataShape> extends Service {
  session: InternalSessionMock<Data>;

  constructor(owner: any) {
    super(owner);

    this.session = owner.lookup('session:main');
  }

  /**
   * Says whether the service was correctly initialized by the {#linkplain SessionService.setup}
   */
  _setupIsCalled = false;

  /**
    Returns whether the session is currently authenticated.

    @memberof SessionService
    @property isAuthenticated
    @type Boolean
    @readOnly
    @default false
    @public
  */
  @readOnly('session.isAuthenticated') declare isAuthenticated: boolean;

  /**
    The current session data as a plain object. The
    `authenticated` key inside  {@linkplain SessionService.data} holds the session data that the authenticator resolved
    with when the session was authenticated (see {@linkplain BaseAuthenticator.authenticate}) and
    that will be cleared when the session is invalidated. This data cannot be
    written. All other session data is writable and will not be cleared when
    the session is invalidated.

    @memberof SessionService
    @property data
    @type Object
    @readOnly
    @default { authenticated: {} }
    @public
  */
  @readOnly('session.content') declare data: Data;

  /**
    The session store.

    @memberof SessionService
    @property store
    @type BaseStore
    @readOnly
    @default null
    @public
  */
  @readOnly('session.store') declare store: unknown;

  /**
    A previously attempted but intercepted transition (e.g. by the
    {@linkplain SessionService.requireAuthentication}
    If an attempted transition is present it will be retried.

    @memberof SessionService
    @property attemptedTransition
    @type Transition
    @default null
    @public
  */
  @alias('session.attemptedTransition')
  attemptedTransition: null | Transition = null;

  set(key: any, value: any) {
    const setsSessionData = SESSION_DATA_KEY_PREFIX.test(key);
    if (setsSessionData) {
      const sessionDataKey = `session.${key.replace(SESSION_DATA_KEY_PREFIX, '')}`;
      return super.set(sessionDataKey, value);
    } else {
      return super.set(key, value);
    }
  }

  _setupHandlers() {
    this.session.on('authenticationSucceeded', () =>
      this.handleAuthentication(Configuration.routeAfterAuthentication)
    );
    this.session.on('invalidationSucceeded', () => this.handleInvalidation(Configuration.rootURL));
  }

  /**
    __Authenticates the session with an `authenticator`__ and appropriate
    arguments. The authenticator implements the actual steps necessary to
    authenticate the session (see
    {@linkplain BaseAuthenticator.authenticate} and
    returns a promise after doing so. The session handles the returned promise
    and when it resolves becomes authenticated, otherwise remains
    unauthenticated. All data the authenticator resolves with will be
    accessible via the
    {@Linkplain SessionService.data} session data's
    `authenticated` property.

    This method returns a promise. A resolving promise indicates that the
    session was successfully authenticated while a rejecting promise
    indicates that authentication failed and the session remains
    unauthenticated. The promise does not resolve with a value; instead, the
    data returned from the authenticator is available via the
    {@linkplain SessionService.data} property.

    When authentication succeeds this will trigger the
    {@linkplain SessionService.authenticationSucceeded} event.

    @memberof SessionService
    @method authenticate
    @param {String} authenticator The authenticator to use to authenticate the session
    @param {Any} [...args] The arguments to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
    @return {Promise} A promise that resolves when the session was authenticated successfully and rejects otherwise
    @public
  */
  authenticate(authenticator: string, ...args: any[]) {
    return this.session.authenticate(authenticator, ...args);
  }

  /**
    __Invalidates the session with the authenticator it is currently
    authenticated with__ (see
    {@linkplain SessionService.authenticate}). This
    invokes the authenticator's
    {@linkplain BaseAuthenticator.invalidate} method
    and handles the returned promise accordingly.

    This method returns a promise. A resolving promise indicates that the
    session was successfully invalidated while a rejecting promise indicates
    that invalidation failed and the session remains authenticated. Once the
    session is successfully invalidated it clears all of its authenticated data
    (see {@linkplain SessionService.data}).

    When invalidation succeeds this will trigger the
    {@linkplain SessionService.invalidationSucceeded}
    event.

    When calling the {@linkplain BaseAuthenticator.invalidate}
    on an already unauthenticated session, the method will return a resolved Promise
    immediately.

    @memberof SessionService
    @method invalidate
    @param {Array} ...args arguments that will be passed to the authenticator
    @return {Promise} A promise that resolves when the session was invalidated successfully and rejects otherwise
    @public
  */
  invalidate(...args: any[]) {
    return this.session.invalidate(...args);
  }

  /**
    Checks whether the session is authenticated and if it is not, transitions
    to the specified route or invokes the specified callback.

    If a transition is in progress and is aborted, this method will save it in the
    session service's
    {@linkplain SessionService.attemptedTransition}
    property so that  it can be retried after the session is authenticated. If
    the transition is aborted in Fastboot mode, the transition's target URL
    will be saved in a `ember_simple_auth-redirectTarget` cookie for use by the
    browser after authentication is complete.

    @memberof SessionService
    @method requireAuthentication
    @param {Transition} transition A transition that triggered the authentication requirement or null if the requirement originated independently of a transition
    @param {String|Function} routeOrCallback The route to transition to in case that the session is not authenticated or a callback function to invoke in that case
    @return {Boolean} true when the session is authenticated, false otherwise
    @public
  */
  requireAuthentication(transition: Transition, routeOrCallback: RouteOrCallback) {
    assertSetupHasBeenCalled(this._setupIsCalled);
    let isAuthenticated = requireAuthentication(getOwner(this), transition);
    if (!isAuthenticated) {
      if (typeof routeOrCallback === 'string') {
        triggerAuthentication(getOwner(this), routeOrCallback);
      } else if (typeof routeOrCallback === 'function') {
        routeOrCallback();
      } else {
        assert(
          `The second argument to requireAuthentication must be a String or Function, got "${typeof routeOrCallback}"!`,
          false
        );
      }
    }
    return isAuthenticated;
  }

  /**
    Checks whether the session is authenticated and if it is, transitions
    to the specified route or invokes the specified callback.

    @memberof SessionService
    @method prohibitAuthentication
    @param {String|Function} routeOrCallback The route to transition to in case that the session is authenticated or a callback function to invoke in that case
    @return {Boolean} true when the session is not authenticated, false otherwise
    @public
  */
  prohibitAuthentication(routeOrCallback: RouteOrCallback) {
    assertSetupHasBeenCalled(this._setupIsCalled);
    let isAuthenticated = this.get('isAuthenticated');
    if (isAuthenticated) {
      if (typeof routeOrCallback === 'string') {
        prohibitAuthentication(getOwner(this), routeOrCallback);
      } else if (typeof routeOrCallback === 'function') {
        routeOrCallback();
      } else {
        assert(
          `The first argument to prohibitAuthentication must be a String or Function, got "${typeof routeOrCallback}"!`,
          false
        );
      }
    }
    return !isAuthenticated;
  }

  /**
    This method is called whenever the session goes from being unauthenticated
    to being authenticated. If there is a transition that was previously
    intercepted by the
    {@linkplain SessionService.requireAuthentication},
    it will retry it. If there is no such transition, the
    `ember_simple_auth-redirectTarget` cookie will be checked for a url that
    represents an attemptedTransition that was aborted in Fastboot mode,
    otherwise this action transitions to the specified
    routeAfterAuthentication.

    @memberof SessionService
    @method handleAuthentication
    @param {String} routeAfterAuthentication The route to transition to
    @public
  */
  handleAuthentication(routeAfterAuthentication: string) {
    handleSessionAuthenticated(getOwner(this), routeAfterAuthentication);
  }

  /**
    This method is called whenever the session goes from being authenticated to
    not being authenticated. __It reloads the Ember.js application__ by
    redirecting the browser to the specified route so that all in-memory data
    (such as Ember Data stores etc.) gets cleared.

    If the Ember.js application will be used in an environment where the users
    don't have direct access to any data stored on the client (e.g.
    [cordova](http://cordova.apache.org)) this action can be overridden to e.g.
    simply transition to the index route.

    @memberof SessionService
    @method handleInvalidation
    @param {String} routeAfterInvalidation The route to transition to
    @public
  */
  handleInvalidation(routeAfterInvalidation: string) {
    handleSessionInvalidated(getOwner(this), routeAfterInvalidation);
  }

  /**
    Sets up the session service.

    This method must be called when the application starts up,
    usually as the first thing in the `application` route's `beforeModel`
    method.

    @memberof SessionService
    @method setup
    @public
  */
  setup() {
    if(!this._setupIsCalled) {
      this._setupIsCalled = true;
      this._setupHandlers();
  
      return this.session.restore().catch(() => {
        // If it raises an error then it means that restore didn't find any restorable state.
      });
    }
  }
}
