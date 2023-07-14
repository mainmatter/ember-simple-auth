/* eslint-disable no-unused-vars */
// @ts-check
import { assert } from '@ember/debug';
import ApplicationInstance from '@ember/application/instance';

export default function isFastBoot(owner) {
  assert('You must pass in an owner to isFastBoot!', owner && typeof owner.lookup === 'function');
  const fastboot = owner.lookup('service:fastboot');
  return fastboot ? fastboot.get('isFastBoot') : false;
}
