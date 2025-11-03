import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default class ApplicationStore extends AdaptiveStore {
  init(emberOwner: any): void {
    let __isLocalStorageAvailable = determineStorageBackend();
    super.init(emberOwner, __isLocalStorageAvailable);
  }
}

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
