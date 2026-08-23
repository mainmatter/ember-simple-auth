import InternalSession from '../internal-session';
import Ephemeral from '../session-stores/ephemeral';
import { isTesting } from '@embroider/macros';
import Configuration from '../configuration';

export default function setupSession(registry) {
  if (Configuration.useInternalSessionLookup) {
    registry.register('session:main', InternalSession);
  }

  if (isTesting()) {
    registry.register('session-store:test', Ephemeral);
  }
}
