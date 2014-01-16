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
session in whose context the user is using the application. This session can
either be authenticated or not.__ Ember.SimpleAuth provides a number of classes
and mixins that create that session, make it available throughout the
application, provide methods for authenticating and invalidating it etc.

To enable Ember.SimpleAuth in an application, simply add a custom initializer
(also see the
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
is authenticated ([see below](#authorizers)).

The application route of the application must implement the respective mixin
provided by Ember.SimpleAuth:

```js
App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);
```

This adds some actions to `App.ApplicationRoute` like `authenticateSession` and
`invalidateSession` as well as callback actions that are triggered when the
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

This will make the route transition to `/login` (or a different URL if
configured) when the session is not authenticated in the `beforeModel` method.

### Authenticators

__Authenticators implement the steps to authenticate the session.__ An app can
have several authenticators for different kinds of authentication providers
(e.g. the application's own backend server, external authentication providers
like Facebook etc.) while the session can only be authenticated with one at a
time (see the
[API docs for Session#authenticate](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Session-authenticate).

#### The RFC 6749 (OAuth 2.0) Authenticator

Ember.SimpleAuth's default authenticator (see the
[API docs for Authenticators.OAuth2](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authenticators-OAuth2))
is compliant with [RFC 6749 (OAuth 2.0)](http://tools.ietf.org/html/rfc6749),
specifically the _"Resource Owner Password Credentials Grant Type"_. This grant
type basically specifies that the client `POST`s a set of credentials to a
server:

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=johndoe&password=A3ddj3w
```

and in exchange receives an access token that is then used to identify the user
in subsequent requests:

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

This route display the login form with fields for `identification` and
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

While Ember.SimpleAuth only comes with the OAuth 2.0 authenticator, it is
easy to implement authenticators for other strategies as well. All that needs
to be done is to extend `Authenticators.Base` and implement 3 methods (see the
[API docs for Authenticators.Base](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authenticators-Base)).

Then to use that authenticator, simply specify it in the controller handling
the login route of the application:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  authenticator: App.MyCustomAuthenticator
});
```

or in the case that the authenticator does not use a login form with
`identification` and `password`, include the more generic
`AuthenticationControllerMixin` (see the
[API docs for AuthenticationControllerMixin](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-AuthenticationControllerMixin))
to implement a custom solution:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.AuthenticationControllerMixin, {
  authenticator: App.MyCustomAuthenticator,
  actions: {
    authenticate: function() {
      var options = // some options that authenticator uses
      this._super(options);
    }
  }
});
```

### Authorizers

While the authenticator acquires the data that aur

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

You can also start a development server by running

```bash
bundle exec rackup
```

and then run the tests in the browser at
[http://localhost:4567](http://localhost:9292).
