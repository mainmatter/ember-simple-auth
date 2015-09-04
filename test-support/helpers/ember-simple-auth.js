export function authenticateSession(app, sessionData) {
  const session = app.__container__.lookup('service:session');
  session.authenticate('authenticator:test', sessionData);
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
