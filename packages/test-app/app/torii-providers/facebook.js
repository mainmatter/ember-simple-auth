import FacebookOauth2 from 'torii/providers/facebook-oauth2';

export default class FacebookOauth2Provider extends FacebookOauth2 {
  get redirectUri() {
    return [window.location.protocol, '//', window.location.host, '/torii/redirect.html'].join('');
  }

  fetch(data) {
    return data;
  }
}
