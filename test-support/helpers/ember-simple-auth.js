import Test from 'ember-simple-auth/authenticators/test';

const TEST_CONTAINER_KEY = 'authenticator:test';

function ensureAuthenticator(app, container) {
  const authenticator = container.lookup(TEST_CONTAINER_KEY);
  if (!authenticator) {
    app.register(TEST_CONTAINER_KEY, Test);
  }
}

export function authenticateSession(app, sessionData) {
  const { __container__: container } = app;
  const session = container.lookup('service:session');
  ensureAuthenticator(app, container);
  session.authenticate(TEST_CONTAINER_KEY, sessionData);
  return wait();
};

export function currentSession(app) {
  return app.__container__.lookup('service:session');
};

export function invalidateSession(app) {
  const session = app.__container__.lookup('service:session');
  if (session.get('isAuthenticated')) {
    session.invalidate();
  }
  return wait();
};
