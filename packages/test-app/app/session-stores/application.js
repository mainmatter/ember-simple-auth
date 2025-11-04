import { isTesting, macroCondition, importSync } from '@embroider/macros';
import CookieStore from 'ember-simple-auth/session-stores/cookie';
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

let klass = class extends AdaptiveStore {
  init(emberOwner: any): void {
    let __isLocalStorageAvailable = determineStorageBackend();
    super.init(emberOwner, __isLocalStorageAvailable);
  }
};
if (macroCondition(globalThis.FastBoot)) {
  // Playwright testing
  klass = class extends CookieStore { };
}

console.log(klass);
export default klass;

function determineStorageBackend(): boolean | null {
  const storageBackend = globalThis.ESA_STORAGE_BACKEND;

  if (storageBackend === 'localStorage') {
    return true;
  } else if (storageBackend === 'cookieStorage') {
    return false;
  }

  // Adaptive
  return null;
}
