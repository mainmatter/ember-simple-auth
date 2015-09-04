export default {
  name:       'torii-authenticator',
  initialize: function(registry) {
    registry.injection('authenticator:torii', 'torii', 'torii:main');
  }
};
