import Ember from 'ember';
import OAuth2ImplicitGrantCallbackRouteMixin from 'ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin';

const { Route } = Ember;

export default Route.extend(OAuth2ImplicitGrantCallbackRouteMixin, {
  authenticator: 'authenticator:oauth2-implicit-grant'
});
