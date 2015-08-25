[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.svg?branch=master)](https://travis-ci.org/simplabs/ember-simple-auth)

__[Ember Simple Auth's API docs are available here](http://ember-simple-auth.com/ember-simple-auth-api-docs.html)__

#  Ember Simple Auth

![Logo](http://ember-simple-auth.com/images/logo.png)

Ember Simple Auth is a __lightweight library for implementing authentication/
authorization with [Ember.js](http://emberjs.com) applications__. It has
minimal requirements with respect to application structure, routes etc. With
its pluggable strategies it can support all kinds of authentication and
authorization mechanisms.

## What does it do?

* it __manages a client side session__ and synchronizes that across tabs/
  windows
* it __authenticates the session__ against the application's own server, external
  providers like Facebook etc.
* it __authorizes requests__ to backend servers
* it is easily customizable and extensible

## How do I use it?

### The Session

Ember Simple Auth is built around the fundamental idea that __users are always
using the application in the context of a (client side) session. This session
can either be authenticated or not.__ Ember Simple Auth creates that session,
provides functionality to authenticate and invalidate it and also has a set of
mixins that provide default implementations for common scenarios like
redirecting users to the login if they access a restricted page etc.

The session can be accessed via the `session` service. That service defines
(besides other things) the `isAuthenticated` property returns whether the session is authenticated or not.
In order to e.g. show a login or logout button depending on the current authentication state,
simple inject the service in the respective component or controller

```js
import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session')
});
```

and add an `if` in the respective template:

```html
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
```

For authenticating and invalidating the session, the service
defines the `authenticate` and `invalidate` methods. The `authenticate` method
expects the authenticator to use as first argument and additional arguments depending
on the authenticator used, e.g.:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      let data = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:some', data).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
```

`invalidate` doesn't expect any arguments:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  actions: {
    invalidate() {
      this.get('session').invalidate();
    }
  }
});
```

The session service also provides the `sessionAuthenticated` and `sessionInvalidated` events that
are triggered whenever the session is successfully authenticated or invalidated (which not only happens
when the user submit the login form or clicks the login button but also when the session is authenticated
or invalidated in another tab or window which will then be synchronized to other tabs via the session store).
To have these events handled in the default way automatically, simply mixin the `ApplicationRouteMixin`
in the application route:

```js
// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin);
```

To make a route in the application require the session to be authenticated,
there is another mixin that Ember Simple Auth provides and that is included in
the respective route (see the
[API docs for `AuthenticatedRouteMixin`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-AuthenticatedRouteMixin)):

```js
// app/routes/protected.js
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin);
```

This will make the route transition to `/login` (or a different URL if
configured) when the session is not authenticated in the `beforeModel` method.

To prevent a route from being accessed when the session is authenticated (which
makes sense for the `login` route for example), use the
[`UnauthenticatedRouteMixin`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-UnauthenticatedRouteMixin)).

### Authenticators

__Authenticators implement the concrete steps necessary to authenticate the
session.__ An application can have several authenticators for different kinds
of authentication mechanisms (e.g. the application's own backend server,
external authentication providers like Facebook etc.) while the session is only
authenticated with one authenticator at a time (see the
[API docs for `Session#authenticate`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Session-authenticate)).
The authenticator to use is chosen when authentication is triggered:

```js
this.get('session').authenticate('authenticator:some', {});
```

Ember Simple Auth comes with 3 authenticators:

* `OAuth2PasswordGrantAuthenticator`: an OAuth 2.0 authenticator that implements the _"Resource Owner Password Credentials Grant Type"_
* `DeviseAuthenticator`: an authenticator compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)
* `ToriiAuthenticator`: an authenticator that wraps the [torii library](https://github.com/Vestorly/torii)

To use one of these authenticator in an application, simply extend it:

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrantAuthenticator.extend();
```

This authenticator can then be used to authenticate the session as follows:

```js
this.get('session').authenticate('authenticator:some', data)
```

#### Implementing a custom Authenticator

Besides the option to use one of the predefined authenticators, it is easy to implement custom authenticators as well. All
that is necessary is to extend the base authenticator and implement three
methods (see the
[API docs for `Authenticators.Base`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Authenticators-Base)),
e.g.:

```js
// app/authenticators/custom.js
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  restore: function(data) {
    …
  },
  authenticate: function(options) {
    …
  },
  invalidate: function(data) {
    …
  }
});
```

This authenticator can then be used to authenticate the session as follows:

```js
this.get('session').authenticate('authenticator:custom', {});
```

### Authorizers

Ember Simple Auth defines authorizers to use data obtained on session authentication
to e.g. authorize backend requests. While the authenticator acquires some sort of secret information from an
authentication provider when it authenticates the session, __the authorizer
uses that secret information acquired by the authenticator to authorize
subsequent requests, thus the authenticator and authorizer have to fit
together__.

Ember Simple Auth comes with 2 authorizers:

* `OAuth2BearerAuthorizer`: an OAuth 2.0 authorizer that uses Bearer tokens
* `DeviseAuthorizer`: an authorizer compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)

Unlike in previous versions of Ember Simple Auth, authorization will not happen automatically for
all requests the application makes anymore but has to be done explicitly via the service. Therefor the service
defines the `authorize` method that calls a specified callback with the authorization data if the session is
authenticated:

```js
this.get('session').authorize('authorizer:some', (authorizationData) => {
  // do sth. with the authorizationData
});
```

When using Ember Data this would be added to the application adapter to inject an `Authorization` into requests so
that the API can identify the user issuing the request. As that is a very common case though there is the
`DataAdapterMixin` to simplify this:

```js
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:application'
});
```

#### Implementing a custom Authorizer

Besides the option to use one of the predefined authorizers from the extension
libraries, it is easy to implement custom authorizers as well. All you have to
do is to extend the base authorizer and implement one method (see the
[API docs for `Authorizers.Base`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Authorizers-Base)).

```js
// app/authorizers/custom.js
import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  authorize(block) {
    …
  }
});
```

### Stores

Ember Simple Auth __persists the session state so it survives page reloads__.
There is only one store per application that can be configured in the application's
environment object:

```js
//config/environment.js
ENV['simple-auth'] = {
  store: 'session-store:local-storage'
}
```

#### Store Types

Ember Simple Auth comes with 2 bundled stores:

##### `localStorage` Store

The `localStorage` store (see the
[API docs for `Stores.LocalStorage`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-LocalStorage))
stores its data in the browser's `localStorage`; __this is the default store__.

##### Ephemeral Store

The ephemeral store (see the
[API docs for `Stores.Ephemeral`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-Ephemeral))
stores its data in memory and thus __is not actually persistent__. This store
is mainly useful for testing. Also the ephemeral store cannot keep multiple
tabs or windows in sync as tabs/windows cannot share memory.

A cookie based store is available in the extension library
[__simple-auth-cookie-store__](packages/ember-simple-auth-cookie-store).

#### Implementing a custom Store

Implementing a custom store is as easy as implementing custom authenticators or
authorizers. All you have to do is to extend the base store and implement three
methods (see the
[API docs for `Stores.Base`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-Base)).

## Testing

Ember Simple Auth comes with a set up test helpers that help testing
authentication:

* `currentSession()`: provides access to the current session.
* `authenticateSession(sessionData)`: authenticates the session; the optional
  `sessionData` argument can be used to mock an authenticator response - e.g.
  a token.
* `invalidateSession()`: invalidates the session.

## Dummy app

Ember Simple Auth comes with a dummy app that shows how to use it. To run it,
clone the repository and start the Ember server:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth
npm install
bower install
ember serve
```

Open [http://localhost:4200](http://localhost:4200) to access the app.

## Installation

Ember Simple Auth is distributed as an Ember CLI Addon so installation is as
easy as:

```bash
ember install ember-simple-auth
```

## Configuration

Ember Simple Auth is configured via the `'ember-simple-auth'` section in the
application's `config/environment.js` file. See the
[API docs](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Configuration))
for the available settings.

## License

Ember Simple Auth is developed by and &copy;
[simplabs GmbH/Marco Otte-Witte](http://simplabs.com) and contributors. It is
released under the
[MIT License](https://github.com/simplabs/ember-simple-auth/blob/master/LICENSE).

Ember Simple Auth is not an official part of [Ember.js](http://emberjs.com) and
is not maintained by the Ember.js Core Team.
