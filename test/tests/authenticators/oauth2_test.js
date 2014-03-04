import { OAuth2 } from 'ember-simple-auth/authenticators/oauth2';

describe('Authenticators.OAuth2', function() {
  beforeEach(function() {
    this.authenticator = OAuth2.create();
  });

  function itSchedulesTokenRefreshing() {
  }

  describe('#restore', function() {
    describe('when the data contains an access_token', function() {
      it('returns a resolving promise', function(done) {
        this.authenticator.restore({ access_token: 'access_token' }).then(function() {
          expect(true).to.be.ok();
          done();
        }, function() {
          expect().fail();
          done();
        });
      });

      itSchedulesTokenRefreshing();
    });

    describe('when the data does not contain an access_token', function() {
      it('returns a rejecting promise', function(done) {
        this.authenticator.restore().then(function() {
          expect().fail();
          done();
        }, function() {
          expect(true).to.be.ok();
          done();
        });
      });
    });
  });

  describe('#authenticate', function() {
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', function(done) {
      this.authenticator.invalidate().then(function() {
        expect(true).to.be.ok();
        done();
      }, function() {
        expect().fail();
        done();
      });
    });
  });
});

/*import { OAuth2 } from 'ember-simple-auth/authenticators/oauth2';

var authenticator;

var ajaxMock;
var AjaxMock = Ember.Object.extend({
  ajaxCapture: function(options) {
    this.requestOptions = options;
    return {
      then: function(success, fail) {
        if (AjaxMock._resolve) {
          success(AjaxMock._resolve);
        } else if (AjaxMock._reject) {
          fail(AjaxMock._reject);
        }
      }
    };
  }
});

module('Authenticators.OAuth2', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    authenticator = OAuth2.create();
    ajaxMock      = AjaxMock.create();
    Ember.$.ajax  = Ember.$.proxy(ajaxMock.ajaxCapture, ajaxMock);
  },
  teardown: function() {
    Ember.run.cancel(authenticator._refreshTokenTimeout);
    Ember.$.ajax = this.originalAjax;
  }
});

test('restores the session', function() {
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.restore({ access_token: 'access_token', key: 'value' }).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Authenticators.OAuth2 returns a resolving promise when the properties it restores the session from include an access_token.');
  deepEqual(resolvedWith, { access_token: 'access_token', key: 'value' }, 'Authenticators.OAuth2 returns a promise that resolves with the passed properties when the properties it restores the session from include an access_token.');

  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Authenticators.OAuth2 returns a rejecting promise when the properties it restores the session from do not include an access_token.');

  rejected = false;
  Ember.run(function() {
    authenticator.restore({ access_token: '' }).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Authenticators.OAuth2 returns a rejecting promise when the properties it restores the session from include an empty access_token.');
});

test('issues an AJAX request for authentication', function() {
  Ember.run(function() {
    authenticator.authenticate({ identification: 'identification', password: 'password' });
  });

  equal(ajaxMock.requestOptions.url, '/token', 'Authenticators.OAuth2 sends a request to the serverTokenEndpoint for authentication.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Authenticators.OAuth2 sends a POST request for authentication.');
  deepEqual(ajaxMock.requestOptions.data, { grant_type: 'password', password: 'password', username: 'identification' }, 'Authenticators.OAuth2 sends a request with the correct data for authentication.');
  equal(ajaxMock.requestOptions.dataType, 'json', 'Authenticators.OAuth2 sends a request with the data type "json" for authentication.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Authenticators.OAuth2 sends a request with the content type "application/x-www-form-urlencoded" for authentication.');
});

test('returns a promise on authentication', function() {
  AjaxMock._resolve = { access_token: 'access_token' };
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.authenticate({}).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Authenticators.OAuth2 returns a resolving promise when the authentication AJAX request is successful.');
  deepEqual(resolvedWith, { access_token: 'access_token' }, "Authenticators.OAuth2 returns a promise that resolves with the server's response when the authentication AJAX request is successful.");

  AjaxMock._resolve = false;
  AjaxMock._reject  = { responseText: 'error' };
  var rejected;
  var rejectedWith;
  Ember.run(function() {
    authenticator.authenticate({}).then(function() {}, function(error) {
      rejected     = true;
      rejectedWith = error;
    });
  });

  ok(rejected, 'Authenticators.OAuth2 returns a rejecting promise when the authentication AJAX request is not successful.');
  deepEqual(rejectedWith, 'error', 'Authenticators.OAuth2 returns a promise that rejects with the error message from the response when the authentication AJAX request is not successful.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function(error) {
      resolved = true;
    });
  });

  ok(resolved, 'Authenticators.OAuth2 returns a resolving promise for session invalidation.');
});

test('refreshes the access token', function() {
  Ember.run(function() {
    authenticator.refreshAccessToken(1, 'refresh token!');
  });

  equal(ajaxMock.requestOptions.url, '/token', 'Authenticators.OAuth2 sends a request to the serverTokenEndpoint to refresh the access token.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Authenticators.OAuth2 sends a POST request to refresh the access token.');
  deepEqual(ajaxMock.requestOptions.data, { grant_type: 'refresh_token', refresh_token: 'refresh token!' }, 'Authenticators.OAuth2 sends a request with the correct data to refresh the access token.');
  equal(ajaxMock.requestOptions.dataType, 'json', 'Authenticators.OAuth2 sends a request with the data type "json" to refresh the access token.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Authenticators.OAuth2 sends a request with the content type "application/x-www-form-urlencoded" to refresh the access token.');
});

test('keeps the token fresh', function() {
  AjaxMock._resolve = false;
  Ember.run(function() {
    authenticator.refreshAccessToken(1, 'refresh token!');
  });

  ok(Ember.isEmpty(authenticator._refreshTokenTimeout), 'Authenticators.OAuth2 does not schedule another refresh when refreshing the access token failed.');

  AjaxMock._resolve = true;
  Ember.run(function() {
    authenticator.refreshAccessToken(5, 'refresh token!');
  });

  ok(Ember.isEmpty(authenticator._refreshTokenTimeout), 'Authenticators.OAuth2 does not schedule another refresh when the token expiration time is 5 seconds or less.');

  Ember.run(function() {
    authenticator.refreshAccessToken(10, 'refresh token!');
  });

  ok(!Ember.isEmpty(authenticator._refreshTokenTimeout), 'Authenticators.OAuth2 schedules another refresh when it successfully refreshed the access token.');
});
*/