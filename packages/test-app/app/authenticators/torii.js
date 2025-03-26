import * as s from '@ember/service';
const service = s.service ?? s.inject;
import Torii from 'ember-simple-auth/authenticators/torii';

export default class ToriiAuthenticator extends Torii {
  @service torii;

  authenticate() {
    return super.authenticate(...arguments).then(data => {
      return fetch('/token', {
        method: 'POST',
        data: JSON.stringify({
          grant_type: 'facebook_auth_code',
          auth_code: data.authorizationCode,
        }),
        headers: { 'content-type': 'application/json' },
      }).then(response => {
        return {
          access_token: response.access_token,
          provider: data.provider,
        };
      });
    });
  }
}
