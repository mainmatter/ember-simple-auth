var global = (typeof window !== 'undefined') ? window : {};

export default function(scope) {
  return(global.ENV || {})[scope] || {};
}
