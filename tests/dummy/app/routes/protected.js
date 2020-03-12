import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ProtectedRoute extends Route.extend(AuthenticatedRouteMixin) {
  model() {
    return this.store.findAll('post');
  }
}
