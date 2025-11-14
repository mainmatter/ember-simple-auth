import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query } from '@warp-drive/utilities/json-api';
import { getRequestState } from '@warp-drive/ember';

export default class ProtectedRoute extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return getRequestState(this.store.request(query('posts')));
  }
}
