import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from '../config/environment';

export default class LoginFormComponent extends Component {
  @service session;
  @tracked identification;
  @tracked password;
  @tracked rememberMe;
  @tracked errorMessage;

  @action
  authenticateWithOAuth2(e) {
    e.preventDefault();

    let { identification, password } = this;
    this.session.authenticate('authenticator:oauth2-password-grant', identification, password)
      .then(() => {
        this.rememberMe && this.session.set('store.cookieExpirationTime', 60 * 60 * 24 * 14);
      }) 
      .catch(async (response) => {
        let responseBody = await response.clone().json();
        this.errorMessage = responseBody.error;
      });
  }

  @action
  authenticateWithFacebook() {
    this.session.authenticate('authenticator:torii', 'facebook');
  }

  @action
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
  }
}
