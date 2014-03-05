if (navigator.userAgent.indexOf('PhantomJS') !== -1) {
  window.ProgressEvent = function (type, params) {
    params                = params || {};
    this.lengthComputable = params.lengthComputable || false;
    this.loaded           = params.loaded || 0;
    this.total            = params.total || 0;
  };
}

if (typeof(Ember.RSVP.Promise.resolve) !== 'function') {
  Ember.RSVP.Promise.resolve = function() {
    return new Ember.RSVP.Promise(function(resolve, reject) { resolve(); });
  };
}

if (typeof(Ember.RSVP.Promise.reject) !== 'function') {
  Ember.RSVP.Promise.reject = function() {
    return new Ember.RSVP.Promise(function(resolve, reject) { reject(); });
  };
}
