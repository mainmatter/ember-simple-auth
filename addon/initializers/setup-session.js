import Session from '../session';

export default function setupSession(registry) {
  registry.register('simple-auth-session:main', Session);
  registry.injection('simple-auth-session:main', 'store', 'session-store:application');
}
