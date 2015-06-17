# 0.8.0

* Correctly initialize the session's `content`, see #556.

# 0.8.0-beta.3

* Fixed a bug related to the mechanism for automatic translation of session
  events to route actions leaking state, see #544.
* Fixed a bug where non-secure session data would get lost after a reload, see
  #534.
* Ember Simple Auth does not explicitly set the container on the session
  anymore as that's already set by the container itself when creating the
  object, see #520.

# 0.8.0-beta.2

* Ember Simple Auth now uses the application's `register` and `inject` methods
  instead of the container's, see #462.
* A bug in the OAuth 2.0 authorizer was fixed that prevented requests from
  actually being authorized, see #483.
* Changed the way the test helpers are loaded to prevent JSHint errors, see
  #478.
* Better implementation for detection of changes in the session store, see
  #469.

# 0.8.0-beta.1

* __[BREAKING]__ The devise package's `identificationAttributeName` property
  now defaults to `email`, see #456.
* The secure session data is now stored under the special key `secure`, see
  #414. This makes sure that the session isn't cleared completely on logout but
  only the `secure` key instead. This is a __[BREAKING]__ change if you're
  using a custom authorizer as that must fetch the token etc. from the
  session's `secure` key now.
* The cookie session store will now only expire on inactivity - as long as the
  session is active, the cookie's expiration time will frequently be updated,
  see #451.
* The `LoginControllerMixin` and `AuthenticationControllerMixin` mixins are now
  deprecated. The `invalidateSession` and `authenticateSession` actions in the
  `ApplicationRouteMixin` mixin have been deprecated as well.
  `authenticateSession` is replaced by the new `sessionRequiresAuthentication`
  action, see #467.
* The `AuthenticatedRouteMixin` mixin will now correctly return upstream
  `beforeModel` promises, see #464.

# 0.7.3

* __[BREAKING]__ The name of the token attribute used by the devise
  authenticator and authorizer is now `token` by default, see #394.
* __[BREAKING]__ The devise authenticator will now send the user's
  identification for the configured `identificationAttributeName` instead of
  always using `email`, see #403.
* The `crossOriginWhitelist` now supports whitelisting all subdomains of a
  specific domain, see #398.
* The docs for defining custom authenticators have been improved, see #399.
* The tests will now run against the newest versions of Ember, Ember.js, jQuery
  and handlebars.
* The examples now run with handlebars 2.0.0 and jQuery 2.1.3.
* The Google+ example has been fixed so that it will always prompt the user for
  approval, see #412.
* The template for the API docs was updated so that it works with the newest
  handlebars version.

# 0.7.2

* The session's `authenticate` method now accepts an arbitrary list of
  arguments to pass to the authenticator's `authenticate` method which also
  allows to pass options to torii providers, see #371.
* With the move away from controllers/views and towards components, the session
  is now injected into components as well, see #364.
* The OAuth 2.0 authenticator now handles access scopes, see #363.
* `ApplicationRouteMixin` will now send actions to the current route if
  available or the initial transition, see #367.
* Added a new `currentSession()` helper to the Ember Simple Auth Testing
  package that provides access to the current session, see #359.
* Fixed clearing of cookie and `localStorage` stores, see #349.
* The `ajaxPrefilter` and `ajaxError` handlers were cleaned up.

# 0.7.1

* The `localStorage` session store now correctly reads its configuration from
  the `Configuration` object and in turn can be configured in
  `config/environment.js` in Ember CLI projects, see #340.

# 0.7.0

* __[BREAKING]__: The Devise authorizer now sends the session token as
  `user_token` instead of `token` for consistency.
* The session store can store nested objects now, see #321.
* The property names for `user_token` and `user_email` are now configurable for
  the Devise authenticator/authorizer, see #319.
* The `ApplicationRouteMixin`'s `sessionInvalidationSucceeded` action will no
  longer reload the page in testing mode, see #333.
* The cookie session store now has a `cookieDomain` setting that can be used if
  e.g. the session needs to be shared across subdomains, see #332.
* The AMD distribution has been fixed so that it doesn't depend on any specific
  global objects anymore, see #325, #323.
* Removed the insecure connection warning as it never actually triggers when it
  actually should, see #318.
* The `crossOriginWhitelist` setting can now be set to `['*']` to allow
  requests to all domains, see #309.
* The global `ajaxPrefilter` and `ajaxError` hooks will now be setup only once
  which fixes some problems in testing mode.

# 0.6.7

* The Ember CLI Addons will now use the project's configuration as defined in
  `config/environment.js` and do not depend on `window.ENV` anymore, see
  [simplabs/ember-cli-simple-auth#21]https://github.com/simplabs/ember-cli-simple-auth/issues/21.
* All configuration data is now held in configuration objects for the
  OAuth 2.0, cookie store and devise extension libraries as well.

# 0.6.6

This release fixes the Ember CLI Addon packages that were (again) published
incorrectly to npm...

# 0.6.5

* __[BREAKING]__: The OAuth 2.0 authenticator's `serverTokenRevocationEndpoint`
  property has been renamed to `serverTokenRevocationEndpoint`
  (_"k"_ to _"c"_).
* The new `UnauthenticatedRouteMixin` mixin can be used for routes that do not
  allow the session to be authenticated like the login route, see #236.
* The `localStorage` store's `localStorageKey` property can now be configured,
  see #300.
* The `AuthenticatedRouteMixin` and `UnauthenticatedRouteMixin` will now check
  for infinite redirection loops, see #293.
* The cookie store now sets `path=/` for its cookies so that there is only one
  Ember Simple Auth cookie per application, see #288.
* The browserified distribution does not correctly export the test helpers, see
  #283.
* `authorizationFailed` will now only be triggered for requests that were
  actually authenticate by Ember Simple Auth, see #271.
* Fixed a bug that prevented the browserified version from being used in older
  versions of Internet Explorer, see #266.

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
  [API Docs for `Configuration`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Configuration)
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
