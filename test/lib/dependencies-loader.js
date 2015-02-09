(function() {
  function parseVersion(dependency) {
    var regexp = new RegExp('[?&]' + dependency + '=(.*?)(?=&|$)');
    return (window.location.search.match(regexp) || [])[1];
  }

  var jQueryVersion     = parseVersion('jQuery') || '2.1.3';
  var emberVersion      = parseVersion('ember') || '1.10.0';
  var handlebarsVersion = parseVersion('handlebars') || '2.0.0';

  document.write('<script src="vendor/jquery-' + jQueryVersion + '.js"></script>');
  document.write('<script src="vendor/handlebars-' + handlebarsVersion + '.js"></script>');
  document.write('<script src="vendor/ember-' + emberVersion + '.js"></script>');
})();
