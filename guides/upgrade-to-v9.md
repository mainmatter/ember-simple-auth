## tl;dr

v9 removes resolver-based `session:main` wiring. The session service owns `InternalSession` directly.

## `session:main` resolver registration

Set `useInternalSessionLookup` to `false` so the session service constructs `InternalSession` and `session:main` is not registered.

```js
// config/environment.js
ENV['ember-simple-auth'] = {
  useInternalSessionLookup: false,
};
```
