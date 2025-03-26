import Route from '@ember/routing/route';
import * as s from '@ember/service';
const service = s.service ?? s.inject;

export default Route.extend({
  store: service(),
  session: service(),

  beforeModel(transition) {
    this.get('session').requireAuthentication(transition, 'login');
  },

  model() {
    return this.get('store').findAll('post');
  },
});
