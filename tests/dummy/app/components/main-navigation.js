import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MainNavigationComponent extends Component {
  @service session;
  @service sessionAccount;

  @action
  login() {
    this.args.onLogin();
  }

  @action
  logout() {
    this.session.invalidate();
  }
}
