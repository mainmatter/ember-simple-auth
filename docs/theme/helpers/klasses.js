function sortByName(a, b) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
}

function buildSignature(method) {
  var arguments = (method.params || []).map(function(param) {
    return param.optional ? ['[', param.name, ']'].join('') : param.name;
  }).join(', ');
  return [method.name, '(', arguments, ')'].join('');
}

module.exports = function() {
  var _this   = this;
  var klasses = [];
  for (var klass in _this.classes) {
    klass = _this.classes[klass]
    var items = _this.classitems.filter(function(classitem) {
      return classitem.class === klass.name && classitem.access !== 'private'
    });
    klass.properties = items.filter(function(classitem) {
      return classitem.itemtype === 'property';
    });
    klass.methods = items.filter(function(classitem) {
      return classitem.itemtype === 'method' && !classitem.name.match(/^actions\./);
    }).map(function(method) {
      method.signature = buildSignature(method);
      return method;
    });
    klass.actions = items.filter(function(classitem) {
      return classitem.itemtype === 'method' && classitem.name.match(/^actions\./);
    }).map(function(action) {
      action.signature = buildSignature(action);
      action.name = action.name.replace(/^actions\./, '');
      return action;
    });
    klasses.push(klass);
  }
  return klasses.sort(sortByName);
};
