import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';
import config from '../config/environment';

export default class ApplicationController extends Controller {
  @service router;
  @service session;
  @service fastboot;

  useResolver = config['ember-simple-auth'].useResolver ?? true;

  get sessionMainRegistered() {
    return Boolean(
      getOwner(this).hasRegistration('session:main') || getOwner(this).factoryFor('session:main')
    );
  }

  @action
  transitionToLoginRoute() {
    this.router.transitionTo('login');
  }
}
