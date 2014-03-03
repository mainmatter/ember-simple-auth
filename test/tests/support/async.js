var async = function(fn) {
  return function(done) {
    Ember.run.next(this, function() {
      fn.apply(this);
      done();
    });
  };
};

export { async };
