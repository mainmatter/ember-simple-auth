/**
  @method isSecureUrl
  @private
*/
var isSecureUrl = function(url) {
  var link  = document.createElement('a');
  link.href = location;
  link.href = url;
  return link.protocol == 'https:';
};

export { isSecureUrl };
