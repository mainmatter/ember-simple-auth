import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';
import { computed } from '@ember/object';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.apiHost,

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = {};
    if (this.get('session.isAuthenticated')) {
      headers['Authorization'] = `Bearer ${this.get('session.data.authenticated.access_token')}`;
    }

    return headers;
  }),
});
