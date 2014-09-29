var global = (typeof window !== 'undefined') ? window : {};

export default function(scope) {
  return Ember.get(global, 'ENV.' + scope) || {};
}
