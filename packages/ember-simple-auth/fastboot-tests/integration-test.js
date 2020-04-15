'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('Integration tests', function() {
  setupTest('fastboot-ready-app');

  it('redirects to login page on a protected route', function() {
    return this.visit('/protected')
      .then(function({ response }) {

        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/'])
        expect(response.req.path).to.equal('/login');
      });
  });

  it('authenticates and create the session when accessing authenticate route', function() {
    return this.visit({ url: '/authenticate', jar: true })
      .then(function({ response }) {

        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%22authenticator%22%3A%22authenticator%3Aauth%22%2C%22account_id%22%3A%22123%22%7D%7D; path=/'])
        expect(response.req.path).to.equal('/');
      });
  });

  it('user can access protected page after authentication', function() {
    return this.visit({ url: '/protected', jar: true })
      .then(function({ response }) {
        expect(response.req.path).to.equal('/protected');
        expect(response.body).to.contain('This is a protected page only visible to authenticated users!');
      });
  });

  it('invalidate removes session cookies', function() {
    return this.visit({ url: '/invalidate', jar: true })
      .then(function({ response }) {
        expect(response.req.path).to.equal('/');
        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/'])
      });
  });

  it('implicit grant callback route works with FastBoot', function() {
    return this.visit({ url: '/callback', jar: true })
      .then(function({ response }) {
        expect(response.statusCode).to.equal(200);
      });
  });
});
