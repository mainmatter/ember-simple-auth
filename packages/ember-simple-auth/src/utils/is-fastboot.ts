import { assert } from '@ember/debug';

export default function isFastBoot(owner: any) {
  assert('You must pass in an owner to isFastBoot!', owner && typeof owner.lookup === 'function');
  const fastboot = owner.lookup('service:fastboot');
  return fastboot ? fastboot.get('isFastBoot') : false;
}
