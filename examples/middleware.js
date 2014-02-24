module.exports = function(request, response, next) {
  if (request.url === '/ember-simple-auth.js') {
    response.redirect('/dist/ember-simple-auth.js');
  } else {
    next();
  }
};
