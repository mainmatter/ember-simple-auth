var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  The base for all store types. __This serves as a starting point for
  implementing custom stores and must not be used directly.__

  Stores may trigger the `'ember-simple-auth:session-updated'` event when
  any of the stored values changes due to external actions (e.g. from another
  tab). The session listens to that event and will handle the changes
  accordingly. Whenever the event is triggered by the store, the session will
  forward all values as one object to its authenticator which might lead to
  the session being invalidated (see
  [EmberSimpleAuth.Authenticators.Base#restore](#EmberSimpleAuth-Authenticators-Base-restore)).

  @class Base
  @namespace EmberSimpleAuth.Stores
  @extends Ember.Object
  @uses Ember.Evented
*/
var Base = Ember.Object.extend(Ember.Evented, {
  /**
    Persists the `data` in the store.

    `EmberSimpleAuth.Stores.Base`'s implementation does nothing.

    @method persist
    @param {Object} data The data to persist
  */
  persist: function(data) {
  },

  /**
    Restores all data currently saved in the store as one object.

    `EmberSimpleAuth.Stores.Base`'s implementation always returns an empty
    plain Object.

    @method restore
    @return {Object} The data currently persisted in the store.
  */
  restore: function() {
    return {};
  },

  /**
    Clears the store.

    `EmberSimpleAuth.Stores.Base`'s implementation does nothing.

    @method clear
  */
  clear: function() {
  }
});

export { Base };
