export function register(applicationInstance, name, factory) {
  if (applicationInstance && applicationInstance.application) {
    return applicationInstance.application.register(name, factory);
  } else {
    return applicationInstance.registry.register(name, factory);
  }
}

export default register;
