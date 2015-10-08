[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.svg?branch=master)](https://travis-ci.org/simplabs/ember-simple-auth)

__[Ember Simple Auth's API docs are available here](http://ember-simple-auth.com/api/)__

#  Ember Simple Auth

![Logo](http://ember-simple-auth.com/images/logo.png)

Ember Simple Auth is a __lightweight library for implementing authentication/
authorization with [Ember.js](http://emberjs.com) applications__. It has
minimal requirements with respect to application structure, routes etc. With
its pluggable strategies it __can support all kinds of authentication and
authorization mechanisms__.

## What does it do?

* it __maintains a client side session__ and synchronizes its state across
  multiple tabs/windows of the application
* it __authenticates the session__ against the application's own server, external
  providers like Facebook etc.
* it __authorizes requests__ to backend servers
* it is __easily customizable and extensible__

## How does it work?

Ember Simple Auth consists of __4 main building blocks__ - the session, a session store, authenticators and (optionally)
authorizers.

The __session service is the main interface to the library__. It provides __methods for authenticating and invalidating the
session__ as well as for setting and reading session data.

The __session store persists the session state__ so that it survives a page reload. It also synchronizes the session state
across multiple tabs or windows of the application so that e.g. a logout in one tab or window also results in a logout in all other tabs or windows of the application.

__Authenticators authenticate the session__. An application can leverage multiple authenticators to support multiple ways
of authentication such as sending credentials to the application's own backend server, Facebook, github etc.

__Authorizers__ use the data retrieved by an authenticator and stored in the session to __generate
authorization data that can be injected into outgoing requests such as Ember Data requests__.

## How do I use it?

__Ember Simple Auth comes with a
[dummy app](https://github.com/simplabs/ember-simple-auth/tree/master/tests/dummy)
that implementes a complete auth solution__ including authentication against
the application's own server as well as Facebook, authorization of Ember Data
requests and error handling. __Check out that dummy app for reference.__ To start
it, run

```
git clone git@github.com:simplabs/ember-simple-auth.git
cd ember-simple-auth
npm install && bower install && ember serve
```

and go to [http://localhost:4200](http://localhost:4200).

### Installation

Installing the library is as easy as:

```bash
ember install ember-simple-auth
```

### Basic Usage

Once the library is installed, __the session service can be injected wherever needed in the application__. In order to e.g.
display login/logout buttons depending on the current session state, inject the service into the respective
controller or component and __query its `isAuthenticated` property in the template__:

```js
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session')

  …
});
```

```handlebars
{{!-- app/templates/application.hbs --}}
<div class="menu">
  …
  {{#if session.isAuthenticated}}
    <a {{action 'invalidateSession'}}>Logout</a>
  {{else}}
    {{#link-to 'login'}}Login{{/link-to}}
  {{/if}}
</menu>
<div class="main">
  {{outlet}}
</div>
```

In the `invalidateSession` action __call the session service's `invalidate` method to invalidate the session__ and log the user out:

```js
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  …

  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
    }
  }
});
```

For authenticating the session, __the session service provides the `authenticate` method__ that takes the name of the
authenticator to use as well as other arguments depending on specific authenticator used. __To define an authenticator, add a new file
in `app/authenticators`__ and extend one of the authenticators the library comes with, e.g.:

```js
// app/authenticator/oauth2.js
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend();
```

With that authenticator and a login form like

```handlebars
{{!-- app/templates/login.hbs --}}
<form {{action 'authenticate' on='submit'}}>
  <div class="form-group">
    <label for="identification">Login</label>
    {{input value=identification placeholder='Enter Login' class='form-control'}}
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    {{input value=password placeholder='Enter Password' class='form-control' type='password'}}
  </div>
  <button type="submit" class="btn btn-default">Login</button>
</form>
```

the __session can be authenticated with the session service's `authenticate` method__:

```js
// app/controllers/login.js
import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
```

__The session service also provides the `authenticationSucceeded` and `invalidationSucceeded` events__ that
are triggered whenever the session is successfully authenticated or invalidated (which not only happens
when the user submits the login form or clicks the logout button but also when the session is authenticated
or invalidated in another tab or window of the application).
__To have these events handled automatically, simply mixin the `ApplicationRouteMixin`
in the application route__:

```js
// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin);
```

The `ApplicationRouteMixin` automatically maps the session events to the `sessionAuthenticated` and `sessionInvalidated`
methods it implements. The `sessionAuthenticated` method will transition to a configurable route while the `sessionInvalidated`
method will reload the page to clear all potentially sensitive data from memory.

__To make a route in the application accessible only when the session is authenticated__,
mixin the `AuthenticatedRouteMixin` into the respective route:

```js
// app/routes/protected.js
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin);
```

This will make the route (and all of its subroutes) transition to a configurable login route when the session is not authenticated.

To prevent a route from being accessed when the session is authenticated (which
makes sense for login and registration routes for example), mixin the UnauthenticatedRouteMixin into the respective route.

In order to add authorization information to outgoing API requests the application can define an authorizer. To do so,
add a new file to `app/authorizers`, e.g.:

```js
// app/authorizers/oauth2.js
import OAuth2Bearer from 'ember-simple-auth/authenticators/oauth2-bearer';

export default OAuth2Bearer.extend();
```

and use that to authorize a block of code via the session service's `authorize` method, e.g.:

```js
this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
  const headers = {};
  headers[headerName] = headerValue;
  Ember.$.ajax('/secret-data', { headers });
});
```

To include authorization info in all Ember Data requests if the session is authenticated, mixin the DataAdapterMixin into the application adapter:

```js
// app/adapters/application.js
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:oauth2'
});
```

## The Session Service

The session service is the main interface to the library. It defines the `authenticate`, `invalidate` and `authorize` methods
as well as the session events as shown above.

It also provides the __`isAuthenticated` as well as the `data` properties. The latter
can be used to get and set the session data__. While the special `authenticated` section in the session data is contains the data
that was acquired by the authenticator when it authenticated the session and is read-only, all other session data
can be written and will also remain in the session after session invalidation. It can be used to store all kinds of client side
data that needs to be persisted and synchronized across tabs and windows, e.g.:

```js
this.get('session').set('data.locale', 'de');
```

## Authenticators

__Authenticators implement the concrete steps necessary to authenticate the
session.__ An application can have several authenticators for different kinds
of authentication mechanisms (e.g. the application's own backend server,
external authentication providers like Facebook etc.) while the session is only
ever authenticated with one authenticator at a time (see the
[API docs for `Session#authenticate`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Session-authenticate)).
The authenticator to use is chosen when authentication is triggered via the
name it is registered with in the Ember container:

```js
this.get('session').authenticate('authenticator:some', {});
```

Ember Simple Auth comes with 3 authenticators:

* `OAuth2PasswordGrantAuthenticator`: an OAuth 2.0 authenticator that implements the _"Resource Owner Password Credentials Grant Type"_
* `DeviseAuthenticator`: an authenticator compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)
* `ToriiAuthenticator`: an authenticator that wraps the [torii library](https://github.com/Vestorly/torii)

To use any of these authenticators in an application, define a new authenticator in `app/authenticators`, extend if from the Ember Simple Auth authenticator

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend();
```

and invoke the session service's `authenticate` method with the respective name, specifying more arguments as needed by the authenticator:

```js
this.get('session').authenticate('authenticator:some', data);
```

### Implementing a custom Authenticator

Besides extending one of the predefined authenticators, an application can also implement fully custom authenticators. In order to
do that, extend the abstract base authenticator that Ember Simple Auth comes with and implement the `authenticate`, `restore`
and (optionally) `invalidate` methods:

```js
// app/authenticators/custom.js
import Base from 'ember-simple-auth/authenticators/base';

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

## Authorizers

__Authorizers use the session data aqcuired by the authenticator to construct authorization data__ that can be
injected into outgoing network requests. As the authorizer depends on the data that the authenticator acquires,
__authorizers and authenticators have to fit together__.

Ember Simple Auth comes with 2 authorizers:

* `OAuth2BearerAuthorizer`: an OAuth 2.0 authorizer that uses Bearer tokens
* `DeviseAuthorizer`: an authorizer compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)

To use any of these authorizers in an application, define a new authroizer in `app/authroizer`, extend if from the Ember Simple Auth authroizer

```js
// app/authorizers/oauth2.js
import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';

export default OAuth2Bearer.extend();
```

and invoke the session service's `authorize` method with the respective:

```js
this.get('session').authorize('authenticator:some', () => {
  …
});
```

__Unlike in previous versions of Ember Simple Auth, authorization will not happen automatically for
all requests the application issues anymore__ but has to be initiated explicitly via the service.__

When using Ember Data you can mixin the `DataAdapterMixin` in the application adapter to automatically authorize all API requests:

```js
// app/adapters/application.js
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:some'
});
```

### Implementing a custom Authorizer

Besides extending one of the predefined authorizers, an application can also implement fully custom authorizers. In order to
do that, extend the abstract base authorizer that Ember Simple Auth comes with and implement the `authorize` method:

```js
// app/authorizers/custom.js
import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  authorize(sessionData, block) {
    …
  }
});
```

## Session Stores

Ember Simple Auth __persists the session state via a session store so it survives page reloads__.
There is only one store per application that can be configured in the application's
environment object:

```js
//config/environment.js
ENV['ember-simple-auth'] = {
  store: 'session-store:local-storage'
}
```

### Store Types

Ember Simple Auth comes with 3 stores:

#### `localStorage` Store

The `localStorage` store (see the
[API docs for `Stores.LocalStorage`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-LocalStorage))
stores its data in the browser's `localStorage`; __this is the default store__.

#### Cookie Store

The Cookie store (see the
[API docs for `Stores.LocalStorage`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-LocalStorage))
stores its data in a cookie

#### Ephemeral Store

The ephemeral store (see the
[API docs for `Stores.Ephemeral`](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Stores-Ephemeral))
stores its data in memory and thus __is not actually persistent__. This store
is mainly useful for testing. Also the ephemeral store cannot keep multiple
tabs or windows in sync as tabs/windows cannot share memory.

### Implementing a custom Store

Besides using one of the predefined session stores, an application can also implement fully custom store. In order to
do that, extend the abstract base session store that Ember Simple Auth comes with and implement the `persist`
and `restore` methods:

```js
// app/session-stores/custom.js
import Base from 'ember-simple-auth/session-stores/base';

export default Base.extend({
  persist() {
    …
  },

  restore() {
    …
  }
});
```

## Testing

Ember Simple Auth comes with a set up test helpers that can be used in acceptance tests:

* `currentSession(app)`: returns the current session.
* `authenticateSession(app, sessionData)`: authenticates the session; the optional
  `sessionData` argument can be used to mock an authenticator response - e.g.
  a token.
* `invalidateSession(app)`: invalidates the session.

## Configuration

Ember Simple Auth is configured via the `'ember-simple-auth'` section in the
application's `config/environment.js` file, e.g.:

```js
ENV['ember-simple-auth'] = {
  store: 'session-store:cookie'
};
```

See the
[API docs](http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Configuration))
for the available settings.

## License

Ember Simple Auth is developed by and &copy;
[simplabs GmbH/Marco Otte-Witte](http://simplabs.com) and contributors. It is
released under the
[MIT License](https://github.com/simplabs/ember-simple-auth/blob/master/LICENSE).

Ember Simple Auth is not an official part of [Ember.js](http://emberjs.com) and
is not maintained by the Ember.js Core Team.
