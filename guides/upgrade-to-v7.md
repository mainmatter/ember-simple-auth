## tl;dr

Release 7.0.0 doesn't contain any new features and the API haven't really changed.
It focuses on housekeeping, modernizing the codebase and introducing Typescript to our library.
The biggest change was getting rid of as much "classic" Ember syntax as possible and get onto ES6 classes.

There are some not-so-painful breaking changes however, please refer to the following document.

## Extending ember-simple-auth's classes

Most if not all of the public API is ES6 classes, as a result you'll have to change how ESA's classes are extended in your codebases.
Here's an example based on the OAuth2PasswordGrant authenticator.

Old

```js
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: `${config.apiHost}/token`,
  serverTokenRevocationEndpoint: `${config.apiHost}/revoke`,
});
```

New

```js
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

export default class OAuth2 extends OAuth2PasswordGrant {
  serverTokenEndpoint = `${config.apiHost}/token`;
  serverTokenRevocationEndpoint = `${config.apiHost}/revoke`;
}
```

## Default session-store and service are no longer automatically injected.

This change is made due to processing problems found here [ember-simple-auth/#2888](https://github.com/mainmatter/ember-simple-auth/pull/2888) and [shipshapecode/swach#1736](https://github.com/shipshapecode/swach/pull/1736).
It's been a problem for a long time and with Ember-Data and Ember itself being more explicit around dependencies, we're making the change too.

The only thing that ESA will continue to export is the initializer, they aren't usually imported and extended by users so they shouldn't cause problems as long as Ember still supports it.

### Migration guide:

Add `app/services/session.js` or `app/services/session.ts`

```js
import Service from 'ember-simple-auth/services/session';

export default class SessionService extends Service {}
```

Add `app/session-stores/application.js` or `app/session-stores/application.ts`

```js
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default class SessionStore extends AdaptiveStore {}
```
