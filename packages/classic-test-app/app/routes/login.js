import Route from '@ember/routing/route';
import * as s from '@ember/service';
const service = s.service ?? s.inject;

export default Route.extend({
  session: service(),

  beforeModel(transition) {
    this.get('session').prohibitAuthentication('index');
  },
});
