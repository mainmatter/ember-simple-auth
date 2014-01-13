'use strict';

/**
  The base for all store types. This serves as a starting point for
  implementing custom stores and must not be used directly.

  Stores may trigger the 'ember-simple-auth:session-updated' event when
  any of the stored properties change (and the change wasn't triggered by the
  `persist` method). The session listens to that event and will handle the
  change accordingly. Whenever the event is triggered by the store, the session
  will forward all properties to its authenticator which might lead to the
  session being invalidated (see Ember.SimpleAuth.Authenticators.Base#restore).

  @class Base
  @namespace Ember.SimpleAuth.Stores
  @extends Ember.Object
  @uses Ember.Evented
*/
Ember.SimpleAuth.Stores.Base = Ember.Object.extend(Ember.Evented, {
  /**
    Persists the `properties` in the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
  },

  /**
    Restores all properties currently saved in the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation always returns an empty
    plain Object.

    @method restore
    @return {Object} All properties currently persisted in the store.
  */
  restore: function() {
    return {};
  },

  /**
    Clears the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

    @method clear
  */
  clear: function() {
  }
});
