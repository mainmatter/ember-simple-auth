import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class MainNavigationComponent extends Component {
  @service session;
  @service sessionAccount;

  @action
  logout() {
    this.session.invalidate();
  }

  @action
  onLogin() {}
}
