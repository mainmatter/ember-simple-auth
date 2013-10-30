$(function() {
  $('body').scrollspy({ target: '#sidebar' });
  $('#sidebar').on('activate.bs.scrollspy', function(event) {
    console.log(event);
  });
});
