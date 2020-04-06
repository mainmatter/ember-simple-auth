/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import OAuth2ImplicitGrantCallbackRouteMixin from 'ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin';

export default Route.extend(OAuth2ImplicitGrantCallbackRouteMixin, {
  authenticator: 'authenticator:oauth2-implicit-grant'
});
