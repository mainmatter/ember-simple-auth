import Ember from 'ember';

const { setOwner } = Ember;

export default function createWithContainer(Constructor, options, container) {
  if (setOwner) {
    let instance = Constructor.create(options);
    setOwner(instance, container);
    return instance;
  } else {
    options.container = container;
    return Constructor.create(options);
  }
}
