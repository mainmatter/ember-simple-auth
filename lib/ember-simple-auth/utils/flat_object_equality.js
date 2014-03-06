var flatObjectsAreEqual = function(a, b) {
  function sortObject(object) {
    var array = [];
    for (var property in object) {
      array.push([property, object[property]]);
    }
    return array.sort(function(a, b) { return a[1] - b[1]; });
  }
  return JSON.stringify(sortObject(a)) === JSON.stringify(sortObject(b));
};

export { flatObjectsAreEqual };
