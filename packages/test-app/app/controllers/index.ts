import Controller from '@ember/controller';
import { service } from '@ember/service';
import type SessionService from 'test-app/services/session';

export default class ApplicationIndexController extends Controller {
  @service declare session: SessionService;

  constructor(owner: any) {
    super(owner);

    console.log(this.session.data.authenticated.id);
  }
}
