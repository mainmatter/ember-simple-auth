import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

export default function isFastBoot() {
  return computed(function() {
    const container = getOwner(this);
    assert('You may only use isFastBoot() on a container-aware object', container && typeof container.lookup === 'function');

    const fastboot = container.lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  });
}
