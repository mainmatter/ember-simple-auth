import Adaptive from 'ember-simple-auth/session-stores/adaptive';
import assign from 'ember-simple-auth/utils/assign';

export default function createAdaptiveStore(
  cookiesService,
  options = {},
  owner
) {
  owner.register('session-store:adaptive', Adaptive.extend(assign({
    _isLocalStorageAvailable: false,
  }, options)));

  return owner.lookup('session-store:adaptive');
}
