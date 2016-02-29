import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const SESSION_DATA_KEY_PREFIX = /^data\./;

const { computed }  = Ember;

/**
  __The session service provides access to the current session as well as
  methods to authenticate and invalidate it__ etc. It is the main interface for
  the application to Ember Simple Auth's functionality. It can be injected via

  ```js
  // app/components/login-form.js
  import Ember from 'ember';

  export default Ember.Component.extend({
    session: Ember.inject.service('session')
  });
  ```

  @class SessionService
  @module ember-simple-auth/services/session
  @extends Ember.Service
  @uses Ember.Evented
  @public
*/
export default Ember.Service.extend(Ember.Evented, {
  /**
    Triggered whenever the session is successfully authenticated. This happens
    when the session gets authenticated via
    {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}} but also
    when the session is authenticated in another tab or window of the same
    application and the session state gets synchronized across tabs or windows
    via the store (see
    {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).

    When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
    event will automatically get handled (see
    {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).

    @event authenticationSucceeded
    @public
  */

  /**
    Triggered whenever the session is successfully invalidated. This happens
    when the session gets invalidated via
    {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}} but also
    when the session is invalidated in another tab or window of the same
    application and the session state gets synchronized across tabs or windows
    via the store (see
    {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).

    When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
    event will automatically get handled (see
    {{#crossLink "ApplicationRouteMixin/sessionInvalidated:method"}}{{/crossLink}}).

    @event invalidationSucceeded
    @public
  */

  /**
    Returns whether the session is currently authenticated.

    @property isAuthenticated
    @type Boolean
    @readOnly
    @default false
    @public
  */
  isAuthenticated: computed.oneWay('session.isAuthenticated'),

  /**
    The current session data as a plain object. The
    `authenticated` key holds the session data that the authenticator resolved
    with when the session was authenticated (see
    {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}) and
    that will be cleared when the session is invalidated. This data cannot be
    written. All other session data is writable and will not be cleared when
    the session is invalidated.

    @property data
    @type Object
    @readOnly
    @default { authenticated: {} }
    @public
  */
  data: computed.oneWay('session.content'),

  /**
    The session store.

    @property store
    @type BaseStore
    @readOnly
    @default null
    @public
  */
  store: computed.oneWay('session.store'),

  /**
    A previously attempted but intercepted transition (e.g. by the
    {{#crossLink "AuthenticatedRouteMixin"}}{{/crossLink}}). If an attempted
    transition is present, the
    {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} will retry it when the
    session becomes authenticated (see
    {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).

    @property attemptedTransition
    @type Transition
    @default null
    @public
  */
  attemptedTransition: computed.alias('session.attemptedTransition'),

  init() {
    this._super(...arguments);
    this._forwardSessionEvents();
  },

  set(key, value) {
    const setsSessionData = SESSION_DATA_KEY_PREFIX.test(key);
    if (setsSessionData) {
      const sessionDataKey = `session.${key.replace(SESSION_DATA_KEY_PREFIX, '')}`;
      return this._super(sessionDataKey, value);
    } else {
      return this._super(...arguments);
    }
  },

  _forwardSessionEvents() {
    Ember.A([
      'authenticationSucceeded',
      'invalidationSucceeded'
    ]).forEach((event) => {
      const session = this.get('session');
      // the internal session won't be available in route unit tests
      if (session) {
        session.on(event, () => {
          this.trigger(event, ...arguments);
        });
      }
    });
  },

  /**
    __Authenticates the session with an `authenticator`__ and appropriate
    arguments. The authenticator implements the actual steps necessary to
    authenticate the session (see
    {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}) and
    returns a promise after doing so. The session handles the returned promise
    and when it resolves becomes authenticated, otherwise remains
    unauthenticated. All data the authenticator resolves with will be
    accessible via the
    {{#crossLink "SessionService/data:property"}}session data's{{/crossLink}}
    `authenticated` property.

    __This method returns a promise. A resolving promise indicates that the
    session was successfully authenticated__ while a rejecting promise
    indicates that authentication failed and the session remains
    unauthenticated. The promise does not resolve with a value; instead, the
    data returned from the authenticator is available via the
    {{#crossLink "SessionService/data:property"}}{{/crossLink}} property.

    When authentication succeeds this will trigger the
    {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
    event.

    @method authenticate
    @param {String} authenticator The authenticator to use to authenticate the session
    @param {Any} [...args] The arguments to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
    @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully and rejects otherwise
    @public
  */
  authenticate() {
    const session = this.get('session');

    return session.authenticate(...arguments);
  },

  /**
    __Invalidates the session with the authenticator it is currently
    authenticated with__ (see
    {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}}). This
    invokes the authenticator's
    {{#crossLink "BaseAuthenticator/invalidate:method"}}{{/crossLink}} method
    and handles the returned promise accordingly.

    This method returns a promise. A resolving promise indicates that the
    session was successfully invalidated while a rejecting promise indicates
    that invalidation failed and the session remains authenticated. Once the
    session is successfully invalidated it clears all of its authenticated data
    (see {{#crossLink "SessionService/data:property"}}{{/crossLink}}).

    When invalidation succeeds this will trigger the
    {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
    event.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully and rejects otherwise
    @public
  */
  invalidate() {
    const session = this.get('session');

    return session.invalidate(...arguments);
  },

  /**
    Authorizes a block of code with an authorizer (see
    {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) if the
    session is authenticated. If the session is not currently authenticated
    this method does nothing.

    ```js
    this.get('session').authorize('authorizer:oauth2-bearer', (headerName, headerValue) => {
      xhr.setRequestHeader(headerName, headerValue);
    });
    ```

    @method authorize
    @param {String} authorizer The authorizer to authorize the block with
    @param {Function} block The block of code to call with the authorization data generated by the authorizer
    @public
  */
  authorize(authorizerFactory, block) {
    if (this.get('isAuthenticated')) {
      const authorizer = getOwner(this).lookup(authorizerFactory);
      const sessionData = this.get('data.authenticated');
      authorizer.authorize(sessionData, block);
    }
  }
});
