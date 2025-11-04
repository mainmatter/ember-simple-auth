import { macroCondition, getOwnConfig } from '@embroider/macros';
import CookieStore from 'ember-simple-auth/session-stores/cookie';
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

let klass = class extends CookieStore {};
if (macroCondition(getOwnConfig().FASTBOOT_DISABLED)) {
  // Playwright testing
  klass = class extends AdaptiveStore {
    init(emberOwner) {
      let __isLocalStorageAvailable = determineStorageBackend();
      super.init(emberOwner, __isLocalStorageAvailable);
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

export default klass;
