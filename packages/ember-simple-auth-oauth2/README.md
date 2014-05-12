__[The API docs for Ember.SimpleAuth OAuth 2.0 are available here](http://ember-simple-auth.simplabs.com/ember-simple-auth-oauth2-api-docs.html)__

# Ember.SimpleAuth OAuth 2.0

This is an extension to the Ember.SimpleAuth library that provides an
authenticator and an authorizer that are compatible with OAuth 2.0.

## The Authenticator

The authenticator (see the
[API docs for `Authenticators.OAuth2`](http://ember-simple-auth.simplabs.com/ember-simple-auth-oauth2-api-docs.html#Ember-SimpleAuth-Authenticators-OAuth2))
is compliant with [RFC 6749 (OAuth 2.0)](http://tools.ietf.org/html/rfc6749),
specifically the _"Resource Owner Password Credentials Grant Type"_. This grant
type basically specifies that the client sends a set of credentials to a
server:

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=johndoe&password=A3ddj3w
```

and if those credentials are valid in exchange receives an `access_token`:

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token":"2YotnFZFEjr1zCsicMWpAA",
  "token_type":"bearer"
}
```

__The OAuth 2.0 authenticator also supports automatic token refreshing__ which
is explained in more detail in
[section 6 of RFC 6749](http://tools.ietf.org/html/rfc6749#section-6).

### Using the RFC 6749 (OAuth 2.0) Authenticator

In order to use the OAuth 2.0 authenticator the application needs to have a
login route:

```js
App.Router.map(function() {
  this.route('login');
});
```

This route displays the login form with fields for `identification` and
`password`:

```html
<form {{action 'authenticate' on='submit'}}>
  <label for="identification">Login</label>
  {{input id='identification' placeholder='Enter Login' value=identification}}
  <label for="password">Password</label>
  {{input id='password' placeholder='Enter Password' type='password' value=password}}
  <button type="submit">Login</button>
</form>
```

The `authenticate` action that is triggered by submitting the form is provided
by the `LoginControllerMixin` that the respective controller in the application
can include (the controller can also implement its own action and use the
session API directly; see the
[API docs for `Session`](http://ember-simple-auth.simplabs.com/ember-simple-auth-api-docs.html#Ember-SimpleAuth-Session)).
It then also needs to specify the OAuth 2.0 authenticator to be used:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  authenticatorFactory: 'ember-simple-auth-authenticator:oauth2-password-grant'
});
```

### Compatible Middlewares

There are lots of middlewares for different server stacks that support OAuth
2.0 and the _"Resource Owner Password Credentials Grant Type"_ and that work
with this library:

#### Ruby

* rack-oauth2: https://github.com/nov/rack-oauth2
* doorkeeper: https://github.com/applicake/doorkeeper
* Rails app template: https://github.com/bazzel/rails-templates/blob/master/ember-simple-auth.rb

#### PHP

* oauth2-server: https://github.com/php-loep/oauth2-server
* zfr-oauth2-server: https://github.com/zf-fr/zfr-oauth2-server
* zfr-oauth2-server-module (for ZF2): https://github.com/zf-fr/zfr-oauth2-server-module

#### Java

* scribe-java: https://github.com/fernandezpablo85/scribe-java

#### Node.js

* oauth2orize: https://github.com/jaredhanson/oauth2orize

## The Authorizer

The authorizer (see the
[API docs for `Authorizers.OAuth2`](http://ember-simple-auth.simplabs.com/ember-simple-auth-oauth2-api-docs.html#Ember-SimpleAuth-Authorizers-OAuth2))
is compliant with [RFC 6750 (OAuth 2.0 Bearer Tokens)](http://tools.ietf.org/html/rfc6750)
and thus fits the OAuth 2.0 authenticator. It simply injects an `Authorization`
header with the `access_token` that the authenticator acquired into all
requests:

```
Authorization: Bearer <access_token>
```

To use the authorizer, specify it for Ember.SimpleAuth's setup:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      authorizerFactory: 'ember-simple-auth-authorizer:oauth2-bearer'
    });
  }
});
```
