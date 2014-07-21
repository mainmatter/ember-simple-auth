import Store from 'simple-auth-cookie-store/stores/cookie';

export default {
  name:       'simple-auth-cookie-store',
  before:     'simple-auth',
  initialize: function(container, application) {
    container.register('simple-auth-session-store:cookie', Store);
  }
};
