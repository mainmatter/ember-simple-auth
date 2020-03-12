import DS from 'ember-data';

const { attr, Model } = DS;

export default class AccountModel extends Model {
  @attr login;
  @attr name;
}
