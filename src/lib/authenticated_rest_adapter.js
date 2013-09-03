if (DS.RESTAdapter) {
  App.AuthenticatedRESTAdapter = DS.RESTAdapter.extend({
    ajax: function(url, type, hash) {
      hash         = hash || {};
      hash.headers = hash.headers || {};
      hash.headers['X-AUTHENTICATION-TOKEN'] = this.store.session.authToken;
      return this._super(url, type, hash);
    }
  });
}
