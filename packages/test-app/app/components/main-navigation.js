import * as s from '@ember/service';
const service = s.service ?? s.inject;
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class MainNavigationComponent extends Component {
  @service session;
  @service sessionAccount;

  @action
  logout() {
    this.session.invalidate();
  }
}
