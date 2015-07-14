/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Torii from 'ember-simple-auth/authenticators/torii';

describe('Torii', function() {
  beforeEach(function() {
    this.torii         = {
      fetch() {},
      open() {},
      close() {}
    };
    this.authenticator = Torii.create({ torii: this.torii });
  });

  describe('#restore', function() {
    function itDoesNotRestore(data) {
      it('returns a rejecting promise', function(done) {
        this.authenticator.restore(data).then(null, function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('unsets the provider', function(done) {
        this.authenticator.provider = 'provider';
        this.authenticator.restore(data).then(null, () => {
          expect(this.authenticator.provider).to.be.null;
          done();
        });
      });
    }

    describe('when there is a torii provider in the session data', function() {
      describe('when torii fetches successfully', function() {
        beforeEach(function() {
          sinon.stub(this.torii, 'fetch').returns(Ember.RSVP.resolve({ some: 'other data' }));
        });

        it('returns a promise that resolves with the session data', function(done) {
          this.authenticator.restore({ some: 'data', provider: 'provider' }).then(function(data) {
            expect(data).to.eql({ some: 'other data', provider: 'provider' });
            done();
          });
        });

        it('remembers the provider', function(done) {
          this.authenticator.restore({ some: 'data', provider: 'provider' }).then(() => {
            expect(this.authenticator.provider).to.eql('provider');
            done();
          });
        });
      });

      describe('when torii does not fetch successfully', function() {
        beforeEach(function() {
          sinon.stub(this.torii, 'fetch').returns(Ember.RSVP.reject());
        });

        itDoesNotRestore({ some: 'data', provider: 'provider' });
      });
    });

    describe('when there is no torii provider in the session data', function() {
      itDoesNotRestore();
    });
  });

  describe('#authenticate', function() {
    describe('when torii opens successfully', function() {
      beforeEach(function() {
        sinon.stub(this.torii, 'open').returns(Ember.RSVP.resolve({ some: 'data' }));
      });

      it('returns a promise that resolves with the session data', function(done) {
        this.authenticator.authenticate('provider').then(function(data) {
          expect(data).to.eql({ some: 'data', provider: 'provider' });
          done();
        });
      });

      it('remembers the provider', function(done) {
        this.authenticator.authenticate('provider').then(() => {
          expect(this.authenticator.provider).to.eql('provider');
          done();
        });
      });
    });

    describe('when torii does not open successfully', function() {
      beforeEach(function() {
        sinon.stub(this.torii, 'open').returns(Ember.RSVP.reject());
      });

      it('returns a rejecting promise', function(done) {
        this.authenticator.authenticate('provider').then(null, function() {
          expect(true).to.be.true;
          done();
        });
      });
    });
  });

  describe('#invalidate', function() {
    describe('when torii closes successfully', function() {
      beforeEach(function() {
        sinon.stub(this.torii, 'close').returns(Ember.RSVP.resolve());
      });

      it('returns a resolving promise', function(done) {
        this.authenticator.invalidate({ some: 'data' }).then(function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('unsets the provider', function(done) {
        this.authenticator.provider = 'provider';
        this.authenticator.invalidate({ some: 'data' }).then(() => {
          expect(this.authenticator.provider).to.be.null;
          done();
        });
      });
    });

    describe('when torii does not close successfully', function() {
      beforeEach(function() {
        sinon.stub(this.torii, 'open').returns(Ember.RSVP.reject());
      });

      it('returns a rejecting promise', function(done) {
        this.authenticator.invalidate('provider').then(null, function() {
          expect(true).to.be.true;
          done();
        });
      });

      it('keeps the provider', function(done) {
        this.authenticator.provider = 'provider';
        this.authenticator.invalidate({ some: 'data' }).then(null, () => {
          expect(this.authenticator.provider).to.eql('provider');
          done();
        });
      });
    });
  });

});
