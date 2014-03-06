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

function cleanElementName(name, module) {
  return name.replace(/^(\$mainModule)?\./, module + '.');
}

function modulizeName(name, module) {
  if (!name.match(new RegExp('^' + module))) {
    name = module + '.' + name;
  }
  return name;
}

function processFunctions(funcs) {
  return funcs.map(function(func) {
    func.signature = buildSignature(func);
    func.name      = func.name.replace(/^actions\./, '');
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

function extractProperties(items) {
  return processFunctions(items.filter(function(item) {
    return item.itemtype === 'property';
  }));
}

function cleanModuleItems(items, module) {
  return items.map(function(item) {
    item.class     = cleanElementName(item.namespace, module);
    item.namespace = module;
    item.anchor    = anchorify(item.namespace + '-' + module);
    return item;
  });
};

module.exports = function() {
  var _this        = this;
  var module       = this.modules[this.project.module];
  var moduleItems = this.classitems.filter(function(item) {
    return item.namespace === '$mainModule' && item.access !== 'private';
  });
  module.functions = cleanModuleItems(extractFunctions(moduleItems), module.name);
  module.anchor    = anchorify(module.name);

  var klassNames = [];
  module.klasses = [];
  for (var klassName in module.classes) {
    klassNames.push(klassName);
  }
  klassNames = klassNames.sort(sortByName);
  for (var i = 0; i < klassNames.length; i++) {
    klass = _this.classes[klassNames[i]]
    var klassItems = _this.classitems.filter(function(classitem) {
      return classitem.class === klass.name && classitem.access !== 'private';
    }).map(function(item) {
      item.class  = modulizeName(cleanElementName(item.class, module.name), module.name);
      item.anchor = anchorify(item.class + '-' + item.name);
      return item;
    });
    klass.properties = extractProperties(klassItems);
    klass.methods    = extractMethods(klassItems);
    klass.actions    = extractActions(klassItems);
    klass.uses       = (klass.uses || []).map(function(name) {
      return cleanElementName(name, module.name);
    });
    if (!!klass.extends) {
      klass.extends = cleanElementName(klass.extends, module.name);
    }
    klass.name   = modulizeName(cleanElementName(klass.name, module.name), module.name);
    klass.anchor = anchorify(klass.name);
    module.klasses.push(klass);
  }
  return module;
};
