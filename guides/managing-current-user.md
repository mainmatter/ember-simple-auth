[Back to Main README](../README.md)

## Managing a Current User

Although there are various ways to load data for the current or authenticated
user, this guide describes the canonical way of doing so. The concepts
described here might eventually be merged into the core Ember Simple Auth
library.

### `current-user` service

In the approach described in this guide, the current user is managed and made
available to the application via a service. That service will load the current
user either via an ID provided by the authenticator when authenticating the
session or via a special endpoint that will always respond with the user
belonging to the provided authorization token.

The service can then be injected into e.g. controllers or components that need
access to the current user record, e.g.:

```js
import Ember from 'ember';

const { inject: { service }, Component } = Ember;

export default Component.extend({
  session:     service('session'),
  currentUser: service('current-user')
});
```

```hbs
<nav>
  {{#link-to 'index' classNames='navbar-brand'}}
    Home
  {{/link-to}}

  {{#if session.isAuthenticated}}
    <button onclick={{action 'logout'}}>Logout</button>
    {{#if currentUser.user}}
      <p>Signed in as {{currentUser.user.name}}</p>
    {{/if}}
  {{else}}
    <button onclick={{action 'login'}}>Login</button>
  {{/if}}
</nav>
```

#### Using a dedicated endpoint

In this example, the service does not need to know the ID of the current user
as it uses a dedicated endpoint instead that will always respond with the user
belonging to the authorization token in the request.

Note: Using `store.queryRecord` is the correct way to query for a record when id is
unknown. Ember data expects the returned model to have the same id, as otherwise an
unused empty record with `id` of `me` is in the store.

We can override the adapter to generate `api/users/me` when `store.queryRecord` is
invoked with a query param where the `me` param is present.

```js
// app/services/current-user.js
import Ember from 'ember';

const { inject: { service }, isEmpty, RSVP } = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user', { me: true }).then((user) => {
        this.set('user', user);
      });
    }
  }
});

// app/adapters/user.js
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this._super(...arguments)}/me`;
    }

    return this._super(...arguments);
  }
});
```

#### Loading the user with its id

In this example, the user is loaded by its ID. This assumes that the
authenticator receives the user id when it authenticates the session so that
the id is then stored in the session data and can be read from there.

```js
// app/services/current-user.js
import Ember from 'ember';

const { inject: { service }, isEmpty, RSVP } = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  load() {
    let userId = this.get('session.data.authenticated.user_id');
    if (!isEmpty(userId)) {
      return this.get('store').findRecord('user', userId).then((user) => {
        this.set('user', user);
      });
    } else {
      return Ember.RSVP.resolve();
    }
  }
});
```

### Loading the current user

The Ember Simple Auth session can either be authenticated already when the
application starts up or become authenticated later when either the user logs
in via that instance of the application or the session state is synced from
another tab or window. In the first case, the session will already be
authenticated when the application route's `beforeModel` method is called and
in the latter case Ember Simple Auth will call the application route's
`sessionAuthenticated` method. The `currentUser` service's `load` method must
be called in both cases so that it's `user` property is always populated when
the session is authenticated:

```js
// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  currentUser: service(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser().catch(() => this.get('session').invalidate());
  },

  _loadCurrentUser() {
    return this.get('currentUser').load();
  }
});
```
