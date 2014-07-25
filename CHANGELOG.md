# 0.6.4

* __The new package `ember-simple-auth-testing` was added that contains test
  helpers__ that simplify testing of authenticated routes, e.g.:

  ```js
  test('a protected route is accessible when the session is authenticated', function() {
    expect(1);
    authenticateSession(); // <--
    visit('/protected');

    andThen(function() {
      equal(currentRouteName(), 'protected');
    });
  });
  ```

* __Ember Simple Auth now allows to define a custom session class__ which e.g.
  makes adding custom methods to the session much simpler, e.g.:

  ```js
  App.CustomSession = SimpleAuth.Session.extend({
    account: function() {
      var accountId = this.get('account_id');
      if (!Ember.isEmpty(accountId)) {
        return this.container.lookup('store:main').find('account', accountId);
      }
    }.property('account_id')
  });
  …
  container.register('session:custom', App.CustomSession);
  …
  window.ENV['simple-auth'] = {
    session: 'session:custom',
  }
  ```

* __A race condition was fixed that could have broken synchronization of
  multiple tabs or windows__, see #254. The stores will now only store one
  cookie, one `localStorage` key etc. holding a JSON representation of the
  session's data instead of one cookie, `localStorage` key etc. per property.
  __This change includes 2 breaking changes:__
    * The cookie store's `cookieNamePrefix` property is now just `cookieName`
      as there's only one cookie now.
    * The `localStorage` store's `keyPrefix` property is now just `key` as
      there's only one key now.
* The session will now persist custom content that is assigned manually without
  the authenticator, see #260.
* A bug was fixed that caused session events to trigger multiple action
  invocations when the application was started via a deep link to an
  authenticated route, see #257.
* The AMD distribution does no longer require the `Ember` global but will try
  to require it with `require('ember')` if the global does not exist, see #255.
* The used Ember Simple Auth libraries and their respective will now be logged
  on application startup together with the Ember core libraries, e.g.:

  ```
  [Debug] DEBUG: -------------------------------
  [Debug] DEBUG: Ember                       : 1.6.1
  [Debug] DEBUG: Handlebars                  : 1.0.0
  [Debug] DEBUG: jQuery                      : 1.9.1
  [Debug] DEBUG: Ember Simple Auth           : 0.6.4
  [Debug] DEBUG: Ember Simple Auth OAuth 2.0 : 0.6.4
  [Debug] DEBUG: -------------------------------
  ```
* The `LoginControllerMixin`'s `authenticate` action now returns the promise
  returned by the session so that controllers can use that to handle successful
  authentication or authentication errors, e.g.:

  ```js
  App.LoginController = Ember.Controller.extend(SimpleAuth.LoginControllerMixin, {
    authenticator: 'simple-auth-authenticator:oauth2-password-grant',
    actions: {
      authenticate: function() {
        this._super().then(function() {
          // authentication succeeded
        },
        function(error) {
          // authentication failed
        });
      }
    }
  });
  ```

* Fixed a bug where the OAuth 1.0 authenticator would not try to refresh the
  token on restore in some situations, see #249.

# 0.6.3

* added new extension library
  [Ember Simple Auth Torii](https://github.com/simplabs/ember-simple-auth/tree/master/packages/ember-simple-auth-torii)
* Added support for
  [OAuth 2.0 token revocation](https://tools.ietf.org/html/rfc7009)
  in the Ember Simple Auth OAuth 2.0 extension library, see #228
* The browserified distribution does not export the `setup` function anymore,
  see #235.
* All standard Ember methods that are defined in the mixins will now call
  `this._super`, see #232.

# 0.6.2

* The `crossOriginWhitelist` is now loaded from `window.ENV` correctly, see
  #218.

# 0.6.1

* __[BREAKING] All factory properties that previously had a "Factory" suffix
  have been renamed to not include the suffix anymore__. If you're currently
  setting `storeFactory` or `authorizerFactory` in the configuration be sure to
  change these to `store` and `authorizer`. Also change `authenticatorFactory`
  in the login controller to `authenticator`.
* The file names of the download distribution have been changed to have the
  "ember-" prefix again.

# 0.6.0

* __[BREAKING]__ Ember Simple Auth's `SimpleAuth` object is no longer attached
  to the `Ember` global but is now a global itself (in the browserified
  distribution that exports that global). When you were referring to e.g.
  `Ember.SimpleAuth.ApplicationRouteMixin` you now have to change that to
  just `SimpleAuth.ApplicationRouteMixin`.
* __[BREAKING]__ The "namespace" for all components that Ember Simple Auth
  registers in Ember's container has been changed from 'ember-simple-auth-' to
  just 'simple-auth-'.
* __[BREAKING]__ The names of the distributed files has changed from
  "ember-simple-auth-…" to "simple-auth-…".
* __[BREAKING]__ The requirement for defining an initializer and call
  `SimpleAuth.setup` in that has been dropped. Ember Simple Auth will now
  setup itself once it is loaded. Existing Ember Simple Auth initializers
  should be removed.
* __[BREAKING]__ As `SimpleAuth.setup` was removed there now is a new way to
  configure Ember Simple Auth. Instead of passing configuration values to the
  `setup` method, these values are now defined on `window.ENV['simple-auth']`
  (and `window.ENV['simple-auth-oauth']` etc. for the extension libraries).
  See the
  [API Docs for `Configuration`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Configuration)
  for more information.
* __[BREAKING]__ All underscores have been replaced with dashes in filenames.
  This only affects users that were using the AMD build.
* __[BREAKING]__ The AMD builds are no longer distributed in the 'amd/'
  subfolder but in the root level along with the browserified versions.
* The `ApplicationRouteMixin` now subscribes to the session's events in the
  `beforeModel` method, see #199.
* Added documentation on how to disable server sessions when using the Devise
  extension library, see #204.
* The authorizer will not be used if it is destroyed already, see #191.
* The check for cross origin requests has been simplified, see #190.
* Most of the examples in the READMEs and API docs have been rewritten to focus
  on Ember CLI and ES6 modules instead of the browserified distribution.
* The cookie store example now implements "remember me" functionality.
* There is a new example that uses the AMD distribution.

# 0.5.3

* fixed the AMD build so it does not depend on the Ember.SimpleAuth global, see
  #183.
* Added an example for the devise extension library, see #188.
* Cleaned up the AMD structure so it can better be used with ember-cli, see
  #189 (all files export the default export now).

# 0.5.2

* The `ApplicationRouteMixin` now uses the configured session property name,
  see #184.
* The `ApplicationRouteMixin` will not try to invalidate a session that is not
  authenticated and thus cannot be invalidated, see #185.

# 0.5.1

* The OAuth 2.0 authenticator does not schedule automatic token refreshs in the
  test environment anymore, see #181.

# 0.5.0

* __Using any of the mixins is now completely optional__; Ember Simple Auth
  will work without the mixins as well (see example 9).
* __The session's `authorizationFailed` event will now be triggered for any
  failed XHRs__ and not only for those made in routes' `model` hooks.
* Fixed the Devise authenticator's `restore` method, see #171
* The `AuthenticationControllerMixin`'s `authenticate` action now returns the
  promise that's returned from the session's `authenticate` action.
* The authenticator's `'updated'` event was renamed to `'sessionDataUpdated'`.
* The store's `'updated'` event was renamed to `'sessionDataUpdated'`.
* The API docs now include the events an object might trigger.
* The tests now run with the latest Ember and jQuery versions.

# 0.4.0

* __[BREAKING]__ Ember Simple Auth's factories are now registered with
  "namespaced" names with Ember's container to avoid conflicts, see #159;
  __this requires all references to these factories (e.g.
  `authenticatorFactory` in controllers to be prepended with
  `'ember-simple-auth-'`)__.
* __[BREAKING]__ `Ember.SimpleAuth.Authorizers.Devise` now sends the user's
  token and email address in one header that's compatible to
  [Rails' token auth module](http://api.rubyonrails.org/classes/ActionController/HttpAuthentication/Token.html)
* __[BREAKING]__ `Ember.SimpleAuth.Authenticators.Devise` now sends the
  (configurable) resource name for session authentication, see #157
* The name of the property that Ember.SimpleAuth injects the session with into
  routes and controllers can now be customized, see #159
* fixed `Ember.SimpleAuth.Utils.isSecureUrl` so that it checks the passed URL
  not the current location
* improved the instructions for server side setup for ember-simple-auth-devise,
  see #155

# 0.3.1

* Fixed a bug where the arguments from session events were not passed to router
  actions.

# 0.3.0

* Ember Simple Auth has been split up into a base library and a set of
  extension libraries - the OAuth 2.0 authenticator/authorizer, the cookie
  session store as well as the new Devise authenticator/authorizer now reside
  in their own extension libraries so everybody can include only what they
  need. __If you're currently using the OAuth 2.0 authenticator and/or
  authorizer, you now need to include the `ember-simple-auth-oauth2.js` file in
  your app! If you're using the `Cookie` store you need to include
  `ember-simple-auth-cookie-store.js`.__
* the new Devise authenticator and authorizer have been added, see README
  there.
* it is now optional to specify an authorizer; if none is specified no requests
  will be authorized. If you're currently using an authorized be sure to
  specify it for `Ember.SimpleAuth.setup` now, e.g.:
  ```js
  Ember.SimpleAuth.setup(container, application, {
    authorizerFactory: 'authorizer:oauth2-bearer'
  });
  ```
* the session is no longer injected into models and views - it was probably not
  working for both for some time anyway and it was also not a good idea to do
  it in the first place as anything related to the session should be managed by
  the routes and controllers; see #122.
* the authenticator's update event is now handled correctly so that it might
  lead to the session being invalidated, see #121.
* examples have been updated
* the OAuth 2.0 authenticator will now try to refresh an expired token on
  refresh and only reject when that fails, see #102

# 0.2.1

* removed check for identification and password being present in
  `LoginControllerMixin` so an error is triggered with the server's response
* serve both examples and tests with `grunt dev_server` task
* README improvements
* improved examples

# 0.2.0

* Ember Simple Auth now reloads the application's root page on logout so all
  sensitive in-memory data etc. gets cleared - this also works across tabs now,
  see #92
* the OAuth 2.0 authenticator rejects restoration when the access token is
  known to have expired, see #102
* the store is not updated unnecessarily anymore, see #97
* the library is now built with grunt, uses ES6 modules and is tested with
  mocha - all Ruby dependencies have been removed
* added warnings when credentials/tokens etc. are transmitted via insecure
  connections (HTTP)

# 0.1.3

* fixed synchronization of stores, see #91

# 0.1.2

* `Ember.SimpleAuth.setup` now **expects the container and the application as
  arguments** (`Ember.SimpleAuth.setup(container, application);`)
* the authenticator to use is now looked up via Ember's container instead of
  the class name which fixes all sorts of problems especially when using Ember
  AppKit with the new ES6 modules lookup
* the examples will now always build a new release of Ember Simple Auth when
  starting
* origin validation now works in IE, see #84

# 0.1.1

* use absolute expiration times for tokens, see #76
* fix for cross origin check in IE, see #72
* make sure errors bubble up, see #79
* added documentation for customizing/extending the library

# 0.1.0

The Big Rewrite™, see the
[README](https://github.com/simplabs/ember-simple-auth#readme) and the
[release notes](https://github.com/simplabs/ember-simple-auth/releases/tag/0.1.0).

The main changes are:

* all code that is specific to concrete authentication/authorization mechanisms
  was moved into strategy classes (see e.g. Authenticators.OAuth2, Authorizers.OAuth2)
* instead of persisting the session in cookies, the default store is now
  `localStorage`
* `Ember.SimpleAuth.setup` does not expect the container as first argument
  anymore, now takes only the application object
* the terms login/logout were replaced by session authentication/session
  invalidation
* OAuth 2.0 client authentication was removed from the default library as it
  does not really work for public clients

# 0.0.11

* fixed cross origin check for Firefox (which doesn't implement
  location.origin), see #41

# 0.0.10

* fixed problem that broke integration tests, see #38 and #39

# 0.0.9

* don't periodically refresh data stored in cookie in testing mode, see #35
* support for client id and client secret, see, #36

# 0.0.8

* clear password on login, see #29
* fixed prevention of sending `Authorization` header with cross-origin requests
* added Ember.SimpleAuth.crossOriginWhitelist to also sent `Authorization`
  header with configured cross-origin requests

# 0.0.7

* use session cookies to store the session properties (see #30)

# 0.0.6

* added API docs

# 0.0.5

* fixed #21

# 0.0.4

* made the library compliant to RFC 6749
* added the application route mixin with `login`, `logout`, `loginSucceeded`,
  `loginFailed` actions
* added callbacks for use with external OpenID/OAuth providers
* more examples
* added automatic token refreshing

# 0.0.3

* changed header to standard `Authorization` instead of the custom header, see
  #15

# 0.0.2

* fixed content type of `POST /session` request to be application/json, see #13

# 0.0.1

initial release
