import { deprecate } from '@ember/application/deprecations';
import Test from 'ember-simple-auth/authenticators/test';

const TEST_CONTAINER_KEY = 'authenticator:test';

function ensureAuthenticator(app, container) {
  const authenticator = container.lookup(TEST_CONTAINER_KEY);
  if (!authenticator) {
    app.register(TEST_CONTAINER_KEY, Test);
  }
}

function deprecateOldTestingApi() {
  deprecate('Ember Simple Auth: The legacy testing API is deprecated; switch to the new testing helpers available from "ember-simple-auth/test-support".', false, {
    id: `ember-simple-auth.testing.legacy-testing-api`,
    until: '3.0.0'
  });
}

export function authenticateSession(app, sessionData) {
  deprecateOldTestingApi();
  const { __container__: container } = app;
  const session = container.lookup('service:session');
  ensureAuthenticator(app, container);
  session.authenticate(TEST_CONTAINER_KEY, sessionData);
  return app.testHelpers.wait();
}

export function currentSession(app) {
  deprecateOldTestingApi();
  return app.__container__.lookup('service:session');
}

export function invalidateSession(app) {
  deprecateOldTestingApi();
  const session = app.__container__.lookup('service:session');
  if (session.get('isAuthenticated')) {
    session.invalidate();
  }
  return app.testHelpers.wait();
}
