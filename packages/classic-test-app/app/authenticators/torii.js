import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';

export default Torii.extend({
  torii: service(),

  authenticate() {
    return this._super(...arguments).then((data) => {
      return fetch('/token', {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'facebook_auth_code',
          auth_code: data.authorizationCode,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        return {
          access_token: response.access_token,
          provider: data.provider
        };
      });
    });
  }
});
