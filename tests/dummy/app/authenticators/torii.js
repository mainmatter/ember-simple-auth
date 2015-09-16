import Ember from 'ember';
import Torii from 'ember-simple-auth/authenticators/torii';
import raw from 'ic-ajax';

const { RSVP } = Ember;
const { service } = Ember.inject;

export default Torii.extend({
  torii: service('torii'),

  authenticate() {
    return new RSVP.Promise((resolve, reject) => {
      this._super(...arguments).then((data) => {
        raw({
          url:      '/token',
          type:     'POST',
          dataType: 'json',
          data:     { 'grant_type': 'facebook_auth_code', 'auth_code': data.authorizationCode }
        }).then((response) => {
          resolve({
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            access_token: response.access_token,
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            provider: data.provider
          });
        }, reject);
      }, reject);
    });
  }
});
