The 3.0 version of Ember Simple Auth removes all the code that was deprecated in previous versions. To make sure
your app continues to work properly, ensure that your app no longer makes use of the following list of deprecated
features and settings.

Also take into consideration that this new version supports Ember 3.0 and up. Older versions of Ember may still
work with Ember Simple Auth 3.0 but are not officially supported.

### Move configuration options to routes

Configuration options `authenticationRoute`, `routeAfterAuthentication` and ` routeIfAlreadyAuthenticated` can
no longer be set as part of Ember Simple Auth's configuration, they now need to be overriden on the specific
routes including the mixins that define them.

**authenticationRoute**

Defined in [`AuthenticatedRouteMixin`](http://ember-simple-auth.com/api/classes/AuthenticatedRouteMixin.html) with
`'login'` as the default value, should be overriden as:

```js app/routes/protected.js
  import Route from '@ember/routing/route';
  import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

  export default Route.extend(AuthenticatedRouteMixin, {
    routeAfterAuthentication: 'signin',
  });
```

**routeAfterAuthentication**

Defined in [`ApplicationRouteMixin`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html) with
`'index'` as the default value, should be overriden as:

```js app/routes/application.js
  import Route from '@ember/routing/route';
  import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

  export default Route.extend(ApplicationRouteMixin, {
    routeAfterAuthentication: 'profile',
  });
```

**routeIfAlreadyAuthenticated**

Defined in [`UnauthenticatedRouteMixin`](http://ember-simple-auth.com/api/classes/UnauthenticatedRouteMixin.html) with
`'index'` as the default value, should be overriden as:

```js app/routes/application.js
  import Route from '@ember/routing/route';
  import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

  export default Route.extend(UnauthenticatedRouteMixin, {
    routeAfterAuthentication: 'search',
  });
```

### Rename rejectWithXhr to rejectWithResponse

`rejectWithXhr` setting in authenticators was renamed to `rejectWithResponse` in previous versions but was
still supported, the support is removed in this version so any uses should be updated.

### Make your custom session store asychronous

Synchronous session stores are no longer supported, custom `persist`, `restore` and `clear` methods should now return promises.
The example below shows how to adapt your current stores using `RSVP`.

```js
// app/session-stores/application.js
import Base from 'ember-simple-auth/session-stores/base';
import RSVP from 'rsvp';

export default Base.extend({
  persist() {
    …
    return RSVP.resolve();
  },

  restore() {
    …
    return RSVP.resolve(return_data);
  },

  clear() {
    …
    return RSVP.resolve();
  },
});
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

### Don't rely on Client ID being sent as a Header

Sending the Client ID as Base64 Encoded in the Authorization Header was against the spec and caused
incorrect behavior with OAuth2 Servers that had implemented the spec properly.

We are now only sending the client id as a query parameter and have removed the `sendClientIdAsQueryParam`
setting. If you have it set to `false` take into account that this has no effect.
