# 0.2.0

* Ember.SimpleAuth now reloads the application's root page on logout so all sensitive in-memory data etc. gets cleared - this also works across tabs now, see #92
* the OAuth 2.0 authenticator rejects restoration when the access token is known to have expired, see #102
* the store is not updated unnecessarily anymore, see #97
* the library is now built with grunt, uses ES6 modules and is tested with mocha - all Ruby dependencies have been removed
* added warnings when credentials/tokens etc. are transmitted via insecure connections (HTTP)

# 0.1.3

* fixed synchronization of stores, see #91

# 0.1.2

* Ember.SimpleAuth.setup now **expects the container and the application as arguments** (`Ember.SimpleAuth.setup(container, application);`)
* the authenticator to use is now looked up via Ember's container instead of the class name which fixes all sorts of problems especially when using Ember AppKit with the new ES6 modules lookup
* the examples will now always build a new release of Ember.SimpleAuth when starting
* origin validation now works in IE, see #84

# 0.1.1

* use absolute expiration times for tokens, see #76
* fix for cross origin check in IE, see #72
* make sure errors bubble up, see #79
* added documentation for customizing/extending the library

# 0.1.0

The Big Rewrite™, see the [README](https://github.com/simplabs/ember-simple-auth#readme) and the [release notes](https://github.com/simplabs/ember-simple-auth/releases/tag/0.1.0).

The main changes are:

* all code that is specific to concrete authentication/authorization mechanisms was moved into strategy classes (see e.g. Authenticators.OAuth2, Authorizers.OAuth2)
* instead of persisting the session in cookies, the default store is now `localStorage`
* Ember.SimpleAuth.setup does not expect the container as first argument anymore, now takes only the application object
* the terms login/logout were replaced by session authentication/session invalidation
* OAuth 2.0 client authentication was removed from the default library as it does not really work for public clients

# 0.0.11

* fixed cross origin check for Firefox (which doesn't implement location.origin), see #41

# 0.0.10

* fixed problem that broke integration tests, see #38 and #39

# 0.0.9

* don't periodically refresh data stored in cookie in testing mode, see #35
* support for client id and client secret, see, #36

# 0.0.8

* clear password on login, see #29
* fixed prevention of sending `Authorization` header with cross-origin requests
* added Ember.SimpleAuth.crossOriginWhitelist to also sent `Authorization` header with configured cross-origin requests

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
