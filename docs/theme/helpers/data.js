function sortByName(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

function anchorify(name) {
  return name.replace(/[\._]/g, '-');
}

function buildSignature(method) {
  var arguments = (method.params || []).map(function(param) {
    return param.optional ? ['[', param.name, ']'].join('') : param.name;
  }).join(', ');
  return [method.name, '(', arguments, ')'].join('');
}

function processFunctions(funcs) {
  return funcs.map(function(func) {
    func.name      = func.name.replace(/^actions\./, '');
    func.signature = buildSignature(func);
    return func;
  });
}

function extractFunctions(items) {
  return processFunctions(items.filter(function(item) {
    return item.itemtype === 'method' && item.static === 1;
  }));
}

function extractMethods(items) {
  return processFunctions(items.filter(function(item) {
    return item.itemtype === 'method' && !item.name.match(/^actions\./) && item.static !== 1;
  }));
}

function extractActions(items) {
  return processFunctions(items.filter(function(item) {
    return item.itemtype === 'method' && item.name.match(/^actions\./);
  }));
}

function extractEvents(items) {
  return items.filter(function(item) {
    return item.itemtype === 'event'
  }).map(function(event) {
    event.signature = event.name
    return event;
  });
}

function extractProperties(items) {
  return processFunctions(items.filter(function(item) {
    return item.itemtype === 'property';
  }));
}

function cleanClassItems(items) {
  return items.map(function(item) {
    item.anchor = anchorify(item.class + '-' + item.name);
    return item;
  });
};

module.exports = function() {
  var _this      = this;
  var klasses    = [];
  var klassNames = Object.keys(this.classes).sort(sortByName);
  for (var i = 0; i < klassNames.length; i++) {
    klass = _this.classes[klassNames[i]];
    var klassItems = _this.classitems.filter(function(classitem) {
      return classitem.class === klass.name && classitem.access !== 'private';
    });
    klass.functions  = cleanClassItems(extractFunctions(klassItems));
    klass.properties = cleanClassItems(extractProperties(klassItems));
    klass.methods    = cleanClassItems(extractMethods(klassItems));
    klass.actions    = cleanClassItems(extractActions(klassItems));
    klass.events     = cleanClassItems(extractEvents(klassItems));
    klass.uses       = (klass.uses || []);
    klass.name       = klass.name;
    klass.shortname  = klass.name.replace(klass.namespace + '.', '');
    klass.anchor     = anchorify(klass.name);
    klasses.push(klass);
  }
  return klasses;
};
