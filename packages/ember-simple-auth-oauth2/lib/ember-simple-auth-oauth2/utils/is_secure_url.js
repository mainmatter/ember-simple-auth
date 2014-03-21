var isSecureUrl = function(url) {
  var link  = document.createElement('a');
  link.href = location;
  link.href = link.href;
  return link.protocol == 'https:';
};

export { isSecureUrl };
