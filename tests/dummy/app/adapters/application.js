/* eslint-disable ember/no-mixins */
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from '../config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default JSONAPIAdapter.extend({
  session: service(),
  host: config.apiHost,

  headers: computed('session.{data.authenticated.access_token,isAuthenticated}', function() {
    let headers = {};
    if (this.get('session.isAuthenticated')) {
      headers['Authorization'] = `Bearer ${this.get('session.data.authenticated.access_token')}`;
    }

    return headers;
  }),

  handleResponse(status, headers, payload, requestData) {
    if (status === 401) {
      this.get('session').handleAuthorizationError();
    }
    return this._super(...arguments);
  },
});
