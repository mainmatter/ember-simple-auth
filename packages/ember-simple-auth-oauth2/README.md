#### The RFC 6749 (OAuth 2.0) Authenticator

Ember.SimpleAuth's default authenticator (see the
[API docs for `Authenticators.OAuth2`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authenticators-OAuth2))
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

and in exchange receives an `access_token` that is then used to identify the
user in subsequent requests:

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

__Ember.SimpleAuth's OAuth 2.0 authenticator also supports automatic token
refreshing__ which is explained in more detail in
[section 6 of RFC 6749](http://tools.ietf.org/html/rfc6749#section-6).

##### Using the RFC 6749 (OAuth 2.0) Authenticator

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
needs to include:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin);
```

The mixin will by default use the OAuth 2.0 authenticator to authenticate the
session.

##### Compatible Middlewares

There is a whole bunch of middlewares for different languages and servers that
implement OAuth 2.0 and can be used with Ember.SimpleAuth's OAuth 2.0
authenticator. The
[complete list can be found in the Wiki](https://github.com/simplabs/ember-simple-auth/wiki/OAuth-2.0-Middlewares).


#### The RFC 6750 Authorizer

Ember.SimpleAuth's default authorizer (see the
[API docs for `Authorizers.OAuth2`](http://ember-simple-auth.simplabs.com/api.html#Ember-SimpleAuth-Authorizers-OAuth2))
is compliant with [RFC 6750 (OAuth 2.0 Bearer Tokens)](http://tools.ietf.org/html/rfc6750)
and thus fits the default OAuth 2.0 authenticator. It simply injects an
`Authorization` header with the `access_token` that the authenticator acquired
into all requests:

```
Authorization: Bearer <access_token>
```
