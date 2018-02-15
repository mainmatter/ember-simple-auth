import { tryInvoke } from '@ember/utils';
import {
  currentURL,
  setApplication,
  setupContext,
  setupApplicationContext,
  teardownApplicationContext,
  teardownContext,
  visit
} from '@ember/test-helpers';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import Pretender from 'pretender';
import {
  invalidateSession,
  authenticateSession,
  currentSession
} from 'ember-simple-auth/test-support';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

import config from '../../config/environment';

describe('Acceptance: New style helpers', function() {
  let context;
  let server;

  beforeEach(function() {
    context = {};
    return setupContext(context).then(() => setupApplicationContext(context));
  });

  afterEach(function() {
    tryInvoke(server, 'shutdown');
    return teardownApplicationContext(context).then(() => teardownContext(context));
  });

  describe('the protected route', function() {
    if (!hasEmberVersion(2, 4)) {
      // guard against running test module on unsupported version (before 2.4)
      return;
    }

    it('cannot be visited when the session is not authenticated', function() {
      return invalidateSession()
        .then(() => visit('/protected'))
        .then(() => {
          expect(currentURL()).to.eq('/login');
        });
    });

    it('can be visited when the session is authenticated', function() {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });
      return authenticateSession({ userId: 1, otherData: 'some-data' })
        .then(() => visit('/protected'))
        .then(() => {
          let session = currentSession();
          expect(currentURL()).to.eq('/protected');
          expect(session.get('data.authenticated.userId')).to.eql(1);
          expect(session.get('data.authenticated.otherData')).to.eql('some-data');
        });
    });
  });

  describe('the login route', function() {
    if (!hasEmberVersion(2, 4)) {
      // guard against running test module on unsupported version (before 2.4)
      return;
    }

    it('can be visited when the session is not authenticated', function() {
      return invalidateSession()
        .then(() => visit('/login'))
        .then(() => {
          expect(currentURL()).to.eq('/login');
        });
    });

    it('cannot be visited when the session is authenticated', function() {
      return authenticateSession()
        .then(() => visit('/login'))
        .then(() => {
          expect(currentURL()).to.eq('/');
        });
    });
  });
});

describe('New style helpers outside of ApplicationContext', function() {
  let context;

  before(function() {
    // guarantee that application test state isn't leaking into these tests
    setApplication(undefined);
  });

  beforeEach(function() {
    context = {};
    return setupContext(context).then(() => {
      // Must run the session initializers
      setupSession(context.owner);
      setupSessionService(context.owner);
    });
  });

  afterEach(function() {
    return teardownContext(context);
  });

  if (!hasEmberVersion(2, 4)) {
    // guard against running test module on unsupported version (before 2.4)
    return;
  }

  it('invalidateSession helper works', function() {
    return invalidateSession()
      .then(() => {
        let { owner } = context;
        let session = owner.lookup('service:session');
        expect(session.get('isAuthenticated')).to.be.false;
      });
  });

  it('authenticateSession helper works', function() {
    return authenticateSession({ userId: 1, otherData: 'some-data' })
      .then(() => {
        let { owner } = context;
        let session = owner.lookup('service:session');
        expect(session.get('isAuthenticated')).to.be.true;
      });
  });

  it('currentSession helper works', function() {
    return authenticateSession({ userId: 1, otherData: 'some-data' })
      .then(() => {
        let session = currentSession();
        let { owner } = context;
        let lookedUpSession = owner.lookup('service:session');
        expect(session).to.eq(lookedUpSession);
      });
  });
});
