## tl;dr

Existing apps keep working with `useResolver: true` (the default). v9 can drop resolver-based `session:main`, `session-store:*`, and `authenticator:*` wiring when you opt out.

## Resolver registration

Set `useResolver` to `false`. The addon will no longer register `session:main`, `session-store:adaptive`, `session-store:cookie`, `session-store:local-storage`, or `session-store:test`, and will not look up `session-store:application`. Implement `createSessionStore` and `createAuthenticators` on the session service.

```js
// config/environment.js
ENV['ember-simple-auth'] = {
  useResolver: false,
};
```

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default class OAuth2 extends OAuth2PasswordGrant {
  static id = 'oauth2';
}
```

```js
// app/services/session.js
import SessionService from 'ember-simple-auth/services/session';
import SessionStore from '../session-stores/application';
import OAuth2 from '../authenticators/oauth2';

export default class Session extends SessionService {
  createSessionStore(owner) {
    return new SessionStore(owner);
  }

  createAuthenticators(owner) {
    return [new OAuth2(owner)];
  }
}
```

Each authenticator must have a static `id`.
`authenticate` accepts class, instance, id, or factory name.
Set `static id` to the old filename.
