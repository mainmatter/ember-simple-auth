import Base from 'simple-auth/authorizers/base';

/**
  Authorizer that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by sending a bearer token
  ([RFC 6750](http://tools.ietf.org/html/rfc6750)) in the request's
  Form-Encoded Body Parameter ([RFC 6750 Section 2.2](http://tools.ietf.org/html/rfc6750#section-2.2)
  for POST requests and in the URI Query Parameter
  ([RFC 6750 Section 2.3](http://tools.ietf.org/html/rfc6750#section-2.3)
  for GET requests.

  _The factory for this authorizer is registered as
  `'simple-auth-authorizer:oauth2-access-token'` in Ember's container._

  @class OAuth2
  @namespace SimpleAuth.Authorizers
  @module simple-auth-oauth2/authorizers/oauth2
  @extends Base
*/
export default Base.extend({
  /**
    Authorizes an XHR request by sending the `access_token` property from the
    session as a bearer token in the Form-Encoded Body Parameter or
    URI Query Parameter:

    ```
    POST /resource HTTP/1.1
    Host: server.example.com
    Content-Type: application/x-www-form-urlencoded

    access_token=mF_9.B5f-4.1JqM
    ```

    ```
    GET /resource?access_token=mF_9.B5f-4.1JqM HTTP/1.1
    Host: server.example.com
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
    var accessToken = this.get('session.access_token');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
      var data;

      if (requestOptions.contentType && requestOptions.contentType.indexOf('application/json') > -1) {
        data = requestOptions.data || '{}';
        data = Ember.$.extend(JSON.parse(data), {access_token: accessToken});
        requestOptions.data = JSON.stringify(data);
      } else {
        data = requestOptions.data || '';

        if (typeof data.append === 'function') { // FormData
          data.append('access_token', accessToken);
        } else {
          var param = Ember.$.param({access_token: accessToken});

          if (data.length === 0) {
            requestOptions.data = param;
          } else {
            requestOptions.data += '&' + param;
          }
        }
      }
    }
  }
});
