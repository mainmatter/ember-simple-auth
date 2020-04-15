'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('Graceful regression tests', function() {
  setupTest('not-fastboot-ready-app');

  it('does not error when using the adaptive store', function() {
    return this.visit('/protected')
      .then(function({ response }) {

        expect(response.headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/'])
        expect(response.req.path).to.equal('/login');
      });
  });
});
