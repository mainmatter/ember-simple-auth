# 0.1.0

The Big Rewrite™, see the [README](https://github.com/simplabs/ember-simple-auth#readme) and the [release notes](https://github.com/simplabs/ember-simple-auth/releases/tag/0.1.0).

The main changes are:

* all code that is specific to concrete authentication/authorization mechanisms was moved into strategy classes (see e.g. Authenticators.OAuth2, Authorizers.OAuth2)
* instead of persisting the session in cookies, the default store is now `localStorage`
* Ember.SimpleAuth.setup does not expect the container as first argument anymore, now takes only the application object
* the terms login/logout were replaced by session authentication/session invalidation

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
