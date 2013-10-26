[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.png?branch=master)](https://travis-ci.org/simplabs/ember-simple-auth)

#  Ember.SimpleAuth

Ember.SimpleAuth is a lightweight library for implementing
token based authentication with [Ember.js](http://emberjs.com) applications. It
has minimal requirements with respect to the application structure, routes etc.

While it follows the RFC 6749 specification (specifically the "Resource Owner Password Credentials Grant Type") it can support a wide range of different
server APIs with very little customization effort.

## RFC 6749

RFC 6749 is the IETF specification that defines the OAuth 2.0 Authorization
framework. It defines a series of grant types of which the "Resource Owner
Password Credentials Grant Type", the grant type that Ember.SimpleAuth supports, is the most simple. It's actually
just a formalization of requesting an authorization token from the server in
exchange for a valid set of user credentials.

That token is then sent with every subsequent request in the standard HTTP `Authorization` header:

```
Authorization: Bearer <secret token>
```

For now, Ember.SimpleAuth only supports bearer tokens (see <a href="http://tools.ietf.org/html/rfc6750" title="RFC 6750">RFC 6750</a> for more information on this token type).

NOTE!
As the `Authorization` header is sent with every AJAX request the Ember.js application makes, Ember.SimpleAuth
supports all kinds of data adapters etc. out of the box. As long as the request goes through the jQuery AJAX
API (which every request in an Ember.js application does anyway), it will be authenticated.

## External Authentication Providers

Additionally to servers compliant to RFC 6749, Ember.SimpleAuth can also be used with external OpenID or OAuth providers like
[Facebook](https://developers.facebook.com/docs/facebook-login/getting-started-web/),
[Twitter](https://dev.twitter.com/docs/auth) or
[Google](https://developers.google.com/accounts/docs/OpenID) which can easily
be integrated.

## Custom Server Protocols

Ember.SimpleAuth can also be used with custom server protocols (e.g. JSON based etc.). This requires a little more
integration work though (see the "Custom Server example" in the examples). Also, there is a wide range of middlewares available that
support the OAuth 2.0 standard so you might want to consider using one of those instead of running your own incompatible version.

## Usage

To enable Ember.SimpleAuth simply add a custom initializer:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application);
  }
});
```

The `App.ApplicationRoute` must implement the mixin provided by
Ember.SimpleAuth so that the `login` and `logout` actions are available:

```js
App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.LogoutActionableMixin);
```

The current session can be accessed as `session` in models, views, controllers and
routes. To e.g. display login/logout buttons depending on whether the user is
currently authenticated or not, simple add something like this to the
respective template:

```html
{{#if session.isAuthenticated}}
  {{#link-to 'logout'}}Logout{{/link-to}}
  <p class="navbar-text pull-right">Your are currently signed in</p>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
```

To actually make a route in the application protected and inaccessible when no
user is authenticated, simply implement the
`Ember.SimpleAuth.AuthenticatedRouteMixin` in the respective route:

```js
App.Router.map(function() {
  this.route('protected');
});
App.ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);
```

This will make the route redirect to `/login` (or a different URL if
configured) when no user is authenticated.

To actually authenticate the user so that the secret token is obtained from the
server, there are two options: using a login form that sends a set of
credentials to a server or to integrate an OAuth/OpenID provider.

### Login Form

When using a server that is compliant to RFC 6749, a login route is needed. This
can be named anything you want:

```js
App.Router.map(function() {
  this.route('login');
});
```

To wire this up with Ember.SimpleAuth, the login controller
needs to implement the respective mixin provided by
Ember.SimpleAuth:

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

Ember.SimpleAuth will handle the process of exchanging the user's credentials, setting up the session etc.

### OAuth/OpenID

When using an external authentication provider to authenticate the user, there is
a little custom code necessary. Instead of implementing a login route that renders
a form you need to override the `App.ApplicationRoute`'s `login` action so that
it opens a new window that displays the external provider's UI for logging in.
If you're using Facebook that would look something like this:

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

When Facebook redirects to your callback URI, you server identifies the user by
the Facebook OAuth token and renders a response that invokes the
`externalLoginSucceeded` callback on it's opener window:

```html
<html>
<head></head>
<body>
  <script>
    window.opener.Ember.SimpleAuth.externalLoginSucceeded({ access_token: 'secret token!' });
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

For a more complete example see the _"OAuth example"_ in the [examples](#examples) list.

## The Server side

The client/server interface as described for the "Resource Owner Password Credentials Grant" in RFC 6749 is
quite simple. The client sends a request including the grant type as well as the user's username and password
to the server's token endpoint:

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=johndoe&password=A3ddj3w
```

The server then either answers with a successful response including the bearer token:

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

For more documentation of the specified error codes, see <a href="http://tools.ietf.org/html/rfc6749#section-5.2" title="RFC 6749 - Error Response">RFC 6749</a>.

The server can also include an expiry as well as a refresh token in the successful response:

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

Refresh tokens are usually valid for longer than access tokens and can be used to obtain fresh
access tokens when these are expired. If the server supports refresh tokens, Ember.SimpleAuth will
automatically refresh access tokens about 5 seconds before they expire:

```
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
```

### The `Authorization` header

Once the access token has successfully been acquired from the server, all subsequent
request the client sends will includes the `Authorization` header. The server uses
that token to identify the user making the request:

```
Authorization: Bearer <secret token>
```

**As the access token is sent without any further encryption etc. you should
make sure you're always using TLS/HTTPS for all client/server communication!**

### Custom Servers

In order to use a custom server that is not compliant to RFC 6749, there are only two things
that need to be customized: the construction of the request that is sent to the server to
acquire the access token and the parsing of the server's response. To customize the request,
simply override the `tokenRequestOptions` method in the login controller, e.g.:

```js
App.LoginController  = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  tokenRequestOptions: function(username, password) {
    var putData = '{ "SESSION": { "USER_NAME": "' + username + '", "PASS": "' + password + '" } }';
    return { type: 'PUT', data: putData, contentType: 'application/json' };
  }
});
```

In this case the request that is sent to acquire the token will be a PUT request with JSON
data instead of the standard POST with form-encoded data.

To customize the parsing of the server's token response, override the `setup` method of
Ember.SimpleAuth.Session, e.g.:

```js
Ember.SimpleAuth.Session.reopen({
  setup: function(serverSession) {
    this.set('authToken', serverSession.SESSION.TOKEN);
  }
});
```

### Middlewares supporting RFC 6749

This is an incomplete list of middlewares supporting RFC 6749.

Ruby

Python

Perl

PHP

Java

## Configuration

Ember.SimpleAuth offers some configuration settings that allow to customize parts of the library
without actually changing/overriding any code:

```js
Ember.SimpleAuth.setup(container, application, {
  routeAfterLogin: ...  // the route that Ember.SimpleAuth redirects the user to after successfully logging in - defaults to 'index'
  routeAfterLogout: ... // the route that Ember.SimpleAuth redirects the user to after logging out - defaults to 'index'
  loginRoute: ...       // the route that Ember.SimpleAuth redirects the user to when login is required - defaults to 'login'
  serverTokenRoute: ... // the server endpoint used to acquire the access token - defaults to '/token'
  autoRefreshToken: ... // enable/disable automatic token refreshing (if the server supports it) - defaults to true
});
```

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
