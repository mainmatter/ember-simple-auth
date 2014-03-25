var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { flatObjectsAreEqual } from '../utils/flat_objects_are_equal';

/**
  The base for all store types. __This serves as a starting point for
  implementing custom stores and must not be used directly.__

  Stores may trigger the `'updated'` event when
  any of the stored values change due to external actions (e.g. from another
  tab). The session listens to that event and will handle the changes
  accordingly. Whenever the event is triggered by the store, the session will
  forward all values as one object to its authenticator which might then
  invalidate the session (see
  [Ember.SimpleAuth.Authenticators.Base#restore](#Ember-SimpleAuth-Authenticators-Base-restore)).

  @class Base
  @namespace Stores
  @extends Ember.Object
  @uses Ember.Evented
*/
var Base = Ember.Object.extend(Ember.Evented, {
  /**
    Persists the `data` in the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

    @method persist
    @param {Object} data The data to persist
  */
  persist: function(data) {
  },

  /**
    Restores all data currently saved in the store as one plain object.

    `Ember.SimpleAuth.Stores.Base`'s implementation always returns an empty
    plain Object.

    @method restore
    @return {Object} The data currently persisted in the store.
  */
  restore: function() {
    return {};
  },

  /**
    Replaces all data currently saved in the store with the specified `data`.

    `Ember.SimpleAuth.Stores.Base`'s implementation clears the store, then
    persists the specified `data`. If the store's current content is equal to
    the specified `data`, nothing is done.

    @method replace
    @param {Object} data The data to replace the store's content with
  */
  replace: function(data) {
    if (!flatObjectsAreEqual(data, this.restore())) {
      this.clear();
      this.persist(data);
    }
  },

  /**
    Clears the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

    @method clear
  */
  clear: function() {
  }
});

export { Base };
