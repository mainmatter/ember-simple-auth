import { isEmpty, isNone } from '@ember/utils';
import EmberObject, { action, get } from '@ember/object';
import { debug, assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { associateDestroyableChild } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';
import { isTesting, isDevelopingApp, macroCondition } from '@embroider/macros';
import Configuration from './configuration';
import EsaEventTarget from './-internals/event-target';

class SessionEventTarget extends EsaEventTarget {}

const authenticatorMatches = (authenticator, authenticatorRef) => {
  if (authenticator === authenticatorRef) {
    return true;
  } else if (typeof authenticatorRef === 'function') {
    return (
      authenticator.constructor === authenticatorRef || authenticator instanceof authenticatorRef
    );
  } else if (typeof authenticatorRef === 'string') {
    const id = authenticator.constructor.id;
    return id === authenticatorRef || `authenticator:${id}` === authenticatorRef;
  } else {
    return false;
  }
};

const assertAuthenticators = authenticators => {
  if (!authenticators) {
    return;
  }

  assert(
    'Ember Simple Auth: createAuthenticators must return an array of authenticator instances.',
    Array.isArray(authenticators)
  );

  const seen = new Set();
  authenticators.forEach(authenticator => {
    const id = authenticator?.constructor?.id;
    assert(
      'Ember Simple Auth: each authenticator returned from createAuthenticators must have a static id.',
      !isEmpty(id)
    );
    assert(
      `Ember Simple Auth: duplicate authenticator id "${id}" returned from createAuthenticators.`,
      !seen.has(id)
    );
    seen.add(id);
  });
};

/**
  __An internal implementation of Session. Communicates with stores and emits events.__

  @class InternalSession
  @extends EmberObject
  @private
*/

export default class InternalSession extends EmberObject {
  /**
    Triggered whenever the session is successfully authenticated. This happens
    when the session gets authenticated via
    {@linkplain SessionService.authenticate} but also
    when the session is authenticated in another tab or window of the same
    application and the session state gets synchronized across tabs or windows
    via the store (see
    {@linkplain BaseStore.sessionDataUpdated}).

    @memberof InternalSession
    @event authenticationSucceeded
    @private
  */

  /**
    Triggered whenever the session is successfully invalidated. This happens
    when the session gets invalidated via
    {@linkplain SessionService.invalidate} but also
    when the session is invalidated in another tab or window of the same
    application and the session state gets synchronized across tabs or windows
    via the store (see
    {@linkplain BaseStore.sessionDataUpdated}.

    @memberof InternalSession
    @event invalidationSucceeded
    @private
  */
  authenticator = null;
  @tracked content = { authenticated: {} };
  @tracked store = null;
  @tracked isAuthenticated = false;
  @tracked attemptedTransition = null;
  sessionEvents = null;
  redirectTarget = null;

  constructor(owner, sessionStore, options = {}) {
    super(owner);

    this.content = { authenticated: {} };
    this.sessionEvents = new SessionEventTarget();
    this._busy = false;
    this._authenticators = options.authenticators || null;
    if (macroCondition(isDevelopingApp())) {
      assertAuthenticators(this._authenticators);
    }

    const store = sessionStore || this._lookupStore();
    assert('Ember Simple Auth: InternalSession requires a session store.', store);
    this.store = store;
    if (sessionStore) {
      associateDestroyableChild(this, sessionStore);
    }
    if (this._authenticators) {
      this._authenticators.forEach(authenticator => {
        associateDestroyableChild(this, authenticator);
      });
    }
    this._bindToStoreEvents();
  }

  _lookupStore() {
    if (!Configuration.useResolver) {
      return null;
    }

    let storeFactory = isTesting() ? 'session-store:test' : 'session-store:application';
    return getOwner(this).lookup(storeFactory);
  }

  authenticate(authenticatorFactory, ...args) {
    this._busy = true;
    assert(
      `Session#authenticate requires the authenticator to be specified, was "${authenticatorFactory}"!`,
      authenticatorFactory != null && authenticatorFactory !== ''
    );
    const authenticator = this._findAuthenticator(authenticatorFactory);

    return authenticator.authenticate(...args).then(
      content => {
        this._busy = false;
        return this._setup(authenticatorFactory, content, true);
      },
      error => {
        const rejectWithError = () => Promise.reject(error);

        this._busy = false;
        return this._clear().then(rejectWithError, rejectWithError);
      }
    );
  }

  invalidate() {
    this._busy = true;
    this.attemptedTransition = null;

    if (!this.get('isAuthenticated')) {
      this._busy = false;
      return Promise.resolve();
    }

    let authenticator = this._findAuthenticator(this.authenticator);
    return authenticator.invalidate(this.content.authenticated, ...arguments).then(
      () => {
        authenticator.off('sessionDataUpdated', this._onSessionDataUpdated);
        this._busy = false;
        return this._clear(true);
      },
      error => {
        this.trigger('sessionInvalidationFailed', error);
        this._busy = false;
        return Promise.reject(error);
      }
    );
  }

  restore() {
    this._busy = true;
    const reject = () => Promise.reject();

    return this.store.restore().then(
      restoredContent => {
        let { authenticator: authenticatorFactory } = restoredContent.authenticated || {};
        if (authenticatorFactory) {
          delete restoredContent.authenticated.authenticator;
          const authenticator = this._findAuthenticator(authenticatorFactory);
          return authenticator.restore(restoredContent.authenticated).then(
            content => {
              this.content = restoredContent;
              this._busy = false;
              return this._setup(authenticatorFactory, content);
            },
            err => {
              debug(
                `The authenticator "${authenticatorFactory}" rejected to restore the session - invalidating…`
              );
              if (err) {
                debug(err);
              }
              this._busy = false;
              return this._clearWithContent(restoredContent).then(reject, reject);
            }
          );
        } else {
          delete (restoredContent || {}).authenticated;
          this._busy = false;
          return this._clearWithContent(restoredContent).then(reject, reject);
        }
      },
      () => {
        this._busy = false;
        return this._clear().then(reject, reject);
      }
    );
  }

  _replaceContent(next) {
    this.content = next;
  }

  _withAuthenticated(authenticatedContent) {
    this._replaceContent(
      Object.assign({}, this.content || {}, { authenticated: authenticatedContent })
    );
  }

  _setup(authenticator, authenticatedContent, trigger) {
    trigger = Boolean(trigger) && !this.get('isAuthenticated');
    this.isAuthenticated = true;
    this.authenticator =
      typeof authenticator === 'string'
        ? authenticator
        : this._findAuthenticator(authenticator).constructor.id;
    this._withAuthenticated(authenticatedContent);
    this._bindToAuthenticatorEvents();

    return this._updateStore().then(
      () => {
        if (trigger) {
          this.trigger('authenticationSucceeded');
        }
      },
      () => {
        this.isAuthenticated = false;
        this.authenticator = null;
        this._withAuthenticated({});
      }
    );
  }

  _clear(trigger) {
    trigger = Boolean(trigger) && this.get('isAuthenticated');
    this.isAuthenticated = false;
    this.authenticator = null;
    this._withAuthenticated({});

    return this._updateStore().then(() => {
      if (trigger) {
        this.trigger('invalidationSucceeded');
      }
    });
  }

  _clearWithContent(content, trigger) {
    this._replaceContent(content);
    return this._clear(trigger);
  }

  // ObjectProxy shim for content key delegation.
  unknownProperty(key) {
    let content = get(this, 'content');
    return content ? get(content, key) : undefined;
  }

  setUnknownProperty(key, value) {
    assert('"authenticated" is a reserved key used by Ember Simple Auth!', key !== 'authenticated');
    let content = get(this, 'content');
    assert(
      `Cannot delegate set('${key}', ${value}) to the 'content' property of the internal session: its 'content' is undefined.`,
      content
    );
    this._replaceContent(Object.assign({}, content, { [key]: value }));
    this.notifyPropertyChange(key);
    if (!/^_/.test(key)) {
      this._updateStore();
    }
    return value;
  }

  _updateStore() {
    let data = this.content;
    if (!isEmpty(this.authenticator)) {
      data = Object.assign({}, data, {
        authenticated: Object.assign({ authenticator: this.authenticator }, data.authenticated || {}),
      });
      this._replaceContent(data);
    }
    return this.store.persist(data);
  }

  _bindToAuthenticatorEvents() {
    const authenticator = this._findAuthenticator(this.authenticator);
    authenticator.on('sessionDataUpdated', this._onSessionDataUpdated);
    authenticator.on('sessionDataInvalidated', this._onSessionDataInvalidated);
  }

  @action
  _onSessionDataUpdated({ detail: content }) {
    this._setup(this.authenticator, content);
  }

  @action
  _onSessionDataInvalidated() {
    this._clear(true);
  }

  _bindToStoreEvents() {
    this.store.on('sessionDataUpdated', ({ detail: content }) => {
      if (!this._busy) {
        this._busy = true;
        let { authenticator: authenticatorFactory } = content.authenticated || {};
        if (authenticatorFactory) {
          delete content.authenticated.authenticator;
          const authenticator = this._findAuthenticator(authenticatorFactory);
          authenticator.restore(content.authenticated).then(
            authenticatedContent => {
              this._replaceContent(content);
              this._busy = false;
              this._setup(authenticatorFactory, authenticatedContent, true);
            },
            err => {
              debug(
                `The authenticator "${authenticatorFactory}" rejected to restore the session - invalidating…`
              );
              if (err) {
                debug(err);
              }
              this._busy = false;
              this._clearWithContent(content, true);
            }
          );
        } else {
          this._busy = false;
          this._clearWithContent(content, true);
        }
      }
    });
  }

  _findAuthenticator(authenticatorRef) {
    if (this._authenticators) {
      const matches = this._authenticators.filter(authenticator =>
        authenticatorMatches(authenticator, authenticatorRef)
      );

      if (typeof authenticatorRef === 'function') {
        assert(
          `Multiple authenticators returned from 'SessionService.createAuthenticators' matched factory "${
            authenticatorRef.name || authenticatorRef
          }".`,
          matches.length <= 1
        );
      }

      if (matches[0]) {
        return matches[0];
      }
    }

    if (typeof authenticatorRef === 'string' && authenticatorRef.includes(':')) {
      const fromRegistry = getOwner(this).lookup(authenticatorRef);
      if (!isNone(fromRegistry)) {
        return fromRegistry;
      }
    }

    assert(
      'Ember Simple Auth: InternalSession requires createAuthenticators when useResolver is false.',
      Boolean(this._authenticators) || Configuration.useResolver
    );
    assert(
      `No authenticator for factory "${authenticatorRef}" could be found!`,
      false
    );
  }

  on(event, cb) {
    this.sessionEvents.addEventListener(event, cb);
  }

  off(event, cb) {
    this.sessionEvents.removeEventListener(event, cb);
  }

  trigger(event, value) {
    this.sessionEvents.dispatchEvent(event, value);
  }

  setRedirectTarget(url) {
    this.store.setRedirectTarget?.(url);
  }

  getRedirectTarget() {
    return this.store.getRedirectTarget?.();
  }

  clearRedirectTarget() {
    return this.store.clearRedirectTarget?.();
  }
}
