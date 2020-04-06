import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';
import { computed } from '@ember/object';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.apiHost,
  namespace: config.apiNamespace,

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = {};
    if (this.get('session.isAuthenticated')) {
      headers['Authorization'] = `Bearer ${this.get('session.data.authenticated.access_token')}`;
    }

    return headers;
  }),
});
