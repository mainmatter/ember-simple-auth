[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.png?branch=master)](https://travis-ci.org/simplabs/ember-simple-auth)

__[Ember.SimpleAuth's API docs are available here](http://ember-simple-auth.simplabs.com/api.html)__

#  Ember.SimpleAuth

Ember.SimpleAuth is a __lightweight library for implementing authentication/
authorization with [Ember.js](http://emberjs.com) applications__. It has
minimal requirements regarding the application structure, routes etc. Due to
its configurable strategies it can support all kinds of authentication and
authorization mechanisms.

## How does it work?

Ember.SimpleAuth is based on the idea that __there is always an application
session in whose context the user is using the application. This session can
either be authenticated or not.__ Ember.SimpleAuth provides a number of classes
and mixins that create that session, make it available throughout the
application, provide methods for authenticating and invalidating it etc.

__To enable Ember.SimpleAuth in an application, simply add a custom
initializer__ (also see the
[API docs for `Ember.SimpleAuth.setup`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-setup)):

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(application);
  }
});
```

This initializer sets up the session (see the
[API docs for `Ember.SimpleAuth.Session`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Session)
and __makes it available as `session` in all routes, controllers, views and
models__). It also sets up an
[`$.ajaxPrefilter`](http://api.jquery.com/jQuery.ajaxPrefilter/) that is used
to authorize AJAX requests with the information stored in the session when it
is authenticated ([see below](#authorizers)).

The application route must include the respective mixin provided by
Ember.SimpleAuth:

```js
App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);
```

This adds some actions to `App.ApplicationRoute` like `authenticateSession` and
`invalidateSession` as well as callback actions that are triggered when the
session's authentication state changes like `sessionAuthenticationSucceeded` or
`sessionInvalidationSucceeded` (see the
[API docs for `ApplicationRouteMixin`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-ApplicationRouteMixin)).

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
there is another mixin__ that Ember.SimpleAuth provides and that can simply
be included in the respective route (see the
[API docs for `AuthenticatedRouteMixin`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-AuthenticatedRouteMixin)):

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
[API docs for `Session#authenticate`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Session-authenticate).

#### The RFC 6749 (OAuth 2.0) Authenticator

Ember.SimpleAuth's default authenticator (see the
[API docs for `Authenticators.OAuth2`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authenticators-OAuth2))
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

This route displays the login form with fields for `identification` and
`password`:

```html
<form {{action 'authenticate' on='submit'}}>
  <label for="identification">Login</label>
  {{input id='identification' placeholder='Enter Login' value=identification}}
  <label for="password">Password</label>
  {{input id='password' placeholder='Enter Password' type='password' value=password}}
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
* Rails app template: https://github.com/bazzel/rails-templates/blob/master/ember-simple-auth.rb

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
[API docs for `Authenticators.Base`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authenticators-Base)).

__Custom authenticators have to be registered with Ember's dependency
injection container__ so that the session can retrieve an instance, e.g.:

```javascript
var CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
  ...
});
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    container.register('app:authenticators:custom', CustomAuthenticator);
    Ember.SimpleAuth.setup(container, application);
  }
});
```

To use a custom authenticator, simply specify the registered factory in the
controller handling the login route of the application:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  authenticator: 'app:authenticators:custom'
});
```

or in the case that the authenticator does not use a login form with
`identification` and `password`, include the more generic
`AuthenticationControllerMixin` (see the
[API docs for `AuthenticationControllerMixin`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-AuthenticationControllerMixin))
to implement a custom solution:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.AuthenticationControllerMixin, {
  authenticator: 'app:authenticators:custom',
  actions: {
    authenticate: function() {
      var options = …// some options that the authenticator uses
      this._super(options);
    }
  }
});
```

### Authorizers

While the authenticator acquires some sort of secret information from the
authentication provider when it authenticates the session (e.g. the
`access_token` in the case of the
[OAuth 2.0 authenticator](#the-rfc-6749-oauth-20-authenticator)), __the
authorizer uses that secret information to identify the user in subsequent
requests__. Thus, as the authorizer depends on the information provided by the
authenticator, the two have to fit together.

There is always only one authorizer in an application which can be set when
Ember.SimpleAuth is set up (see the
[API docs for `Ember.SimpleAuth.setup`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-setup)).

#### The RFC 6750 Authorizer

Ember.SimpleAuth's default authorizer (see the
[API docs for `Authorizers.OAuth2`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authorizers-OAuth2))
is compliant with [RFC 6750 (OAuth 2.0 Bearer Tokens)](http://tools.ietf.org/html/rfc6750)
and thus fits the default OAuth 2.0 authenticator. It simply injects an
`Authorization` header with the `access_token` that the authenticator acquired
into all requests:

```
Authorization: Bearer <access_token>
```

#### Implementing a custom Authorizer

While Ember.SimpleAuth only comes with the OAuth 2.0 authorizer, it is easy to
implement custom authorizers as well. All that needs to be done is to extend
`Authorizers.Base` and implement 1 method (see the
[API docs for `Authorizers.Base`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authorizers-Base)).

To use a custom authorizer, simply configure it in the initializer:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      authorizer: App.MyCustomAuthorizer
    });
  }
});
```

#### Cross Origin Authorization

Ember.SimpleAuth __will never authorize cross origin requests__ so that no
secret information gets exposed to 3rd parties. To enable authorization for
additional origins (for example if the REST API of the application runs on a
different domain than the one the Ember.js application is served from) __these
origins can be whitelisted__ when Ember.SimpleAuth is set up _(beware that
origins consist of protocol, host and port (port can be left out when it is
80))_:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      crossOriginWhitelist: ['http://some.other.domain:1234']
    });
  }
});
```

### Stores

Ember.SimpleAuth __persists the session state and its properties so it survives
a page reload__. When the session is created in the application initializer it
tries to restore any previously persisted state and properties and if that
succeeds, is authenticated immediately. While Ember.SimpleAuth comes with
several store types, only one store is used per application; that store can be
configured during setup (see the
[API docs for `Ember.SimpleAuth.setup`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-setup)):

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      store: Ember.SimpleAuth.Stores.Cookie
    });
  }
});
```

#### Store Types

Ember.SimpleAuth comes with 3 stores:

##### `Stores.Cookie`

The cookie store (see the
[API docs for `Stores.Cookie`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Stores-Cookie))
stores its data in session cookies.

##### `Stores.LocalStorage`

The local storage store (see the
[API docs for `Stores.LocalStorage`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Stores-LocalStorage))
stores its data in the browser's `localStorage`; __this is the default store__.

##### `Stores.Ephemeral`

The ephemeral store (see the
[API docs for `Stores.Ephemeral`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Stores-Ephemeral))
stores its data in memory and thus __is not actually persistent__. This store
is mainly useful for testing.

#### Implementing a custom Store

Implementing a custom store is as easy as implementing custom authenticators or
authorizers. All that needs to be done is to extend `Stores.Base` and implement
3 methods (see the
[API docs for `Stores.Base`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Stores-Base)).

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
