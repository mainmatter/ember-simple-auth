$(function() {
  $('body').scrollspy({ target: '.nav-sidebar' });
  $('#sidebar').on('activate.bs.scrollspy', function(event) {
    console.log(event);
  });
});
