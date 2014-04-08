##### Using the Devise Authenticator

In order to use the Devise authenticator the application needs to have a
login route:

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
needs to include:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin,
  { authenticatorFactory: "authenticator:devise" });
```

The mixin will by default use the OAuth 2.0 authenticator to authenticate the
session, so be sure to set the authenticator to `authenticator:devise`.

Next, you need to set the Devise authorizer in your EmberSimpleAuth initializer:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      authorizer: "authorizer:devise"
    });
  }
});
```

The authorizer will append the client's `auth_token` to the header of each request, so you'll have to grab it in Rails if you want to recognize them with functions like `current_user`. To do so, add an appropriate `before_filter` to your `application_controller`:

```ruby
# app/controllers/application_controller.rb
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

(Note that for security reasons, we're authorizing the user by both email and authentication_token, as described [here](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).)

Finally, within your `DeviseSessionsController`, be sure to return the user's `auth_token`, `email`, and `id` like so:

```ruby
  def create
    resource = resource_from_credentials
    data = {
      user_id: resource.id,
      auth_token: resource.authentication_token,
      auth_email: resource.email
    }
    render json: data, status: 201
  end
```
