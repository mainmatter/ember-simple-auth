##### Using the Devise Authenticator

In order to use the Devise authenticator the application needs to have a
login route:

```js
App.Router.map(function() {
  this.route('login');
});
```

This route displays the login form with fields for `identification`,
`password`, and an optionally `remeber_me`:

```html
<form {{action 'authenticate' on='submit'}}>
  <label for="identification">Login</label>
  {{input id='identification' placeholder='Enter Login' value=identification}}
  <label for="password">Password</label>
  {{input id='password' placeholder='Enter Password' type='password' value=password}}
  <label for="remember_me">Remember Me</label>
  {{input id='remember_me' checked=remember_me type="checkbox" }}
  <button type="submit">Login</button>
</form>
```

The `authenticate` action that is triggered by submitting the form is provided
by the `LoginControllerMixin` that the respective controller in the application
needs to include:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin,
  { authenticator: "authenticator:devise" });
```

The mixin will by default use the OAuth 2.0 authenticator to authenticate the
session, so be sure to set the authenticator to `authenticator:devise`.
