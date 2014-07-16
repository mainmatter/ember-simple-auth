(function() {
  function parseVersion(dependency) {
    var regexp = new RegExp('[?&]' + dependency + '=(.*?)(?=&|$)');
    return (window.location.search.match(regexp) || [])[1];
  }

  var jQueryVersion     = parseVersion('jQuery') || '2.1.1';
  var emberVersion      = parseVersion('ember') || '1.6.1';

  document.write('<script src="vendor/jquery-' + jQueryVersion + '.js"></script>');
  document.write('<script src="vendor/handlebars.js"></script>');
  document.write('<script src="vendor/ember-' + emberVersion + '.js"></script>');
})();
