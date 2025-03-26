import * as s from '@ember/service';
const service = s.service ?? s.inject;
import Component from '@glimmer/component';
import config from '../config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginFormComponent extends Component {
  @service session;

  @tracked errorMessage;
  @tracked identification;
  @tracked password;
  @tracked rememberMe;

  @action
  async authenticateWithOAuth2(event) {
    event.preventDefault();
    try {
      let { identification, password } = this;
      await this.session.authenticate('authenticator:oauth2', identification, password);

      if (this.rememberMe) {
        this.session.set('store.cookieExpirationTime', 60 * 60 * 24 * 14);
      } else {
        this.session.set('store.cookieExpirationTime', null);
      }
    } catch (response) {
      let responseBody = await response.clone().json();
      this.errorMessage = responseBody;
    }
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
    window.location.replace(
      `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${redirectURI}` +
        `&response_type=${responseType}` +
        `&scope=${scope}`
    );
  }

  @action
  updateIdentification(e) {
    this.identification = e.target.value;
  }

  @action
  updatePassword(e) {
    this.password = e.target.value;
  }

  @action
  updateRememberMe(e) {
    this.rememberMe = e.target.checked;
  }
}
