import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Service.extend({
  session: service('session'),
  store: Ember.inject.service(),

  account: Ember.computed('session.data.secure.account_id', function() {
    const accountId = this.get('session.data.secure.account_id');
    if (!Ember.isEmpty(accountId)) {
      return DS.PromiseObject.create({
        promise: this.get('store').find('account', accountId)
      });
    }
  })
});
