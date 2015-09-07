/* jshint expr:true */
import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import { invalidateSession, authenticateSession } from '../helpers/ember-simple-auth';

describe('Acceptance: Authentication', function() {
  let application;
  let server;

  beforeEach(function() {
    application = startApp();
    return visit('/');
  });

  afterEach(function() {
    Ember.tryInvoke(server, 'shutdown');
    Ember.run(application, 'destroy');
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
        this.get('/posts', () => [200, { 'Content-Type': 'application/json' }, '[]']);
      });
      authenticateSession(application);
      visit('/protected');

      return andThen(() => {
        expect(currentPath()).to.eq('protected');
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
