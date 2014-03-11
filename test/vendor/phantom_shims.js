if (navigator.userAgent.indexOf('PhantomJS') !== -1) {
  window.ProgressEvent = function (type, params) {
    params                = params || {};
    this.lengthComputable = params.lengthComputable || false;
    this.loaded           = params.loaded || 0;
    this.total            = params.total || 0;
  };
}
