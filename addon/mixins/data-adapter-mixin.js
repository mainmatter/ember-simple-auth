import Ember from 'ember';

const { service } = Ember.inject;

/**
  This mixin is for adapters and will make authorizing requests as easy as
  with the $.ajaxPrefilter before while being much cleaner. All that is to
  be done to authorize all Ember Data requests with an authorizer of choice
  is now:

  ```js
  // app/adapters/application.js
  import DS from 'ember-data';
  import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

  export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:application'
  });
  ```

  @class DataAdapterMixin
  @namespace Mixins
  @module ember-simple-auth/mixins/data-adapter-mixin
  @extends Ember.Mixin
  @static
  @public
*/

export default Ember.Mixin.create({
  session: service('session'),

  ajaxOptions() {
    let hash = this._super(...arguments);
    let { beforeSend } = hash;
    hash.beforeSend = (xhr) => {
      this.get('session').authorize(this.get('authorizer'), (headerName, headerValue) => {
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
