[Back to Main README](README.md)

## Managing a Current User

Although there are various ways to load currentUser data, this is the canonical
way to do so. Your authentication route will need to identify how it can access
the data for the current user. There are 2 examples: one loading through a
userId that is sent through the auth payload and another accessing a specific
endpoint (i.e. '/users/me').

### CurrentUser Service

In order for the app to keep the user data, we will store it in its own service:

#### Example with user/me endpoint

```js
// app/services/session-account.js
import Ember from 'ember';

const { inject: { service }, isEmpty, RSVP } = Ember;

export default Ember.Service.extend({
  store: service(),

  account: null,

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      return this.get('store').find('user', 'me').then(
        user => resolve(this.set('user', user)),
        reject
      );
    });
  }
});
```

This example accesses the users/me endpoint which should return the current
user.  The service then sets the user as the returned record and is accessible
in this sessionAccount service.

#### Example with userId

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
      const userId = this.get('session.data.authenticated.user_id');
      if (!isEmpty(userId)) {
        return this.get('store').find('user', userId).then(
          user => resolve(this.set('user', user)),
          reject
        );
      } else {
        resolve();
      }
    });
  }
});
```

In this example, we grab the user id and then make an ember-data request to the
API. After a successful request, it sets the user and is easily access anywhere
by injecting this service.

### Calling the function to set the current user

The best place for us to make the call to load the current user is on the
application route:

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

This uses the session-account service you created to set the currentUser when
the application route loads and there is a session that has successfully been
restored (using the beforeModel() hook), or when a session is authenticated
(using the sessionAuthenticated() hook). Notice that in the
sessionAuthenticated() hook, if we can't load the current user, then it will
invalidate our session.

NOTE: There are 2 places that `_loadCurrentUser()` is called. It is called in
the beforeModel function for loading the current user on records that are
already authenticated, and in the sessionAuthenticated function in order to load
the current user when a user logs in (without having to reload the application
route).

### Accessing Current User Data

To access your current user when logged in:

```js
import Ember from 'ember';

const { computed: { alias }, inject: { service } } = Ember;

export default ....extend({
  sessionAccount: service(),

  currentUser: alias('sessionAccount.user')
});
```
