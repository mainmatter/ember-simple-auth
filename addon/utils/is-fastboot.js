/* eslint-disable no-unused-vars */
// @ts-check
import { computed } from '@ember/object';
import ComputedProperty from '@ember/object/computed';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import ApplicationInstance from '@ember/application/instance';
import { isPresent } from '@ember/utils';

/**
 * @return {ComputedProperty<boolean>}
 */
export default function isFastBootCPM() {
  return computed({
    get() {
      if (isPresent(this._isFastBootCPM)) {
        return this._isFastBootCPM;
      }
      return isFastBoot(getOwner(this));
    },
    set(key, value) {
      return this._isFastBootCPM = value;
    }
  });
}

/**
 *
 * @param {ApplicationInstance} owner
 * @return {boolean}
 */
export function isFastBoot(owner) {
  assert('You may only use isFastBoot() on a container-aware object', owner && typeof owner.lookup === 'function');
  const fastboot = owner.lookup('service:fastboot');
  return fastboot ? fastboot.get('isFastBoot') : false;
}
