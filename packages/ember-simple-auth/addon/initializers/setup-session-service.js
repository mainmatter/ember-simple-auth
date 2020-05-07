import inject from '../utils/inject';

export default function setupSessionStore(registry) {
  inject(registry, 'service:session', 'session', 'session:main');
}
