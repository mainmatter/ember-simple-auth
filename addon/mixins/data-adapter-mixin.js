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
    const authorizer = this.get('authorizer');
    let hash = this._super(...arguments);
    let { beforeSend } = hash;

    Ember.assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", Ember.isPresent(authorizer));

    hash.beforeSend = (xhr) => {
      this.get('session').authorize(authorizer, (headerName, headerValue) => {
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
