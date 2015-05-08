/**
  This was taken from http://stackoverflow.com/questions/1068834/object-comparison-in-javascript#1144249

  @method objectsAreEqual
  @private
*/
export default function objectsAreEqual(a, b) {
  function compare(x, y) {
    var property;
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    if (x === y) {
      return true;
    }

    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    for (property in y) {
      if (y.hasOwnProperty(property) !== x.hasOwnProperty(property)) {
        return false;
      } else if (typeof y[property] !== typeof x[property]) {
        return false;
      }
    }

    for (property in x) {
      if (y.hasOwnProperty(property) !== x.hasOwnProperty(property)) {
        return false;
      } else if (typeof y[property] !== typeof x[property]) {
        return false;
      }

      switch (typeof (x[property])) {
        case 'object':
          if (!compare(x[property], y[property])) {
            return false;
          }
          break;
        default:
          if (x[property] !== y[property]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  return compare(a, b);
}
