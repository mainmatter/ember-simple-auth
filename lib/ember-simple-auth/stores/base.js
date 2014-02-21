var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  The base for all store types. __This serves as a starting point for
  implementing custom stores and must not be used directly.__

  Stores may trigger the `'ember-simple-auth:session-updated'` event when
  any of the stored properties changes due to external actions (e.g. from
  another tab). The session listens to that event and will handle the changes
  accordingly. Whenever the event is triggered by the store, the session will
  forward all properties to its authenticator which might lead to the session
  being invalidated (see
  [EmberSimpleAuth.Authenticators.Base#restore](#Ember-SimpleAuth-Authenticators-Base-restore)).

  @class Base
  @extends Ember.Object
  @uses Ember.Evented
*/
var Base = Ember.Object.extend(Ember.Evented, {
  /**
    Persists the `properties` in the store.

    `EmberSimpleAuth.Stores.Base`'s implementation does nothing.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
  },

  /**
    Restores all properties currently saved in the store.

    `EmberSimpleAuth.Stores.Base`'s implementation always returns an empty
    plain Object.

    @method restore
    @return {Object} All properties currently persisted in the store.
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
