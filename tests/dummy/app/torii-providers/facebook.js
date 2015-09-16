import FacebookOauth2Provider from 'torii/providers/facebook-oauth2';

export default FacebookOauth2Provider.extend({
  fetch(data) {
    return data;
  }
});
