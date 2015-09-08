import inject from '../utils/inject';

export default function setupAuthorizers(registry) {
  inject(registry, 'authorizer', 'session', 'session:main');
}
