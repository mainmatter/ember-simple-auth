# 0.5.2

* The `ApplicationRouteMixin` now uses the configured session property name,
  see #184.
* The `ApplicationRouteMixin` will not try to invalidate a session that is not
  authenticated and thus cannot be invalidated, see #185.

# 0.5.1

* The OAuth 2.0 authenticator does not schedule automatic token refreshs in the
  test environment anymore, see #181.

# 0.5.0

* __Using any of the mixins is now completely optional__; Ember.SimpleAuth will
  work without the mixins as well (see example 9).
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

* __[BREAKING]__ Ember.SimpleAuth's factories are now registered with
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

* Ember.SimpleAuth has been split up into a base library and a set of extension
  libraries - the OAuth 2.0 authenticator/authorizer, the cookie session store
  as well as the new Devise authenticator/authorizer now reside in their own
  extension libraries so everybody can include only what they need. __If you're
  currently using the OAuth 2.0 authenticator and/or authorizer, you now need
  to include the `ember-simple-auth-oauth2.js` file in your app! If you're
  using the `Cookie` store you need to include
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

* Ember.SimpleAuth now reloads the application's root page on logout so all
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

* Ember.SimpleAuth.setup now **expects the container and the application as
  arguments** (`Ember.SimpleAuth.setup(container, application);`)
* the authenticator to use is now looked up via Ember's container instead of
  the class name which fixes all sorts of problems especially when using Ember
  AppKit with the new ES6 modules lookup
* the examples will now always build a new release of Ember.SimpleAuth when
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
* Ember.SimpleAuth.setup does not expect the container as first argument
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
