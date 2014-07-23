import Authenticator from 'simple-auth-devise/authenticators/devise';
import Authorizer    from 'simple-auth-devise/authorizers/devise';

export default {
  name:       'simple-auth-devise',
  before:     'simple-auth',
  initialize: function(container, application) {
    container.register('simple-auth-authorizer:devise', Authorizer);
    container.register('simple-auth-authenticator:devise', Authenticator);
  }
};
