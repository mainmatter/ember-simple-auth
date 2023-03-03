import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = config.apiHost;
  @service session;

  get headers() {
    let headers = {};
    if (this.session.get('isAuthenticated')) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }

  handleResponse(status) {
    if (status === 401 && this.session.get('isAuthenticated')) {
      this.session.invalidate();
    }
    return super.handleResponse(...arguments);
  }
}
