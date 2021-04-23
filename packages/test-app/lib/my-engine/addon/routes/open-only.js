import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel(transition) {
    this.get('session').prohibitAuthentication(() => this.transitionToExternal('index'));
  }
});
