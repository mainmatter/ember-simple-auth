import Adaptive from 'ember-simple-auth/session-stores/adaptive';
import createCookieStore from './create-cookie-store';
import { merge, assign as emberAssign } from '@ember/polyfills';

const assign = emberAssign || merge;

export default function createAdaptiveStore(
  cookiesService,
  options = {},
  props = {}
) {
  let cookieStore = createCookieStore(
    cookiesService,
    assign({}, options, { _isFastboot: false })
  );
  props._createStore = function() {
    cookieStore.on('sessionDataUpdated', data => {
      this.trigger('sessionDataUpdated', data);
    });

    return cookieStore;
  };

  return Adaptive.extend(props).create(options);
}
