import Ember from 'ember';

const { on } = Ember;

export default Ember.ObjectProxy.extend(Ember.Evented, {
  authenticator:       null,
  store:               null,
  container:           null,
  isAuthenticated:     false,
  attemptedTransition: null,
  content:             { authenticated: {} },

  authenticate() {
    let args          = Array.prototype.slice.call(arguments);
    let authenticator = args.shift();
    Ember.assert(`Session#authenticate requires the authenticator to be specified, was "${authenticator}"!`, !Ember.isEmpty(authenticator));
    let theAuthenticator = this.container.lookup(authenticator);
    Ember.assert(`No authenticator for factory "${authenticator}" could be found!`, !Ember.isNone(theAuthenticator));
    return new Ember.RSVP.Promise((resolve, reject) => {
      theAuthenticator.authenticate.apply(theAuthenticator, args).then((content) => {
        this._setup(authenticator, content, true);
        resolve();
      }, (error) => {
        this._clear();
        reject(error);
      });
    });
  },

  invalidate() {
    Ember.assert('Session#invalidate requires the session to be authenticated!', this.get('isAuthenticated'));
    return new Ember.RSVP.Promise((resolve, reject) => {
      let authenticator = this.container.lookup(this.authenticator);
      authenticator.invalidate(this.content.authenticated).then(() => {
        authenticator.off('sessionDataUpdated');
        this._clear(true);
        resolve();
      }, (error) => {
        this.trigger('sessionInvalidationFailed', error);
        reject(error);
      });
    });
  },

  restore() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let restoredContent   = this.store.restore();
      let { authenticator } = (restoredContent.authenticated || {});
      if (!!authenticator) {
        delete restoredContent.authenticated.authenticator;
        this.container.lookup(authenticator).restore(restoredContent.authenticated).then((content) => {
          this.set('content', restoredContent);
          this._setup(authenticator, content);
          resolve();
        }, () => {
          Ember.Logger.debug(`The authenticator "${authenticator}" rejected to restore the session - invalidating…`);
          this.set('content', restoredContent);
          this._clear();
          reject();
        });
      } else {
        delete (restoredContent || {}).authenticated;
        this.set('content', restoredContent);
        this._clear();
        reject();
      }
    });
  },

  _setup(authenticator, authenticatedContend, trigger) {
    trigger = !!trigger && !this.get('isAuthenticated');
    this.beginPropertyChanges();
    this.setProperties({
      isAuthenticated: true,
      authenticator
    });
    Ember.set(this.content, 'authenticated', authenticatedContend);
    this._bindToAuthenticatorEvents();
    this._updateStore();
    this.endPropertyChanges();
    if (trigger) {
      this.trigger('authenticationSucceeded');
    }
  },

  _clear(trigger) {
    trigger = !!trigger && this.get('isAuthenticated');
    this.beginPropertyChanges();
    this.setProperties({
      isAuthenticated: false,
      authenticator:   null
    });
    Ember.set(this.content, 'authenticated', {});
    this._updateStore();
    this.endPropertyChanges();
    if (trigger) {
      this.trigger('invalidationSucceeded');
    }
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
    this.store.persist(data);
  },

  _bindToAuthenticatorEvents() {
    let authenticator = this.container.lookup(this.authenticator);
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
        this.container.lookup(authenticator).restore(content.authenticated).then((authenticatedContent) => {
          this.set('content', content);
          this._setup(authenticator, authenticatedContent, true);
        }, () => {
          Ember.Logger.debug(`The authenticator "${authenticator}" rejected to restore the session - invalidating…`);
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
