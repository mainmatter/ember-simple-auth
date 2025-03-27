import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),

  beforeModel() {
    return this.session.setup();
  },
});
