import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Service.extend({
  session: service('session'),

  account: Ember.computed('session.content.secure.account_id', function() {
    const accountId = this.get('session.content.secure.account_id');
    if (!Ember.isEmpty(accountId)) {
      return DS.PromiseObject.create({
        promise: this.container.lookup('store:main').find('account', accountId)
      });
    }
  })
});
