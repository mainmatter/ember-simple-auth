/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel(transition) {
    this.get('session').requireAuthentication(transition, 'login');
  },

  model() {
    return this.get('store').find('post', 3);
  }
});
