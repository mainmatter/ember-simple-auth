import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  session: service(),

  logout: action(function () {
    this.get('session').invalidate();
  }),
});
