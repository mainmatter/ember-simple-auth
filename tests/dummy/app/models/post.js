import DS from 'ember-data';

const { attr, Model } = DS;

export default class PostModel extends Model {
  @attr title;
  @attr body;
}
