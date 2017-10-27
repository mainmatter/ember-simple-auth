import Adaptive from 'ember-simple-auth/session-stores/adaptive';
import createCookieStore from './create-cookie-store';

export default function createAdaptiveStore(cookiesService, options = {}) {
  options._cookies = cookiesService;
  options._fastboot = { isFastBoot: false };
  options._isLocalStorageAvailable = false;
  options._isFastboot = false;

  let cookieStore = createCookieStore(cookiesService, options);

  return Adaptive.extend({
    _createStore() {
      cookieStore.on('sessionDataUpdated', (data) => {
        this.trigger('sessionDataUpdated', data);
      });

      return cookieStore;
    }
  }).create(options);
}
