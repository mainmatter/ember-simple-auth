import Session from '../session';
import Configuration from '../configuration';

export default function setupSession(registry) {
  registry.register('session:main', Session);
  registry.injection('session:main', 'store', Configuration.base.store);
}
