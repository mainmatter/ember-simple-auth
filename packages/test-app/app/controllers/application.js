import Controller from '@ember/controller';
import * as s from '@ember/service';
const service = s.service ?? s.inject;
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service router;
  @service session;

  @action
  transitionToLoginRoute() {
    this.router.transitionTo('login');
  }
}
