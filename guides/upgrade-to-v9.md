## tl;dr

v9 removes resolver-based `session:main` wiring. The session service owns `InternalSession` directly.

## `session:main` resolver registration

Assign an `InternalSession` on your session service instead of looking it up via `session:main`.

```js
import SessionService from 'ember-simple-auth/services/session';
import InternalSession from 'ember-simple-auth/internal-session';

export default class extends SessionService {
  session = InternalSession.create(this);
}
```
