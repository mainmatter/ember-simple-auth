### tl;dr

Release 7.0.0 doesn't contain any new features and the API haven't really changed.
It focuses on housekeeping, modernizing the codebase and introducing Typescript to our library.
The biggest change was getting rid of as much "classic" Ember syntax as possible and get onto ES6 classes.

### Extending ember-simple-auth's classes

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
