import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';

export default Torii.extend({
  torii: service(),
  ajax: service(),

  authenticate() {
    const ajax = this.get('ajax');

    return this._super(...arguments).then((data) => {
      return ajax.request('/token', {
        type:     'POST',
        dataType: 'json',
        data:     { 'grant_type': 'facebook_auth_code', 'auth_code': data.authorizationCode }
      }).then((response) => {
        return {
          access_token: response.access_token,
          provider: data.provider
        };
      });
    });
  }
});
