import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const { RSVP, on } = Ember;

export default Ember.ObjectProxy.extend(Ember.Evented, {
  authenticator:       null,
  store:               null,
  isAuthenticated:     false,
  attemptedTransition: null,
  content:             { authenticated: {} },

  authenticate() {
    let args          = Array.prototype.slice.call(arguments);
    let authenticator = args.shift();
    Ember.assert(`Session#authenticate requires the authenticator to be specified, was "${authenticator}"!`, !Ember.isEmpty(authenticator));
    let theAuthenticator = getOwner(this).lookup(authenticator);
    Ember.assert(`No authenticator for factory "${authenticator}" could be found!`, !Ember.isNone(theAuthenticator));
    return new RSVP.Promise((resolve, reject) => {
      theAuthenticator.authenticate.apply(theAuthenticator, args).then((content) => {
        this._setup(authenticator, content, true).then(resolve, reject);
      }, (error) => {
        this._clear().then(() => {
          reject(error);
        }, () => {
          reject(error);
        });
      });
    });
  },

  invalidate() {
    Ember.assert('Session#invalidate requires the session to be authenticated!', this.get('isAuthenticated'));
    return new RSVP.Promise((resolve, reject) => {
      let authenticator = getOwner(this).lookup(this.authenticator);
      authenticator.invalidate(this.content.authenticated).then(() => {
        authenticator.off('sessionDataUpdated');
        this._clear(true).then(resolve, reject);
      }, (error) => {
        this.trigger('sessionInvalidationFailed', error);
        reject(error);
      });
    });
  },

  restore() {
    return new RSVP.Promise((resolve, reject) => {
      this._callStoreAsync('restore').then((restoredContent) => {
        let { authenticator } = (restoredContent.authenticated || {});
        if (!!authenticator) {
          delete restoredContent.authenticated.authenticator;
          getOwner(this).lookup(authenticator).restore(restoredContent.authenticated).then((content) => {
            this.set('content', restoredContent);
            this._setup(authenticator, content).then(resolve, reject);
          }, (err) => {
            Ember.Logger.debug(`The authenticator "${authenticator}" rejected to restore the session - invalidating…`);
            if (err) {
              Ember.Logger.debug(err);
            }
            this.set('content', restoredContent);
            this._clear().then(reject, reject);
          });
        } else {
          delete (restoredContent || {}).authenticated;
          this.set('content', restoredContent);
          this._clear().then(reject, reject);
        }
      }, () => {
        this._clear().then(reject, reject);
      });
    });
  },

  _callStoreAsync(method, ...params) {
    let result = this.store[method](...params);
    if (typeof result === 'undefined' || typeof result.then === 'undefined') {
      Ember.deprecate(`Ember Simple Auth: Synchronous stores have been deprecated. Make sure your custom store's ${method} method returns a promise.`, false, {
        id: `ember-simple-auth.session-store.synchronous-${method}`,
        until: '2.0.0'
      });
      return RSVP.Promise.resolve(result);
    } else {
      return result;
    }
  },

  _setup(authenticator, authenticatedContent, trigger) {
    return new RSVP.Promise((resolve, reject) => {
      trigger = !!trigger && !this.get('isAuthenticated');
      this.beginPropertyChanges();
      this.setProperties({
        isAuthenticated: true,
        authenticator
      });
      Ember.set(this.content, 'authenticated', authenticatedContent);
      this._bindToAuthenticatorEvents();
      this._updateStore().then(() => {
        this.endPropertyChanges();
        if (trigger) {
          this.trigger('authenticationSucceeded');
        }
        resolve();
      }, () => {
        this.setProperties({
          isAuthenticated: false,
          authenticator: null
        });
        Ember.set(this.content, 'authenticated', {});
        this.endPropertyChanges();
        reject();
      });
    });
  },

  _clear(trigger) {
    return new RSVP.Promise((resolve, reject) => {
      trigger = !!trigger && this.get('isAuthenticated');
      this.beginPropertyChanges();
      this.setProperties({
        isAuthenticated: false,
        authenticator:   null
      });
      Ember.set(this.content, 'authenticated', {});
      this._updateStore().then(() => {
        this.endPropertyChanges();
        if (trigger) {
          this.trigger('invalidationSucceeded');
        }
        resolve();
      }, () => {
        this.endPropertyChanges();
        reject();
      });
    });
  },

  setUnknownProperty(key, value) {
    Ember.assert('"authenticated" is a reserved key used by Ember Simple Auth!', key !== 'authenticated');
    let result = this._super(key, value);
    this._updateStore();
    return result;
  },

  _updateStore() {
    let data = this.content;
    if (!Ember.isEmpty(this.authenticator)) {
      Ember.set(data, 'authenticated', Ember.merge({ authenticator: this.authenticator }, data.authenticated || {}));
    }
    return this._callStoreAsync('persist', data);
  },

  _bindToAuthenticatorEvents() {
    let authenticator = getOwner(this).lookup(this.authenticator);
    authenticator.off('sessionDataUpdated');
    authenticator.off('sessionDataInvalidated');
    authenticator.on('sessionDataUpdated', (content) => {
      this._setup(this.authenticator, content);
    });
    authenticator.on('sessionDataInvalidated', () => {
      this._clear(true);
    });
  },

  _bindToStoreEvents: on('init', function() {
    this.store.on('sessionDataUpdated', (content) => {
      let { authenticator } = (content.authenticated || {});
      if (!!authenticator) {
        delete content.authenticated.authenticator;
        getOwner(this).lookup(authenticator).restore(content.authenticated).then((authenticatedContent) => {
          this.set('content', content);
          this._setup(authenticator, authenticatedContent, true);
        }, (err) => {
          Ember.Logger.debug(`The authenticator "${authenticator}" rejected to restore the session - invalidating…`);
          if (err) {
            Ember.Logger.debug(err);
          }
          this.set('content', content);
          this._clear(true);
        });
      } else {
        this.set('content', content);
        this._clear(true);
      }
    });
  })
});
