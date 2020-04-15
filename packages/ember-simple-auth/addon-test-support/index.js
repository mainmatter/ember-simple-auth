import { get } from '@ember/object';
import { getContext, settled } from '@ember/test-helpers';
import Promise from 'rsvp';
import Test from 'ember-simple-auth/authenticators/test';

const SESSION_SERVICE_KEY = 'service:session';
const TEST_CONTAINER_KEY = 'authenticator:test';

function ensureAuthenticator(owner) {
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
export function authenticateSession(sessionData) {
  const { owner } = getContext();
  const session = owner.lookup(SESSION_SERVICE_KEY);
  ensureAuthenticator(owner);
  return session.authenticate(TEST_CONTAINER_KEY, sessionData).then(() => {
    return settled();
  });
}

/**
 * Returns the current session.
 *
 * @return {Object} a session service.
 * @public
 */
export function currentSession() {
  const { owner } = getContext();
  return owner.lookup(SESSION_SERVICE_KEY);
}

/**
 * Invalidates the session.
 *
 * @return {Promise}
 * @public
 */
export function invalidateSession() {
  const { owner } = getContext();
  const session = owner.lookup(SESSION_SERVICE_KEY);
  const isAuthenticated = get(session, 'isAuthenticated');
  return Promise.resolve().then(() => {
    if (isAuthenticated) {
      return session.invalidate();
    }
  })
    .then(() => settled());
}
