import Ember from 'ember';
import InternalSession from '../internal-session';
import Ephemeral from '../session-stores/ephemeral';
import inject from '../utils/inject';

export default function setupSession(registry) {
  registry.register('session:main', InternalSession);

  let store = 'session-store:application';
  /* jscs:disable disallowDirectPropertyAccess */
  if (Ember.testing) {
    /* jscs:enable disallowDirectPropertyAccess */
    store = 'session-store:test';
    registry.register(store, Ephemeral);
  }

  inject(registry, store, 'cookies', 'service:cookies');
  inject(registry, 'session:main', 'store', store);
}
