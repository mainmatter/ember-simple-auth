import Model, { attr } from '@ember-data/model';

export default class PostModel extends Model {
  @attr('string') title;
  @attr('string') body;
}
