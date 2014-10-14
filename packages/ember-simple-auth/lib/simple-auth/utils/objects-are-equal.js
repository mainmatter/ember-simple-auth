/**
  @method objectsAreEqual
  @private
*/
export default function(a, b) {
  if(a === b) return true;
  if(!(a instanceof Object) || !(b instanceof Object)) return false;
  if(a.constructor !== b.constructor) return false;

  for(var p in a) {
    if(!a.hasOwnProperty(p)) continue;
    if(!b.hasOwnProperty(p)) return false;
    if(a[p] === b[p]) continue;
    if(typeof(a[p]) !== 'object') return false;
    if (!arguments.callee(a[p], b[p])) return false;
  }

  for(p in b) {
    if(b.hasOwnProperty(p) && !a.hasOwnProperty(p)) return false;
  }

  return true;
}
