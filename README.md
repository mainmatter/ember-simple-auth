[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.png?branch=master)](https://travis-ci.org/simplabs/ember-simple-auth)

__API docs are [available here](http://ember-simple-auth.simplabs.com/api.html)__

#  Ember.SimpleAuth

Ember.SimpleAuth is a __lightweight library for implementing authentication/
authorization with [Ember.js](http://emberjs.com) applications__. It has
minimal requirements with respect to the application structure, routes etc.
Due to its strategies based approach it can support all kinds of authentication
and authorization mechanisms.

## How does it work?

Ember.SimpleAuth is based on the idea that __there is always an application
session in whose context a user is using the application. This session can
either be authenticated or not.__ Ember.SimpleAuth provides a number of classes
and mixins that create that session, make it available throughout the
application, provide methods for authenticating and invalidating it etc.

To enable Ember.SimpleAuth in your application, simply add a custom
initializer (also see the
[API docs for the setup method](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-setup)):

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(application);
  }
});
```

This initializer sets up the session (see the
[API docs for the Session class](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Session)
and __makes it available as `session` in all routes, controllers, views and
models__). It also sets up an
[`$.ajaxPrefilter`](http://api.jquery.com/jQuery.ajaxPrefilter/) that is used
to authorize AJAX requests with the information stored in the session when it
is authenticated (see below (TODO)).

The application route of the application must implement the mixin provided by
Ember.SimpleAuth:

```js
App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);
```

This adds some actions to the `App.ApplicationRoute` like `authenticateSession`
and `invalidateSession` as well as callback actions that are triggered when the
session's authentication state changes like `sessionAuthenticationSucceeded` or
`sessionInvalidationSucceeded` (see the
[API docs for the ApplicationRouteMixin class](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-ApplicationRouteMixin)).

__Rendering login/logout buttons in the UI depending on the authentication
state__ then is as easy as:

```html
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  <a {{ action 'authenticateSession' }}>Login</a>
{{/if}}
```

or when the application uses a dedicated route for logging in (which is usually
the case):

```html
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
```

__To make a route in the application require the session to be authenticated,
there is another mixin__ that Ember.SimpleAuth provides and that is simply
included in the respective route (see the
[API docs for the AuthenticatedRouteMixin class](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-AuthenticatedRouteMixin)):

```js
App.Router.map(function() {
  this.route('protected');
});
App.ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);
```

This will make the route redirect to `/login` (or a different URL if
configured) when the session is not authenticated in the `beforeModel` method.

### Authenticators

__The authenticator implements the steps needed to authenticate the session.__
An app can have several authenticators for different kinds of authentication
providers (e.g. the application's own backend server, external authentication
providers like Facebook etc.) while the session can only be authenticated with
one at a time  (see the
[API docs for Session#authenticate](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Session-authenticate).

#### The RFC 6749 (OAuth 2.0) Authenticator

Ember.SimpleAuth's default authenticator (see the
[API docs for Authenticators.OAuth2](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authenticators-OAuth2))
is compliant with [RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically
the _"Resource Owner Password Credentials Grant Type"_. This grant type
basically specifies that the client `POST`s a set of credentials to a server:

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=johndoe&password=A3ddj3w
```

and in exchange receives an access token that is then later used to identify
the user:

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token":"2YotnFZFEjr1zCsicMWpAA",
  "token_type":"bearer"
}
```

__Ember.SimpleAuth's OAuth 2.0 authenticator also supports automatic token
refreshing__ which is explained in more detail in
[section 6 of RFC 6749](http://tools.ietf.org/html/rfc6749#section-6).

##### Using the RFC 6749 (OAuth 2.0) Authenticator

In order to use the OAuth 2.0 authenticator the application needs to have a
login route:

```js
App.Router.map(function() {
  this.route('login');
});
```

This route would display the login form with fields for `identification` and
`password`:

```html
<form {{action authenticate on='submit'}}>
  <label for="identification">Login</label>
  {{view Ember.TextField id='identification' valueBinding='identification' placeholder='Enter Login'}}
  <label for="password">Password</label>
  {{view Ember.TextField id='password' type='password' valueBinding='password' placeholder='Enter Password'}}
  <button type="submit">Login</button>
</form>
```

The `authenticate` action that is triggered by submitting the form is provided
by the `LoginControllerMixin` that the respective controller in the application
needs to include:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin);
```

The mixin will by default use the OAuth 2.0 authenticator to authenticate the
session.

##### Compatible Middlewares

There is a quantity of middlewares for different languages and servers that
implement OAuth 2.0 and can be used with Ember.SimpleAuth's OAuth 2.0
authenticator.

###### Ruby

* rack-oauth2: https://github.com/nov/rack-oauth2
* doorkeeper: https://github.com/applicake/doorkeeper

###### PHP
* oauth2-server: https://github.com/php-loep/oauth2-server
* zfr-oauth2-server: https://github.com/zf-fr/zfr-oauth2-server
* zfr-oauth2-server-module (for ZF2): https://github.com/zf-fr/zfr-oauth2-server-module

###### Java

* scribe-java: https://github.com/fernandezpablo85/scribe-java

###### Node.js

* oauth2orize: https://github.com/jaredhanson/oauth2orize

#### Implementing a custom Authenticator


Authenticators.Base
AuthenticationControllerMixin

### Authorizers

General concept
Cross Origin authorization

#### The RFC 6750 Authorizer

RFC 6750

#### Implementing a custom Authorizer

Authenticators.Base

### Stores

General concept
Session restore
Store events
Stores.Cookie
Stores.LocalStorage
Stores.Ephemeral

#### Implementing a custom Store

Stores.Base

== remove later below here! ==

## RFC 6749

RFC 6749 is the IETF specification that defines the OAuth 2.0 Authorization
framework. It defines a series of grant types of which the _"[Resource Owner
Password Credentials Grant Type]
(http://tools.ietf.org/html/rfc6749#section-4.3)"_ is used by Ember.SimpleAuth.
It defines the process of acquiring an authorization token from a server in
exchange for a valid pair of credentials (username and password).

The token is then sent in the standard HTTP `Authorization` header along with
every subsequent request:

```
Authorization: Bearer <access token>
```

For now, Ember.SimpleAuth only supports bearer tokens (see
[RFC 6750](http://tools.ietf.org/html/rfc6750) for more information on this
token type).

__As the `Authorization` header is sent with every AJAX request the application
makes (Ember.SimpleAuth uses a
[jQuery AJAX prefilter](http://api.jquery.com/jQuery.ajaxPrefilter) to inject
the header in the request), all kinds of data adapters etc. are supported out
of the box.__

## External OAuth/OpenID Providers

Additionally to servers compliant to RFC 6749, Ember.SimpleAuth can also be
used with external OpenID or OAuth providers like
[Facebook](https://developers.facebook.com/docs/facebook-login/getting-started-web/),
[Twitter](https://dev.twitter.com/docs/auth) or
[Google](https://developers.google.com/accounts/docs/OpenID) which can easily
be integrated. For an example see the _"External OAuth example"_ in the
[examples list](#examples).

## Custom Server Protocols

Ember.SimpleAuth can also be used with your own custom server protocol. This
requires a little more integration work though (see the _"Custom Server
example"_ in the [examples list](#examples)). However, there is a wide range of
middlewares available for different languages and frameworks that support the
OAuth 2.0 standard so you might want to consider using one of those instead of
running your own incompatible solution.

### Login Form

When using a login form to authenticate the user, the first thing that is
needed in the Ember.js application is a login route. This can be named anything
you want:

```js
App.Router.map(function() {
  this.route('login');
});
```

To wire this up with Ember.SimpleAuth, the login controller needs to implement
the respective mixin:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin);
```

The last step is to add a template that renders the login form:

```html
<form {{action login on='submit'}}>
  <label for="identification">Login</label>
  {{view Ember.TextField id='identification' valueBinding='identification' placeholder='Enter Login'}}
  <label for="password">Password</label>
  {{view Ember.TextField id='password' type='password' valueBinding='password' placeholder='Enter Password'}}
  <button type="submit">Login</button>
</form>
```

As the controller implements the mixin as described above, form submission,
session setup etc. will be handled by Ember.SimpleAuth.

### External OAuth/OpenID provider

When using an external authentication provider to authenticate the user, there
is a little custom code necessary. Instead of implementing a login route that
renders a form you need to override the `App.ApplicationRoute`'s `login` action
so that it opens a new window that displays the external provider's UI for
logging in. If you're using Facebook that would look something like this:

```js
App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  actions: {
    login: function() {
      window.open(
        'https://www.facebook.com/dialog/oauth?client_id=<your app id>&redirect_uri=<your callback URI>'
      );
    }
  }
});
```

When Facebook redirects to your callback URI, your server identifies the user
by the Facebook OAuth token and renders a response that invokes the
`externalLoginSucceeded` callback in it's opener window:

```html
<html>
<head></head>
<body>
  <script>
    window.opener.Ember.SimpleAuth.externalLoginSucceeded({ access_token: '<access token>' });
    window.close();
  </script>
</body>
</html>
```

This will set up the current session and redirect to the correct route.

If the external authentication fails, your server renders something like this:

```html
<html>
<head></head>
<body>
  <script>
    window.opener.Ember.SimpleAuth.externalLoginFailed({ error: 'invalid_grant' });
    window.close();
  </script>
</body>
</html>
```

To intercept this error and for example display an error message, you can
override the `loginFailed` action of the `App.ApplicationRoute`:

```js
App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  actions: {
    loginFailed: function(errorMessage) {
      this.controllerFor('application').set('loginErrorMessage', errorMessage);
    }
  }
});
```

For a more complete example see the _"External OAuth example"_ in the
[examples](#examples) list.

## The Client/Server API

The client/server API as specified for the _"Resource Owner Password
Credentials Grant"_ in RFC 6749 is actually quite simple. The client sends a
request including the grant type as well as the user's username and password to
the server's token endpoint:

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=johndoe&password=A3ddj3w
```

The server then either answers with a successful response including the bearer
token:

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token":"2YotnFZFEjr1zCsicMWpAA",
  "token_type":"bearer"
}
```

or with an error:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "error":"invalid_grant"
}
```

For more documentation of the specified error codes, see [the respective
section of RC 6749](http://tools.ietf.org/html/rfc6749#section-5.2).

### Token Expiration and Refresh

The server can also include an expiry for the access token as well as an
additional refresh token in the successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token":"2YotnFZFEjr1zCsicMWpAA",
  "token_type":"bearer",
  "expires_in":3600,
  "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA"
}
```

Refresh tokens are usually valid for longer than access tokens and can be used
to obtain fresh access tokens when these are expired or even before they
expire. If the server supports refresh tokens, Ember.SimpleAuth will
automatically refresh access tokens about 5 seconds before they expire. The
request is similar to the initial request for acquiring the token but instead
of using the grant type `password` and submitting the user's credentials it
uses grant type `refresh_token` and only includes the refresh token:

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
```

The response for this request is the same as the success and error responses
described above.

### The `Authorization` header

Once the access token has successfully been obtained from the server, all
subsequent request the client sends will includes the `Authorization` header.
The server uses that token to identify the user making the request:

```
Authorization: Bearer <access token>
```

**As the access token is sent without any further encryption etc. you should
make sure you're always using TLS/HTTPS for all client/server communication!**

#### Cross Origin Authorization

Ember.SimpleAuth ensures that the authorization token does not get exposed to 3rd parties by exluding it
from all requests that go to a different origin than the Ember.js application's. If you need
to include it for cross origin requests as well (for
example if your REST API runs on a different domain than the one you serve the
Ember.js application from) you need to explicitly specify these origins during
setup:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, { crossOriginWhitelist: ['http://some.other.domain:1234'] });
  }
});
```

Web origins consist of protocol, domain and port (see
[RFC 6454](http://tools.ietf.org/html/rfc6454)). That means that also **if you
serve the Ember.js application via HTTP and connect to the REST API via HTTPS**
you would have to enable that explicitly. For more information on CORS see
http://enable-cors.org. You also have to make sure your server responds to
`OPTIONS` requests etc. including the correct response headers as described
e.g. [here](http://www.html5rocks.com/en/tutorials/cors/).

### Custom Servers

In order to use a custom server that is not compliant to RFC 6749, there are
only two things that need to be customized: the construction of the request
that is sent to the server to obtain the access token and the parsing of the
server's response. To customize the request, simply override the
`tokenRequestOptions` method in the login controller, e.g.:

```js
App.LoginController  = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  tokenRequestOptions: function(username, password) {
    var data = '{ "SESSION": { "USER_NAME": "' + username + '", "PASS": "' + password + '" } }';
    return { type: 'PUT', data: data, contentType: 'application/json' };
  }
});
```

In this case the request that is sent to obtain the token will be a `PUT`
request with JSON data instead of the standard `POST` with form-encoded data.

To customize the parsing of the server's response, override the `setup` method
of Ember.SimpleAuth.Session, e.g.:

```js
Ember.SimpleAuth.Session.reopen({
  setup: function(serverSession) {
    this.set('authToken', serverSession.SESSION.TOKEN);
  }
});
```

### Middlewares supporting RFC 6749

This is an incomplete list of middlewares supporting RFC 6749.

#### Ruby

* rack-oauth2: https://github.com/nov/rack-oauth2
* doorkeeper: https://github.com/applicake/doorkeeper

#### PHP
* oauth2-server: https://github.com/php-loep/oauth2-server
* zfr-oauth2-server: https://github.com/zf-fr/zfr-oauth2-server
* zfr-oauth2-server-module (for ZF2): https://github.com/zf-fr/zfr-oauth2-server-module

#### Java

* scribe-java: https://github.com/fernandezpablo85/scribe-java

#### Node.js

* oauth2orize: https://github.com/jaredhanson/oauth2orize

Please submit a pull request if you think an important library is missing here!

== remove later below here! ==

## Examples

To run the examples you need to have Ruby (at least version 1.9.3) and the
[bundler gem](http://bundler.io) installed. If you have that, you can run:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth/examples
bundle
./runner
```

Open [http://localhost:4567](http://localhost:4567) to access the examples.

### Other Examples

* Ember App Kit: https://github.com/erkarl/ember-app-kit-simple-auth
* Ember.SimpleAuth with Rails 4: https://github.com/ugisozols/ember-simple-auth-rails-demo

## Installation

To install Ember.SimpleAuth in you Ember.js application you have several
options:

* If you're using [Bower](http://bower.io), just add it to your
  `bower.json` file:

```js
{
  "dependencies": {
    "ember-simple-auth": "https://github.com/simplabs/ember-simple-auth-component.git"
  }
}
```

* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
* [Build it yourself](#building)

## Building

To build Ember.SimpleAuth yourself you need to have Ruby (at least version
1.9.3) and the [bundler gem](http://bundler.io) installed. If you have that,
building is as easy as running:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth
bundle
bundle exec rake dist
```

After running that you will find the compiled source file (including a minified
version) in the `dist` directory.

If you want to run the tests as well you also need
[PhantomJS](http://phantomjs.org). You can run the tests with:

```bash
bundle exec rake test
```
