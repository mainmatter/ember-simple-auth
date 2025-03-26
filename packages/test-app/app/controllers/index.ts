import Controller from '@ember/controller';
import * as s from '@ember/service';
const service = s.service ?? s.inject;
import type SessionService from 'test-app/services/session';

export default class ApplicationIndexController extends Controller {
  @service declare session: SessionService;

  constructor(owner: any) {
    super(owner);

    console.log(this.session.data.authenticated.id);
  }
}
