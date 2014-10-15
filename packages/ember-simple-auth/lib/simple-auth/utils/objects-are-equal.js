/**
  @method objectsAreEqual
  @private
*/
function objectsAreEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }
  if(a.constructor !== b.constructor) {
    return false;
  }

  for (var property in a) {
    if (!a.hasOwnProperty(property)) {
      continue;
    }
    if (!b.hasOwnProperty(property)) {
      return false;
    }
    if (a[property] === b[property]) {
      continue;
    }
    if (Ember.typeOf(a[property]) !== 'object') {
      return false;
    }
    if (!objectsAreEqual(a[property], b[property])) {
      return false;
    }
  }

  for (property in b) {
    if (b.hasOwnProperty(property) && !a.hasOwnProperty(property)) {
      return false;
    }
  }

  return true;
}

export default objectsAreEqual;
