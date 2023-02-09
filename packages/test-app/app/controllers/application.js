import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service router;

  @action
  transitionToLoginRoute() {
    this.router.transitionTo('login');
  }
}
