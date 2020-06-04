/* eslint-disable ember/no-mixins */
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from '../config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default JSONAPIAdapter.extend({
  host: config.apiHost,
  session: service(),

  headers: computed('session.{data.authenticated.access_token,isAuthenticated}', function() {
    let headers = {};
    if (this.get('session.isAuthenticated')) {
      headers['Authorization'] = `Bearer ${this.get('session.data.authenticated.access_token')}`;
    }

    return headers;
  }),

  handleResponse(status) {
    if (status === 401 && this.get('session.isAuthenticated')) {
      this.get('session').invalidate();
    }
    return this._super(...arguments);
  },
});
