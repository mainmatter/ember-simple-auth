import Session from '../session';
import Configuration from '../configuration';

export default function setupSession(registry) {
  registry.register('simple-auth-session:main', Session);
  registry.injection('simple-auth-session:main', 'store', Configuration.base.store);
}
