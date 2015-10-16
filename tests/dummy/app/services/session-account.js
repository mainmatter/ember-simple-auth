import Ember from 'ember';
import DS from 'ember-data';

const { service } = Ember.inject;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  account: Ember.computed('session.data.authenticated.account_id', function() {
    const accountId = this.get('session.data.authenticated.account_id');
    if (!Ember.isEmpty(accountId)) {
      return DS.PromiseObject.create({
        promise: this.get('store').find('account', accountId)
      });
    }
  })
});
