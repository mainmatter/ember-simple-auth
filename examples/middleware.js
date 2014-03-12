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

  // endpoint that will always cause an authorization error
  } else if (request.url === '/auth-error' && request.method === 'GET') {
    error(401, '{ "error": "your token has expired" }');

  // authentication endpoint that also supports token refreshing via the "refresh_token" grant type
  } else if (request.url === '/v2/token' && request.method === 'POST') {
    if (request.body.grant_type === 'password') {
      if (request.body.username === 'letme' && request.body.password === 'in') {
        success('{ "access_token": "secret token - 1", "refresh_token": "secret refresh token!", "expires_in": 15 }');
      } else {
        error(400, '{ "error": "invalid_grant" }');
      }
    } else if (request.body.grant_type === 'refresh_token') {
      if (request.body.refresh_token === 'secret refresh token!') {
        var currentToken = parseInt((request.headers.authorization.match(/Bearer [^\d]*(\d+)/) || [])[1]);
        success('{ "access_token": "secret token - ' + (currentToken + 1) + '" }');
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
  } else if (request.url === '/v4/token') {
    if (request.method === 'PUT') {
      if (request.body.SESSION.USER_NAME === 'letme' && request.body.SESSION.PASS === 'in') {
        success('{ "SESSION": { "TOKEN": "secret token!", "AUTHENTICATED_USER": { "ID": 1 } } }');
      } else {
        error(422, '{ "ERROR": { "MSG": "invalid credentials" } }');
      }
    // callback that will be invoked when the user logs out
    } else if (request.method === 'DELETE') {
      success('');
    } else {
      next();
    }

  // validate the Facebook token sent from the client
  } else if (request.url === '/v5/validate-facebook-token' && request.method === 'PUT') {
    success('{}');
  // if the Facebook token was stored in a DB or so it would be deleted here
  } else if (request.url === '/v5/invalidate-facebook-token' && request.method === 'PUT') {
    success('{}');

  } else {
    next();
  }
};
