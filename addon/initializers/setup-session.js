import Session from '../session';
import Configuration from '../configuration';
import inject from '../utils/inject';

export default function setupSession(registry) {
  registry.register('session:main', Session);
  inject(registry, 'session:main', 'store', Configuration.base.store);
}
