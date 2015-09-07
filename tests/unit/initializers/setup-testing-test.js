/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Test from 'ember-simple-auth/authenticators/test';
import setupTesting from 'ember-simple-auth/initializers/setup-testing';

describe('setupTesting', () => {
  let registry;

  beforeEach(() => {
    registry = {
      register() {}
    };
  });

  it('registers the test authenticator', () => {
    sinon.spy(registry, 'register');
    setupTesting(registry);

    expect(registry.register).to.have.been.calledWith('authenticator:test', Test);
  });
});
