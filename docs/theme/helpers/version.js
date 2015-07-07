module.exports = function(version) {
  var stack = version.split('.');
  stack.pop();
  return stack.join('.');
}
