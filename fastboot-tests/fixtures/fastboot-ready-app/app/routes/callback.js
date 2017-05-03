import Ember from 'ember';
import OAuth2ImplicitGrantCallbackRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route } = Ember;

export default Route.extend(OAuth2ImplicitGrantCallbackRouteMixin);
