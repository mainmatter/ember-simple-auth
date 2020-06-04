import Model, { attr } from '@ember-data/model';

export default Model.extend({
  login: attr('string'),
  name:  attr('string')
});
