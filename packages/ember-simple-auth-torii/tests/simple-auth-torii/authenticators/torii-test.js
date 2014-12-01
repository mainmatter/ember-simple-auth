import Torii from 'simple-auth-torii/authenticators/torii';

describe('Torii', function() {
  beforeEach(function() {
    this.torii         = { fetch: function() {}, open: function() {}, close: function() {} };
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
        var _this = this;
        this.authenticator.provider = 'provider';
        this.authenticator.restore(data).then(null, function(data) {
          expect(_this.authenticator.provider).to.be.null;
          done();
        });
      });
    }

    context('when there is a torii provider in the session data', function() {
      context('when torii fetches successfully', function() {
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
          var _this = this;
          this.authenticator.restore({ some: 'data', provider: 'provider' }).then(function(data) {
            expect(_this.authenticator.provider).to.eql('provider');
            done();
          });
        });
      });

      context('when torii does not fetch successfully', function() {
        beforeEach(function() {
          sinon.stub(this.torii, 'fetch').returns(Ember.RSVP.reject());
        });

        itDoesNotRestore({ some: 'data', provider: 'provider' });
      });
    });

    context('when there is no torii provider in the session data', function() {
      itDoesNotRestore();
    });
  });

  describe('#authenticate', function() {
    context('when torii opens successfully', function() {
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
        var _this = this;
        this.authenticator.authenticate('provider').then(function(data) {
          expect(_this.authenticator.provider).to.eql('provider');
          done();
        });
      });
    });

    context('when torii does not open successfully', function() {
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
    context('when torii closes successfully', function() {
      beforeEach(function() {
        sinon.stub(this.torii, 'close').returns(Ember.RSVP.resolve());
      });

      it('returns a resolving promise', function(done) {
        this.authenticator.invalidate({ some: 'data' }).then(function(data) {
          expect(true).to.be.true;
          done();
        });
      });

      it('unsets the provider', function(done) {
        var _this = this;
        this.authenticator.provider = 'provider';
        this.authenticator.invalidate({ some: 'data' }).then(function(data) {
          expect(_this.authenticator.provider).to.be.null;
          done();
        });
      });
    });

    context('when torii does not close successfully', function() {
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
        var _this = this;
        this.authenticator.provider = 'provider';
        this.authenticator.invalidate({ some: 'data' }).then(null, function(data) {
          expect(_this.authenticator.provider).to.eql('provider');
          done();
        });
      });
    });
  });

});
