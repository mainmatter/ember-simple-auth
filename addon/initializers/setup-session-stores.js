import LocalStorageStore from '../stores/local-storage';
import CookieStore from '../stores/cookie';
import EphemeralStore from '../stores/ephemeral';

export default function setupSessionStores(registry) {
  registry.register('session-store:local-storage', LocalStorageStore);
  registry.register('session-store:cookie', CookieStore);
  registry.register('session-store:ephemeral', EphemeralStore);
}
