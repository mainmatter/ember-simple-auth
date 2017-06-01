export function lookupFactory(applicationInstance, name) {
  if (applicationInstance && applicationInstance.lookupFactory) {
    return applicationInstance.lookupFactory(name);
  } else if (applicationInstance && applicationInstance.application) {
    return applicationInstance.application.__container__.lookupFactory(name);
  } else {
    return applicationInstance.container.lookupFactory(name);
  }
}

export default lookupFactory;
