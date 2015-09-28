import InternalSession from '../internal-session';
import Configuration from '../configuration';
import inject from '../utils/inject';

export default function setupSession(registry) {
  registry.register('session:main', InternalSession);
  inject(registry, 'session:main', 'store', Configuration.store);
}
