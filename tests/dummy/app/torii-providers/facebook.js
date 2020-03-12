import { computed } from '@ember/object';
import FacebookOauth2Provider from 'torii/providers/facebook-oauth2';

export default class FacebookToriiProvider extends FacebookOauth2Provider {
  @computed
  get redirectUri() {
    return [
      window.location.protocol,
      '//',
      window.location.host,
      '/torii/redirect.html'
    ].join('');
  }

  fetch(data) {
    return data;
  }
}
