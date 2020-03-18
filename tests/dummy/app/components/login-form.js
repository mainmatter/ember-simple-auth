import { inject as service } from '@ember/service';
import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
  session: service('session'),

  actions: {
    async authenticateWithOAuth2() {
      try {
        let { identification, password } = this;
        await this.get('session').authenticate('authenticator:oauth2', identification, password);

        if (this.rememberMe) {
          this.get('session').set('store.cookieExpirationTime', 60 * 60 * 24 * 14);
        }
      } catch (reason) {
        this.set('errorMessage', reason.error);
      }
    },

    authenticateWithFacebook() {
      this.get('session').authenticate('authenticator:torii', 'facebook');
    },

    authenticateWithGoogleImplicitGrant() {
      let clientId = config.googleClientID;
      let redirectURI = `${window.location.origin}/callback`;
      let responseType = `token`;
      let scope = `email`;
      window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?`
                            + `client_id=${clientId}`
                            + `&redirect_uri=${redirectURI}`
                            + `&response_type=${responseType}`
                            + `&scope=${scope}`
      );
    },

    updateIdentification(e) {
      this.set('identification', e.target.value);
    },

    updatePassword(e) {
      this.set('password', e.target.value);
    },

    updateRememberMe(e) {
      this.set('rememberMe', e.target.checked);
    },
  }
});
