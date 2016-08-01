[Back to Main README](../README.md)

## Managing a Current User

Although there are various ways to load data for the current or authenticated
user, this guide describes the canonical way of doing so. The concepts
described here might eventually be merged into the core Ember Simple Auth
library.

### `session-account` service

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
  session:        service('session'),
  sessionAccount: service('session-account')
});
```

```hbs
<nav>
  {{#link-to 'index' classNames='navbar-brand'}}
    Home
  {{/link-to}}

  {{#if session.isAuthenticated}}
    <button onclick={{action 'logout'}}>Logout</button>
    {{#if sessionAccount.account}}
      <p>Signed in as {{sessionAccount.account.name}}</p>
    {{/if}}
  {{else}}
    <button onclick={{action 'login'}}>Login</button>
  {{/if}}
</nav>
```

#### Using a dedicated endpoint

In this example, the service does not need to know the ID of the current user
as it can just load it via a dedicated endpoint that will always respond with
the user belonging to the authorization token in the request:

```js
// app/services/session-account.js
import Ember from 'ember';

const { inject: { service }, isEmpty, RSVP } = Ember;

export default Ember.Service.extend({
  store: service(),

  loadCurrentUser() {
    return this.get('store').find('user', 'me').then((account) => {
      this.set('account', account);
    });
  }
});
```

#### Loading the user with its id

In this example, the user is loaded by its ID. This assume that the
authenticator receives the user id when it authenticates the session so that
the user ID is then stored in the session data and accessible for the service.

```js
// app/services/session-account.js
import Ember from 'ember';

const { inject: { service }, isEmpty, RSVP } = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  account: null,

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      let userId = this.get('session.data.authenticated.user_id');
      if (!isEmpty(userId)) {
        return this.get('store').find('user', userId).then((user) => {
          this.set('account', user);
        }, reject);
      } else {
        resolve();
      }
    });
  }
});
```

### Loading the current user

The Ember Simple Auth session can either be authenticated already when the
application starts up or become authenticated later when either the user logs
in via that instance of the application or session state is synced from another
tab or window. In the first case, the session will already be authenticated
when the application route's `beforeModel` method is called and in the latter
case Ember Simple Auth will call the application route's `sessionAuthenticated`
method. The session account service's `loadCurrentUser` method should be called
in both cases so that it's `account` property is populated when the session is
authenticated:

```js
// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  sessionAccount: service(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser().catch(() => this.get('session').invalidate());
  },

  _loadCurrentUser() {
    return this.get('sessionAccount').loadCurrentUser();
  }
});
```
