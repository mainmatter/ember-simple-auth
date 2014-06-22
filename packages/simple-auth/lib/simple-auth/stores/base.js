var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import flatObjectsAreEqual from '../utils/flat_objects_are_equal';

/**
  The base for all store types. __This serves as a starting point for
  implementing custom stores and must not be used directly.__

  Stores are used to persist the session's state so it survives a page reload
  and is synchronized across multiple tabs or windows of the same application.
  The store to be used with the application can be configured during
  SimpleAuth's setup
  (see [SimpleAuth.setup](#Ember-SimpleAuth-setup)).

  @class Base
  @namespace SimpleAuth.Stores
  @module simple-auth/stores/base
  @extends Ember.Object
  @uses Ember.Evented
*/
export default Ember.Object.extend(Ember.Evented, {
  /**
    __Triggered when the data that constitutes the session changes in the
    store. This usually happens because the session is authenticated or
    invalidated in another tab or window.__ The session automatically catches
    that event, passes the updated data to its authenticator's
    [SimpleAuth.Authenticators.Base#restore](#Ember-SimpleAuth-Authenticators-Base-restore)
    method and handles the result of that invocation accordingly.

    @event sessionDataUpdated
    @param {Object} data The updated session data
  */

  /**
    Persists the `data` in the store.

    `SimpleAuth.Stores.Base`'s implementation does nothing.

    @method persist
    @param {Object} data The data to persist
  */
  persist: function(data) {
  },

  /**
    Restores all data currently saved in the store as a plain object.

    `SimpleAuth.Stores.Base`'s implementation always returns an empty
    plain Object.

    @method restore
    @return {Object} The data currently persisted in the store.
  */
  restore: function() {
    return {};
  },

  /**
    Replaces all data currently saved in the store with the specified `data`.

    `SimpleAuth.Stores.Base`'s implementation clears the store, then
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

    `SimpleAuth.Stores.Base`'s implementation does nothing.

    @method clear
  */
  clear: function() {
  }
});
