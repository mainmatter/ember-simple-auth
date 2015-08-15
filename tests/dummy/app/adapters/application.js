import Ember from 'ember';
import DS from 'ember-data';

const { service } = Ember.inject;

export default DS.JSONAPIAdapter.extend({
  session: service('session'),

  ajaxOptions() {
    let hash = this._super(...arguments);
    let { beforeSend } = hash;
    hash.beforeSend = (xhr) => {
      this.get('session').authorize('authorizer:application', (headerName, headerValue) => {
        xhr.setRequestHeader(headerName, headerValue);
      });
      if (beforeSend) {
        beforeSend(xhr);
      }
    };
    return hash;
  },

  handleResponse(status) {
    if (status === 401) {
      this.get('session').invalidate();
      return true;
    } else {
      return this._super(...arguments);
    }
  }
});
