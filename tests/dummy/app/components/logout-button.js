import Ember from 'ember';

export default Ember.Component.extend({
  tagName:        'a',
  classNames:     ['btn', 'btn-danger', 'navbar-btn', 'navbar-right'],
  sessionService: Ember.inject.service('session'),

  click() {
    this.get('sessionService').invalidate();
  }
});