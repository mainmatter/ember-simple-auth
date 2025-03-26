import Controller from '@ember/controller';
import * as s from '@ember/service';
const service = s.service ?? s.inject;
import { action } from '@ember/object';

export default Controller.extend({
  router: service(),

  transitionToLoginRoute: action(function () {
    this.router.transitionTo('login');
  }),
});
