/* global describe, before, after, it */
/* jshint node:true */
var chai = require('chai');
var expect = chai.expect;
var RSVP = require('rsvp');
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
var request = require('request');
var request = RSVP.denodeify(request);

describe('Graceful regression tests', function() {
  this.timeout(600000);

  var app;
  var url = 'http://localhost:49741';

  before(function() {
    app = new AddonTestApp();
    return app.create('not-fastboot-ready-app', { fixturesPath: 'node-tests/fixtures/' })
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

  it('does not error when using the adaptive store', function() {
    return request({ url: url + '/protected' })
      .then(function(response) {

        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/'])
        expect(response.req.path).to.equal('/login');
      });
  });
});

function addDependencies(app) {
  app.editPackageJSON(function(pkg) {
    pkg['devDependencies']['ember-cli-fastboot'] = "^1.0.0-beta.8";
  });
  return app.run('npm', 'install');
}
