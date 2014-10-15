[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.png?branch=master)](https://travis-ci.org/simplabs/ember-simple-auth)

__[Ember Simple Auth's API docs are available here](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html)__

#  Ember Simple Auth

Ember Simple Auth is a __lightweight library for implementing authentication/
authorization with [Ember.js](http://emberjs.com) applications__. It has
minimal requirements with respect to application structure, routes etc. With
its pluggable strategies it can support all kinds of authentication and
authorization mechanisms.

## What does it do?

* it __manages a client side session__ and synchronizes that across tabs/
  windows
* it __authenticates users__ against the application's own server, external
  providers like Facebook etc.
* it __authorizes requests__ to the backend server
* it is easily customizable and extensible

## How do I use it?

Ember Simple Auth is built around the fundamental idea that __users are always
using the application in the context of a (client side) session. This session
can either be authenticated or not.__ Ember Simple Auth creates that session,
provides functionality to authenticate and invalidate it and also has a set of
mixins that provide default implementations for common scenarios like
redirecting users to the login if they access a restricted page etc.

_Ember Simple Auth can be used as a browserified version that exports a global
as well as as an AMD build that can be used e.g. with or Ember CLI. This README
covers usage with Ember CLI; using it with Ember App Kit or via the
browserified distribution is analogous._

When Ember Simple Auth is included in an application (see the
[Installation instructions](#installation) for documentation on the various
options for including it into all types of Ember applications), it registers an
[initializer](http://emberjs.com/api/classes/Ember.Application.html#toc_initializers)
named `'simple-auth'`. Once that initializer has run, the session (see the
[API docs for `Session`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Session))
__will be available in all routes and controllers__ of the application.

While not necessary, the easiest way to use the session is to include the
`ApplicationRouteMixin` mixin provided by Ember Simple Auth in the
application route:

```js
// app/routes/application.js
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin);
```

This adds some actions to the application route like `authenticateSession` and
`invalidateSession` as well as callback actions that are triggered when the
session's authentication state changes like `sessionAuthenticationSucceeded` or
`sessionInvalidationSucceeded` (see the
[API docs for `ApplicationRouteMixin`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-ApplicationRouteMixin)).
Displaying e.g. login/logout buttons in the UI depending on the session's
authentication state then is as easy as:

```html
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
```

To make a route in the application require the session to be authenticated,
there is another mixin that Ember Simple Auth provides and that is included in
the respective route (see the
[API docs for `AuthenticatedRouteMixin`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-AuthenticatedRouteMixin)):

```js
// app/routes/protected.js
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin);
```

This will make the route transition to `/login` (or a different URL if
configured) when the session is not authenticated in the `beforeModel` method.

### Authenticators

__Authenticators implement the concrete steps necessary to authenticate the
session.__ An application can have several authenticators for different kinds
of authentication mechanisms (e.g. the application's own backend server,
external authentication providers like Facebook etc.) while the session is only
authenticated with one authenticator at a time (see the
[API docs for `Session#authenticate`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Session-authenticate)).
The authenticator to use is chosen when authentication is triggered:

```js
this.get('session').authenticate('authenticator:custom', {});
```

Ember Simple Auth does not include any authenticators in the base library but
has extension libraries that can be loaded as needed:

* [__simple-auth-oauth2__](packages/ember-simple-auth-oauth2) provides an OAuth 2.0 authenticator
* [__simple-auth-devise__](packages/ember-simple-auth-devise) provides an authenticator compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)
* [__simple-auth-torii__](packages/ember-simple-auth-torii) provides an authenticator that wraps the [torii library](https://github.com/Vestorly/torii)

#### Implementing a custom Authenticator

Besides the option to use one of the predefined authenticators from the
extension libraries, it is easy to implement custom authenticators as well. All
that is necessary is to extend the base authenticator and implement three
methods (see the
[API docs for `Authenticators.Base`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Authenticators-Base)).

__Custom authenticators have to be registered with Ember's dependency injection
container__ so that the session can retrieve an instance, e.g.:

```js
import Base from 'simple-auth/authenticators/base';

var CustomAuthenticator = Base.extend({
  …
});

Ember.Application.initializer({
  name: 'authentication',
  before: 'simple-auth',
  initialize: function(container, application) {
    container.register('authenticator:custom', CustomAuthenticator);
  }
});
```

To authenticate the session with a custom authenticator, simply pass the
registered factory's name to the session's `authenticate` method (see the
[API docs for `Session#authenticate`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Session-authenticate)):

```js
this.get('session').authenticate('authenticator:custom', {});
```

or when using one of the controller mixins:

```js
// app/controllers/login.js
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  authenticator: 'authenticator:custom'
});
```

Also see the
[API docs for `Session#authenticate`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Session-authenticate),
[`LoginControllerMixin`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-LoginControllerMixin)
and
[`AuthenticationControllerMixin`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-AuthenticationControllerMixin).

### Authorizers

If the Ember.js application makes requests to a backend server that requires
authorization and an authorizer is configured, Ember Simple Auth sets up an
[`$.ajaxPrefilter`](http://api.jquery.com/jQuery.ajaxPrefilter/) that is used
to authorize AJAX requests. An authorizer can be configured in the global
configuration object:

```js
window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  authorizer: 'authorizer:custom'
}
```

While the authenticator acquires some sort of secret information from an
authentication provider when it authenticates the session, __the authorizer
uses that secret information acquired by the authenticator to authorize
subsequent requests, thus the authenticator and authorizer have to fit
together__. An application always only has one authorizer.

Ember Simple Auth does not include any authorizers in the base library but
offers extension libraries that can be loaded in the application as needed:

* [__simple-auth-oauth2__](packages/ember-simple-auth-oauth2) provides an OAuth 2.0 authorizer
* [__simple-auth-devise__](packages/ember-simple-auth-devise) provides an authorizer compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)

#### Implementing a custom Authorizer

Besides the option to use one of the predefined authorizers from the extension
libraries, it is easy to implement custom authorizers as well. All you have to
do is to extend the base authorizer and implement one method (see the
[API docs for `Authorizers.Base`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Authorizers-Base)).

To use a custom authorizer, register it with Ember's container and configure it
in the global environment object:

```js
import Base from 'simple-auth/authorizers/base';

var CustomAuthorizer = Base.extend({
  …
});

Ember.Application.initializer({
  name: 'authorization',
  before: 'simple-auth',
  initialize: function(container, application) {
    container.register('authorizer:custom', CustomAuthorizer);
  }
});

window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  authorizer: 'authorizer:custom'
}
```

#### Cross Origin Authorization

Ember Simple Auth __will never authorize cross origin requests__ so that no
secret information gets exposed to third parties. To enable authorization for
additional origins (for example if the REST API of the application runs on a
different domain than the one the Ember.js application is served from),
__additional origins can be whitelisted__ in the configuration _(beware that
origins consist of protocol, host and port where port can be left out when it
is 80 for HTTP or 443 for HTTPS)_:

```js
window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  crossOriginWhitelist: ['http://some.other.domain:1234']
}
```

### Stores

Ember Simple Auth __persists the session state so it survives page reloads__.
There is only one store per application that can be configured in the global
configuration object:

```js
window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  store: 'simple-auth-session-store:local-storage'
}
```

#### Store Types

Ember Simple Auth comes with 2 bundled stores:

##### `localStorage` Store

The `localStorage` store (see the
[API docs for `Stores.LocalStorage`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-LocalStorage))
stores its data in the browser's `localStorage`; __this is the default store__.

##### Ephemeral Store

The ephemeral store (see the
[API docs for `Stores.Ephemeral`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-Ephemeral))
stores its data in memory and thus __is not actually persistent__. This store
is mainly useful for testing. Also the ephemeral store cannot keep multiple
tabs or windows in sync as tabs/windows cannot share memory.

A cookie based store is available in the extension library
[__simple-auth-cookie-store__](packages/ember-simple-auth-cookie-store).

#### Implementing a custom Store

Implementing a custom store is as easy as implementing custom authenticators or
authorizers. All you have to do is to extend the base store and implement three
methods (see the
[API docs for `Stores.Base`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-Base)).

## Testing

The
[Ember Simple Auth Testing extension library](packages/ember-simple-auth-testing)
provides test helpers for testing applications using Ember Simple Auth. [Setup instructions here](http://log.simplabs.com/post/92824729750/testing-with-ember-simple-auth-and-ember-cli)

## Examples

To run the examples you need to have [node.js](http://nodejs.org) and
[grunt](http://gruntjs.com) installed. If you have those, simply run:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth
npm install
grunt server
```

Open [http://localhost:8000/examples](http://localhost:8000/examples) to access
the examples.

### Other Examples

* [Ember App Kit](https://github.com/erkarl/ember-app-kit-simple-auth)
* [Ember Simple Auth with Rails 4](https://github.com/ugisozols/ember-simple-auth-rails-demo)
* [Ember Simple Auth with ember-cli and the Devise authenticator/authorizer](https://github.com/givanse/ember-cli-simple-auth-devise)

## Installation

To install Ember Simple Auth in an Ember.js application there are several
options:

### Ember CLI

If you're using [Ember CLI](https://github.com/stefanpenner/ember-cli), just
add the
[ember-cli-simple-auth](https://github.com/simplabs/ember-cli-simple-auth)
Ember CLI Addon to your project and Ember Simple Auth will setup itself.

The Ember Simple Auth extension libraries are also available as Ember CLI
Addons:

* [ember-cli-simple-auth-oauth2](https://github.com/simplabs/ember-cli-simple-auth-oauth2)
* [ember-cli-simple-auth-devise](https://github.com/simplabs/ember-cli-simple-auth-devise)
* [ember-cli-simple-auth-cookie-store](https://github.com/simplabs/ember-cli-simple-auth-cookie-store)
* [ember-cli-simple-auth-torii](https://github.com/simplabs/ember-cli-simple-auth-torii)

### Bower

Ember Simple Auth is also available in the _"ember-simple-auth"_ bower
package which includes both a browserified version as well as an AMD build.
If you're using the AMD build from bower be sure to require the autoloader:

```js
require('simple-auth/ember');
```

The browserified version will, like the Ember CLI addon, also setup itself
once it is loaded in the application.

### Other Options

* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
* [Build it yourself](#building)

## Building

To build Ember Simple Auth yourself you need to have
[node.js](http://nodejs.org) and [grunt](http://gruntjs.com) installed. If you
have those, simply run:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd simple-auth
npm install
grunt dist
```

After running that you will find the compiled files in the `dist` directory.

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
