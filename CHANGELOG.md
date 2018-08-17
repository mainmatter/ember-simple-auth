# 1.7.0

* The `baseURL` configuration property is now deprecated; use the `rootUrl`
  property instead, see #1597.
* ESA works with ember-fetch@"^2.1.0 || ^3.0.0 || ^4.0.0 || ^5.0.0" now, see
  #1608.
* Session events are now bound to methods on the `application` route
  correctly, see #1604.
* The repeated `isFastBoot` properties used in various places in the codebase
  have been replaced with a computed property macro, see #1623.
* The `broccoli-file-creator` dependency has been raised to `^2.0.0`, see
  #1636.
* The API docs and README habe been improved for greater clarity and better
  examples, see #1583, #1591, #1631, #1598.
* The dummy app now implements remember-me functionality, see #1606.

# 1.6.0

* Authorizers are now deprecated, see #1532. For more information on the
  deprecation, refer to the
  [deprecation guide](https://github.com/simplabs/ember-simple-auth#deprecation-of-authorizers).
* The
  [session service's `invalidate` method](https://ember-simple-auth.com/api/classes/SessionService.html#method_invalidate)
  can now be called when the session is already invalidated, and would simply
  do nothing in that case, see #1555.
* The previously removed `ember-simple-auth` instance initializer has been
  added again which fixes a regression in applications that relied on its
  existence, see #1565.
* Usage of the private `beginPropertyChanges`/`endPropertyChanges` methods has
  been removed, see #1554.

# 1.5.1

* Session restoration is now setup in an initializer (vs. an instance
  initializer), see #1547.
* The new acceptance test helpers introduced with 1.5.0 no longer need to
  manually set up the router (which was using private API), see #1548.

# 1.5.0

* The acceptance test helpers no longer rely on the global `wait` test helper,
  see #1516.
* A new set of acceptance test helpers was introduced that is imported from the
  `ember-simple-auth` module namespaces and supports Ember's new testing model,
  see #1536.
* The `ember-cookies` dependency now allows `^0.1.0` as well as `^0.2.0`, see
  #1538.

# 1.4.2

* The broken `warn()` method on the `cookie` session store has been fixed,
  see #1502.
* The event listener on the `local-storage` session store is correctly removed,
  see #1498.

# 1.4.1

* The `fastboot-app-server` dependency has been removed, see #1446.
* The `torii` authenticator will no longer override the session data with the
  data returned from the torii provider when restoring the session, see #1310.
* `Ember.testing` is no longer destructured which could cause problems with
  recent `ember-qunit`/`ember-cli-qunit`/`ember-test-helpers` versions, see
  #1477.
* The `fastboot-tests` and `guides` directories are no longer distributed with
  the npm package, see #1470.
* The OAuth 2.0 authenticator will now reject correctly for responses with an
  invalid (non-JSON) response body, see #1487, #1442.
* The cookie that stores the session cookie's expiration time is now cleared
  when that time is set to `null`, see #1463.

# 1.4.0

* A new session store has been added that is based on `sessionStorage`, see
  #1392.
* Several documentation errors and typos have been fixed, see #1393, #1372,
  #1374, #1366, #1346.

# 1.3.0

* ESA now uses ember-fetch instead of ember-network. ember-fetch is better
  maintained than ember-network and seems to emerge as the
  community-agreed-upon standard for a FastBoot compliant `fetch` polyfill;
  see #1288.
* A new OAuth 2.0 authenticator that implements the OAuth 2.0
  _"Implicit Grant"_ has been added, along with a route mixin that makes it
  easy to use it; see #1252.
* ESA now depends on ember-cli-babel `^6.0.0`, allowing host applications to
  take advantage of Ember CLI's new `targets` feature, see #1295.
* The `DataAdapterMixin` now allows overriding the `handleResponse` method in a
  way that bypasses ESA's built in logic to invalidate the session on 401
  responses while still being able to call `_super` to invoke the base
  authenticator's logic; see #1290.

# 1.2.2

* The session is now correctly restored when running Ember 2.13, see #1267.
* The mechanism that triggers authentication in the `AuthenticatedRouteMixin`
  is now encapsulated in the (overridable) `triggerAuthentication` method, see
  #1278.
* The ember-cookies dependency has been upgraded to 0.0.13, see #1281.

# 1.2.1

* Arguments passed to the session service's `invalidate` method will now be
  passed on to the authenticator's `invalidate` method along with the session
  data, see #1093.
* The generators for the torii authenticator will now generate a valid file,
  including an `Ember` import, see #1216.
* The cookie session store now allows defining the cookie path, see #1201.
* The cookie session store will now correctly rewrite the cookie when the
  cookie domain or expiration time change but the cookie name remains
  unchanged, see #1234.
* The `AuthenticatedRouteMixin` and `UnauthenticatedRouteMixin` will no longer
  return the return value of `transitionTo` from their `beforeModel` methods,
  see #1247.
* A deprecation caused by a call to `Ember.warn` without a warning id has been
  fixed, see #1250.
* The cookie session store will now correctly restore its expiration time from
  the expiration time cookie if present, see #1257.
* Some parts of the documentation have been improved, see #1253, #1259, #1254.

# 1.2.0

* The [deprecated `bind` method from jQuery](http://api.jquery.com/bind/) has
  been replaced with `on`, see #1184.
* The development dependencies have been updated and unused dependencies have
  been removed, see #1182, #1161, #1183.
* JSHint has been replaced with ESLint, see #1185, #1186.

# 1.2.0-beta.2

* The `getOwner` function is now read from the `Ember` object instead of
  importing it from `ember-getowner-polyfill` which fixes a deprecation, see
  #1124.
* Transitions are no longer aborted in the `AuthenticatedRouteMixin` and
  `UnauthenticatedRouteMixin` which was simply unnecessary, see #1126.
* There is now an assertion checking that a valid authorizer has been passed to
  the session's `authorize` method, see #1132.
* The attempted transition is now being stored in a cookie when Ember Simple
  Auth intercepts a transition and redirects to the login route in the
  `AuthenticatedRouteMixin` so that the transition can be retried in the
  browser, see #1136.
* The `ember-cookies` dependency has been updated to 0.0.11 which fixes a
  deprecation, see #1153.
* Ember Simple Auth now longer uses `Ember.K`, see #1166.
* Deprecated ways to use Ember's deprecations which caused a deprecation
  themselves have been fixed, see #1170.
* There is now a warning when a `cookieExpirationTime` lower than 90 seconds is
  set as that will lead to problems with Ember Simple Auth's session time
  extension mechanism, see #1160.
* Several parts of the documentation have been fixed and a new guide on
  implementing authentication with github has been added, see #1143, #1142,
  #1121, #1139.

# 1.2.0-beta.1

* Ember Simple Auth now supports FastBoot out-of-the-box (when using the cookie
  session store), see #1035.
* Ember CLI's new `rootURL` setting is now used correctly, see #1070.
* The cookie session store will now rewrite its cookies when any of its
  configurable properties (like cookie name) change, see #1056.
* The `DataAdapterMixin` now also overrides the `headersForRequest` method
  which makes it behave correctly with Ember Data 1.7 and above, see #1033.
* Configurable routes like the login route etc. are now configured via
  overriding properties of the respective route mixins instead of settings in
  `config/environment.js`, see #985.
* The OAuth 2.0 Passwort Grant authenticator now allows to define custom
  headers to be sent with authentication requests, see #1018.
* Authenticators can now reject with the server response when requests fail,
  see #1012.
* Server responses are now validated before authenticators resolve
  authentication, see #957.
* The offset that the OAuth 2.0 Password Grant authenticator uses when
  refreshing access tokens is now defined in an (overridable) property, see
  #840.
* The default cookie names that the cookie session store uses are now compliant
  with RFC 2616, see #978.

# 1.1.0

There were no changes since 1.1.0-beta.5.

# 1.1.0-beta.5

* The session will now ignore session store events when it is currently
  authenticating or restoring, see #965.

# 1.1.0-beta.4

* A critical bug in the cookie store causing an immediate logout after logging
  in has been fixed, see #931.
* A deprecation in Ember.js 2.5.0 was fixed, see #941.
* The versions of Ember CLI used to build and develop the addon itself have
  been updated to the latest release versions, see #936.
* The README, API docs and contribution guidelines have been improved, see
  #954, #947.

# 1.1.0-beta.3

* The `ember-cli-is-package-missing` package was added as a dependency
  (previously it was only a dev dependency), fixing a bug that occurred when
  running the new generators, see #913.
* A regression in the cookie store was fixed causing a transition to the
  `routeAfterAuthentication` after session restoration, see #915.
* The code base now consistently overrides the `init` method instead of relying
  on `on('init', …` which results in easier to understand and maintain code,
  see #917.

# 1.1.0-beta.2

* The `silent-error` package was added as a dependency (previously it was only
  a dev dependency), fixing a bug that occurred when running the new
  generators, see #911.
* The API docs for token expiration and refresh were improved, see #921.
* Lots of Ember Simple Auth's internal where cleaned up to take more advantage
  of Babel in order to make the code more concise and easier to maintain, see
  #905.

# 1.1.0-beta.1

* Session Stores are now asynchronous. Synchronous session stores will still
  work but are now deprecated and will be removed in Ember Simple Auth 2.0, see
  #714, #717.
* Ember Simple auth now comes with blueprints for creating authenticators and
  authorizers, see #879.
* The requests that the devise authenticator makes can now be customized with
  additional options, see #886.
* The default for (Ember Simple Auth's internal) `baseURL` property is now
  `''`, see #881.
* `browserify` is now only enabled for Ember Simple Auth's own tests, fixing
  potential problems in apps, see #833.
* When the authenticator fails to restore the session with an error, that error
  will now be logged, see #829.
* When invalidating a torii session, the session data will now be passed to the
  torii provider, see #808.
* ember-getowner-polyfill is now include in Ember Simple Auth's dependencies so
  that applications don't have to install it explicitly, see #806.
* Ember Simple Auth will no longer trigger a deprecation regarding use of the
  `container` property, see #894, #804, #796.
* The `DataAdapterMixin` will now only invalidate the session on 401 responses
  when it is actually currently authenticated, see #722.

# 1.0.1

* A bug in the mechanism that forwards events from the internal session through
  the session service was fixed, see #736, #730.
* The documentation and assertions for the torii authenticator was fixed,
  see #734, #735.
* A typo in the documentation was fixed, see #738.

# 1.0.0

__Ember Simple Auth 1.0.0 changes a lot of external API, a large part of these
changes being breaking changes.__ Because of that this changelog entry does not
mark these breaking changes individually but merely offers an overview of what
has changed.

* Ember Simple Auth is __now compatible with all Ember version starting with
  1.12.0__.
* Ember Simple Auth is __only available as an Ember CLI Addon__ - the
  globalized and bower distributions are no longer maintained.
* The __session is no longer injected__ into routes and controllers but instead
  __exposed as a service__. The service has most of the methods that the
  session had before. The session can also no longer be extended. Instead
  either extend the session service or add another service that uses the
  session service to provide additional functionality.
* __Auto-authorization of all AJAX request has been dropped__. All
  authorization now has to be initiated explicitly via the session service's
  `authorize` method. There is the new `DataAdapterMixin` that can be used to
  simply authorize all Ember Data requests.
* All authenticators and authorizers the application uses now have to be
  defined in `app/authenticators` and `app/authorizers` respectively while in
  most cases they will simply inherit one of the predefined authenticators/
  authorizers. Also configuration of authenticators and authorizers is no
  longer done via `config/environment.js` but instead by overriding properties
  in the extended authenticators/authorizers.
* The `ApplicationRouteMixin` now maps the session events to the
  `sessionAuthenticated` and `sessionInvalidated` methods instead of the
  actions from previous versions.
* The default session store is now the adaptive store that will use
  `localStorage` if available and a cookie otherwise. When testing, Ember
  Simple Auth will always use the ephemeral store.
* The test helpers now take the application instance as the first argument and
  must be imported explicitly in the respective test.
* The session is now restored in the application route's `beforeModel` method
  instead of in an initializer.

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
