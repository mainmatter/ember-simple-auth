import Ember from 'ember';
import SessionService from './session';

export default SessionService.extend({
  account: Ember.computed('content.secure.account_id', function() {
    const accountId = this.get('content.secure.account_id');
    if (!Ember.isEmpty(accountId)) {
      return DS.PromiseObject.create({
        promise: this.container.lookup('store:main').find('account', accountId)
      });
    }
  })
});
