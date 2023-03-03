import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

export default class OAuth2Authenticator extends OAuth2PasswordGrant {
  serverTokenEndpoint = `${config.apiHost}/token`;
  serverTokenRevocationEndpoint = `${config.apiHost}/revoke`;
}
