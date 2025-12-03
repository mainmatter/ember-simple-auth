import { get } from '@ember/object';
import { getContext, settled } from '@ember/test-helpers';
import Test from '../authenticators/test';

const SESSION_SERVICE_KEY = 'service:session';
const TEST_CONTAINER_KEY = 'authenticator:test';

function ensureAuthenticator(owner: any) {
  const authenticator = owner.lookup(TEST_CONTAINER_KEY);
  if (!authenticator) {
    owner.register(TEST_CONTAINER_KEY, Test);
  }
}

/**
 * Authenticates the session.
 *
 * @param {Object} sessionData Optional argument used to mock an authenticator
 * response (e.g. a token or user).
 * @return {Promise}
 * @public
 */
export async function authenticateSession(sessionData: Record<string, any>) {
  const { owner } = getContext() as { owner: any };
  const session = owner.lookup(SESSION_SERVICE_KEY);
  ensureAuthenticator(owner);

  await session.authenticate(TEST_CONTAINER_KEY, sessionData);
  await settled();
}

/**
 * Returns the current session.
 *
 * @return {Object} a session service.
 * @public
 */
export function currentSession() {
  const { owner } = getContext() as { owner: any };
  return owner.lookup(SESSION_SERVICE_KEY);
}

/**
 * Invalidates the session.
 *
 * @return {Promise}
 * @public
 */
export async function invalidateSession() {
  const { owner } = getContext() as { owner: any };
  const session = owner.lookup(SESSION_SERVICE_KEY);
  const isAuthenticated = get(session, 'isAuthenticated');

  if (isAuthenticated) {
    return session.invalidate();
  }

  await settled();
}
