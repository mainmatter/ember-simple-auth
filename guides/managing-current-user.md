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
// app/components/my.js

import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default class MyComponent extends Component {
  @service session;
  @service currentUser;
}
```

```hbs
<nav>
  {{#link-to 'index' classNames='navbar-brand'}}
    Home
  {{/link-to}}

  {{#if this.session.isAuthenticated}}
    <button {{on "click" this.logout}}>Logout</button>
    {{#if this.currentUser.user}}
      <p>Signed in as {{this.currentUser.user.name}}</p>
    {{/if}}
  {{else}}
    <button {{on "click" this.login}}>Login</button>
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

import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  async load() {
    if (this.session.isAuthenticated) {
      let user = await this.store.queryRecord('user', { me: true });
      this.set('user', user);
    }
  }
});

// app/adapters/user.js

import ApplicationAdapter from './application';

export default class UserAdapter extends ApplicationAdapter {
  urlForQueryRecord(query) {
    let originalUrl = super.urlForQueryRecord(...arguments);
    if (query.me) {
      delete query.me;
      return `${originalUrl}/me`;
    }

    return originalUrl;
  }
}
```

#### Loading the user with its id

In this example, the user is loaded by its ID. This assumes that the
authenticator receives the user id when it authenticates the session so that
the id is then stored in the session data and can be read from there.

```js
// app/services/current-user.js
import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  async load() {
    let userId = this.session.data.authenticated.user_id;
    if (userId) {
      let user = await this.store.findRecord('user', userId);
      this.set('user', user);
    }
  }
}
```

### Loading the current user

The Ember Simple Auth session can either be authenticated already when the
application starts up or become authenticated later when either the user logs
in via that instance of the application or the session state is synced from
another tab or window. In the first case, the session will already be
authenticated when the application route's `beforeModel` method is called:

```js
// app/routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service currentUser;

  beforeModel() {
    return this._loadCurrentUser();
  },

  async _loadCurrentUser() {
    try {
      await this.currentUser.load();
    } catch(err) {
      await this.session.invalidate();
    }
  }
});
```

In the latter case Ember Simple Auth will call the session service's
`handleAuthentication` method. The `currentUser` service's `load` method must
be called in that cases as well. We can do that by overriding the session
sevice's method in a custom extension of Ember Simple Auth's standard session
service:

```js
import { inject as service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';

export default SessionService.extend({
  @service currentUser;

  async handleAuthentication() {
    this._super(...arguments);

    try {
      await this.currentUser.load();
    } catch(err) {
      await this.invalidate();
    }
  }
});
```
