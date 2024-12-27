import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type SessionService from 'test-app/services/session';

export default class ApplicationIndexController extends Controller {
  @service declare session: SessionService;
}
