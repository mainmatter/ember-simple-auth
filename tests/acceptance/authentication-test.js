/* jshint expr:true */
import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import { invalidateSession, authenticateSession, currentSession } from '../helpers/ember-simple-auth';
import destroyApp from '../helpers/destroy-app';
import config from '../../config/environment';

const { tryInvoke } = Ember;

describe('Acceptance: Authentication', function() {
  let application;
  let server;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    tryInvoke(server, 'shutdown');
    destroyApp(application);
  });

  describe('the protected route', () => {
    it('cannot be visited when the session is not authenticated', () => {
      invalidateSession(application);
      visit('/protected');

      return andThen(() => {
        expect(currentPath()).to.eq('login');
      });
    });

    it('can be visited when the session is authenticated', () => {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });
      authenticateSession(application, { userId: 1, otherData: 'some-data' });

      visit('/protected');

      return andThen(() => {
        expect(currentPath()).to.eq('protected');
        let session = currentSession(application);
        expect(session.get('data.authenticated.userId')).to.eql(1);
        expect(session.get('data.authenticated.otherData')).to.eql('some-data');
      });
    });
  });

  describe('the login route', () => {
    it('can be visited when the session is not authenticated', () => {
      invalidateSession(application);
      visit('/login');

      return andThen(() => {
        expect(currentPath()).to.eq('login');
      });
    });

    it('cannot be visited when the session is authenticated', () => {
      authenticateSession(application);
      visit('/login');

      return andThen(() => {
        expect(currentPath()).to.eq('index');
      });
    });
  });
});
