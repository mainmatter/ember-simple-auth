import Authenticator from 'simple-auth-oauth2/authenticators/oauth2';
import Authorizer    from 'simple-auth-oauth2/authorizers/oauth2';

export default {
  name:       'simple-auth-oauth2',
  before:     'simple-auth',
  initialize: function(container, application) {
    container.register('simple-auth-authorizer:oauth2-bearer', Authorizer);
    container.register('simple-auth-authenticator:oauth2-password-grant', Authenticator);
  }
};
