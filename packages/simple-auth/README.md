[![Build Status](https://travis-ci.org/simplabs/simple-auth.png?branch=master)](https://travis-ci.org/simplabs/simple-auth)

__[SimpleAuth's API docs are available here](http://simple-auth.simplabs.com/simple-auth-api-docs.html)__

#  SimpleAuth

SimpleAuth is a __lightweight library for implementing authentication/
authorization with [Ember.js](http://emberjs.com) applications__. It has
minimal requirements with respect to application structure, routes etc. With
its pluggable strategies it can support all kinds of authentication and
authorization mechanisms.

## What does it do?

* it __manages authentication state__, synchronizes it across tabs/windows
* it __authenticates users__ against the application's own server, external
  providers like Facebook etc.
* it __authorizes requests__ to the backend server
* it has a simple customization API

## How does it work?

SimpleAuth is built around the idea that __there is always an application
session in whose context the user is using the application. This session can
either be authenticated or not.__ SimpleAuth creates that session,
provides functionality to authenticate and invalidate it and also has a set of
mixins that provide default implementations for common scenarios like
redirecting users to the login if they access a restricted page etc.

__To enable SimpleAuth in an application, simply add a custom
initializer__ (also see the
[API docs for `SimpleAuth.setup`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-setup)):

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    SimpleAuth.setup(container, application);
  }
});
```

This initializer sets up the session (see the
[API docs for `SimpleAuth.Session`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Session)
and __makes it available in all routes and controllers__ of the application).

While not necessary, the easiest way to use the session is to include the
`ApplicationRouteMixin` mixin provided by SimpleAuth in the application's
application route:

```js
App.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin);
```

This adds some actions to `App.ApplicationRoute` like `authenticateSession` and
`invalidateSession` as well as callback actions that are triggered when the
session's authentication state changes like `sessionAuthenticationSucceeded` or
`sessionInvalidationSucceeded` (see the
[API docs for `ApplicationRouteMixin`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-ApplicationRouteMixin)).
Displaying e.g. login/logout buttons in the UI depending on the session's
authentication state then is as easy as:

```html
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  <a {{ action 'authenticateSession' }}>Login</a>
{{/if}}
```

or in the case that the application uses a dedicated route for logging in:

```html
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
```

To make a route in the application require the session to be authenticated,
there is another mixin that SimpleAuth provides and that is included in
the respective route (see the
[API docs for `AuthenticatedRouteMixin`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-AuthenticatedRouteMixin)):

```js
App.Router.map(function() {
  this.route('protected');
});
App.ProtectedRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin);
```

This will make the route transition to `/login` (or a different URL if
configured) when the session is not authenticated in the `beforeModel` method.

### Authenticators

__Authenticators implement the concrete steps necessary to authenticate the
session.__ An application can have several authenticators for different kinds
of authentication mechanisms (e.g. the application's own backend server,
external authentication providers like Facebook etc.) while the session is only
authenticated with one authenticator at a time (see the
[API docs for `Session#authenticate`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Session-authenticate)).
The authenticator to use is chosen when authentication is triggered:

```js
this.get('session').authenticate('authenticator:custom', {});
```

SimpleAuth does not include any authenticators in the base library but
has extension libraries that can be loaded as needed:

* [__simple-auth-oauth2__](packages/simple-auth-oauth2) provides an OAuth 2.0 authenticator
* [__simple-auth-devise__](packages/simple-auth-devise) provides an authenticator compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)

#### Implementing a custom Authenticator

Besides the option to use one of the predefined authenticators from the
extension libraries, it is easy to implement custom authenticators as well. All
that is necessary is to extend `Authenticators.Base` and implement three
methods (see the
[API docs for `Authenticators.Base`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Authenticators-Base)).

__Custom authenticators have to be registered with Ember's dependency injection
container__ so that the session can retrieve an instance, e.g.:

```javascript
var CustomAuthenticator = SimpleAuth.Authenticators.Base.extend({
  ...
});
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    container.register('authenticator:custom', CustomAuthenticator);
    SimpleAuth.setup(container, application);
  }
});
```

To authenticate the session with a custom authenticator, simply pass the
registered factory's name:

```js
this.get('session').authenticate('authenticator:custom', {});
```

or when using one of the controller mixins:

```js
App.LoginController = Ember.Controller.extend(SimpleAuth.LoginControllerMixin, {
  authenticatorFactory: 'authenticator:custom'
});
```

Also see the
[API docs for `Session#authenticate`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Session-authenticate),
[LoginControllerMixin](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-LoginControllerMixin)
and
[AuthenticationControllerMixin](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-AuthenticationControllerMixin).

### Authorizers

If the Ember.js application makes requests to a backend server that requires
authorization and an authorizer is specified for SimpleAuth's setup (see
[API docs for `SimpleAuth.setup`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-setup)),
SimpleAuth sets up an
[`$.ajaxPrefilter`](http://api.jquery.com/jQuery.ajaxPrefilter/) that is used
to authorize AJAX requests.

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    SimpleAuth.setup(container, application, {
      authorizerFactory: 'authorizer:custom'
    });
  }
});
```

While the authenticator acquires some sort of secret information from an
authentication provider when it authenticates the session, __the authorizer
uses that secret information to authorize subsequent requests__. An application
always only has one authorizer.

__As the authorizer depends on the information provided by the authenticator,
the two have to fit together.__

SimpleAuth does not include any authorizers in the base library but
offers extension libraries that can be loaded in the application as needed:

* [__simple-auth-oauth2__](packages/simple-auth-oauth2) provides an OAuth 2.0 authorizer
* [__simple-auth-devise__](packages/simple-auth-devise) provides an authorizer compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)

#### Implementing a custom Authorizer

Besides the option to use one of the predefined authorizers from the extension
libraries, it is easy to implement custom authorizers as well. All that is
necessary is to extend `Authorizers.Base` and implement one method (see the
[API docs for `Authorizers.Base`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Authorizers-Base)).

To use a custom authorizer, register it with Ember's container and configure it
in the initializer:

```js
var CustomAuthorizer = SimpleAuth.Authorizers.Base.extend({
  ...
});
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    container.register('authorizer:custom', CustomAuthorizer);
    SimpleAuth.setup(container, application, {
      authorizerFactory: 'authorizer:custom'
    });
  }
});
```

#### Cross Origin Authorization

SimpleAuth __will never authorize cross origin requests__ so that no
secret information gets exposed to third parties. To enable authorization for
additional origins (for example if the REST API of the application runs on a
different domain than the one the Ember.js application is served from),
__additional origins can be whitelisted__ when SimpleAuth is set up
_(beware that origins consist of protocol, host and port where port can be left
out when it is 80 for HTTP or 443 for HTTPS)_:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    SimpleAuth.setup(container, application, {
      crossOriginWhitelist: ['http://some.other.domain:1234']
    });
  }
});
```

### Stores

SimpleAuth __persists the session state so it survives page reloads__.
There is only one store per application that can be configured during setup
(see the
[API docs for `SimpleAuth.setup`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-setup)):

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    SimpleAuth.setup(container, application, {
      storeFactory: 'simple-auth-session-store:local-storage'
    });
  }
});
```

#### Store Types

SimpleAuth comes with 2 bundled stores:

##### `Stores.LocalStorage`

The `localStorage` store (see the
[API docs for `Stores.LocalStorage`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Stores-LocalStorage))
stores its data in the browser's `localStorage`; __this is the default store__.

##### `Stores.Ephemeral`

The ephemeral store (see the
[API docs for `Stores.Ephemeral`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Stores-Ephemeral))
stores its data in memory and thus __is not actually persistent__. This store
is mainly useful for testing. Also the ephemeral store cannot keep multiple
tabs or windows in sync of course as these tabs/windows cannot share memory.

A cookie based store is available in the extension library
[__simple-auth-cookie-store__](packages/simple-auth-cookie-store)
which is not recommended to be used though as it has some drawbacks.

#### Implementing a custom Store

Implementing a custom store is as easy as implementing custom authenticators or
authorizers. All that is necessary is to extend `Stores.Base` and implement
three methods (see the
[API docs for `Stores.Base`](http://simple-auth.simplabs.com/simple-auth-api-docs.html#Ember-SimpleAuth-Stores-Base)).

## Examples

To run the examples you need to have [node.js](http://nodejs.org) and
[grunt](http://gruntjs.com) installed. If you have those, simply run:

```bash
git clone https://github.com/simplabs/simple-auth.git
cd simple-auth
npm install
grunt server
```

Open [http://localhost:8000/examples](http://localhost:8000/examples) to access
the examples.

### Other Examples

* Ember App Kit: https://github.com/erkarl/ember-app-kit-simple-auth
* SimpleAuth with Rails 4: https://github.com/ugisozols/simple-auth-rails-demo
* SimpleAuth with ember-cli and the Devise authenticator/authorizer: https://github.com/givanse/ember-cli-simple-auth-devise

## Installation

To install SimpleAuth and/or its extension libraries in an Ember.js
application you have several options:

* If you're using [Bower](http://bower.io), just add it to your
  `bower.json` file:

  ```js
  {
    "dependencies": {
      "simple-auth": "https://github.com/simplabs/simple-auth-component.git"
    }
  }
  ```

  The bower distribution contains browserified as well as AMD versions of the
  library.
* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/simple-auth/releases)
* [Build it yourself](#building)
* If you're using Ruby on Rails, you can add the (unofficial) source gem that
  supports the Ruby on Rails asset pipeline by adding it to your `Gemfile`:

  ```ruby
  gem 'ember_simple_auth-rails'
  ```

* When using [ember-cli](https://github.com/stefanpenner/ember-cli), add
  SimpleAuth to the `bower.json` file as described above and add the
  following line to the `Brocfile.js`:

  ```js
  app.import('vendor/simple-auth/simple-auth.js');
  ```

  You can also use the AMD version in which case you have to list all the
  modules and exports (which are all `default`) you want to use:

  ```js
  app.import('vendor/simple-auth/amd/simple-auth.js', {
    'simple-auth/configuration': ['default'],
    'simple-auth/initializer': ['default'],
    'simple-auth/session': ['default'],
    'simple-auth/setup': ['default'],
    'simple-auth/authenticators/base': ['default'],
    'simple-auth/authorizers/base': ['default'],
    'simple-auth/mixins/application_route_mixin': ['default'],
    'simple-auth/mixins/authenticated_route_mixin': ['default'],
    'simple-auth/mixins/authentication_controller_mixin': ['default'],
    'simple-auth/mixins/login_controller_mixin': ['default'],
    'simple-auth/stores/base': ['default'],
    'simple-auth/stores/ephemeral': ['default'],
    'simple-auth/stores/local_storage': ['default'],
  });
  ```

## Building

To build SimpleAuth yourself you need to have [node.js](http://nodejs.org)
and [grunt](http://gruntjs.com) installed. If you have those, simply run:

```bash
git clone https://github.com/simplabs/simple-auth.git
cd simple-auth
npm install
grunt dist
```

After running that you will find the compiled source files (including minified
versions) in the `dist` directory.

If you want to run the tests as well you also need
[PhantomJS](http://phantomjs.org). You can run the tests with:

```bash
grunt test
```

You can also start a development server by running

```bash
grunt server
```

and then run the tests in the browser at
[http://localhost:8000](http://localhost:8000).
