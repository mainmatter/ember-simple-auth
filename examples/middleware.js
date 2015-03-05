module.exports = function(request, response, next) {
  function success(content) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(content);
  }
  function error(status, content) {
    response.statusCode = status;
    response.setHeader('Content-Type', 'application/json');
    response.end(content);
  }

  // endpoint for simple authentication with grant_type "password"
  if (request.url === '/token' && request.method === 'POST') {
    if (request.body.grant_type === 'password') {
      if (request.body.username === 'letme' && request.body.password === 'in') {
        success('{ "access_token": "secret token!" }');
      } else {
        error(400, '{ "error": "invalid_grant" }');
      }
    } else {
      error(400, '{ "error": "unsupported_grant_type" }');
    }

  // endpoint for token revokation
  } else if (request.url === '/revoke' && request.method === 'POST') {
    if (request.body.token_type_hint === 'access_token' || request.body.token_type_hint === 'refresh_token') {
      success('');
    } else {
      error(400, '{ "error": "unsupported_token_type" }');
    }

  // endpoint that will always cause an authorization error
  } else if (request.url === '/auth-error' && request.method === 'GET') {
    error(401, '{ "error": "your token has expired" }');

  // authentication endpoint that also supports token refreshing via the "refresh_token" grant type
  } else if (request.url === '/v2/token' && request.method === 'POST') {
    if (request.body.grant_type === 'password') {
      if (request.body.username === 'letme' && request.body.password === 'in') {
        success('{ "access_token": "secret token!", "refresh_token": "secret refresh token!", "expires_in": 15 }');
      } else {
        error(400, '{ "error": "invalid_grant" }');
      }
    } else if (request.body.grant_type === 'refresh_token') {
      if (request.body.refresh_token === 'secret refresh token!') {
        success('{ "access_token": "' + Math.random().toString(36).substring(10) + '" }');
      } else {
        error(400, '{ "error": "invalid_grant" }');
      }
    } else {
      error(400, '{ "error": "unsupported_grant_type" }');
    }

  // authentication endpoint that includes an authenticated account in the response
  } else if (request.url === '/v3/token' && request.method === 'POST') {
    if (request.body.grant_type === 'password') {
      if (request.body.username === 'letme' && request.body.password === 'in') {
        success('{ "access_token": "secret token!", "account_id": 1 }');
      } else {
        error(400, '{ "error": "invalid_grant" }');
      }
    } else {
      error(400, '{ "error": "unsupported_grant_type" }');
    }

  // endpoint that returns the data for the Ember Data Account model
  } else if (request.url === '/accounts/1' && request.method === 'GET') {
    if (request.headers.authorization === 'Bearer secret token!') {
      success('{ "account": { "id": 1, "login": "letme", "name": "Some Person"} }');
    } else {
      error(401, '{}');
    }

  // endpoint that returns the data for the Ember Data Post model
  } else if (request.url === '/posts' && request.method === 'GET') {
    if (request.headers.authorization === 'Bearer secret token!') {
      success('{ "posts": [{ "id": 1, "title": "first post", "body": "some content"}, { "id": 2, "title": "2nd post", "body": "some other body" }] }');
    } else {
      error(401, '{}');
    }

  // custom authentication endpoint with a completely non-standard interface
  } else if (request.url === '/v4/session') {
    if (request.method === 'POST') {
      if (request.body.session.identification === 'letme' && request.body.session.password === 'in') {
        success('{ "session": { "token": "secret token!" } }');
      } else {
        error(422, '{ "error": "invalid credentials" }');
      }
    // callback that will be invoked when the user logs out
    } else if (request.method === 'DELETE') {
      success('');
    } else {
      next();
    }
  } else if (request.url === '/v4/data') {
    if (request.headers.authorization === 'Token: secret token!') {
      success('{ "some": "data" }');
    } else {
      error(401, '{}');
    }

  // endpoint for the devise example
  } else if (request.url === '/v5/users/sign_in') {
    if (request.method === 'POST') {
      if (request.body.user.email === 'letme' && request.body.user.password === 'in') {
        success('{ "email": "letme", "token": "secret token!" }');
      } else {
        error(422, '');
      }
    } else {
      next();
    }
  } else if (request.url === '/v5/data') {
    if (request.headers.authorization === 'Token token="secret token!", email="letme"') {
      success('{ "some": "data" }');
    } else {
      error(401, '{}');
    }

  } else {
    next();
  }
};
