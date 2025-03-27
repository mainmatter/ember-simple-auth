import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel(transition) {
    this.get('session').prohibitAuthentication('index');
  },
});
