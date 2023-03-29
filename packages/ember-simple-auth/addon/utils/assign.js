/**
 * Assign from @ember/polyfill, copied here to maintain compatilibity
 * with Ember 3.x (and IE 11) as well as 5.x which drops this polyfill
 * https://github.com/emberjs/ember.js/blob/744e536d37697aa59b19dcb4590593861b8eba5a/packages/%40ember/polyfills/lib/assign.ts
 */
function assign(target) {
  for (let i = 1; i < arguments.length; i++) {
    let arg = arguments[i];
    if (!arg) {
      continue;
    }

    let updates = Object.keys(arg);

    for (let i = 0; i < updates.length; i++) {
      let prop = updates[i];
      target[prop] = arg[prop];
    }
  }

  return target;
}

export default Object.assign || assign;
