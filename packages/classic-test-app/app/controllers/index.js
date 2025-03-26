import Controller from '@ember/controller';
import * as s from '@ember/service';
const service = s.service ?? s.inject;

export default Controller.extend({
  session: service(),
});
