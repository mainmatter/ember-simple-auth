## tl;dr

Existing apps keep working with `useResolver: true` (the default). v9 can drop resolver-based `session:main` and `session-store:*` wiring when you opt out.

## Resolver registration

Set `useResolver` to `false`. The addon will no longer register `session:main`, `session-store:adaptive`, `session-store:cookie`, `session-store:local-storage`, or `session-store:test`, and will not look up `session-store:application`. Implement `createSessionStore` on the session service.

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

export default class Session extends SessionService {
  createSessionStore(owner) {
    return new SessionStore(owner);
  }
}
```
