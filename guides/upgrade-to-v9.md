## Resolver registration

Existing apps keep resolver registration and `init` hooks with `useResolver: true` (the default).
To opt out, set `useResolver: false` and implement `createSessionStore` and `createAuthenticators`:

```js
// config/environment.js
ENV['ember-simple-auth'] = {
  useResolver: false,
};
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

## Authenticator IDs

With `useResolver: false`, each authenticator needs a static `id` matching its previous filename to preserve stored sessions.
`authenticate` accepts a class, instance, ID, or factory name.

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default class OAuth2 extends OAuth2PasswordGrant {
  static id = 'oauth2';
}
```

## Store types

Use the optional second `SessionService` type parameter to type `session.store` and `createSessionStore`, keeping your session data type first.
Existing `SessionService<Data>` subclasses and `declare store: CustomStore` declarations remain supported.

```ts
import type Owner from '@ember/owner';
import SessionService, { type DefaultDataShape } from 'ember-simple-auth/services/session';
import CookieStore from 'ember-simple-auth/session-stores/cookie';

export default class Session extends SessionService<DefaultDataShape, CookieStore> {
  createSessionStore(owner: Owner) {
    return new CookieStore(owner);
  }

  // Keep createAuthenticators from the example above.
}
```

## Initialization

With `useResolver: false`, stores and authenticators are created with `new`, which skips `init`.
Move your old `init` code into a constructor after `super(owner)`:

```js
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default class SessionStore extends AdaptiveStore {
  constructor(owner) {
    super(owner);
    // Your own setup code
  }
}
```

## Complete session service

With `useResolver: false` configured above, this service combines a typed cookie store with the OAuth2 authenticator from the earlier example.

```ts
// app/services/session.ts
import type Owner from '@ember/owner';
import SessionService, { type DefaultDataShape } from 'ember-simple-auth/services/session';
import CookieStore from 'ember-simple-auth/session-stores/cookie';
import OAuth2 from '../authenticators/oauth2';

export default class Session extends SessionService<DefaultDataShape, CookieStore> {
  createSessionStore(owner: Owner) {
    return new CookieStore(owner);
  }

  createAuthenticators(owner: Owner) {
    return [new OAuth2(owner)];
  }
}

declare module '@ember/service' {
  interface Registry {
    session: Session;
  }
}
```
