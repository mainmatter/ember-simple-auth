import Authenticator from 'simple-auth-torii/authenticators/torii';

export default {
  name:   'simple-auth-torii',
  before: 'simple-auth',
  after:  'torii',
  initialize: function(container, application) {
    var torii         = container.lookup('torii:main');
    var authenticator = Authenticator.create({ torii: torii });
    application.register('simple-auth-authenticator:torii', authenticator, { instantiate: false });
  }
};
