The 3.0 version of Ember Simple Auth removes all the code that was deprecated in previous versions. To make sure
your app continues to work properly, ensure that your app no longer makes use of the following list of deprecated
features and settings.

Also take into consideration that this new version supports Ember 3.0 and up. Older versions of Ember may still
work with Ember Simple Auth 3.0 but are not officially supported.

### Move configuration options to routes

Configuration options `authenticationRoute`, `routeAfterAuthentication` and ` routeIfAlreadyAuthenticated` can
no longer be set as part of Ember Simple Auth's configuration, they now need to be overridden on the specific
routes including the mixins that define them.

**authenticationRoute**

Defined in [`AuthenticatedRouteMixin`](http://ember-simple-auth.com/api/classes/AuthenticatedRouteMixin.html) with
`'login'` as the default value, should be overridden as:

```js
// app/routes/protected.js

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ProtedtedRoute extends Route.extend(AuthenticatedRouteMixin), {
  authenticationRoute = 'signin';
}
```

**routeAfterAuthentication**

Defined in [`ApplicationRouteMixin`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html) with
`'index'` as the default value, should be overridden as:

```js
// app/routes/application.js

import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {
  routeAfterAuthentication = 'profile';
}
```

**routeIfAlreadyAuthenticated**

Defined in [`UnauthenticatedRouteMixin`](http://ember-simple-auth.com/api/classes/UnauthenticatedRouteMixin.html) with
`'index'` as the default value, should be overridden as:

```js
// app/routes/login.js

import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default class LoginRoute extends Route.extend(UnauthenticatedRouteMixin) {
  routeIfAlreadyAuthenticated = 'search';
}
```

### Make your custom session store asynchronous

Synchronous session stores are no longer supported, custom `persist`, `restore` and `clear` methods should now return promises.
The example below shows how to adapt your current stores using `RSVP`.

```js
// app/session-stores/application.js

import Base from 'ember-simple-auth/session-stores/base';

export default class ApplicationSessionStore extends Base {
  async persist() {
    …
  },

  async restore() {
    …
  },

  async clear() {
    …
  },
}
```

### Refactor Ember Data adapters to remove use of Authorizers

Authorizers and the session service's `authorize` method had been deprecated and
are now removed from Ember Simple Auth. The concept seemed like a good idea
in the early days of Ember Simple Auth, but proved to provide limited value for
the added complexity. To replace authorizers in an application, simply get the
session data from the session service and inject it where needed.

In most cases, authorizers are used with Ember Data adapters (refer to the
[Ember Guides](https://guides.emberjs.com/v3.4.0/models/customizing-adapters/#toc_headers-customization)
for details on adapters). Replacing authorizers in these scenarios is straightforward.

Examples:

```js
// app/adapters/application.js

// OAuth 2
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

export default class ApplicationAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
  @service session;

  @computed('session.data.authenticated.access_token')
  get headers() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }
}

// DataAdapterMixin already injects the `session` service. It is
// included here for clarity.
```

```js
// app/adapters/application.js

// Devise
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

export default class ApplicationAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
  @service session;
  
  // defaults
  // identificationAttributeName: 'email'
  // tokenAttributeName: 'token'
  @computed('session.data.authenticated.token')
  get headers() {
    let headers = {};

    if (this.session.isAuthenticated) {
      let { email, token } = this.session.data.authenticated;
      headers['Authorization'] = `Token token="${token}", email="${email}"`;
    }

    return headers;
  };
};
```

### Expect the whole Fetch API response on rejected authentications

`rejectWithResponse` (previously named `rejectWithXhr`) has been removed and the current behavior
is the same as when the property was set to `true`: the whole Fetch API [Response](https://fetch.spec.whatwg.org/#response-class) is provided to the
callback when the authentication fails. If you're still relying on the response being a JSON (as it
was when `rejectWithResponse=false`, please make the necessary adjustments.

### Don't rely on Client ID being sent as a Header

Sending the Client ID as Base64 Encoded in the Authorization Header was against the spec and caused
incorrect behavior with OAuth2 Servers that had implemented the spec properly.

We are now only sending the client id as a query parameter and have removed the `sendClientIdAsQueryParam`
setting. If you have it set to `false` take into account that this has no effect.

### Update to new testing syntax

In this version of Ember Simple Auth, we've removed support for ember-cli-qunit 4.1.0 and earlier. In order to
continue using our test helpers, you need to have ember-cli-qunit 4.2 or greater and migrate to the [more modern testing
syntax](https://dockyard.com/blog/2018/01/11/modern-ember-testing).

The new style testing helpers don't require the test application as a parameter anymore. The new signatures are:

* `currentSession()` returns the current session.
* `authenticateSession(sessionData)` authenticates the session asynchronously;
  the optional `sessionData` argument can be used to mock an authenticator
  response (e.g. a token or user).
* `invalidateSession()` invalidates the session asynchronously.

They can now be imported as:
```js
// tests/acceptance/…
import { currentSession, authenticateSession, invalidateSession } from 'ember-simple-auth/test-support';
```

Here is an example of how a test might look with the old syntax and helpers vs the new one:

```js
//old syntax

import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'simple-tests/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'simple-tests/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | authentication');

test('authenticated users can visit /super-secret-url', function(assert) {
  // this will authenticate the current session of the test application
  authenticateSession(this.application, {
    userId: 1,
    otherData: 'some-data'
  });

  andThen(() => {
    visit('/super-secret-url');

    andThen(() => {
      assert.equal(currentURL(), '/super-secret-url', 'user is on super-secret-url');
    });
  });
});
```

```js
//new modern syntax
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
