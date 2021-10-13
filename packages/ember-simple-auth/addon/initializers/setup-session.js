import ENV from 'ember-get-config';
import InternalSession from '../internal-session';
import Ephemeral from '../session-stores/ephemeral';

export default function setupSession(registry) {
  registry.register('session:main', InternalSession);

  if (ENV.environment === 'test') {
    registry.register('session-store:test', Ephemeral);
  }
}
