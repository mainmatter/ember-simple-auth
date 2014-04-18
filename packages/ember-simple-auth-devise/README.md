__[The API docs for Ember.SimpleAuth Devise are available here](http://ember-simple-auth.simplabs.com/ember-simple-auth-devise-api-docs.html)__

# Ember.SimpleAuth Devise

This is an extension to the Ember.SimpleAuth library that provides an
authenticator and an authorizer that are compatible with customized
installations of [Devise](https://github.com/plataformatec/devise).

## The Authenticator

In order to use the Devise authenticator (see the
[API docs for `Authenticators.Devise`](http://ember-simple-auth.simplabs.com/ember-simple-auth-devise-api-docs.html#Ember-SimpleAuth-Authenticators-Devise))
the application needs to have a login route:

```js
App.Router.map(function() {
  this.route('login');
});
```

This route displays the login form with fields for `identification`,
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
needs to include. It also needs to specify the Devise authenticator to be used:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin,
  { authenticatorFactory: "authenticator:devise" });
```

As token authentication is not actually part of Devise anymore, there are some
customizations necessary on the server side. In order for the authentication to
work it has to include the user's auth token and email in the JSON response for
session creation:

```ruby
class SessionsController < Devise::SessionsController
  def create
    resource = resource_from_credentials
    data     = {
      auth_token: resource.authentication_token,
      auth_email: resource.email
    }
    render json: data, status: 201
  end
end
```

## The Authorizer

The authorizer (see the
[API docs for `Authorizers.Devise`](http://ember-simple-auth.simplabs.com/ember-simple-auth-devise-api-docs.html#Ember-SimpleAuth-Authorizers-Devise))
authorizes requests by adding `auth-token` and `auth-email` headers. To use the
authorizer, specify it for Ember.SimpleAuth's setup:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      authorizerFactory: 'authorizer:devise'
    });
  }
});
```

As token authentication is not actually part of Devise anymore, the server
needs to implement a custom authentication method that uses the provided email
and token to look up the user (see
[discussion here](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6)):

```ruby
class ApplicationController < ActionController::API
  before_filter :authenticate_user_from_token!

  private

    def authenticate_user_from_token!
      token = request.headers['auth-token'].to_s
      email = request.headers['auth-email'].to_s
      return unless token && email

      user = User.find_by_email(email)

      if user && Devise.secure_compare(user.authentication_token, token)
        sign_in user, store: false
      end
    end
end
```
