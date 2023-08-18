import InternalSession from '../internal-session';
import Ephemeral from '../session-stores/ephemeral';
import { isTesting } from '@embroider/macros';

export default function setupSession(registry) {
  registry.register('session:main', InternalSession);

  if (isTesting()) {
    registry.register('session-store:test', Ephemeral);
  }
}
