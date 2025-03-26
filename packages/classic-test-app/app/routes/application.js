import * as s from '@ember/service';
const service = s.service ?? s.inject;
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),

  beforeModel() {
    return this.session.setup();
  },
});
