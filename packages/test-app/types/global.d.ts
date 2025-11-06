import '@glint/environment-ember-loose';

declare global {
  var ESA_STORAGE_BACKEND: 'localStorage' | 'cookieStorage';
  interface Window {
    ESA_STORAGE_BACKEND: 'localStorage' | 'cookieStorage';
  }
}

export {};
