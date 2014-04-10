/**
  @method flatObjectsAreEqual
  @private
*/
var flatObjectsAreEqual = function(a, b) {
  function sortObject(object) {
    var array = [];
    for (var property in object) {
      array.push([property, object[property]]);
    }
    return array.sort(function(a, b) {
      if (a[0] < b[0]) {
        return -1;
      } else if (a[0] > b[0]) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  return JSON.stringify(sortObject(a)) === JSON.stringify(sortObject(b));
};

export { flatObjectsAreEqual };
