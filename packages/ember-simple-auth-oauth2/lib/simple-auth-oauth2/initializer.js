import Configuration from './configuration';
import getGlobalConfig from 'simple-auth/utils/get-global-config';
import Authenticator from 'simple-auth-oauth2/authenticators/oauth2';
import Authorizer from 'simple-auth-oauth2/authorizers/oauth2';

export default {
  name:       'simple-auth-oauth2',
  before:     'simple-auth',
  initialize: function(container, application) {
    var config = getGlobalConfig('simple-auth-oauth2');
    Configuration.load(container, config);
    application.register('simple-auth-authorizer:oauth2-bearer', Authorizer);
    application.register('simple-auth-authenticator:oauth2-password-grant', Authenticator);
  }
};
