/**
  @method isSecureUrl
  @private
*/
export default function(url) {
  var link  = document.createElement('a');
  link.href = url;
  link.href = link.href;
  return link.protocol == 'https:';
}
