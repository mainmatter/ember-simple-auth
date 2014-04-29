__[The API docs for Ember.SimpleAuth Devise are available here](http://ember-simple-auth.simplabs.com/ember-simple-auth-devise-api-docs.html)__

# Ember.SimpleAuth Devise

This is an extension to the Ember.SimpleAuth library that provides an
authenticator and an authorizer that are compatible with customized
installations of [Devise](https://github.com/plataformatec/devise).

## Server-side setup

As token authentication is not actually part of Devise anymore, there are some
customizations necessary on the server side. Most of this walk-through is 
adapted from [José Valim's gist on token authentication]
(https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).

First, you must add a colunm to your database in which to store the
authentication token:

```ruby
class AddAuthenticationTokenToUser < ActiveRecord::Migration
  def change
    add_column :users, :authentication_token, :string
  end
end
```

Then, you must set up your model to generate the token:

```ruby
class User < ActiveRecord::Base
...
  before_save :ensure_authentication_token

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

private

  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end
end
```

When a user signs in using Ember, requests are made with a JSON API.
Unfortunately, Devise does not give the responses we need in JSON, so we must
make our own controller:

```ruby
class SessionsController < Devise::SessionsController
  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    response = {
      auth_token: resource.authentication_token,
      auth_email: resource.email
    }
    render json: response, status: 201
  end
end
```

Then, we need to tell Devise to use this controller instead of its default:

```ruby
MyRailsApp::Application.routes.draw do
  devise_for :users, controllers: {sessions: "sessions"}
  ...
end
```

Finally, we have to authenticate each subsequent request:

```ruby
class ApplicationController < ActionController::Base
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

Now, we can get on to configuring the Ember side of things.

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
