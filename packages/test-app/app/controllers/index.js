import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationIndexController extends Controller {
  @service session;
}
