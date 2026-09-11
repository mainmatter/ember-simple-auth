import { macroCondition, getOwnConfig } from '@embroider/macros';
import CookieStore from 'ember-simple-auth/session-stores/cookie';
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

let klass = CookieStore;
if (macroCondition(getOwnConfig().FASTBOOT_DISABLED)) {
  // Playwright testing
  klass = class extends AdaptiveStore {
    constructor(owner) {
      super(owner);
      this.__isLocalStorageAvailable = determineStorageBackend();
    }
  };
  function determineStorageBackend() {
    const storageBackend = globalThis.ESA_STORAGE_BACKEND;

    if (storageBackend === 'localStorage') {
      return true;
    } else if (storageBackend === 'cookieStorage') {
      return false;
    }

    // Adaptive
    return null;
  }
}

export default class ApplicationSessionStore extends klass {
  // Expose the legacy lifecycle to the Playwright compatibility test.
  initCalls = 0;

  init(...args) {
    super.init(...args);
    this.initCalls++;
  }
}
