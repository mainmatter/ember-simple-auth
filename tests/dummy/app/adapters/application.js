import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';
import { computed } from '@ember/object';

const { JSONAPIAdapter } = DS;

export default class ApplicationAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
  host = config.apiHost;

  @computed('session.data.authenticated.access_token')
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }
}
