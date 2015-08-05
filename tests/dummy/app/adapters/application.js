import Ember from 'ember';
import DS from 'ember-data';

const { service } = Ember.inject;

export default DS.JSONAPIAdapter.extend({
  session: service('session'),

  ajaxOptions() {
    let hash = this._super(...arguments);
    let { beforeSend } = hash;
    hash.beforeSend = (xhr) => {
      let accessToken = this.get('session.content.secure.access_token');
      if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      }
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
