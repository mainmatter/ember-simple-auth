import Session from '../session';
import Configuration from '../configuration';

export default function setupSession(registry) {
  registry.register('session:main', Session);
  const inject = registry.inject || registry.injection;
  inject.call(registry, 'session:main', 'store', Configuration.base.store);
}
