[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.svg?branch=master)](https://travis-ci.org/simplabs/ember-simple-auth)

__[Ember Simple Auth API docs](http://ember-simple-auth.com/api/)__

__[![Discord](https://img.shields.io/discord/480462759797063690.svg?logo=discord)](https://discord.gg/zT3asNS)__

Ember Simple Auth __supports all Ember.js versions starting with 1.12.__

#  Ember Simple Auth

![Logo](http://ember-simple-auth.com/images/logo.png)

Ember Simple Auth is a __lightweight library for implementing authentication/
authorization with [Ember.js](http://emberjs.com) applications__. It has
minimal requirements with respect to application structure, routes etc. With
its pluggable strategies it __can support all kinds of authentication and
authorization mechanisms__.

# Table of Contents

**Basic Information**

* [What does it do?](#what-does-it-do)
* [How does it work?](#how-does-it-work)
* [Example App](#example-app)

**Usage**

* [Installation](#installation)
* [Walkthrough](#walkthrough)

**Core Feature Guides**

* [The Session Service](#the-session-service)
* [Authenticators](#authenticators)
  * [Customizing an Authenticator](#customizing-an-authenticator)
  * [Implementing a custom Authenticator](#implementing-a-custom-authenticator)
* [Authorizers](#authorizers)
  * [Customizing an Authorizer](#customizing-an-authorizer)
  * [Implementing a custom Authorizer](#implementing-a-custom-authorizer)
* [Session Stores](#session-stores)
  * [Store Types](#store-types)
  * [Implementing a Custom Store](#implementing-a-custom-store)
* [Testing](#testing)

**Other Guides**

* [Managing a current User](guides/managing-current-user.md)
* [GitHub authorization with torii](guides/auth-torii-with-github.md)

**Other Resources**

* [Upgrading from Pre-1.0 versions](https://simplabs.com/blog/2015/11/27/updating-to-ember-simple-auth-1.0.html)
* [API Documentation](http://ember-simple-auth.com/api/)

## What does it do?

* it __maintains a client side session__ and synchronizes its state across
  multiple tabs/windows of the application
* it __authenticates the session__ against the application's own server,
  external providers like Facebook etc.
* it __authorizes requests__ to backend servers
* it is __easily customizable and extensible__

## How does it work?

Ember Simple Auth consists of __4 main building blocks__ - the session, a
session store, authenticators and (optionally) authorizers.

The __session service is the main interface to the library__. It provides
__methods for authenticating and invalidating the session__ as well as for
setting and reading session data.

The __session store persists the session state__ so that it survives a page
reload. It also synchronizes the session state across multiple tabs or windows
of the application so that e.g. a logout in one tab or window also results in a
logout in all other tabs or windows of the application.

__Authenticators authenticate the session__. An application can leverage
multiple authenticators to support multiple ways of authentication such as
sending credentials to the application's own backend server, Facebook, github
etc.

__Authorizers__ use the data retrieved by an authenticator and stored in the
session to __generate authorization data that can be injected into outgoing
requests such as Ember Data requests__.

## Example App

__Ember Simple Auth comes with a
[dummy app](tests/dummy)
that implements a complete auth solution__ including authentication against
the application's own server as well as Facebook, authorization of Ember Data
requests and error handling. __Check out that dummy app for reference.__ To
start it, run

```
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth
yarn install && ember serve
```

and go to [http://localhost:4200](http://localhost:4200).

## Installation

Installing the library is as easy as:

```bash
ember install ember-simple-auth
```

### Upgrading from ember-cli-simple-auth / pre-1.0 release?
The 1.0 release of ember-simple-auth introduced a lot of breaking changes, but thankfully [the upgrade path isn't too hard](https://simplabs.com/blog/2015/11/27/updating-to-ember-simple-auth-1.0.html).

## Walkthrough

Once the library is installed, __the session service can be injected wherever
needed in the application__. In order to display login/logout buttons
depending on the current session state, inject the service into the respective
controller or component and __query its
[`isAuthenticated` property](http://ember-simple-auth.com/api/classes/SessionService.html#property_isAuthenticated)
in the template__:

```js
// app/controllers/application.js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service()

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
</div>
<div class="main">
  {{outlet}}
</div>
```

In the `invalidateSession` action __call the
[session service's `invalidate` method](http://ember-simple-auth.com/api/classes/SessionService.html#method_invalidate)
to invalidate the session__ and log the user out:

```js
// app/controllers/application.js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  …

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
```

For authenticating the session, __the session service provides the
[`authenticate` method](http://ember-simple-auth.com/api/classes/SessionService.html#method_authenticate)__
that takes the name of the authenticator to use as well as other arguments
depending on specific authenticator used. __To define an authenticator, add a
new file in `app/authenticators`__ and extend one of the authenticators the
library comes with, e.g.:

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend();
```

With that authenticator and a login form like

```handlebars
{{!-- app/templates/login.hbs --}}
<form {{action 'authenticate' on='submit'}}>
  <label for="identification">Login</label>
  {{input id='identification' placeholder='Enter Login' value=identification}}
  <label for="password">Password</label>
  {{input id='password' placeholder='Enter Password' type='password' value=password}}
  <button type="submit">Login</button>
  {{#if errorMessage}}
    <p>{{errorMessage}}</p>
  {{/if}}
</form>
```

the __session can be authenticated with the
[session service's `authenticate` method](http://ember-simple-auth.com/api/classes/SessionService.html#method_authenticate)__:

```js
// app/controllers/login.js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
```

__The session service also provides the
[`authenticationSucceeded`](http://ember-simple-auth.com/api/classes/SessionService.html#event_authenticationSucceeded)
and
[`invalidationSucceeded`](http://ember-simple-auth.com/api/classes/SessionService.html#event_invalidationSucceeded)
events__ that are triggered whenever the session is successfully authenticated
or invalidated (which not only happens when the user submits the login form or
clicks the logout button but also when the session is authenticated or
invalidated in another tab or window of the application). __To have these
events handled automatically, simply mix
[`ApplicationRouteMixin`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html)
into the application route__:

```js
// app/routes/application.js
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin);
```

The `ApplicationRouteMixin` automatically maps the session events to the
[`sessionAuthenticated`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html#method_sessionAuthenticated)
and
[`sessionInvalidated`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html#method_sessionInvalidated)
methods it implements. The `sessionAuthenticated` method will transition to a
configurable route while the `sessionInvalidated` method will reload the page
to clear all potentially sensitive data from memory.

__To make a route in the application accessible only when the session is
authenticated__, mix the
[`AuthenticatedRouteMixin`](http://ember-simple-auth.com/api/classes/AuthenticatedRouteMixin.html)
into the respective route:

```js
// app/routes/protected.js
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin);
```

This will make the route (and all of its subroutes) transition to the `login`
route if the session is not authenticated. Add the `login` route in the router
like this:

```js
// app/router.js
Router.map(function() {
  this.route('login');
});
```

The route to transition to if the session is not authenticated can also be
[overridden](https://ember-simple-auth.com/api/classes/AuthenticatedRouteMixin.html#property_authenticationRoute)
to be another one than `login`.

It is recommended to nest all of an application's routes that require the
session to be authenticated under a common parent route:

```js
// app/router.js
Router.map(function() {
  this.route('login');
  this.route('authenticated', { path: '' }, function() {
    // all routes that require the session to be authenticated
  });
});
```

To prevent a route from being accessed when the session is authenticated (which
makes sense for login and registration routes for example), mix the
[`UnauthenticatedRouteMixin`](http://ember-simple-auth.com/api/classes/UnauthenticatedRouteMixin.html)
into the respective route.

In order to add authorization information to outgoing API requests the
application can define an authorizer. To do so, add a new file to
`app/authorizers`, e.g.:

```js
// app/authorizers/oauth2.js
import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';

export default OAuth2Bearer.extend();
```

and use that to authorize a block of code via the
[session service's `authorize`](http://ember-simple-auth.com/api/classes/SessionService.html#method_authorize)
method, e.g.:

```js
this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
  const headers = {};
  headers[headerName] = headerValue;
  Ember.$.ajax('/secret-data', { headers });
});
```

To include authorization info in all Ember Data requests if the session is
authenticated, mix the
[`DataAdapterMixin`](http://ember-simple-auth.com/api/classes/DataAdapterMixin.html)
into the application adapter:

```js
// app/adapters/application.js
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:oauth2'
});
```

## The Session Service

The session service is the main interface to the library. It defines the
`authenticate`, `invalidate` and `authorize` methods as well as the session
events as shown above.

It also provides the
__[`isAuthenticated`](http://ember-simple-auth.com/api/classes/SessionService.html#property_isAuthenticated)
as well as the
[`data`]((http://ember-simple-auth.com/api/classes/SessionService.html#property_data))
properties. The latter can be used to get and set the session data__. While the
special `authenticated` section in the session data contains the data that was
acquired by the authenticator when it authenticated the session and is
read-only, all other session data can be written and will also remain in the
session after it is invalidated. It can be used to store all kinds of client
side data that needs to be persisted and synchronized across tabs and windows,
e.g.:

```js
this.get('session').set('data.locale', 'de');
```

## Authenticators

__Authenticators implement the concrete steps necessary to authenticate the
session.__ An application can leverage several authenticators for different
kinds of authentication mechanisms (e.g. the application's own backend server,
external authentication providers like Facebook etc.) while the session is only
ever authenticated with one authenticator at a time. The authenticator to use
is chosen when authentication is triggered via the name it is registered with
in the Ember container:

```js
this.get('session').authenticate('authenticator:some');
```

Ember Simple Auth comes with 4 authenticators:

* [`OAuth2PasswordGrantAuthenticator`](http://ember-simple-auth.com/api/classes/OAuth2PasswordGrantAuthenticator.html): an OAuth 2.0 authenticator that implements the _"Resource Owner Password Credentials Grant Type"_
* [`OAuth2ImplicitGrantAuthenticator`](http://ember-simple-auth.com/api/classes/OAuth2ImplicitGrantAuthenticator.html): an OAuth 2.0 authenticator that implements the _"Implicit Grant Type"_
* [`DeviseAuthenticator`](http://ember-simple-auth.com/api/classes/DeviseAuthenticator.html): an authenticator compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)
* [`ToriiAuthenticator`](http://ember-simple-auth.com/api/classes/ToriiAuthenticator.html): an authenticator that wraps the [torii library](https://github.com/Vestorly/torii)

To use any of these authenticators in an application, define a new
authenticator in `app/authenticators`, extend if from the Ember Simple Auth
authenticator

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrantAuthenticator.extend();
```

and invoke the session service's `authenticate` method with the respective
name, specifying more arguments as needed by the authenticator:

```js
this.get('session').authenticate('authenticator:some', data);
```

### Customizing an Authenticator

Authenticators are easily customized by setting the respective properties,
e.g.:

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrantAuthenticator.extend({
  serverTokenEndpoint: '/custom/endpoint'
});
```

### Implementing a custom Authenticator

Besides extending one of the predefined authenticators, an application can also
implement fully custom authenticators. In order to do that, extend the
[abstract base authenticator](http://ember-simple-auth.com/api/classes/BaseAuthenticator.html)
that Ember Simple Auth comes with and override the
[`authenticate`](http://ember-simple-auth.com/api/classes/BaseAuthenticator.html#method_authenticate),
[`restore`](http://ember-simple-auth.com/api/classes/BaseAuthenticator.html#method_restore)
and (optionally)
[`invalidate`](http://ember-simple-auth.com/api/classes/BaseAuthenticator.html#method_invalidate)
methods:

```js
// app/authenticators/custom.js
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  restore(data) {
    …
  },
  authenticate(options) {
    …
  },
  invalidate(data) {
    …
  }
});
```

## Authorizers

__Authorizers use the session data acquired by the authenticator to construct
authorization data__ that can be injected into outgoing network requests. As
[Deprecation warning: Authorizers are deprecated](https://github.com/simplabs/ember-simple-auth#deprecation-of-authorizers)

the authorizer depends on the data that the authenticator acquires,
__authorizers and authenticators have to fit together__.

Ember Simple Auth comes with 2 authorizers:

* [`OAuth2BearerAuthorizer`](http://ember-simple-auth.com/api/classes/OAuth2BearerAuthorizer.html): an OAuth 2.0 authorizer that uses Bearer tokens
* [`DeviseAuthorizer`](http://ember-simple-auth.com/api/classes/DeviseAuthorizer.html): an authorizer compatible with the popular Ruby on Rails authentication plugin [devise](https://github.com/plataformatec/devise)

To use any of these authorizers in an application, define a new authorizer in
`app/authorizers`, extend if from the Ember Simple Auth authorizer

```js
// app/authorizers/oauth2.js
import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';

export default OAuth2Bearer.extend();
```

and invoke the session service's [`authorize`](http://ember-simple-auth.com/api/classes/SessionService.html#method_authorize) method with the respective name:

```js
this.get('session').authorize('authorizer:some', (/*authorization data*/) => {
  // Use authorization data
});
```

__Unlike in previous versions of Ember Simple Auth, authorization will not
happen automatically for all requests the application issues anymore__ but has
to be initiated explicitly via the service.

When using Ember Data you can mix the `DataAdapterMixin` in the application
adapter to automatically authorize all API requests:

```js
// app/adapters/application.js
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:some'
});
```

### Customizing an Authorizer

Authorizers are easily customized by setting the respective properties, e.g.:

```js
// app/authorizers/devise.js
import DeviseAuthorizer from 'ember-simple-auth/authorizers/devise';

export default DeviseAuthorizer.extend({
  identificationAttributeName: 'login'
});
```

### Implementing a custom Authorizer

Besides extending one of the predefined authorizers, an application can also
implement fully custom authorizers. In order to do that, extend the
[abstract base authorizer](http://ember-simple-auth.com/api/classes/BaseAuthorizer.html)
that Ember Simple Auth comes with and override the
[`authorize`](http://ember-simple-auth.com/api/classes/BaseAuthorizer.html#method_authorize)
method:

```js
// app/authorizers/custom.js
import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  authorize(sessionData, block) {
    …
  }
});
```

### Deprecation of Authorizers

Authorizers and the session service's `authorize` method are deprecated and
will be removed from Ember Simple Auth 2.0. The concept seemed like a good idea
in the early days of Ember Simple Auth, but proved to provide limited value for
the added complexity. To replace authorizers in an application, simply get the
session data from the session service and inject it where needed.

In most cases, authorizers are used with Ember Data adapters (refer to the
[Ember Guides](https://guides.emberjs.com/v3.0.0/models/customizing-adapters/#toc_headers-customization)
for details on adapters). Replacing authorizers in these scenarios is
straightforward.

Examples:

```js
// OAuth 2
import DS from 'ember-data';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  session: service(), 
  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    if (isPresent(access_token)) {
      xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    }
  }
});

// DataAdapterMixin already injects the `session` service. It is
// included here for clarity.
```

```js
// Devise
import DS from 'ember-data';
import { inject as service } from '@ember/service';
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  session: service(),
  // defaults
  // identificationAttributeName: 'email'
  // tokenAttributeName: 'token'
  authorize(xhr) {
    let { email, token } = this.get('session.data.authenticated');
    let authData = `Token token="${token}", email="${email}"`;
    xhr.setRequestHeader('Authorization', authData);
  }
});
```

When used with `ember-fetch` the `authorize` method will not be called and the
`headers` computed property must be used instead, e.g.:

```js
export default DS.JSONAPIAdapter.extend(AdapterFetch, DataAdapterMixin, {
  headers: computed('session.data.authenticated.token', function() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
    }

    return headers;
  }),
});
```

### Deprecation of Client ID as Header

Sending the Client ID as Base64 Encoded in the Authorization Header was against the spec and caused
incorrect behavior with OAuth2 Servers that had implemented the spec properly.

To change this behavior set `sendClientIdAsQueryParam` to `true`, and the client id will be correctly
sent as a query parameter. Leaving it set to `false` (currently default) will result in a deprecation
notice until the next major version.

## Session Stores

Ember Simple Auth __persists the session state via a session store so it
survives page reloads__. There is only one store per application that can be
defined in `app/session-stores/application.js`:

```js
// app/session-stores/application.js
import Cookie from 'ember-simple-auth/session-stores/cookie';

export default Cookie.extend();
```

If the application does not define a session store, the adaptive store which
uses `localStorage` if that is available or a cookie if it is not, will be used
by default. To customize the adaptive store, define a custom store in
`app/session-stores/application.js` that extends it and overrides the
properties to customize.

### Store Types

Ember Simple Auth comes with 4 stores:

#### Adaptive Store

[The adaptive store](http://ember-simple-auth.com/api/classes/AdaptiveStore.html)
stores its data in the browser's `localStorage` if that is available or in a
cookie if it is not; __this is the default store__.

#### `localStorage` Store

[The `localStorage` store](http://ember-simple-auth.com/api/classes/LocalStorageStore.html)
stores its data in the browser's `localStorage`. This is used by the adaptive
store if `localStorage` is available.

#### Cookie Store

[The Cookie store](http://ember-simple-auth.com/api/classes/CookieStore.html)
stores its data in a cookie. This is used by the adaptive store if
`localStorage` is not available. __This store must be used when the
application uses
[FastBoot](https://github.com/ember-fastboot/ember-cli-fastboot).__

#### `sessionStorage` Store

[The `sessionStorage` store](http://ember-simple-auth.com/api/classes/SessionStorageStore.html)
stores its data in the browser's `sessionStorage`. See [the Web Storage docs](
https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) for details on
`sessionStorage` and `localStorage`. [caniuse](http://caniuse.com/#feat=namevalue-storage)
has up-to-date information on browser support of `sessionStorage` and `localStorage`.

#### Ephemeral Store

[The ephemeral store](http://ember-simple-auth.com/api/classes/EphemeralStore.html)
stores its data in memory and thus __is not actually persistent. This store is
mainly useful for testing.__ Also the ephemeral store cannot keep multiple tabs
or windows in sync as tabs/windows cannot share memory.

### Customizing the Store

The session store is easily customized by setting the respective properties,
e.g.:

```js
// app/session-stores/application.js
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default AdaptiveStore.extend({
  cookieName: 'my-apps-session-cookie'
});
```

### Implementing a custom Store

Besides using one of the predefined session stores, an application can also
implement fully custom stores. In order to do that, extend the
[abstract base session store](http://ember-simple-auth.com/api/classes/BaseStore.html)
that Ember Simple Auth comes with and implement the
[`persist`](http://ember-simple-auth.com/api/classes/BaseStore.html#method_persist),
[`restore`](http://ember-simple-auth.com/api/classes/BaseStore.html#method_restore)
and
[`clear`](http://ember-simple-auth.com/api/classes/BaseStore.html#method_clear)
methods:

```js
// app/session-stores/application.js
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

## FastBoot

Ember Simple Auth works with FastBoot out of the box as long as the Cookie
session store is being used. In order to enable the cookie store, define it as
the application store:

```js
// app/session-stores/application.js
import CookieStore from 'ember-simple-auth/session-stores/cookie';

export default CookieStore.extend();
```

If you are using the
[`OAuth2PasswordGrantAuthenticator`](http://ember-simple-auth.com/api/classes/OAuth2PasswordGrantAuthenticator.html),
or
[`DeviseAuthenticator`](http://ember-simple-auth.com/api/classes/DeviseAuthenticator.html),
you must add `node-fetch` to your list of FastBoot whitelisted dependencies
in `package.json`:

```json
{
  "fastbootDependencies": [
    "node-fetch"
  ]
}
```

## Testing

Ember Simple Auth comes with a __set of test helpers that can be used in
acceptance tests__.

### ember-cli-qunit 4.2.0 and greater or ember-qunit 3.2.0 and greater

If your app is using `ember-cli-qunit` [4.2.0 or
greater](https://github.com/ember-cli/ember-cli-qunit/blob/master/CHANGELOG.md#v420-2017-12-17) or `ember-qunit` 3.2.0 or greater,
you may want to migrate to the [more modern testing
syntax](https://dockyard.com/blog/2018/01/11/modern-ember-testing). In that
case, helpers can be imported from the `ember-simple-auth` addon namespace.

```js
// tests/acceptance/…
import { currentSession, authenticateSession, invalidateSession} from 'ember-simple-auth/test-support';
```

The new-style helpers have the following function signatures:
* `currentSession()` returns the current session.
* `authenticateSession(sessionData)` authenticates the session asynchronously;
  the optional `sessionData` argument can be used to mock an authenticator
  response (e.g. a token or user).
* `invalidateSession()` invalidates the session asynchronously.

New tests using the async `authenticateSession` helper will look like this:

```js
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentURL, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | super secret url', function(hooks) {
  setupApplicationTest(hooks);

  test('authenticated users can visit /super-secret-url', async function(assert) {
    await authenticateSession({
      userId: 1,
      otherData: 'some-data'
    });
    await visit('/super-secret-url');
    assert.equal(currentURL(), '/super-secret-url', 'user is on super-secret-url');
  });
});
```

### ember-cli-qunit 4.1.0 and earlier

For apps using earlier versions of ember-cli-qunit, you can use the
test helpers with the following signature:

* `currentSession(this.application)`: returns the current session of your test application.
* `authenticateSession(this.application, sessionData)`: authenticates the session; the
  optional `sessionData` argument can be used to mock an authenticator
  response - e.g. a token.
* `invalidateSession(this.application)`: invalidates the current session in your test application.

For existing apps, the test helpers are merged into your application's namespace,
and can be imported from the `helpers/ember-simple-auth` module like this:

```js
// tests/acceptance/…
import { currentSession, authenticateSession, invalidateSession } from '<app-name>/tests/helpers/ember-simple-auth';
```

The test helpers used in apps using ember-cli-qunit 4.1.0 and earlier all require access to the test application instance.

An application instance is automatically created for you once you use the `moduleForAcceptance` test helper
that is provided in the acceptance test blueprint.
The app instance created through `moduleForAcceptance` is available as `this.application` in your test cases:

```js
import moduleForAcceptance from '<your-app-name>/tests/helpers/module-for-acceptance';

// creates and destroys a test application instance before / after each test case
moduleForAcceptance('Acceptance | authentication');

test('user is authenticating', function(assert) {
  // returns the instance of your test application
  let app = this.application;
});
```

Pass in your application instance as a first parameter to the test helper functions to
get a handle on your application's session store in your subsequent test cases.
Here is a full example of how an acceptance test might look like if your test suite is leveraging `ember-qunit`:

```js
import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'simple-tests/tests/helpers/module-for-acceptance';
import { currentSession, authenticateSession } from 'simple-tests/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | authentication');

test('user is authenticating', function(assert) {
  visit('/login');

  andThen(() => {
    assert.equal(currentURL(), '/login');
    assert.notOk(currentSession(this.application).get('isAuthenticated'), 'the user is yet unauthenticated');

    // this will authenticate the current session of the test application
    authenticateSession(this.application, { token: 'abcdDEF', token_type: 'Bearer' });

    andThen(() => {
      assert.ok(currentSession(this.application).get('isAuthenticated'), 'the user is authenticated');
      assert.deepEqual(currentSession(this.application).get('data.authenticated'), {
        authenticator: 'authenticator:test',
        token: 'abcdDEF',
        token_type: 'Bearer'
      });
    });
  });
});
```

If you're an `ember-mocha` user, we can recommend to check out this
[example from the test suite of ember-simple-auth itself](https://github.com/simplabs/ember-simple-auth/blob/master/tests/acceptance/authentication-test.js).

## Other guides

* [Managing current User](guides/managing-current-user.md)

## License

Ember Simple Auth is developed by and &copy;
[simplabs GmbH](http://simplabs.com) and contributors. It is
released under the
[MIT License](LICENSE).

Ember Simple Auth is not an official part of [Ember.js](http://emberjs.com) and
is not maintained by the Ember.js Core Team.
