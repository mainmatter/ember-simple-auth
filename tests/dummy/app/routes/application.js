import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  sessionAccount: service('session-account'),

  beforeModel() {
    return this.get('sessionAccount').loadCurrentUser().catch(() => this.get('session').invalidate());
  }
});
