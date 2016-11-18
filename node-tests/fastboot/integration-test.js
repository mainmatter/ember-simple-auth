/* global describe, before, after, it */
/* jshint node:true */
var chai = require('chai');
var expect = chai.expect;
var RSVP = require('rsvp');
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
var request = require('request');
var request = RSVP.denodeify(request);

describe('Integration tests', function() {
  this.timeout(600000);

  var app;
  var url = 'http://localhost:49741';

  before(function() {
    app = new AddonTestApp();
    return app.create('fastboot-ready-app', { fixturesPath: 'node-tests/fixtures/' })
      .then(addDependencies)
      .then(function() {
        return app.startServer({
          command: 'fastboot',
          additionalArguments: ['--host 0.0.0.0']
        });
      });
  });

  after(function() {
    return app.stopServer();
  });

  it('redirects to login page on a protected route', function() {
    return request({ url: url + '/protected' })
      .then(function(response) {

        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/'])
        expect(response.req.path).to.equal('/login');
      });
  });

  it('authenticates and create the session when accessing authenticate route', function() {
    return request({ url: url + '/authenticate', jar: true })
      .then(function(response) {

        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%22authenticator%22%3A%22authenticator%3Aauth%22%2C%22account_id%22%3A%22123%22%7D%7D; path=/'])
        expect(response.req.path).to.equal('/');
      });
  });

  it('user can access protected page after authentication', function() {
    return request({ url: url + '/protected', jar: true })
      .then(function(response) {
        expect(response.req.path).to.equal('/protected');
        expect(response.body).to.contain('This is a protected page only visible to authenticated users!');
      });
  });

  it('invalidate removes session cookies', function() {
    return request({ url: url + '/invalidate', jar: true })
      .then(function(response) {
        expect(response.req.path).to.equal('/');
        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/'])
      });
  });
});

function addDependencies(app) {
  app.editPackageJSON(function(pkg) {
    pkg['devDependencies']['ember-cli-fastboot'] = "^1.0.0-beta.8";
  });
  return app.run('npm', 'install');
}
