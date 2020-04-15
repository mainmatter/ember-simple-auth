'use strict';

define("test-app/tests/acceptance/authentication-test", ["@ember/test-helpers", "ember-test-helpers/has-ember-version", "mocha", "ember-mocha", "chai", "pretender", "ember-simple-auth/test-support", "test-app/config/environment"], function (_testHelpers, _hasEmberVersion, _mocha, _emberMocha, _chai, _pretender, _testSupport, _environment) {
  "use strict";

  (0, _mocha.describe)('Acceptance: Authentication', function () {
    (0, _emberMocha.setupApplicationTest)();
    let server;
    (0, _mocha.afterEach)(function () {
      Ember.tryInvoke(server, 'shutdown');
    });
    (0, _mocha.describe)('the protected route', function () {
      if (!(0, _hasEmberVersion.default)(2, 4)) {
        // guard against running test module on unsupported version (before 2.4)
        return;
      }

      (0, _mocha.it)('cannot be visited when the session is not authenticated', async function () {
        await (0, _testSupport.invalidateSession)();
        await (0, _testHelpers.visit)('/protected');
        (0, _chai.expect)((0, _testHelpers.currentURL)()).to.eq('/login');
      });
      (0, _mocha.it)('can be visited when the session is authenticated', async function () {
        server = new _pretender.default(function () {
          this.get(`${_environment.default.apiHost}/posts`, () => [200, {
            'Content-Type': 'application/json'
          }, '{"data":[]}']);
        });
        await (0, _testSupport.authenticateSession)({
          userId: 1,
          otherData: 'some-data'
        });
        await (0, _testHelpers.visit)('/protected');
        let session = (0, _testSupport.currentSession)();
        (0, _chai.expect)((0, _testHelpers.currentURL)()).to.eq('/protected');
        (0, _chai.expect)(session.get('data.authenticated.userId')).to.eql(1);
        (0, _chai.expect)(session.get('data.authenticated.otherData')).to.eql('some-data');
      });
    });
    (0, _mocha.describe)('the protected route in the engine', function () {
      (0, _mocha.it)('cannot be visited when the session is not authenticated', async function () {
        await (0, _testSupport.invalidateSession)();
        await (0, _testHelpers.visit)('/engine');
        (0, _chai.expect)((0, _testHelpers.currentURL)()).to.eq('/login');
      });
      (0, _mocha.it)('can be visited when the session is authenticated', async function () {
        server = new _pretender.default(function () {
          this.get(`${_environment.default.apiHost}/posts`, () => [200, {
            'Content-Type': 'application/json'
          }, '{"data":[]}']);
        });
        await (0, _testSupport.authenticateSession)({
          userId: 1,
          otherData: 'some-data'
        });
        await (0, _testHelpers.visit)('/engine');
        (0, _chai.expect)((0, _testHelpers.currentURL)()).to.eq('/engine');
        let session = (0, _testSupport.currentSession)();
        (0, _chai.expect)(session.get('data.authenticated.userId')).to.eql(1);
        (0, _chai.expect)(session.get('data.authenticated.otherData')).to.eql('some-data');
      });
      (0, _mocha.it)('can invalidate the session', async function () {
        server = new _pretender.default(function () {
          this.get(`${_environment.default.apiHost}/posts`, () => [200, {
            'Content-Type': 'application/json'
          }, '{"data":[]}']);
        });
        await (0, _testSupport.authenticateSession)({
          userId: 1,
          otherData: 'some-data'
        });
        await (0, _testHelpers.visit)('/engine');
        await (0, _testHelpers.click)('[data-test-logout-button]');
        let session = (0, _testSupport.currentSession)();
        (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
      });
    });
    (0, _mocha.describe)('the login route', function () {
      if (!(0, _hasEmberVersion.default)(2, 4)) {
        // guard against running test module on unsupported version (before 2.4)
        return;
      }

      (0, _mocha.it)('can be visited when the session is not authenticated', async function () {
        await (0, _testSupport.invalidateSession)();
        await (0, _testHelpers.visit)('/login');
        (0, _chai.expect)((0, _testHelpers.currentURL)()).to.eq('/login');
      });
      (0, _mocha.it)('cannot be visited when the session is authenticated', async function () {
        await (0, _testSupport.authenticateSession)();
        await (0, _testHelpers.visit)('/login');
        (0, _chai.expect)((0, _testHelpers.currentURL)()).to.eq('/');
      });
    });
  });
});
define("test-app/tests/helpers/create-adaptive-store", ["exports", "ember-simple-auth/session-stores/adaptive", "test-app/tests/helpers/create-cookie-store"], function (_exports, _adaptive, _createCookieStore) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = createAdaptiveStore;
  const assign = Ember.assign || Ember.merge;

  function createAdaptiveStore(cookiesService, options = {}, props = {}) {
    let cookieStore = (0, _createCookieStore.default)(cookiesService, assign({}, options, {
      _isFastboot: false
    }));

    props._createStore = function () {
      cookieStore.on('sessionDataUpdated', data => {
        this.trigger('sessionDataUpdated', data);
      });
      return cookieStore;
    };

    return _adaptive.default.extend(props).create(options);
  }
});
define("test-app/tests/helpers/create-cookie-store", ["exports", "ember-simple-auth/session-stores/cookie"], function (_exports, _cookie) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = createCookieStore;

  function createCookieStore(cookiesService, options = {}) {
    options._cookies = cookiesService;
    options._fastboot = {
      isFastBoot: false
    };
    return _cookie.default.create(options);
  }
});
define("test-app/tests/helpers/destroy-app", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = destroyApp;

  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define("test-app/tests/helpers/fake-cookie-service", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Object.extend({
    init() {
      this._super(...arguments);

      this._content = {};
    },

    read(name) {
      const value = name ? this._content[name] : this._content;

      if (Ember.isNone(value)) {
        return value;
      } else {
        return decodeURIComponent(value);
      }
    },

    write(name, value) {
      if (Ember.isNone(value)) {
        delete this._content[name];
      } else {
        this._content[name] = encodeURIComponent(value);
      }
    },

    clear(name) {
      let expires = new Date(0);
      this.write(name, null, {
        expires
      });
    }

  });

  _exports.default = _default;
});
define("test-app/tests/helpers/module-for-acceptance", ["exports", "qunit", "test-app/tests/helpers/start-app", "test-app/tests/helpers/destroy-app"], function (_exports, _qunit, _startApp, _destroyApp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _default(name, options = {}) {
    (0, _qunit.module)(name, {
      beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach() {
        let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.resolve(afterEach).then(() => (0, _destroyApp.default)(this.application));
      }

    });
  }
});
define("test-app/tests/helpers/resolver", ["exports", "test-app/resolver", "test-app/config/environment"], function (_exports, _resolver, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };
  var _default = resolver;
  _exports.default = _default;
});
define("test-app/tests/helpers/start-app", ["exports", "test-app/app", "test-app/config/environment"], function (_exports, _app, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = startApp;

  function startApp(attrs) {
    let attributes = Ember.merge({}, _environment.default.APP);
    attributes.autoboot = true;
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(() => {
      let application = _app.default.create(attributes);

      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define("test-app/tests/helpers/torii", ["exports", "test-app/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.stubValidSession = stubValidSession;
  const {
    torii: {
      sessionServiceName
    }
  } = _environment.default;

  function stubValidSession(application, sessionData) {
    let session = application.__container__.lookup(`service:${sessionServiceName}`);

    let sm = session.get('stateMachine');
    Ember.run(() => {
      sm.send('startOpen');
      sm.send('finishOpen', sessionData);
    });
  }
});
define("test-app/tests/test-helper", ["@ember/test-helpers", "test-app/app", "test-app/config/environment"], function (_testHelpers, _app, _environment) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
});
define("test-app/tests/unit/authenticators/base-test", ["mocha", "chai", "ember-simple-auth/authenticators/base"], function (_mocha, _chai, _base) {
  "use strict";

  (0, _mocha.describe)('BaseAuthenticator', () => {
    let authenticator;
    (0, _mocha.beforeEach)(function () {
      authenticator = _base.default.create();
    });
    (0, _mocha.describe)('#restore', function () {
      (0, _mocha.it)('returns a rejecting promise', async function () {
        try {
          await authenticator.restore();
          (0, _chai.expect)(false).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(true).to.be.true;
        }
      });
    });
    (0, _mocha.describe)('#authenticate', function () {
      (0, _mocha.it)('returns a rejecting promise', async function () {
        try {
          await authenticator.authenticate();
          (0, _chai.expect)(false).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(true).to.be.true;
        }
      });
    });
    (0, _mocha.describe)('#invalidate', function () {
      (0, _mocha.it)('returns a resolving promise', async function () {
        try {
          await authenticator.invalidate();
          (0, _chai.expect)(true).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(false).to.be.true;
        }
      });
    });
  });
});
define("test-app/tests/unit/authenticators/devise-test", ["mocha", "chai", "pretender", "ember-simple-auth/authenticators/devise"], function (_mocha, _chai, _pretender, _devise) {
  "use strict";

  (0, _mocha.describe)('DeviseAuthenticator', () => {
    let server;
    let authenticator;
    (0, _mocha.beforeEach)(function () {
      server = new _pretender.default();
      authenticator = _devise.default.create();
    });
    (0, _mocha.afterEach)(function () {
      Ember.tryInvoke(server, 'shutdown');
    });
    (0, _mocha.describe)('#restore', function () {
      (0, _mocha.describe)('when the data contains a token and email', function () {
        (0, _mocha.it)('resolves with the correct data', async function () {
          let content = await authenticator.restore({
            token: 'secret token!',
            email: 'user@email.com'
          });
          (0, _chai.expect)(content).to.eql({
            token: 'secret token!',
            email: 'user@email.com'
          });
        });
      });
      (0, _mocha.describe)('when the data contains a custom token and email attribute', function () {
        (0, _mocha.beforeEach)(function () {
          authenticator = _devise.default.extend({
            tokenAttributeName: 'employee.token',
            identificationAttributeName: 'employee.email'
          }).create();
        });
        (0, _mocha.it)('resolves with the correct data', async function () {
          let content = await authenticator.restore({
            employee: {
              token: 'secret token!',
              email: 'user@email.com'
            }
          });
          (0, _chai.expect)(content).to.eql({
            employee: {
              token: 'secret token!',
              email: 'user@email.com'
            }
          });
        });
      });
    });
    (0, _mocha.describe)('#authenticate', function () {
      (0, _mocha.beforeEach)(function () {
        server.post('/users/sign_in', () => [201, {
          'Content-Type': 'application/json'
        }, '{ "token": "secret token!", "email": "email@address.com" }']);
      });
      (0, _mocha.it)('sends an AJAX request to the sign in endpoint', async function () {
        await authenticator.authenticate('identification', 'password');
        let [request] = server.handledRequests;
        (0, _chai.expect)(request.url).to.eql('/users/sign_in');
        (0, _chai.expect)(request.method).to.eql('POST');
        (0, _chai.expect)(JSON.parse(request.requestBody)).to.eql({
          user: {
            email: 'identification',
            password: 'password'
          }
        });
        (0, _chai.expect)(request.requestHeaders['content-type']).to.eql('application/json');
        (0, _chai.expect)(request.requestHeaders.accept).to.eql('application/json');
      });
      (0, _mocha.describe)('when the authentication request is successful', function () {
        (0, _mocha.beforeEach)(function () {
          server.post('/users/sign_in', () => [201, {
            'Content-Type': 'application/json'
          }, '{ "token": "secret token!", "email": "email@address.com" }']);
        });
        (0, _mocha.it)('resolves with the correct data', async function () {
          let data = await authenticator.authenticate('email@address.com', 'password');
          (0, _chai.expect)(data).to.eql({
            token: 'secret token!',
            email: 'email@address.com'
          });
        });
        (0, _mocha.describe)('when the server returns incomplete data', function () {
          (0, _mocha.it)('fails when token is missing', async function () {
            server.post('/users/sign_in', () => [201, {
              'Content-Type': 'application/json'
            }, '{ "email": "email@address.com" }']);

            try {
              await authenticator.authenticate('email@address.com', 'password');
              (0, _chai.expect)(false).to.be.true;
            } catch (error) {
              (0, _chai.expect)(error).to.eql('Check that server response includes token and email');
            }
          });
          (0, _mocha.it)('fails when identification is missing', async function () {
            server.post('/users/sign_in', () => [201, {
              'Content-Type': 'application/json'
            }, '{ "token": "secret token!" }']);

            try {
              await authenticator.authenticate('email@address.com', 'password');
              (0, _chai.expect)(false).to.be.true;
            } catch (error) {
              (0, _chai.expect)(error).to.eql('Check that server response includes token and email');
            }
          });
        });
      });
      (0, _mocha.describe)('when the authentication request fails', function () {
        (0, _mocha.beforeEach)(function () {
          server.post('/users/sign_in', () => [400, {
            'Content-Type': 'application/json',
            'X-Custom-Context': 'foobar'
          }, '{ "error": "invalid_grant" }']);
        });
        (0, _mocha.it)('rejects with the response', async function () {
          try {
            await authenticator.authenticate('username', 'password');
            (0, _chai.expect)(false).to.be.true;
          } catch (response) {
            (0, _chai.expect)(response.ok).to.be.false;
          }
        });
      });
      (0, _mocha.it)('can customize the ajax request', async function () {
        server.put('/login', () => [201, {
          'Content-Type': 'application/json'
        }, '{ "token": "secret token!", "email": "email@address.com" }']);
        authenticator = _devise.default.extend({
          makeRequest(config) {
            return this._super(config, {
              method: 'PUT',
              url: '/login'
            });
          }

        }).create();
        await authenticator.authenticate('identification', 'password');
        let [request] = server.handledRequests;
        (0, _chai.expect)(request.url).to.eql('/login');
        (0, _chai.expect)(request.method).to.eql('PUT');
      });
      (0, _mocha.it)('can handle a resp with the namespace of the resource name', async function () {
        server.post('/users/sign_in', () => [201, {
          'Content-Type': 'application/json'
        }, '{ "user": { "token": "secret token!", "email": "email@address.com" } }']);
        let data = await authenticator.authenticate('email@address.com', 'password');
        (0, _chai.expect)(true).to.be.true;
        (0, _chai.expect)(data).to.eql({
          token: 'secret token!',
          email: 'email@address.com'
        });
      });
    });
    (0, _mocha.describe)('#invalidate', function () {
      (0, _mocha.it)('returns a resolving promise', async function () {
        try {
          await authenticator.invalidate();
          (0, _chai.expect)(true).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(false).to.be.true;
        }
      });
    });
  });
});
define("test-app/tests/unit/authenticators/oauth2-implicit-grant-test", ["ember-mocha", "mocha", "chai", "ember-simple-auth/authenticators/oauth2-implicit-grant"], function (_emberMocha, _mocha, _chai, _oauth2ImplicitGrant) {
  "use strict";

  (0, _mocha.describe)('OAuth2ImplicitGrantAuthenticator', () => {
    let authenticator;
    let data = {
      'access_token': 'secret-token'
    };
    (0, _mocha.beforeEach)(function () {
      authenticator = _oauth2ImplicitGrant.default.create();
    });
    (0, _mocha.describe)('#restore', function () {
      (0, _mocha.describe)('when the data contains an access_token', function () {
        (0, _emberMocha.it)('resolves with the correct data', async function () {
          let _data = await authenticator.restore(data);

          (0, _chai.expect)(_data).to.eql(data);
        });
        (0, _mocha.describe)('when the data does not contain an access_token', function () {
          (0, _emberMocha.it)('returns a rejecting promise', async function () {
            try {
              await authenticator.restore();
              (0, _chai.expect)(false).to.be.true;
            } catch (error) {
              (0, _chai.expect)(error).to.eql('Could not restore session - "access_token" missing.');
            }
          });
        });
      });
    });
    (0, _mocha.describe)('#authenticate', function () {
      (0, _mocha.describe)('when the data contains an access_token', function () {
        (0, _emberMocha.it)('resolves with the correct data', async function () {
          let _data = await authenticator.authenticate(data);

          (0, _chai.expect)(_data).to.eql(data);
        });
      });
      (0, _mocha.describe)('when the data does not contain an access_token', function () {
        (0, _emberMocha.it)('rejects with an error', async function () {
          try {
            await authenticator.authenticate({
              foo: 'bar'
            });
            (0, _chai.expect)(false).to.be.true;
          } catch (error) {
            (0, _chai.expect)(error).to.eql('Invalid auth params - "access_token" missing.');
          }
        });
      });
      (0, _mocha.describe)('when the data contains an error', function () {
        (0, _emberMocha.it)('rejects with that error', async function () {
          try {
            await authenticator.authenticate({
              error: 'access_denied'
            });
            (0, _chai.expect)(false).to.be.true;
          } catch (error) {
            (0, _chai.expect)(error).to.eql('access_denied');
          }
        });
      });
    });
    (0, _mocha.describe)('#invalidate', function () {
      (0, _emberMocha.it)('returns a resolving promise', async function () {
        try {
          await authenticator.invalidate();
          (0, _chai.expect)(true).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(false).to.be.true;
        }
      });
    });
  });
});
define("test-app/tests/unit/authenticators/oauth2-password-grant-test", ["mocha", "ember-mocha", "chai", "pretender", "ember-simple-auth/authenticators/oauth2-password-grant"], function (_mocha, _emberMocha, _chai, _pretender, _oauth2PasswordGrant) {
  "use strict";

  (0, _mocha.describe)('OAuth2PasswordGrantAuthenticator', () => {
    (0, _emberMocha.setupTest)();
    let authenticator;
    let server;

    let parsePostData = query => {
      let result = {};
      query.split('&').forEach(part => {
        let item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    };

    (0, _mocha.beforeEach)(function () {
      authenticator = _oauth2PasswordGrant.default.create();
      Ember.setOwner(authenticator, this.owner);
      server = new _pretender.default();
    });
    (0, _mocha.afterEach)(function () {
      Ember.tryInvoke(server, 'shutdown');
    });
    (0, _mocha.describe)('#restore', function () {
      (0, _mocha.describe)('when the data includes expiration data', function () {
        (0, _mocha.it)('resolves with the correct data', async function () {
          let data = await authenticator.restore({
            'access_token': 'secret token!',
            'expires_in': 12345,
            'refresh_token': 'refresh token!'
          });
          (0, _chai.expect)(data).to.eql({
            'access_token': 'secret token!',
            'expires_in': 12345,
            'refresh_token': 'refresh token!'
          });
        });
        (0, _mocha.describe)('when the data includes an expiration time in the past', function () {
          (0, _mocha.describe)('when automatic token refreshing is enabled', function () {
            (0, _mocha.describe)('when the refresh request is successful', function () {
              (0, _mocha.beforeEach)(function () {
                server.post('/token', () => [200, {
                  'Content-Type': 'application/json'
                }, '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }']);
              });
              (0, _mocha.it)('resolves with the correct data', async function () {
                let data = await authenticator.restore({
                  'access_token': 'secret token!',
                  'expires_at': 1
                });
                (0, _chai.expect)(data['expires_at']).to.be.greaterThan(new Date().getTime());
                delete data['expires_at'];
                (0, _chai.expect)(data).to.eql({
                  'access_token': 'secret token 2!',
                  'expires_in': 67890,
                  'refresh_token': 'refresh token 2!'
                });
              });
            });
            (0, _mocha.describe)('when the access token is not refreshed successfully', function () {
              (0, _mocha.it)('returns a rejecting promise', async function () {
                try {
                  await authenticator.restore({
                    'access_token': 'secret token!',
                    'expires_at': 1
                  });
                  (0, _chai.expect)(false).to.be.true;
                } catch (_error) {
                  (0, _chai.expect)(true).to.be.true;
                }
              });
            });
          });
          (0, _mocha.describe)('when automatic token refreshing is disabled', function () {
            (0, _mocha.beforeEach)(function () {
              authenticator.set('refreshAccessTokens', false);
            });
            (0, _mocha.it)('returns a rejecting promise', async function () {
              try {
                await authenticator.restore({
                  'access_token': 'secret token!',
                  'expires_at': 1
                });
                (0, _chai.expect)(false).to.be.true;
              } catch (_error) {
                (0, _chai.expect)(true).to.be.true;
              }
            });
          });
        });
      });
      (0, _mocha.describe)('when the data does not include expiration data', function () {
        (0, _mocha.describe)('when the data contains an access_token', function () {
          (0, _mocha.it)('resolves with the correct data', async function () {
            let data = await authenticator.restore({
              'access_token': 'secret token!'
            });
            (0, _chai.expect)(data).to.eql({
              'access_token': 'secret token!'
            });
          });
        });
        (0, _mocha.describe)('when the data does not contain an access_token', function () {
          (0, _mocha.it)('returns a rejecting promise', async function () {
            try {
              await authenticator.restore();
              (0, _chai.expect)(false).to.be.true;
            } catch (_error) {
              (0, _chai.expect)(true).to.be.true;
            }
          });
        });
      });
    });
    (0, _mocha.describe)('#authenticate', function () {
      (0, _mocha.it)('sends an AJAX request to the token endpoint', async function () {
        server.post('/token', request => {
          let body = parsePostData(request.requestBody);
          (0, _chai.expect)(body).to.eql({
            'grant_type': 'password',
            'username': 'username',
            'password': 'password'
          });
          return [200, {
            'Content-Type': 'application/json'
          }, '{ "access_token": "secret token!" }'];
        });
        await authenticator.authenticate('username', 'password');
      });
      (0, _mocha.it)('sends an AJAX request to the token endpoint with client_id as parameter in the body', async function () {
        server.post('/token', request => {
          let body = parsePostData(request.requestBody);
          (0, _chai.expect)(body).to.eql({
            'client_id': 'test-client',
            'grant_type': 'password',
            'username': 'username',
            'password': 'password'
          });
          return [200, {
            'Content-Type': 'application/json'
          }, '{ "access_token": "secret token!" }'];
        });
        authenticator.set('clientId', 'test-client');
        await authenticator.authenticate('username', 'password');
      });
      (0, _mocha.it)('sends an AJAX request to the token endpoint with customized headers', async function () {
        server.post('/token', request => {
          (0, _chai.expect)(request.requestHeaders['x-custom-context']).to.eql('foobar');
          return [200, {
            'Content-Type': 'application/json'
          }, '{ "access_token": "secret token!" }'];
        });
        await authenticator.authenticate('username', 'password', [], {
          'X-Custom-Context': 'foobar'
        });
      });
      (0, _mocha.it)('sends a single OAuth scope to the token endpoint', async function () {
        server.post('/token', request => {
          let {
            requestBody
          } = request;
          let {
            scope
          } = parsePostData(requestBody);
          (0, _chai.expect)(scope).to.eql('public');
          return [200, {
            'Content-Type': 'application/json'
          }, '{ "access_token": "secret token!" }'];
        });
        await authenticator.authenticate('username', 'password', 'public');
      });
      (0, _mocha.it)('sends multiple OAuth scopes to the token endpoint', async function () {
        server.post('/token', request => {
          let {
            requestBody
          } = request;
          let {
            scope
          } = parsePostData(requestBody);
          (0, _chai.expect)(scope).to.eql('public private');
          return [200, {
            'Content-Type': 'application/json'
          }, '{ "access_token": "secret token!" }'];
        });
        await authenticator.authenticate('username', 'password', ['public', 'private']);
      });
      (0, _mocha.describe)('when the authentication request is successful', function () {
        (0, _mocha.beforeEach)(function () {
          server.post('/token', () => [200, {
            'Content-Type': 'application/json'
          }, '{ "access_token": "secret token!" }']);
        });
        (0, _mocha.it)('resolves with the correct data', async function () {
          authenticator.set('refreshAccessTokens', false);
          let data = await authenticator.authenticate('username', 'password');
          (0, _chai.expect)(data).to.eql({
            'access_token': 'secret token!'
          });
        });
        (0, _mocha.describe)('when the server response includes expiration data', function () {
          (0, _mocha.beforeEach)(function () {
            server.post('/token', () => [200, {
              'Content-Type': 'application/json'
            }, '{ "access_token": "secret token!", "expires_in": 12345, "refresh_token": "refresh token!" }']);
          });
          (0, _mocha.it)('resolves with the correct data', async function () {
            let data = await authenticator.authenticate('username', 'password');
            (0, _chai.expect)(data['expires_at']).to.be.greaterThan(new Date().getTime());
            delete data['expires_at'];
            (0, _chai.expect)(data).to.eql({
              'access_token': 'secret token!',
              'expires_in': 12345,
              'refresh_token': 'refresh token!'
            });
          });
        });
        (0, _mocha.describe)('when the server response is missing access_token', function () {
          (0, _mocha.it)('fails with a string describing the issue', async function () {
            server.post('/token', () => [200, {
              'Content-Type': 'application/json'
            }, '{}']);

            try {
              await authenticator.authenticate('username', 'password');
              (0, _chai.expect)(false).to.be.true;
            } catch (error) {
              (0, _chai.expect)(error).to.eql('access_token is missing in server response');
            }
          });
        });
        (0, _mocha.describe)('but the response is not valid JSON', function () {
          (0, _mocha.it)('fails with the string of the response', async function () {
            server.post('/token', () => [200, {
              'Content-Type': 'text/plain'
            }, 'Something went wrong']);

            try {
              await authenticator.authenticate('username', 'password');
              (0, _chai.expect)(false).to.be.true;
            } catch (error) {
              (0, _chai.expect)(error.responseText).to.eql('Something went wrong');
            }
          });
        });
      });
      (0, _mocha.describe)('when the authentication request fails', function () {
        (0, _mocha.beforeEach)(function () {
          server.post('/token', () => [400, {
            'Content-Type': 'application/json',
            'X-Custom-Context': 'foobar'
          }, '{ "error": "invalid_grant" }']);
        });
        (0, _mocha.it)('rejects with response object containing responseJSON', async function () {
          try {
            await authenticator.authenticate('username', 'password');
            (0, _chai.expect)(false).to.be.true;
          } catch (error) {
            (0, _chai.expect)(error.responseJSON).to.eql({
              error: 'invalid_grant'
            });
          }
        });
        (0, _mocha.it)('provides access to custom headers', async function () {
          try {
            await authenticator.authenticate('username', 'password');
            (0, _chai.expect)(false).to.be.true;
          } catch (error) {
            (0, _chai.expect)(error.headers.get('x-custom-context')).to.eql('foobar');
          }
        });
      });
      (0, _mocha.describe)('when the authentication request fails without a valid response', function () {
        (0, _mocha.beforeEach)(function () {
          server.post('/token', () => [500, {
            'Content-Type': 'text/plain',
            'X-Custom-Context': 'foobar'
          }, 'The server has failed completely.']);
        });
        (0, _mocha.it)('rejects with response object containing responseText', async function () {
          try {
            await authenticator.authenticate('username', 'password');
            (0, _chai.expect)(false).to.be.true;
          } catch (error) {
            (0, _chai.expect)(error.responseJSON).to.not.exist;
            (0, _chai.expect)(error.responseText).to.eql('The server has failed completely.');
          }
        });
        (0, _mocha.it)('provides access to custom headers', async function () {
          try {
            await authenticator.authenticate('username', 'password');
            (0, _chai.expect)(false).to.be.true;
          } catch (error) {
            (0, _chai.expect)(error.headers.get('x-custom-context')).to.eql('foobar');
          }
        });
      });
    });
    (0, _mocha.describe)('#invalidate', function () {
      function itSuccessfullyInvalidatesTheSession() {
        (0, _mocha.it)('returns a resolving promise', async function () {
          try {
            await authenticator.invalidate({
              'access_token': 'access token!'
            });
            (0, _chai.expect)(true).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(false).to.be.true;
          }
        });
      }

      (0, _mocha.describe)('when token revokation is enabled', function () {
        (0, _mocha.beforeEach)(function () {
          authenticator.serverTokenRevocationEndpoint = '/revoke';
        });
        (0, _mocha.it)('sends an AJAX request to the revokation endpoint', async function () {
          server.post('/revoke', request => {
            let {
              requestBody
            } = request;
            let body = parsePostData(requestBody);
            (0, _chai.expect)(body).to.eql({
              'token_type_hint': 'access_token',
              'token': 'access token!'
            });
          });
          await authenticator.invalidate({
            'access_token': 'access token!'
          });
        });
        (0, _mocha.describe)('when the revokation request is successful', function () {
          (0, _mocha.beforeEach)(function () {
            server.post('/revoke', () => [200, {}, '']);
          });
          itSuccessfullyInvalidatesTheSession();
        });
        (0, _mocha.describe)('when the revokation request fails', function () {
          (0, _mocha.beforeEach)(function () {
            server.post('/token', () => [400, {
              'Content-Type': 'application/json'
            }, '{ "error": "unsupported_grant_type" }']);
          });
          itSuccessfullyInvalidatesTheSession();
        });
        (0, _mocha.describe)('when a refresh token is set', function () {
          (0, _mocha.it)('sends an AJAX request to invalidate the refresh token', async function () {
            server.post('/revoke', request => {
              let {
                requestBody
              } = request;
              let body = parsePostData(requestBody);
              (0, _chai.expect)(body).to.eql({
                'token_type_hint': 'refresh_token',
                'token': 'refresh token!'
              });
            });
            await authenticator.invalidate({
              'access_token': 'access token!',
              'refresh_token': 'refresh token!'
            });
          });
        });
      });
      (0, _mocha.describe)('when token revokation is not enabled', function () {
        itSuccessfullyInvalidatesTheSession();
      });
    });
    (0, _mocha.describe)('#tokenRefreshOffset', function () {
      (0, _mocha.it)('returns a number between 5000 and 10000', function () {
        (0, _chai.expect)(authenticator.get('tokenRefreshOffset')).to.be.at.least(5000);
        (0, _chai.expect)(authenticator.get('tokenRefreshOffset')).to.be.below(10000);
      });
      (0, _mocha.it)('can be overridden in a subclass', function () {
        let authenticator = _oauth2PasswordGrant.default.extend({
          tokenRefreshOffset: Ember.computed(function () {
            return 42;
          })
        }).create();

        (0, _chai.expect)(authenticator.get('tokenRefreshOffset')).to.equal(42);
      });
    }); // testing private API here ;(

    (0, _mocha.describe)('#_refreshAccessToken', function () {
      (0, _mocha.it)('sends an AJAX request to the token endpoint', async function () {
        server.post('/token', request => {
          let {
            requestBody
          } = request;
          let body = parsePostData(requestBody);
          (0, _chai.expect)(body).to.eql({
            'grant_type': 'refresh_token',
            'refresh_token': 'refresh token!'
          });
        });
        await authenticator._refreshAccessToken(12345, 'refresh token!');
      });
      (0, _mocha.describe)('when the refresh request is successful', function () {
        (0, _mocha.beforeEach)(function () {
          server.post('/token', () => [200, {
            'Content-Type': 'application/json'
          }, '{ "access_token": "secret token 2!" }']);
        });
        (0, _mocha.it)('triggers the "sessionDataUpdated" event', function (done) {
          authenticator.one('sessionDataUpdated', data => {
            (0, _chai.expect)(data['expires_at']).to.be.greaterThan(new Date().getTime());
            delete data['expires_at'];
            (0, _chai.expect)(data).to.eql({
              'access_token': 'secret token 2!',
              'expires_in': 12345,
              'refresh_token': 'refresh token!'
            });
            done();
          });

          authenticator._refreshAccessToken(12345, 'refresh token!');
        });
        (0, _mocha.describe)('when the server response includes updated expiration data', function () {
          (0, _mocha.beforeEach)(function () {
            server.post('/token', () => [200, {
              'Content-Type': 'application/json'
            }, '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }']);
          });
          (0, _mocha.it)('triggers the "sessionDataUpdated" event with the correct data', function (done) {
            authenticator.one('sessionDataUpdated', data => {
              (0, _chai.expect)(data['expires_at']).to.be.greaterThan(new Date().getTime());
              delete data['expires_at'];
              (0, _chai.expect)(data).to.eql({
                'access_token': 'secret token 2!',
                'expires_in': 67890,
                'refresh_token': 'refresh token 2!'
              });
              done();
            });

            authenticator._refreshAccessToken(12345, 'refresh token!');
          });
        });
      });
    });
  });
});
define("test-app/tests/unit/authenticators/test-test", ["mocha", "chai", "ember-simple-auth/authenticators/test"], function (_mocha, _chai, _test) {
  "use strict";

  (0, _mocha.describe)('TestAuthenticator', () => {
    let authenticator;
    (0, _mocha.beforeEach)(function () {
      authenticator = _test.default.create();
    });
    (0, _mocha.describe)('#restore', function () {
      (0, _mocha.it)('returns a resolving promise', async function () {
        try {
          await authenticator.restore();
          (0, _chai.expect)(true).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(false).to.be.true;
        }
      });
      (0, _mocha.it)('resolves with session data', async function () {
        let data = await authenticator.restore({
          userId: 1,
          otherData: 'some-data'
        });
        (0, _chai.expect)(data).to.eql({
          userId: 1,
          otherData: 'some-data'
        });
      });
    });
    (0, _mocha.describe)('#authenticate', function () {
      (0, _mocha.it)('returns a resolving promise', async function () {
        try {
          await authenticator.authenticate();
          (0, _chai.expect)(true).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(false).to.be.true;
        }
      });
      (0, _mocha.it)('resolves with session data', async function () {
        let data = await authenticator.authenticate({
          userId: 1,
          otherData: 'some-data'
        });
        (0, _chai.expect)(data).to.eql({
          userId: 1,
          otherData: 'some-data'
        });
      });
    });
    (0, _mocha.describe)('#invalidate', function () {
      (0, _mocha.it)('returns a resolving promise', async function () {
        try {
          await authenticator.invalidate();
          (0, _chai.expect)(true).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(false).to.be.true;
        }
      });
    });
  });
});
define("test-app/tests/unit/authenticators/torii-test", ["mocha", "chai", "sinon", "ember-simple-auth/authenticators/torii"], function (_mocha, _chai, _sinon, _torii) {
  "use strict";

  (0, _mocha.describe)('ToriiAuthenticator', () => {
    let sinon;
    let authenticator;
    let torii;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      torii = {
        fetch() {},

        open() {},

        close() {}

      };
      authenticator = _torii.default.create({
        torii
      });
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.describe)('#restore', function () {
      function itDoesNotRestore(data) {
        (0, _mocha.it)('returns a rejecting promise', async function () {
          try {
            await authenticator.restore(data);
            (0, _chai.expect)(false).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(true).to.be.true;
          }
        });
      }

      (0, _mocha.it)('throws if torii is not installed', async function () {
        authenticator.set('torii', null);

        try {
          await authenticator.restore();
          (0, _chai.expect)(false).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(true).to.be.true;
        }
      });
      (0, _mocha.describe)('when there is a torii provider in the session data', function () {
        (0, _mocha.describe)('when torii fetches successfully', function () {
          (0, _mocha.beforeEach)(function () {
            sinon.stub(torii, 'fetch').returns(Ember.RSVP.resolve({
              some: 'other data'
            }));
          });
          (0, _mocha.it)('returns a promise that resolves with the session data merged with the data fetched from torri', async function () {
            let data = await authenticator.restore({
              some: 'data',
              provider: 'provider',
              another: 'prop'
            });
            (0, _chai.expect)(data).to.eql({
              some: 'other data',
              provider: 'provider',
              another: 'prop'
            });
          });
        });
        (0, _mocha.describe)('when torii does not fetch successfully', function () {
          (0, _mocha.beforeEach)(function () {
            sinon.stub(torii, 'fetch').returns(Ember.RSVP.reject());
          });
          itDoesNotRestore({
            some: 'data',
            provider: 'provider'
          });
        });
      });
      (0, _mocha.describe)('when there is no torii provider in the session data', function () {
        itDoesNotRestore();
      });
    });
    (0, _mocha.describe)('#authenticate', function () {
      (0, _mocha.it)('throws if torii is not installed', async function () {
        authenticator.set('torii', null);

        try {
          await authenticator.authenticate();
          (0, _chai.expect)(false).to.be.true;
        } catch (_error) {
          (0, _chai.expect)(true).to.be.true;
        }
      });
      (0, _mocha.describe)('when torii opens successfully', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(torii, 'open').returns(Ember.RSVP.resolve({
            some: 'data'
          }));
        });
        (0, _mocha.it)('returns a promise that resolves with the session data', async function () {
          let data = await authenticator.authenticate('provider');
          (0, _chai.expect)(data).to.eql({
            some: 'data',
            provider: 'provider'
          });
        });
      });
      (0, _mocha.describe)('when torii does not open successfully', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(torii, 'open').returns(Ember.RSVP.reject());
        });
        (0, _mocha.it)('returns a rejecting promise', async function () {
          try {
            await authenticator.authenticate('provider');
            (0, _chai.expect)(false).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(true).to.be.true;
          }
        });
      });
    });
    (0, _mocha.describe)('#invalidate', function () {
      (0, _mocha.describe)('when torii closes successfully', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(torii, 'close').returns(Ember.RSVP.resolve());
        });
        (0, _mocha.it)('returns a resolving promise', async function () {
          try {
            await authenticator.invalidate({
              some: 'data'
            });
            (0, _chai.expect)(true).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(false).to.be.true;
          }
        });
      });
      (0, _mocha.describe)('when torii does not close successfully', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(torii, 'close').returns(Ember.RSVP.reject());
        });
        (0, _mocha.it)('returns a rejecting promise', async function () {
          try {
            await authenticator.invalidate({
              some: 'data'
            });
            (0, _chai.expect)(false).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(true).to.be.true;
          }
        });
      });
    });
  });
});
define("test-app/tests/unit/configuration-test", ["mocha", "chai", "ember-simple-auth/configuration"], function (_mocha, _chai, _configuration) {
  "use strict";

  (0, _mocha.describe)('Configuration', () => {
    (0, _mocha.afterEach)(function () {
      _configuration.default.load({});
    });
    (0, _mocha.describe)('rootURL', function () {
      (0, _mocha.it)('defaults to ""', function () {
        _configuration.default.load({});

        (0, _chai.expect)(_configuration.default.rootURL).to.eql('');
      });
    });
    (0, _mocha.describe)('.load', function () {
      (0, _mocha.it)('sets rootURL correctly', function () {
        _configuration.default.load({
          rootURL: '/rootURL'
        });

        (0, _chai.expect)(_configuration.default.rootURL).to.eql('/rootURL');
      });
    });
  });
});
define("test-app/tests/unit/initializers/setup-session-restoration-test", ["ember-mocha", "mocha", "chai", "sinon", "ember-simple-auth/initializers/setup-session-restoration"], function (_emberMocha, _mocha, _chai, _sinon, _setupSessionRestoration) {
  "use strict";

  (0, _mocha.describe)('setupSessionRestoration', () => {
    (0, _emberMocha.setupTest)();
    let sinon;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      this.owner.register('route:application', Ember.Route.extend());
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.it)('adds a beforeModel method', function () {
      (0, _setupSessionRestoration.default)(this.owner);
      const route = this.owner.lookup('route:application');
      (0, _chai.expect)(route).to.respondTo('beforeModel');
    });
    (0, _mocha.describe)('the beforeModel method', function () {
      let session;
      let route;
      (0, _mocha.beforeEach)(function () {
        this.owner.register('session:main', Ember.Object.extend({
          restore() {}

        }));
        session = this.owner.lookup('session:main');
        this.owner.register('route:application', Ember.Route.extend({
          beforeModel() {
            return Ember.RSVP.resolve('test');
          }

        }));
        route = this.owner.lookup('route:application');
        (0, _setupSessionRestoration.default)(this.owner);
      });
      (0, _mocha.describe)('when session restoration resolves', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(session, 'restore').returns(Ember.RSVP.resolve());
        });
        (0, _mocha.it)('returns the return value of the original "beforeModel" method', async function () {
          let value = await route.beforeModel();
          (0, _chai.expect)(value).to.eq('test');
        });
      });
      (0, _mocha.describe)('when session restoration rejects', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(session, 'restore').returns(Ember.RSVP.reject());
        });
        (0, _mocha.it)('returns the return value of the original "beforeModel" method', async function () {
          let value = await route.beforeModel();
          (0, _chai.expect)(value).to.eq('test');
        });
      });
    });
  });
});
define("test-app/tests/unit/initializers/setup-session-service-test", ["mocha", "chai", "sinon", "ember-simple-auth/initializers/setup-session-service"], function (_mocha, _chai, _sinon, _setupSessionService) {
  "use strict";

  (0, _mocha.describe)('setupSessionService', () => {
    let sinon;
    let registry;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      registry = {
        injection() {}

      };
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.it)('injects the session into the session service', function () {
      sinon.spy(registry, 'injection');
      (0, _setupSessionService.default)(registry);
      (0, _chai.expect)(registry.injection).to.have.been.calledWith('service:session', 'session', 'session:main');
    });
  });
});
define("test-app/tests/unit/initializers/setup-session-test", ["mocha", "chai", "sinon", "ember-simple-auth/initializers/setup-session", "ember-simple-auth/session-stores/ephemeral", "ember-simple-auth/internal-session"], function (_mocha, _chai, _sinon, _setupSession, _ephemeral, _internalSession) {
  "use strict";

  (0, _mocha.describe)('setupSession', () => {
    let sinon;
    let registry;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      registry = {
        register() {},

        injection() {}

      };
      Ember.testing = true; // eslint-disable-line ember/no-ember-testing-in-module-scope
    });
    (0, _mocha.afterEach)(function () {
      sinon.restore();
    });
    (0, _mocha.it)('registers the session', function () {
      sinon.spy(registry, 'register');
      (0, _setupSession.default)(registry);
      (0, _chai.expect)(registry.register).to.have.been.calledWith('session:main', _internalSession.default);
    });
    (0, _mocha.describe)('when Ember.testing is true', function () {
      (0, _mocha.it)('registers the test session store', function () {
        sinon.spy(registry, 'register');
        (0, _setupSession.default)(registry);
        (0, _chai.expect)(registry.register).to.have.been.calledWith('session-store:test', _ephemeral.default);
      });
      (0, _mocha.it)('injects the test session store into the session', function () {
        sinon.spy(registry, 'injection');
        (0, _setupSession.default)(registry);
        (0, _chai.expect)(registry.injection).to.have.been.calledWith('session:main', 'store', 'session-store:test');
      });
    });
    (0, _mocha.describe)('when Ember.testing is false', function () {
      (0, _mocha.beforeEach)(function () {
        Ember.testing = false; // eslint-disable-line ember/no-ember-testing-in-module-scope
      });
      (0, _mocha.afterEach)(function () {
        Ember.testing = true; // eslint-disable-line ember/no-ember-testing-in-module-scope
      });
      (0, _mocha.it)('injects the application session store into the session', function () {
        sinon.spy(registry, 'injection');
        (0, _setupSession.default)(registry);
        (0, _chai.expect)(registry.injection).to.have.been.calledWith('session:main', 'store', 'session-store:application');
      });
    });
  });
});
define("test-app/tests/unit/internal-session-test", ["mocha", "ember-mocha", "chai", "sinon", "ember-simple-auth/internal-session", "ember-simple-auth/session-stores/ephemeral", "ember-simple-auth/authenticators/base"], function (_mocha, _emberMocha, _chai, _sinon, _internalSession, _ephemeral, _base) {
  "use strict";

  (0, _mocha.describe)('InternalSession', () => {
    (0, _emberMocha.setupTest)();
    let sinon;
    let session;
    let store;
    let authenticator;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      store = _ephemeral.default.create();
      authenticator = _base.default.create();
      this.owner.register('authenticator:test', authenticator, {
        instantiate: false
      });
      session = _internalSession.default.create({
        store
      });
      Ember.setOwner(session, this.owner);
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.it)('does not allow data to be stored for the key "authenticated"', function () {
      (0, _chai.expect)(() => {
        session.set('authenticated', 'test');
      }).to.throw(Error);
    });

    function itHandlesAuthenticatorEvents(preparation) {
      (0, _mocha.describe)('when the authenticator triggers the "sessionDataUpdated" event', function () {
        (0, _mocha.beforeEach)(function () {
          return preparation.call();
        });
        (0, _mocha.it)('stores the data the event is triggered with in its authenticated section', function (done) {
          authenticator.trigger('sessionDataUpdated', {
            some: 'property'
          });
          Ember.run.next(() => {
            (0, _chai.expect)(session.get('authenticated')).to.eql({
              some: 'property',
              authenticator: 'authenticator:test'
            });
            done();
          });
        });
      });
      (0, _mocha.describe)('when the authenticator triggers the "invalidated" event', function () {
        (0, _mocha.beforeEach)(function () {
          return preparation.call();
        });
        (0, _mocha.it)('is not authenticated', function (done) {
          authenticator.trigger('sessionDataInvalidated');
          Ember.run.next(() => {
            (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
            done();
          });
        });
        (0, _mocha.it)('clears its authenticated section', function (done) {
          session.set('content', {
            some: 'property',
            authenticated: {
              some: 'other property'
            }
          });
          authenticator.trigger('sessionDataInvalidated');
          Ember.run.next(() => {
            (0, _chai.expect)(session.get('content')).to.eql({
              some: 'property',
              authenticated: {}
            });
            done();
          });
        });
        (0, _mocha.it)('updates the store', function (done) {
          authenticator.trigger('sessionDataInvalidated');
          Ember.run.next(async () => {
            let properties = await store.restore();
            (0, _chai.expect)(properties.authenticated).to.eql({});
            done();
          });
        });
        (0, _mocha.it)('triggers the "invalidationSucceeded" event', function (done) {
          let triggered = false;
          session.one('invalidationSucceeded', () => {
            triggered = true;
          });
          authenticator.trigger('sessionDataInvalidated');
          Ember.run.next(() => {
            (0, _chai.expect)(triggered).to.be.true;
            done();
          });
        });
      });
    }

    (0, _mocha.describe)('restore', function () {
      function itDoesNotRestore() {
        (0, _mocha.it)('returns a rejecting promise', async function () {
          try {
            await session.restore();
            (0, _chai.expect)(false).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(true).to.be.true;
          }
        });
        (0, _mocha.it)('is not authenticated', async function () {
          try {
            await session.restore();
          } catch (_error) {
            (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
          }
        });
        (0, _mocha.it)('clears its authenticated section', async function () {
          store.persist({
            some: 'property',
            authenticated: {
              some: 'other property'
            }
          });

          try {
            await session.restore();
          } catch (_error) {
            (0, _chai.expect)(session.get('content')).to.eql({
              some: 'property',
              authenticated: {}
            });
          }
        });
      }

      (0, _mocha.describe)('when the restored data contains an authenticator factory', function () {
        (0, _mocha.beforeEach)(function () {
          store.persist({
            authenticated: {
              authenticator: 'authenticator:test'
            }
          });
        });
        (0, _mocha.describe)('when the authenticator resolves restoration', function () {
          (0, _mocha.beforeEach)(function () {
            sinon.stub(authenticator, 'restore').returns(Ember.RSVP.resolve({
              some: 'property'
            }));
          });
          (0, _mocha.it)('returns a resolving promise', async function () {
            try {
              await session.restore();
              (0, _chai.expect)(true).to.be.true;
            } catch (_error) {
              (0, _chai.expect)(false).to.be.true;
            }
          });
          (0, _mocha.it)('is authenticated', async function () {
            await session.restore();
            (0, _chai.expect)(session.get('isAuthenticated')).to.be.true;
          });
          (0, _mocha.it)('stores the data the authenticator resolves with in its authenticated section', async function () {
            await store.persist({
              authenticated: {
                authenticator: 'authenticator:test'
              }
            });
            await session.restore();
            let properties = await store.restore();
            delete properties.authenticator;
            (0, _chai.expect)(session.get('authenticated')).to.eql({
              some: 'property',
              authenticator: 'authenticator:test'
            });
          });
          (0, _mocha.it)('persists its content in the store', async function () {
            await store.persist({
              authenticated: {
                authenticator: 'authenticator:test'
              },
              someOther: 'property'
            });
            await session.restore();
            let properties = await store.restore();
            delete properties.authenticator;
            (0, _chai.expect)(properties).to.eql({
              authenticated: {
                some: 'property',
                authenticator: 'authenticator:test'
              },
              someOther: 'property'
            });
          });
          (0, _mocha.it)('persists the authenticator factory in the store', async function () {
            await session.restore();
            let properties = await store.restore();
            (0, _chai.expect)(properties.authenticated.authenticator).to.eql('authenticator:test');
          });
          (0, _mocha.it)('does not trigger the "authenticationSucceeded" event', async function () {
            let triggered = false;
            session.one('authenticationSucceeded', () => triggered = true);
            await session.restore();
            (0, _chai.expect)(triggered).to.be.false;
          });
          itHandlesAuthenticatorEvents(async () => {
            await session.restore();
          });
        });
        (0, _mocha.describe)('when the authenticator rejects restoration', function () {
          (0, _mocha.beforeEach)(function () {
            sinon.stub(authenticator, 'restore').returns(Ember.RSVP.reject());
          });
          itDoesNotRestore();
        });
      });
      (0, _mocha.describe)('when the restored data does not contain an authenticator factory', function () {
        itDoesNotRestore();
      });
      (0, _mocha.describe)('when the store rejects restoration', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(store, 'restore').returns(Ember.RSVP.Promise.reject());
        });
        (0, _mocha.it)('is not authenticated', async function () {
          await session.restore();
          (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
        });
      });
      (0, _mocha.describe)('when the store rejects persistance', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(store, 'persist').returns(Ember.RSVP.reject());
        });
        (0, _mocha.it)('is not authenticated', async function () {
          await session.restore();
          (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
        });
      });
    });
    (0, _mocha.describe)('authentication', function () {
      (0, _mocha.describe)('when the authenticator resolves authentication', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.resolve({
            some: 'property'
          }));
        });
        (0, _mocha.it)('is authenticated', async function () {
          await session.authenticate('authenticator:test');
          (0, _chai.expect)(session.get('isAuthenticated')).to.be.true;
        });
        (0, _mocha.it)('returns a resolving promise', async function () {
          try {
            await session.authenticate('authenticator:test');
            (0, _chai.expect)(true).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(false).to.be.true;
          }
        });
        (0, _mocha.it)('stores the data the authenticator resolves with in its authenticated section', async function () {
          await session.authenticate('authenticator:test');
          (0, _chai.expect)(session.get('authenticated')).to.eql({
            some: 'property',
            authenticator: 'authenticator:test'
          });
        });
        (0, _mocha.it)('persists its content in the store', async function () {
          await session.authenticate('authenticator:test');
          let properties = await store.restore();
          delete properties.authenticator;
          (0, _chai.expect)(properties).to.eql({
            authenticated: {
              some: 'property',
              authenticator: 'authenticator:test'
            }
          });
        });
        (0, _mocha.it)('persists the authenticator factory in the store', async function () {
          await session.authenticate('authenticator:test');
          let properties = await store.restore();
          (0, _chai.expect)(properties.authenticated.authenticator).to.eql('authenticator:test');
        });
        (0, _mocha.it)('triggers the "authenticationSucceeded" event', async function () {
          let triggered = false;
          session.one('authenticationSucceeded', () => triggered = true);
          await session.authenticate('authenticator:test');
          (0, _chai.expect)(triggered).to.be.true;
        });
        itHandlesAuthenticatorEvents(async () => {
          await session.authenticate('authenticator:test');
        });
      });
      (0, _mocha.describe)('when the authenticator rejects authentication', function () {
        (0, _mocha.it)('is not authenticated', async function () {
          sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));

          try {
            await session.authenticate('authenticator:test');
          } catch (_error) {
            (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
          }
        });
        (0, _mocha.it)('returns a rejecting promise', async function () {
          sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));

          try {
            await session.authenticate('authenticator:test');
            (0, _chai.expect)(false).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(true).to.be.true;
          }
        });
        (0, _mocha.it)('clears its authenticated section', async function () {
          sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));
          session.set('content', {
            some: 'property',
            authenticated: {
              some: 'other property'
            }
          });

          try {
            await session.authenticate('authenticator:test');
          } catch (_error) {
            (0, _chai.expect)(session.get('content')).to.eql({
              some: 'property',
              authenticated: {}
            });
          }
        });
        (0, _mocha.it)('updates the store', async function () {
          sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));
          session.set('content', {
            some: 'property',
            authenticated: {
              some: 'other property'
            }
          });

          try {
            await session.authenticate('authenticator:test');
          } catch (_error) {
            let properties = await store.restore();
            (0, _chai.expect)(properties).to.eql({
              some: 'property',
              authenticated: {}
            });
          }
        });
        (0, _mocha.it)('does not trigger the "authenticationSucceeded" event', async function () {
          let triggered = false;
          sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));
          session.one('authenticationSucceeded', () => triggered = true);

          try {
            await session.authenticate('authenticator:test');
          } catch (_error) {
            (0, _chai.expect)(triggered).to.be.false;
          }
        });
      });
      (0, _mocha.describe)('when the store rejects persistance', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(store, 'persist').returns(Ember.RSVP.reject());
        });
        (0, _mocha.it)('is not authenticated', async function () {
          await session.authenticate('authenticator:test');
          (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
        });
      });
    });
    (0, _mocha.describe)('invalidation', function () {
      (0, _mocha.beforeEach)(async function () {
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.resolve({
          some: 'property'
        }));
        await session.authenticate('authenticator:test');
      });
      (0, _mocha.describe)('when invalidate gets called with additional params', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.spy(authenticator, 'invalidate');
        });
        (0, _mocha.it)('passes the params on to the authenticators invalidate method', function () {
          let param = {
            some: 'random data'
          };
          session.invalidate(param);
          (0, _chai.expect)(authenticator.invalidate).to.have.been.calledWith(session.get('authenticated'), param);
        });
      });
      (0, _mocha.describe)('when the authenticator resolves invalidation', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.resolve());
        });
        (0, _mocha.it)('is not authenticated', async function () {
          await session.invalidate();
          (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
        });
        (0, _mocha.it)('returns a resolving promise', async function () {
          try {
            await session.invalidate();
            (0, _chai.expect)(true).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(false).to.be.true;
          }
        });
        (0, _mocha.it)('clears its authenticated section', async function () {
          session.set('content', {
            some: 'property',
            authenticated: {
              some: 'other property'
            }
          });
          await session.invalidate();
          (0, _chai.expect)(session.get('content')).to.eql({
            some: 'property',
            authenticated: {}
          });
        });
        (0, _mocha.it)('updates the store', async function () {
          session.set('content', {
            some: 'property',
            authenticated: {
              some: 'other property'
            }
          });
          await session.invalidate();
          let properties = await store.restore();
          (0, _chai.expect)(properties).to.eql({
            some: 'property',
            authenticated: {}
          });
        });
        (0, _mocha.it)('triggers the "invalidationSucceeded" event', async function () {
          let triggered = false;
          session.one('invalidationSucceeded', () => triggered = true);
          await session.invalidate();
          (0, _chai.expect)(triggered).to.be.true;
        });
      });
      (0, _mocha.describe)('when the authenticator rejects invalidation', function () {
        (0, _mocha.it)('stays authenticated', async function () {
          sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

          try {
            await session.invalidate();
          } catch (_error) {
            (0, _chai.expect)(session.get('isAuthenticated')).to.be.true;
          }
        });
        (0, _mocha.it)('returns a rejecting promise', async function () {
          sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

          try {
            await session.invalidate();
            (0, _chai.expect)(false).to.be.true;
          } catch (_error) {
            (0, _chai.expect)(true).to.be.true;
          }
        });
        (0, _mocha.it)('keeps its content', async function () {
          sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

          try {
            await session.invalidate();
          } catch (_error) {
            (0, _chai.expect)(session.get('authenticated')).to.eql({
              some: 'property',
              authenticator: 'authenticator:test'
            });
          }
        });
        (0, _mocha.it)('does not update the store', async function () {
          sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

          try {
            await session.invalidate();
          } catch (_error) {
            let properties = await store.restore();
            (0, _chai.expect)(properties).to.eql({
              authenticated: {
                some: 'property',
                authenticator: 'authenticator:test'
              }
            });
          }
        });
        (0, _mocha.it)('does not trigger the "invalidationSucceeded" event', async function () {
          sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));
          let triggered = false;
          session.one('invalidationSucceeded', () => triggered = true);

          try {
            await session.invalidate();
          } catch (_error) {
            (0, _chai.expect)(triggered).to.be.false;
          }
        });
        itHandlesAuthenticatorEvents(function () {});
      });
      (0, _mocha.describe)('when the store rejects persistance', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(store, 'persist').returns(Ember.RSVP.reject());
        });
        (0, _mocha.it)('rejects but is not authenticated', async function () {
          try {
            await session.invalidate();
          } catch (_error) {
            (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
          }
        });
      });
    });
    (0, _mocha.describe)("when the session's content changes", function () {
      (0, _mocha.describe)('when a single property is set', function () {
        (0, _mocha.describe)('when the property is private (starts with an "_")', function () {
          (0, _mocha.beforeEach)(function () {
            session.set('_some', 'property');
          });
          (0, _mocha.it)('does not persist its content in the store', async function () {
            let properties = await store.restore();
            delete properties.authenticator;
            (0, _chai.expect)(properties).to.eql({});
          });
        });
        (0, _mocha.describe)('when the property is not private (does not start with an "_")', function () {
          (0, _mocha.beforeEach)(function () {
            session.set('some', 'property');
          });
          (0, _mocha.it)('persists its content in the store', async function () {
            let properties = await store.restore();
            delete properties.authenticator;
            (0, _chai.expect)(properties).to.eql({
              some: 'property',
              authenticated: {}
            });
          });
        });
      });
      (0, _mocha.describe)('when multiple properties are set at once', function () {
        (0, _mocha.beforeEach)(function () {
          session.set('some', 'property');
          session.setProperties({
            another: 'property',
            multiple: 'properties'
          });
        });
        (0, _mocha.it)('persists its content in the store', async function () {
          let properties = await store.restore();
          delete properties.authenticator;
          (0, _chai.expect)(properties).to.eql({
            some: 'property',
            another: 'property',
            multiple: 'properties',
            authenticated: {}
          });
        });
      });
    });
    (0, _mocha.describe)('when the store triggers the "sessionDataUpdated" event', function () {
      (0, _mocha.describe)('when the session is currently busy', function () {
        (0, _mocha.beforeEach)(function () {
          sinon.stub(store, 'restore').returns(new Ember.RSVP.Promise(resolve => {
            Ember.run.next(() => resolve({
              some: 'other property'
            }));
          }));
        });
        (0, _mocha.it)('does not process the event', async function () {
          sinon.spy(authenticator, 'restore');
          let restoration = session.restore();
          store.trigger('sessionDataUpdated', {
            some: 'other property',
            authenticated: {
              authenticator: 'authenticator:test'
            }
          });
          await restoration;
          (0, _chai.expect)(authenticator.restore).to.not.have.been.called;
        });
      });
      (0, _mocha.describe)('when the session is not currently busy', function () {
        (0, _mocha.describe)('when there is an authenticator factory in the event data', function () {
          (0, _mocha.describe)('when the authenticator resolves restoration', function () {
            (0, _mocha.beforeEach)(function () {
              sinon.stub(authenticator, 'restore').returns(Ember.RSVP.resolve({
                some: 'other property'
              }));
            });
            (0, _mocha.it)('is authenticated', function (done) {
              store.trigger('sessionDataUpdated', {
                some: 'other property',
                authenticated: {
                  authenticator: 'authenticator:test'
                }
              });
              Ember.run.next(() => {
                (0, _chai.expect)(session.get('isAuthenticated')).to.be.true;
                done();
              });
            });
            (0, _mocha.it)('stores the data the authenticator resolves with in its authenticated section', function (done) {
              store.trigger('sessionDataUpdated', {
                some: 'property',
                authenticated: {
                  authenticator: 'authenticator:test'
                }
              });
              Ember.run.next(() => {
                (0, _chai.expect)(session.get('authenticated')).to.eql({
                  some: 'other property',
                  authenticator: 'authenticator:test'
                });
                done();
              });
            });
            (0, _mocha.it)('persists its content in the store', function (done) {
              store.trigger('sessionDataUpdated', {
                some: 'property',
                authenticated: {
                  authenticator: 'authenticator:test'
                }
              });
              Ember.run.next(async () => {
                let properties = await store.restore();
                (0, _chai.expect)(properties).to.eql({
                  some: 'property',
                  authenticated: {
                    some: 'other property',
                    authenticator: 'authenticator:test'
                  }
                });
                done();
              });
            });
            (0, _mocha.describe)('when the session is already authenticated', function () {
              (0, _mocha.beforeEach)(function () {
                session.set('isAuthenticated', true);
              });
              (0, _mocha.it)('does not trigger the "authenticationSucceeded" event', function (done) {
                let triggered = false;
                session.one('authenticationSucceeded', () => triggered = true);
                store.trigger('sessionDataUpdated', {
                  some: 'other property',
                  authenticated: {
                    authenticator: 'authenticator:test'
                  }
                });
                Ember.run.next(() => {
                  (0, _chai.expect)(triggered).to.be.false;
                  done();
                });
              });
            });
            (0, _mocha.describe)('when the session is not already authenticated', function () {
              (0, _mocha.beforeEach)(function () {
                session.set('isAuthenticated', false);
              });
              (0, _mocha.it)('triggers the "authenticationSucceeded" event', function (done) {
                let triggered = false;
                session.one('authenticationSucceeded', () => triggered = true);
                store.trigger('sessionDataUpdated', {
                  some: 'other property',
                  authenticated: {
                    authenticator: 'authenticator:test'
                  }
                });
                Ember.run.next(() => {
                  (0, _chai.expect)(triggered).to.be.true;
                  done();
                });
              });
            });
          });
          (0, _mocha.describe)('when the authenticator rejects restoration', function () {
            (0, _mocha.beforeEach)(function () {
              sinon.stub(authenticator, 'restore').returns(Ember.RSVP.reject());
            });
            (0, _mocha.it)('is not authenticated', function (done) {
              store.trigger('sessionDataUpdated', {
                some: 'other property',
                authenticated: {
                  authenticator: 'authenticator:test'
                }
              });
              Ember.run.next(() => {
                (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
                done();
              });
            });
            (0, _mocha.it)('clears its authenticated section', function (done) {
              session.set('content', {
                some: 'property',
                authenticated: {
                  some: 'other property'
                }
              });
              store.trigger('sessionDataUpdated', {
                some: 'other property',
                authenticated: {
                  authenticator: 'authenticator:test'
                }
              });
              Ember.run.next(() => {
                (0, _chai.expect)(session.get('content')).to.eql({
                  some: 'other property',
                  authenticated: {}
                });
                done();
              });
            });
            (0, _mocha.it)('updates the store', function (done) {
              session.set('content', {
                some: 'property',
                authenticated: {
                  some: 'other property'
                }
              });
              store.trigger('sessionDataUpdated', {
                some: 'other property',
                authenticated: {
                  authenticator: 'authenticator:test'
                }
              });
              Ember.run.next(async () => {
                let properties = await store.restore();
                (0, _chai.expect)(properties).to.eql({
                  some: 'other property',
                  authenticated: {}
                });
                done();
              });
            });
            (0, _mocha.describe)('when the session is authenticated', function () {
              (0, _mocha.beforeEach)(function () {
                session.set('isAuthenticated', true);
              });
              (0, _mocha.it)('triggers the "invalidationSucceeded" event', function (done) {
                let triggered = false;
                session.one('invalidationSucceeded', () => triggered = true);
                store.trigger('sessionDataUpdated', {
                  some: 'other property',
                  authenticated: {
                    authenticator: 'authenticator:test'
                  }
                });
                Ember.run.next(() => {
                  (0, _chai.expect)(triggered).to.be.true;
                  done();
                });
              });
            });
            (0, _mocha.describe)('when the session is not authenticated', function () {
              (0, _mocha.beforeEach)(function () {
                session.set('isAuthenticated', false);
              });
              (0, _mocha.it)('does not trigger the "invalidationSucceeded" event', function (done) {
                let triggered = false;
                session.one('invalidationSucceeded', () => triggered = true);
                store.trigger('sessionDataUpdated', {
                  some: 'other property',
                  authenticated: {
                    authenticator: 'authenticator:test'
                  }
                });
                Ember.run.next(() => {
                  (0, _chai.expect)(triggered).to.be.false;
                  done();
                });
              });
            });
          });
        });
        (0, _mocha.describe)('when there is no authenticator factory in the store', function () {
          (0, _mocha.it)('is not authenticated', function (done) {
            store.trigger('sessionDataUpdated', {
              some: 'other property'
            });
            Ember.run.next(() => {
              (0, _chai.expect)(session.get('isAuthenticated')).to.be.false;
              done();
            });
          });
          (0, _mocha.it)('clears its authenticated section', function (done) {
            session.set('content', {
              some: 'property',
              authenticated: {
                some: 'other property'
              }
            });
            store.trigger('sessionDataUpdated', {
              some: 'other property'
            });
            Ember.run.next(() => {
              (0, _chai.expect)(session.get('content')).to.eql({
                some: 'other property',
                authenticated: {}
              });
              done();
            });
          });
          (0, _mocha.it)('updates the store', function (done) {
            session.set('content', {
              some: 'property',
              authenticated: {
                some: 'other property'
              }
            });
            store.trigger('sessionDataUpdated', {
              some: 'other property'
            });
            Ember.run.next(async () => {
              let properties = await store.restore();
              (0, _chai.expect)(properties).to.eql({
                some: 'other property',
                authenticated: {}
              });
              done();
            });
          });
          (0, _mocha.describe)('when the session is authenticated', function () {
            (0, _mocha.beforeEach)(function () {
              session.set('isAuthenticated', true);
            });
            (0, _mocha.it)('triggers the "invalidationSucceeded" event', function (done) {
              let triggered = false;
              session.one('invalidationSucceeded', () => triggered = true);
              store.trigger('sessionDataUpdated', {
                some: 'other property'
              });
              Ember.run.next(() => {
                (0, _chai.expect)(triggered).to.be.true;
                done();
              });
            });
          });
          (0, _mocha.describe)('when the session is not authenticated', function () {
            (0, _mocha.beforeEach)(function () {
              session.set('isAuthenticated', false);
            });
            (0, _mocha.it)('does not trigger the "invalidationSucceeded" event', function (done) {
              let triggered = false;
              session.one('invalidationSucceeded', () => triggered = true);
              store.trigger('sessionDataUpdated', {
                some: 'other property'
              });
              Ember.run.next(() => {
                (0, _chai.expect)(triggered).to.be.false;
                done();
              });
            });
            (0, _mocha.it)('it does not trigger the "sessionInvalidationFailed" event', async function () {
              let triggered = false;
              session.one('sessionInvalidationFailed', () => triggered = true);
              await session.invalidate();
              (0, _chai.expect)(triggered).to.be.false;
            });
            (0, _mocha.it)('it returns with a resolved Promise', async function () {
              try {
                await session.invalidate();
                (0, _chai.expect)(true).to.be.true;
              } catch (_error) {
                (0, _chai.expect)(false).to.be.true;
              }
            });
          });
        });
      });
    });
    (0, _mocha.it)('does not share the content object between multiple instances', function () {
      let session2 = _internalSession.default.create({
        store
      });

      Ember.setOwner(session2, this.owner);
      (0, _chai.expect)(session2.get('content')).to.not.equal(session.get('content'));
    });
  });
});
define("test-app/tests/unit/mixins/application-route-mixin-test", ["mocha", "ember-mocha", "chai", "sinon", "ember-simple-auth/internal-session", "ember-simple-auth/session-stores/ephemeral"], function (_mocha, _emberMocha, _chai, _sinon, _internalSession, _ephemeral) {
  "use strict";

  (0, _mocha.describe)('ApplicationRouteMixin', () => {
    (0, _emberMocha.setupTest)();
    let sinon;
    let session;
    let sessionService;
    let route;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      session = _internalSession.default.create({
        store: _ephemeral.default.create()
      });
      sessionService = this.owner.lookup('service:session');
      sessionService.set('session', session);
      this.owner.register('service:cookies', Ember.Service.extend({
        read: sinon.stub(),
        clear: sinon.stub()
      }));
      route = this.owner.lookup('route:application');
      sinon.stub(route, 'transitionTo');
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.describe)('mapping of service events to route methods', function () {
      (0, _mocha.beforeEach)(function () {
        sinon.spy(route, 'sessionAuthenticated');
        sinon.spy(route, 'sessionInvalidated');
        sinon.stub(route, '_refresh');
      });
      afterEach(function () {
        sinon.restore();
      });
      (0, _mocha.it)("maps the services's 'authenticationSucceeded' event into a method call", function (done) {
        sessionService.trigger('authenticationSucceeded');
        Ember.run.next(() => {
          (0, _chai.expect)(route.sessionAuthenticated).to.have.been.calledOnce;
          done();
        });
      });
      (0, _mocha.it)("maps the services's 'invalidationSucceeded' event into a method call", function (done) {
        sessionService.trigger('invalidationSucceeded');
        Ember.run.next(() => {
          (0, _chai.expect)(route.sessionInvalidated).to.have.been.calledOnce;
          done();
        });
      });
      (0, _mocha.it)('does not attach the event listeners twice', function (done) {
        route.beforeModel();
        sessionService.trigger('authenticationSucceeded');
        Ember.run.next(() => {
          (0, _chai.expect)(route.sessionAuthenticated).to.have.been.calledOnce;
          done();
        });
      });
    });
    (0, _mocha.describe)('sessionAuthenticated', function () {
      (0, _mocha.describe)('when an attempted transition is stored in the session', function () {
        let attemptedTransition;
        (0, _mocha.beforeEach)(function () {
          attemptedTransition = {
            retry: sinon.stub()
          };
          session.set('attemptedTransition', attemptedTransition);
        });
        (0, _mocha.it)('retries that transition', function () {
          route.sessionAuthenticated();
          (0, _chai.expect)(attemptedTransition.retry).to.have.been.calledOnce;
        });
        (0, _mocha.it)('removes it from the session', function () {
          route.sessionAuthenticated();
          (0, _chai.expect)(session.get('attemptedTransition')).to.be.null;
        });
      });
      (0, _mocha.describe)('when a redirect target is stored in a cookie', function () {
        let cookieName = 'ember_simple_auth-redirectTarget';
        let targetUrl = 'transition/target/url';
        let clearStub;
        (0, _mocha.beforeEach)(function () {
          clearStub = sinon.stub();
          this.owner.register('service:cookies', Ember.Service.extend({
            read() {
              return targetUrl;
            },

            clear: clearStub
          }));
        });
        (0, _mocha.it)('transitions to the url', function () {
          route.sessionAuthenticated();
          (0, _chai.expect)(route.transitionTo).to.have.been.calledWith(targetUrl);
        });
        (0, _mocha.it)('clears the cookie', function () {
          route.sessionAuthenticated();
          (0, _chai.expect)(clearStub).to.have.been.calledWith(cookieName);
        });
      });
      (0, _mocha.describe)('when no attempted transition is stored in the session', function () {
        (0, _mocha.it)('transitions to "index" by default', function () {
          route.sessionAuthenticated();
          (0, _chai.expect)(route.transitionTo).to.have.been.calledWith('index');
        });
        (0, _mocha.it)('transitions to "routeAfterAuthentication"', function () {
          let routeAfterAuthentication = 'path/to/route';
          route.set('routeAfterAuthentication', routeAfterAuthentication);
          route.sessionAuthenticated();
          (0, _chai.expect)(route.transitionTo).to.have.been.calledWith(routeAfterAuthentication);
        });
      });
    });
  });
});
define("test-app/tests/unit/mixins/authenticated-route-mixin-test", ["mocha", "ember-mocha", "chai", "sinon", "ember-simple-auth/mixins/authenticated-route-mixin"], function (_mocha, _emberMocha, _chai, _sinon, _authenticatedRouteMixin) {
  "use strict";

  (0, _mocha.describe)('AuthenticatedRouteMixin', () => {
    (0, _emberMocha.setupTest)();
    let sinon;
    let route;
    let router;
    let transition;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.describe)('#beforeModel', function () {
      (0, _mocha.beforeEach)(function () {
        const MixinImplementingBeforeModel = Ember.Mixin.create({
          beforeModel() {
            return Ember.RSVP.resolve('upstreamReturnValue');
          }

        });
        transition = {
          intent: {
            url: '/transition/target/url'
          },

          send() {}

        };
        this.owner.register('service:router', Ember.Service.extend({
          transitionTo() {}

        }));
        router = this.owner.lookup('service:router');
        this.owner.register('service:session', Ember.Service.extend());
        route = Ember.Route.extend(MixinImplementingBeforeModel, _authenticatedRouteMixin.default).create();
        Ember.setOwner(route, this.owner);
        sinon.spy(transition, 'send');
        sinon.spy(router, 'transitionTo');
      });
      (0, _mocha.describe)('if the session is authenticated', function () {
        (0, _mocha.beforeEach)(function () {
          let session = this.owner.lookup('service:session');
          session.set('isAuthenticated', true);
        });
        (0, _mocha.it)('returns the upstream promise', async function () {
          let result = await route.beforeModel(transition);
          (0, _chai.expect)(result).to.equal('upstreamReturnValue');
        });
        (0, _mocha.it)('does not transition to the authentication route', function () {
          route.beforeModel(transition);
          (0, _chai.expect)(router.transitionTo).to.not.have.been.calledWith('login');
        });
      });
      (0, _mocha.describe)('if the session is not authenticated', function () {
        (0, _mocha.it)('does not return the upstream promise', function () {
          (0, _chai.expect)(route.beforeModel(transition)).to.be.undefined;
        });
        (0, _mocha.it)('transitions to "login" as the default authentication route', function () {
          route.beforeModel(transition);
          (0, _chai.expect)(router.transitionTo).to.have.been.calledWith('login');
        });
        (0, _mocha.it)('transitions to the set authentication route', function () {
          let authenticationRoute = 'path/to/route';
          route.set('authenticationRoute', authenticationRoute);
          route.beforeModel(transition);
          (0, _chai.expect)(router.transitionTo).to.have.been.calledWith(authenticationRoute);
        });
        (0, _mocha.it)('sets the redirectTarget cookie in fastboot', function () {
          this.owner.register('service:fastboot', Ember.Service.extend({
            isFastBoot: true,

            init() {
              this._super(...arguments);

              this.request = {
                protocol: 'https'
              };
            }

          }));
          let writeCookieStub = sinon.stub();
          this.owner.register('service:cookies', Ember.Service.extend({
            write: writeCookieStub
          }));
          let cookieName = 'ember_simple_auth-redirectTarget';
          route.beforeModel(transition);
          (0, _chai.expect)(writeCookieStub).to.have.been.calledWith(cookieName, transition.intent.url, {
            path: '/',
            secure: true
          });
        });
      });
    });
  });
});
define("test-app/tests/unit/mixins/data-adapter-mixin-test", ["mocha", "chai", "sinon", "ember-simple-auth/mixins/data-adapter-mixin"], function (_mocha, _chai, _sinon, _dataAdapterMixin) {
  "use strict";

  (0, _mocha.describe)('DataAdapterMixin', () => {
    let sinon;
    let adapter;
    let sessionService;
    let Adapter;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      sessionService = Ember.Object.create({
        authorize() {},

        invalidate() {}

      });
      const BaseAdapter = Ember.Object.extend({
        handleResponse() {
          return '_super return value';
        }

      });
      Adapter = BaseAdapter.extend(_dataAdapterMixin.default, {});
      adapter = Adapter.create({
        session: sessionService
      });
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.describe)('#handleResponse', function () {
      (0, _mocha.beforeEach)(function () {
        sinon.spy(sessionService, 'invalidate');
      });
      (0, _mocha.describe)('when the response status is 401', function () {
        (0, _mocha.describe)('when the session is authenticated', function () {
          (0, _mocha.beforeEach)(function () {
            sessionService.set('isAuthenticated', true);
          });
          (0, _mocha.it)('invalidates the session', function () {
            adapter.handleResponse(401);
            (0, _chai.expect)(sessionService.invalidate).to.have.been.calledOnce;
          });
        });
        (0, _mocha.describe)('when the session is not authenticated', function () {
          (0, _mocha.beforeEach)(function () {
            sessionService.set('isAuthenticated', false);
          });
          (0, _mocha.it)('does not invalidate the session', function () {
            adapter.handleResponse(401);
            (0, _chai.expect)(sessionService.invalidate).to.not.have.been.called;
          });
        });
      });
      (0, _mocha.describe)('when the response status is not 401', function () {
        (0, _mocha.it)('does not invalidate the session', function () {
          adapter.handleResponse(200);
          (0, _chai.expect)(sessionService.invalidate).to.not.have.been.called;
        });
      });
      (0, _mocha.describe)('when called via _super, and ensureResponseAuthorized is overridden', function () {
        let returnValue;
        (0, _mocha.beforeEach)(function () {
          const DoesntInvalidateOn401 = Adapter.extend({
            ensureResponseAuthorized() {// no op, doesn't call this.get('session').invalidate();
            },

            handleResponse() {
              return this._super();
            }

          });
          adapter = DoesntInvalidateOn401.create();
          returnValue = adapter.handleResponse(401);
        });
        (0, _mocha.it)("doesn't invalidate the session (ensureResponseAuthorized can be overridden)", function () {
          (0, _chai.expect)(sessionService.invalidate).to.not.have.been.called;
        });
        (0, _mocha.it)("returns _super's return value", function () {
          (0, _chai.expect)(returnValue).to.eq('_super return value');
        });
      });
      (0, _mocha.it)("returns _super's return value", function () {
        (0, _chai.expect)(adapter.handleResponse(401)).to.eq('_super return value');
      });
    });
  });
});
define("test-app/tests/unit/mixins/oauth2-implicit-grant-callback-route-mixin-test", ["ember-mocha", "mocha", "chai", "sinon", "ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin", "ember-simple-auth/utils/location"], function (_emberMocha, _mocha, _chai, _sinon, _oauth2ImplicitGrantCallbackRouteMixin, LocationUtil) {
  "use strict";

  (0, _mocha.describe)('OAuth2ImplicitGrantCallbackRouteMixin', function () {
    (0, _emberMocha.setupTest)();
    let sinon;
    let route;
    let session;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
    });
    (0, _mocha.afterEach)(function () {
      sinon.restore();
    });
    (0, _mocha.describe)('#activate', function () {
      (0, _mocha.beforeEach)(function () {
        session = Ember.Object.extend({
          authenticate(authenticator, hash) {
            if (!Ember.isEmpty(hash.access_token)) {
              return Ember.RSVP.resolve();
            } else {
              return Ember.RSVP.reject('access_denied');
            }
          }

        }).create();
        sinon.spy(session, 'authenticate');
        route = Ember.Route.extend(_oauth2ImplicitGrantCallbackRouteMixin.default, {
          authenticator: 'authenticator:oauth2',
          _isFastBoot: false
        }).create({
          session
        });
        Ember.setOwner(route, this.owner);
        sinon.spy(route, 'transitionTo');
      });
      (0, _emberMocha.it)('correctly passes the auth parameters if authentication succeeds', function (done) {
        // it isn't possible to stub window.location.hash so we stub a wrapper function instead
        sinon.stub(LocationUtil, 'default').returns({
          hash: '#/routepath#access_token=secret-token'
        });
        route.activate();
        setTimeout(() => {
          (0, _chai.expect)(session.authenticate).to.have.been.calledWith('authenticator:oauth2', {
            access_token: 'secret-token'
          });
          done();
        }, 10);
      });
      (0, _emberMocha.it)('saves the error and transition if authentication fails', function (done) {
        route.activate();
        setTimeout(() => {
          (0, _chai.expect)(route.error).to.eq('access_denied');
          (0, _chai.expect)(session.authenticate).to.have.been.calledWith('authenticator:oauth2');
          done();
        }, 10);
      });
    });
  });
});
define("test-app/tests/unit/mixins/unauthenticated-route-mixin-test", ["mocha", "ember-mocha", "chai", "sinon", "ember-simple-auth/mixins/unauthenticated-route-mixin"], function (_mocha, _emberMocha, _chai, _sinon, _unauthenticatedRouteMixin) {
  "use strict";

  (0, _mocha.describe)('UnauthenticatedRouteMixin', () => {
    (0, _emberMocha.setupTest)();
    let sinon;
    let route;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.describe)('#beforeModel', function () {
      (0, _mocha.beforeEach)(function () {
        const MixinImplementingBeforeModel = Ember.Mixin.create({
          beforeModel() {
            return Ember.RSVP.resolve('upstreamReturnValue');
          }

        });
        this.owner.register('service:session', Ember.Service.extend());
        route = Ember.Route.extend(MixinImplementingBeforeModel, _unauthenticatedRouteMixin.default, {
          // pretend this is never FastBoot
          // replace actual transitionTo as the router isn't set up etc.
          transitionTo() {}

        }).create();
        Ember.setOwner(route, this.owner);
        sinon.spy(route, 'transitionTo');
      });
      (0, _mocha.describe)('if the session is authenticated', function () {
        (0, _mocha.beforeEach)(function () {
          let session = this.owner.lookup('service:session');
          session.set('isAuthenticated', true);
        });
        (0, _mocha.it)('transitions to "index" by default', function () {
          route.beforeModel();
          (0, _chai.expect)(route.transitionTo).to.have.been.calledWith('index');
        });
        (0, _mocha.it)('transitions to set routeIfAlreadyAuthenticated', function () {
          let routeIfAlreadyAuthenticated = 'path/to/route';
          route.set('routeIfAlreadyAuthenticated', routeIfAlreadyAuthenticated);
          route.beforeModel();
          (0, _chai.expect)(route.transitionTo).to.have.been.calledWith(routeIfAlreadyAuthenticated);
        });
        (0, _mocha.it)('does not return the upstream promise', function () {
          (0, _chai.expect)(route.beforeModel()).to.be.undefined;
        });
      });
      (0, _mocha.describe)('if the session is not authenticated', function () {
        (0, _mocha.it)('does not call route transitionTo', function () {
          route.beforeModel();
          (0, _chai.expect)(route.transitionTo).to.not.have.been.called;
        });
        (0, _mocha.it)('returns the upstream promise', async function () {
          let result = await route.beforeModel();
          (0, _chai.expect)(result).to.equal('upstreamReturnValue');
        });
      });
    });
  });
});
define("test-app/tests/unit/register-version-test", ["mocha", "chai", "test-app/config/environment"], function (_mocha, _chai, _environment) {
  "use strict";

  const {
    libraries
  } = Ember;
  const expectedVersion = _environment.default.esaVersion;
  (0, _mocha.describe)('register-version', () => {
    (0, _mocha.it)('registers "Ember Simple Auth" as a library', function () {
      (0, _chai.expect)(libraries._getLibraryByName('Ember Simple Auth')).to.deep.equal({
        name: 'Ember Simple Auth',
        version: expectedVersion
      });
    });
  });
});
define("test-app/tests/unit/routes/application-test", ["chai", "mocha", "ember-mocha"], function (_chai, _mocha, _emberMocha) {
  "use strict";

  (0, _mocha.describe)('ApplicationRoute', function () {
    (0, _emberMocha.setupTest)();
    (0, _mocha.it)('is still testable when using the ApplicationRouteMixin', function () {
      const route = this.owner.lookup('route:application');
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
define("test-app/tests/unit/routes/login-test", ["chai", "mocha", "ember-mocha"], function (_chai, _mocha, _emberMocha) {
  "use strict";

  (0, _mocha.describe)('LoginRoute', function () {
    (0, _emberMocha.setupTest)();
    (0, _mocha.it)('is still testable when using the UnauthenticatedRouteMixin', function () {
      const route = this.owner.lookup('route:login');
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
define("test-app/tests/unit/routes/protected-test", ["chai", "mocha", "ember-mocha"], function (_chai, _mocha, _emberMocha) {
  "use strict";

  (0, _mocha.describe)('ProtectedRoute', function () {
    (0, _emberMocha.setupTest)();
    (0, _mocha.it)('is still testable when using the AuthenticatedRouteMixin', function () {
      const route = this.owner.lookup('route:protected');
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
define("test-app/tests/unit/services/session-test", ["mocha", "ember-mocha", "chai", "sinon", "ember-simple-auth/services/session"], function (_mocha, _emberMocha, _chai, _sinon, _session) {
  "use strict";

  (0, _mocha.describe)('SessionService', () => {
    (0, _emberMocha.setupTest)();
    let sinon;
    let sessionService;
    let session;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      session = Ember.ObjectProxy.extend(Ember.Evented, {
        init() {
          this._super(...arguments);

          this.content = {};
        }

      }).create();
      this.owner.register('authorizer:custom', Ember.Object.extend({
        authorize() {}

      }));
      sessionService = _session.default.create({
        session
      });
      Ember.setOwner(sessionService, this.owner);
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.it)('forwards the "authenticationSucceeded" event from the session', function (done) {
      let triggered = false;
      sessionService.one('authenticationSucceeded', () => triggered = true);
      session.trigger('authenticationSucceeded');
      Ember.run.next(() => {
        (0, _chai.expect)(triggered).to.be.true;
        done();
      });
    });
    (0, _mocha.it)('forwards the "invalidationSucceeded" event from the session', function (done) {
      let triggered = false;
      sessionService.one('invalidationSucceeded', () => triggered = true);
      session.trigger('invalidationSucceeded');
      Ember.run.next(() => {
        (0, _chai.expect)(triggered).to.be.true;
        done();
      });
    });
    (0, _mocha.describe)('isAuthenticated', function () {
      (0, _mocha.it)('is read from the session', function () {
        session.set('isAuthenticated', true);
        (0, _chai.expect)(sessionService.get('isAuthenticated')).to.be.true;
      });
      (0, _mocha.it)('is read-only', function () {
        (0, _chai.expect)(() => {
          sessionService.set('isAuthenticated', false);
        }).to.throw;
      });
    });
    (0, _mocha.describe)('store', function () {
      (0, _mocha.it)('is read from the session', function () {
        session.set('store', 'some store');
        (0, _chai.expect)(sessionService.get('store')).to.eq('some store');
      });
      (0, _mocha.it)('is read-only', function () {
        (0, _chai.expect)(() => {
          sessionService.set('store', 'some other store');
        }).to.throw;
      });
    });
    (0, _mocha.describe)('attemptedTransition', function () {
      (0, _mocha.it)('is read from the session', function () {
        session.set('attemptedTransition', 'some transition');
        (0, _chai.expect)(sessionService.get('attemptedTransition')).to.eq('some transition');
      });
      (0, _mocha.it)('is written back to the session', function () {
        sessionService.set('attemptedTransition', 'some other transition');
        (0, _chai.expect)(session.get('attemptedTransition')).to.eq('some other transition');
      });
    });
    (0, _mocha.describe)('data', function () {
      (0, _mocha.it)("is read from the session's content", function () {
        session.set('some', 'data');
        (0, _chai.expect)(sessionService.get('data')).to.eql({
          some: 'data'
        });
      });
      (0, _mocha.it)("is written back to the session's content", function () {
        sessionService.set('data.some', {
          other: 'data'
        });
        (0, _chai.expect)(session.content).to.eql({
          some: {
            other: 'data'
          }
        });
      });
      (0, _mocha.it)('can be set with Ember.set', function () {
        Ember.set(sessionService, 'data.emberSet', 'ember-set-data');
        (0, _chai.expect)(session.content).to.eql({
          emberSet: 'ember-set-data'
        });
      });
      (0, _mocha.it)('is read-only', function () {
        (0, _chai.expect)(() => {
          sessionService.set('data', false);
        }).to.throw;
      });
    });
    (0, _mocha.describe)('authenticate', function () {
      (0, _mocha.beforeEach)(function () {
        session.reopen({
          authenticate() {
            return 'value';
          }

        });
      });
      (0, _mocha.it)('authenticates the session', function () {
        sinon.spy(session, 'authenticate');
        sessionService.authenticate({
          some: 'argument'
        });
        (0, _chai.expect)(session.authenticate).to.have.been.calledWith({
          some: 'argument'
        });
      });
      (0, _mocha.it)("returns the session's authentication return value", function () {
        (0, _chai.expect)(sessionService.authenticate()).to.eq('value');
      });
    });
    (0, _mocha.describe)('invalidate', function () {
      (0, _mocha.beforeEach)(function () {
        session.reopen({
          invalidate() {
            return 'value';
          }

        });
      });
      (0, _mocha.it)('invalidates the session', function () {
        sinon.spy(session, 'invalidate');
        sessionService.invalidate({
          some: 'argument'
        });
        (0, _chai.expect)(session.invalidate).to.have.been.calledWith({
          some: 'argument'
        });
      });
      (0, _mocha.it)("returns the session's invalidation return value", function () {
        (0, _chai.expect)(sessionService.invalidate()).to.eq('value');
      });
    });
  });
});
define("test-app/tests/unit/session-stores/adaptive-test", ["mocha", "chai", "sinon", "ember-simple-auth/session-stores/adaptive", "ember-simple-auth/session-stores/local-storage", "test-app/tests/unit/session-stores/shared/store-behavior", "test-app/tests/unit/session-stores/shared/cookie-store-behavior", "test-app/tests/helpers/fake-cookie-service", "test-app/tests/helpers/create-adaptive-store"], function (_mocha, _chai, _sinon, _adaptive, _localStorage, _storeBehavior, _cookieStoreBehavior, _fakeCookieService, _createAdaptiveStore) {
  "use strict";

  (0, _mocha.describe)('AdaptiveStore', () => {
    let sinon;
    let store;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
    });
    (0, _mocha.afterEach)(function () {
      store.clear();
      sinon.restore();
    });
    (0, _mocha.describe)('when localStorage is available', function () {
      (0, _mocha.beforeEach)(function () {
        store = _adaptive.default.extend({
          _createStore(storeType, options) {
            return _localStorage.default.create({
              _isFastBoot: false
            }, options);
          }

        }).create({
          _isLocalStorageAvailable: true
        });
      });
      (0, _storeBehavior.default)({
        store() {
          return store;
        }

      });
    });
    (0, _mocha.describe)('when localStorage is not available', function () {
      let cookieService;
      (0, _mocha.beforeEach)(function () {
        cookieService = _fakeCookieService.default.create();
        sinon.spy(cookieService, 'read');
        sinon.spy(cookieService, 'write');
        store = (0, _createAdaptiveStore.default)(cookieService, {
          _isLocal: false,
          _cookies: cookieService
        });
      });
      (0, _storeBehavior.default)({
        store() {
          return store;
        }

      });
      (0, _cookieStoreBehavior.default)({
        createStore(cookieService, options = {}) {
          options._isLocalStorageAvailable = false;
          return (0, _createAdaptiveStore.default)(cookieService, options, {
            _cookies: cookieService,
            _fastboot: {
              isFastBoot: false
            }
          });
        },

        renew(store, data) {
          return store.get('_store')._renew(data);
        },

        sync(store) {
          store.get('_store')._syncData();
        },

        spyRewriteCookieMethod(store) {
          sinon.spy(store.get('_store'), 'rewriteCookie');
          return store.get('_store').rewriteCookie;
        }

      });
      (0, _mocha.it)('persists to cookie when cookie attributes change', function () {
        let now = new Date();
        Ember.run(() => {
          store.persist({
            key: 'value'
          });
          store.setProperties({
            cookieName: 'test:session',
            cookieExpirationTime: 60
          });
        });
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('test:session-expiration_time', 60, sinon.match(function ({
          domain,
          expires,
          path,
          secure
        }) {
          return domain === null && path === '/' && secure === false && expires >= new Date(now.getTime() + 60 * 1000);
        }));
      });
    });
  });
});
define("test-app/tests/unit/session-stores/cookie-test", ["mocha", "sinon", "test-app/tests/unit/session-stores/shared/store-behavior", "test-app/tests/unit/session-stores/shared/cookie-store-behavior", "test-app/tests/helpers/fake-cookie-service", "test-app/tests/helpers/create-cookie-store"], function (_mocha, _sinon, _storeBehavior, _cookieStoreBehavior, _fakeCookieService, _createCookieStore) {
  "use strict";

  (0, _mocha.describe)('CookieStore', () => {
    let sinon;
    let store;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      store = (0, _createCookieStore.default)(_fakeCookieService.default.create());
    });
    afterEach(function () {
      sinon.restore();
    });
    (0, _storeBehavior.default)({
      store() {
        return store;
      },

      syncExternalChanges() {
        store._syncData();
      }

    });
    (0, _cookieStoreBehavior.default)({
      createStore(cookiesService, options = {}) {
        return (0, _createCookieStore.default)(cookiesService, options);
      },

      renew(store, data) {
        return store._renew(data);
      },

      sync(store) {
        store._syncData();
      },

      spyRewriteCookieMethod(store) {
        sinon.spy(store, 'rewriteCookie');
        return store.rewriteCookie;
      }

    });
  });
});
define("test-app/tests/unit/session-stores/ephemeral-test", ["mocha", "ember-simple-auth/session-stores/ephemeral", "test-app/tests/unit/session-stores/shared/store-behavior"], function (_mocha, _ephemeral, _storeBehavior) {
  "use strict";

  (0, _mocha.describe)('EphemeralStore', function () {
    (0, _storeBehavior.default)({
      store() {
        return _ephemeral.default.create();
      }

    });
  });
});
define("test-app/tests/unit/session-stores/local-storage-test", ["mocha", "ember-simple-auth/session-stores/local-storage", "test-app/tests/unit/session-stores/shared/store-behavior", "test-app/tests/unit/session-stores/shared/storage-event-handler-behavior"], function (_mocha, _localStorage, _storeBehavior, _storageEventHandlerBehavior) {
  "use strict";

  (0, _mocha.describe)('LocalStorageStore', function () {
    (0, _storeBehavior.default)({
      store() {
        return _localStorage.default.create({
          _isFastBoot: false
        });
      }

    });
    (0, _storageEventHandlerBehavior.default)({
      store() {
        return _localStorage.default.create({
          _isFastBoot: false
        });
      }

    });
  });
});
define("test-app/tests/unit/session-stores/session-storage-test", ["mocha", "ember-simple-auth/session-stores/session-storage", "test-app/tests/unit/session-stores/shared/store-behavior", "test-app/tests/unit/session-stores/shared/storage-event-handler-behavior"], function (_mocha, _sessionStorage, _storeBehavior, _storageEventHandlerBehavior) {
  "use strict";

  (0, _mocha.describe)('SessionStorageStore', function () {
    (0, _storeBehavior.default)({
      store() {
        return _sessionStorage.default.create({
          _isFastBoot: false
        });
      }

    });
    (0, _storageEventHandlerBehavior.default)({
      store() {
        return _sessionStorage.default.create({
          _isFastBoot: false
        });
      }

    });
  });
});
define("test-app/tests/unit/session-stores/shared/cookie-store-behavior", ["exports", "mocha", "chai", "sinon", "test-app/tests/helpers/fake-cookie-service"], function (_exports, _mocha, _chai, _sinon, _fakeCookieService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;
  let warnings;
  Ember.Debug.registerWarnHandler((message, options, next) => {
    // in case a deprecation is issued before a test is started
    if (!warnings) {
      warnings = [];
    }

    warnings.push(message);
    next(message, options);
  });

  function _default(options) {
    let sinon;
    let store;
    let createStore;
    let renew;
    let sync;
    let cookieService;
    let spyRewriteCookieMethod; // eslint-disable-next-line mocha/no-top-level-hooks

    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      createStore = options.createStore;
      renew = options.renew;
      sync = options.sync;
      cookieService = _fakeCookieService.default.create();
      sinon.spy(cookieService, 'read');
      sinon.spy(cookieService, 'write');
      store = createStore(cookieService);
      spyRewriteCookieMethod = options.spyRewriteCookieMethod;
    }); // eslint-disable-next-line mocha/no-top-level-hooks

    (0, _mocha.afterEach)(function () {
      sinon.restore();
      store.clear();
    });
    (0, _mocha.describe)('#persist', function () {
      (0, _mocha.beforeEach)(function () {
        warnings = [];
      });
      (0, _mocha.it)('respects the configured cookieName', function () {
        let store;
        Ember.run(() => {
          store = createStore(cookieService, {
            cookieName: 'test-session'
          });
        });
        store.persist({
          key: 'value'
        });
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('test-session', JSON.stringify({
          key: 'value'
        }), {
          domain: null,
          expires: null,
          path: '/',
          sameSite: null,
          secure: false
        });
      });
      (0, _mocha.it)('respects the configured cookieDomain', function () {
        let store;
        Ember.run(() => {
          store = createStore(cookieService, {
            cookieName: 'session-cookie-domain',
            cookieDomain: 'example.com'
          });
          store.persist({
            key: 'value'
          });
        });
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('session-cookie-domain', JSON.stringify({
          key: 'value'
        }), {
          domain: 'example.com',
          expires: null,
          path: '/',
          sameSite: null,
          secure: false
        });
      });
      (0, _mocha.it)('respects the configured cookiePath', function () {
        let store;
        Ember.run(() => {
          store = createStore(cookieService, {
            cookieName: 'session-cookie-domain',
            cookieDomain: 'example.com',
            cookiePath: '/hello-world'
          });
          store.persist({
            key: 'value'
          });
        });
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('session-cookie-domain', JSON.stringify({
          key: 'value'
        }), {
          domain: 'example.com',
          expires: null,
          path: '/hello-world',
          sameSite: null,
          secure: false
        });
      });
      (0, _mocha.it)('respects the configured sameSite', function () {
        let store;
        Ember.run(() => {
          store = createStore(cookieService, {
            cookieName: 'session-cookie-domain',
            cookieDomain: 'example.com',
            sameSite: 'Strict'
          });
          store.persist({
            key: 'value'
          });
        });
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('session-cookie-domain', JSON.stringify({
          key: 'value'
        }), {
          domain: 'example.com',
          expires: null,
          path: '/',
          sameSite: 'Strict',
          secure: false
        });
      });
      (0, _mocha.it)('sends a warning when `cookieExpirationTime` is less than 90 seconds', function (done) {
        Ember.run(() => {
          createStore(cookieService, {
            cookieName: 'session-cookie-domain',
            cookieDomain: 'example.com',
            cookieExpirationTime: 60
          });
          (0, _chai.expect)(warnings).to.have.length(1);
          (0, _chai.expect)(warnings[0]).to.equal('The recommended minimum value for `cookieExpirationTime` is 90 seconds. If your value is less than that, the cookie may expire before its expiration time is extended (expiration time is extended every 60 seconds).');
          done();
        });
      });
    });
    (0, _mocha.describe)('#renew', function () {
      let now = new Date();
      (0, _mocha.beforeEach)(async function () {
        store = createStore(cookieService, {
          cookieName: 'test-session',
          cookieExpirationTime: 60
        });
        store.persist({
          key: 'value'
        });
        await renew(store);
      });
      (0, _mocha.it)('stores the expiration time in a cookie named "test-session-expiration_time"', function () {
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('test-session-expiration_time', 60, sinon.match(function ({
          domain,
          expires,
          path,
          secure
        }) {
          return domain === null && path === '/' && secure === false && expires >= new Date(now.getTime() + 60 * 1000);
        }));
      });
    });
    (0, _mocha.describe)('the "sessionDataUpdated" event', function () {
      let triggered;
      (0, _mocha.beforeEach)(function () {
        triggered = false;
        store.persist({
          key: 'value'
        });
        store.one('sessionDataUpdated', () => {
          triggered = true;
        });
      });
      (0, _mocha.it)('is not triggered when the cookie has not actually changed', function (done) {
        document.cookie = 'ember_simple_auth-session=%7B%22key%22%3A%22value%22%7D;path=/;';
        sync(store);
        Ember.run.next(() => {
          (0, _chai.expect)(triggered).to.be.false;
          done();
        });
      });
      (0, _mocha.it)('is triggered when the cookie changed', function (done) {
        const cookiesService = store.get('_cookies') || store.get('_store._cookies');
        cookiesService._content['ember_simple_auth-session'] = '%7B%22key%22%3A%22other%20value%22%7D';
        sync(store);
        Ember.run.next(() => {
          Ember.run.next(() => {
            (0, _chai.expect)(triggered).to.be.true;
            done();
          });
        });
      });
      (0, _mocha.it)('is not triggered when the cookie expiration was renewed', function (done) {
        renew(store, {
          key: 'value'
        });
        sync(store);
        Ember.run.next(() => {
          (0, _chai.expect)(triggered).to.be.false;
          done();
        });
      });
    });
    (0, _mocha.describe)('rewrite behavior', function () {
      let store;
      let cookieSpy;
      let cookieService;
      let now = new Date();
      (0, _mocha.beforeEach)(function () {
        cookieService = _fakeCookieService.default.create();
        store = createStore(cookieService, {
          cookieName: 'session-foo',
          cookieExpirationTime: 1000
        });
        cookieService = store.get('_cookies') || store.get('_store._cookies');
        cookieSpy = spyRewriteCookieMethod(store);
        sinon.spy(cookieService, 'write');
        sinon.spy(cookieService, 'clear');
      });
      (0, _mocha.afterEach)(function () {
        cookieService.write.restore();
        cookieService.clear.restore();
        cookieSpy.restore();
      });
      (0, _mocha.it)('deletes the old cookie and writes a new one when name property changes', function () {
        Ember.run(() => {
          store.persist({
            key: 'value'
          });
          store.set('cookieName', 'session-bar');
        });
        (0, _chai.expect)(cookieService.clear).to.have.been.calledWith('session-foo');
        (0, _chai.expect)(cookieService.clear).to.have.been.calledWith('session-foo-expiration_time');
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('session-bar', JSON.stringify({
          key: 'value'
        }), sinon.match(function ({
          domain,
          expires,
          path,
          secure
        }) {
          return domain === null && path === '/' && secure === false && expires >= new Date(now.getTime() + 1000 * 1000);
        }));
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('session-bar-expiration_time', 1000, sinon.match(function ({
          domain,
          expires,
          path,
          secure
        }) {
          return domain === null && path === '/' && secure === false && expires >= new Date(now.getTime() + 1000 * 1000);
        }));
      });
      (0, _mocha.it)('deletes the old cookie and writes a new one when domain property changes', function () {
        let defaultName = 'ember_simple_auth-session';
        Ember.run(() => {
          store.persist({
            key: 'value'
          });
          store.set('cookieDomain', 'example.com');
        });
        (0, _chai.expect)(cookieService.clear).to.have.been.calledWith(defaultName);
        (0, _chai.expect)(cookieService.clear).to.have.been.calledWith(`${defaultName}-expiration_time`);
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('session-foo', JSON.stringify({
          key: 'value'
        }), sinon.match(function ({
          domain,
          expires,
          path,
          secure
        }) {
          return domain === 'example.com' && path === '/' && secure === false && expires >= new Date(now.getTime() + 1000 * 1000);
        }));
      });
      (0, _mocha.it)('deletes the old cookie and writes a new one when expiration property changes', function () {
        let defaultName = 'ember_simple_auth-session';
        let expirationTime = 180;
        Ember.run(() => {
          store.persist({
            key: 'value'
          });
          store.set('cookieExpirationTime', expirationTime);
        });
        (0, _chai.expect)(cookieService.clear).to.have.been.calledWith(defaultName);
        (0, _chai.expect)(cookieService.clear).to.have.been.calledWith(`${defaultName}-expiration_time`);
        (0, _chai.expect)(cookieService.write).to.have.been.calledWith('session-foo', JSON.stringify({
          key: 'value'
        }), sinon.match(function ({
          domain,
          expires,
          path,
          secure
        }) {
          return domain === null && path === '/' && secure === false && expires >= new Date(now.getTime() + (expirationTime - 10) * 1000);
        }));
      });
      (0, _mocha.it)('clears cached expiration times when setting expiration to null', function () {
        Ember.run(() => {
          store.set('cookieExpirationTime', null);
        });
        (0, _chai.expect)(cookieService.clear).to.have.been.calledWith(`session-foo-expiration_time`);
      });
      (0, _mocha.it)('only rewrites the cookie once per run loop when multiple properties are changed', function (done) {
        Ember.run(() => {
          store.set('cookieName', 'session-bar');
          store.set('cookieExpirationTime', 10000);
        });
        Ember.run.next(() => {
          (0, _chai.expect)(cookieSpy).to.have.been.calledOnce;
          done();
        });
      });
    });
    (0, _mocha.describe)('#init', function () {
      let cookieName = 'ember_simple_auth-session-expiration_time';
      let expirationTime = 60 * 60 * 24;
      (0, _mocha.beforeEach)(function () {
        cookieService.write(cookieName, expirationTime);
        store = createStore(cookieService);
      });
      (0, _mocha.afterEach)(function () {
        cookieService.clear(cookieName);
      });
      (0, _mocha.it)('restores expiration time from cookie', function () {
        (0, _chai.expect)(store.get('cookieExpirationTime')).to.equal(expirationTime);
      });
    });
  }
});
define("test-app/tests/unit/session-stores/shared/storage-event-handler-behavior", ["exports", "mocha", "chai", "sinon"], function (_exports, _mocha, _chai, _sinon) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _default(options) {
    let sinon;
    let store; // eslint-disable-next-line mocha/no-top-level-hooks

    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
      store = options.store();
    }); // eslint-disable-next-line mocha/no-top-level-hooks

    afterEach(function () {
      sinon.restore();
    });
    (0, _mocha.describe)('storage events', function () {
      (0, _mocha.beforeEach)(function () {
        sinon.spy(window, 'addEventListener');
        sinon.spy(window, 'removeEventListener');
      });
      afterEach(function () {
        window.addEventListener.restore();
        window.removeEventListener.restore();
      });
      (0, _mocha.it)('binds to "storage" events on the window when created', function () {
        store = options.store();
        (0, _chai.expect)(window.addEventListener).to.have.been.calledOnce;
      });
      (0, _mocha.it)('triggers the "sessionDataUpdated" event when the data in the browser storage has changed', function () {
        let triggered = false;
        store.on('sessionDataUpdated', () => {
          triggered = true;
        });
        window.dispatchEvent(new StorageEvent('storage', {
          key: store.get('key')
        }));
        (0, _chai.expect)(triggered).to.be.true;
      });
      (0, _mocha.it)('does not trigger the "sessionDataUpdated" event when the data in the browser storage has not changed', function () {
        let triggered = false;
        store.on('sessionDataUpdated', () => {
          triggered = true;
        });
        store.persist({
          key: 'value'
        }); // this data will be read again when the event is handled so that no change will be detected

        window.dispatchEvent(new StorageEvent('storage', {
          key: store.get('key')
        }));
        (0, _chai.expect)(triggered).to.be.false;
      });
      (0, _mocha.it)('does not trigger the "sessionDataUpdated" event when the data in the browser storage has changed for a different key', function () {
        let triggered = false;
        store.on('sessionDataUpdated', () => {
          triggered = true;
        });
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'another key'
        }));
        (0, _chai.expect)(triggered).to.be.false;
      });
      (0, _mocha.it)('unbinds from "storage" events on the window when destroyed', function () {
        Ember.run(() => store.destroy());
        (0, _chai.expect)(window.removeEventListener).to.have.been.calledOnce;
      });
    });
  }
});
define("test-app/tests/unit/session-stores/shared/store-behavior", ["exports", "mocha", "chai"], function (_exports, _mocha, _chai) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _default(options) {
    let syncExternalChanges = options.syncExternalChanges || function () {};

    let store; // eslint-disable-next-line mocha/no-top-level-hooks

    (0, _mocha.beforeEach)(function () {
      store = options.store();
    }); // eslint-disable-next-line mocha/no-top-level-hooks

    afterEach(function () {
      store.clear();
    });
    (0, _mocha.describe)('#persist', function () {
      (0, _mocha.it)('persists an object', async function () {
        await store.persist({
          key: 'value'
        });
        let restoredContent = await store.restore();
        (0, _chai.expect)(restoredContent).to.eql({
          key: 'value'
        });
      });
      (0, _mocha.it)('overrides existing data', async function () {
        await store.persist({
          key1: 'value1'
        });
        await store.persist({
          key2: 'value2'
        });
        let restoredContent = await store.restore();
        (0, _chai.expect)(restoredContent).to.eql({
          key2: 'value2'
        });
      });
      (0, _mocha.it)('does not trigger the "sessionDataUpdated" event', function (done) {
        let triggered = false;
        store.one('sessionDataUpdated', () => triggered = true);
        store.persist({
          key: 'other value'
        });
        syncExternalChanges();
        Ember.run.next(() => {
          (0, _chai.expect)(triggered).to.be.false;
          done();
        });
      });
    });
    (0, _mocha.describe)('#restore', function () {
      (0, _mocha.describe)('when the store is empty', function () {
        (0, _mocha.it)('returns an empty object', async function () {
          await store.clear();
          let restoredContent = await store.restore();
          (0, _chai.expect)(restoredContent).to.eql({});
        });
      });
      (0, _mocha.describe)('when the store has data', function () {
        (0, _mocha.beforeEach)(function () {
          return store.persist({
            key1: 'value1',
            key2: 'value2'
          });
        });
        (0, _mocha.it)('returns all data in the store', async function () {
          let restoredContent = await store.restore();
          (0, _chai.expect)(restoredContent).to.eql({
            key1: 'value1',
            key2: 'value2'
          });
        });
        (0, _mocha.it)('returns a copy of the stored data', async function () {
          let data = await store.restore();
          data.key1 = 'another value!';
          let restoredContent = await store.restore();
          (0, _chai.expect)(restoredContent).to.eql({
            key1: 'value1',
            key2: 'value2'
          });
        });
      });
    });
    (0, _mocha.describe)('#clear', function () {
      (0, _mocha.it)('empties the store', async function () {
        await store.persist({
          key1: 'value1',
          key2: 'value2'
        });
        await store.clear();
        let restoredContent = await store.restore();
        (0, _chai.expect)(restoredContent).to.eql({});
      });
    });
  }
});
define("test-app/tests/unit/utils/location-test", ["chai", "mocha", "ember-simple-auth/utils/location", "sinon"], function (_chai, _mocha, LocationUtil, _sinon) {
  "use strict";

  // eslint-disable-next-line
  const foo = {
    get hash() {
      return LocationUtil.default().hash;
    }

  };
  (0, _mocha.describe)('Unit | Utility | location', function () {
    let sinon;
    (0, _mocha.beforeEach)(function () {
      sinon = _sinon.default.createSandbox();
    });
    (0, _mocha.afterEach)(function () {
      sinon.restore();
    });
    (0, _mocha.it)('works', function () {
      (0, _chai.expect)(LocationUtil.default()).to.be.ok;
      (0, _chai.expect)(LocationUtil.default().hash).to.be.a('string');
    });
  });
});
define("test-app/tests/unit/utils/objects-are-equal-test", ["mocha", "chai", "ember-simple-auth/utils/objects-are-equal"], function (_mocha, _chai, _objectsAreEqual) {
  "use strict";

  (0, _mocha.describe)('objectsAreEqual', () => {
    (0, _mocha.it)('is true for equal objects', function () {
      (0, _chai.expect)((0, _objectsAreEqual.default)({
        a: 'b',
        c: 'd'
      }, {
        a: 'b',
        c: 'd'
      })).to.be.true;
    });
    (0, _mocha.it)('is true for equal objects regardless of property order', function () {
      (0, _chai.expect)((0, _objectsAreEqual.default)({
        a: 'b',
        c: 'd'
      }, {
        c: 'd',
        a: 'b'
      })).to.be.true;
    });
    (0, _mocha.it)('is true for equal nested objects regardless of property order', function () {
      (0, _chai.expect)((0, _objectsAreEqual.default)({
        a: 'b',
        c: 'd',
        e: {
          f: 'g'
        }
      }, {
        e: {
          f: 'g'
        },
        a: 'b',
        c: 'd'
      })).to.be.true;
    });
    (0, _mocha.it)('is true for equal objects that include arrays', function () {
      (0, _chai.expect)((0, _objectsAreEqual.default)({
        a: ['b', 'c']
      }, {
        a: ['b', 'c']
      })).to.be.true;
    });
    (0, _mocha.it)('is false for equal objects that include differently ordered arrays', function () {
      (0, _chai.expect)((0, _objectsAreEqual.default)({
        a: ['b', 'c']
      }, {
        a: ['c', 'b']
      })).to.be.false;
    });
    (0, _mocha.it)('is false for unequal objects', function () {
      (0, _chai.expect)((0, _objectsAreEqual.default)({
        a: 'b'
      }, {
        c: 'd'
      })).to.be.false;
    });
  });
});
define('test-app/config/environment', [], function() {
  if (typeof FastBoot !== 'undefined') {
return FastBoot.config('test-app');
} else {
var prefix = 'test-app';try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

}
});

require('test-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
