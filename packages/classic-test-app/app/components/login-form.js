import Component from '@ember/component';
import config from '../config/environment';
import { action } from '@ember/object';
import * as s from '@ember/service';
const service = s.service ?? s.inject;

export default Component.extend({
  session: service('session'),

  authenticateWithOAuth2: action(async function (e) {
    e.preventDefault();
    try {
      let { identification, password } = this;
      await this.get('session').authenticate('authenticator:oauth2', identification, password);

      if (this.rememberMe) {
        this.get('session').set('cookieExpirationTime', 60 * 60 * 24 * 14);
      }
    } catch (response) {
      console.error(response.toString());
      this.set('errorMessage', response.toString());
    }
  }),

  authenticateWithFacebook: action(function (e) {
    e.preventDefault();
    this.get('session').authenticate('authenticator:torii', 'facebook');
  }),

  authenticateWithGoogleImplicitGrant: action(function (e) {
    e.preventDefault();
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
  }),

  updateIdentification: action(function (e) {
    this.set('identification', e.target.value);
  }),

  updatePassword: action(function (e) {
    this.set('password', e.target.value);
  }),

  updateRememberMe: action(function (e) {
    this.set('rememberMe', e.target.checked);
  }),
});
