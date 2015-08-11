import Session from '../session';
import Configuration from '../configuration';
import TestAuthenticator from '../authenticators/test';

export default function setupSession(registry) {
  registry.register('simple-auth-session:main', Session);
  registry.register('simple-auth-authenticator:test', TestAuthenticator);
  registry.injection('simple-auth-session:main', 'store', Configuration.base.store);
}
