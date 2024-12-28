import Controller from '@ember/controller';
import type Owner from '@ember/owner';
import { inject as service } from '@ember/service';
import type SessionService from 'test-app/services/session';

export default class ApplicationIndexController extends Controller {
  @service session!: SessionService;

  constructor(owner: Owner) {
    super(owner);
  }
}
