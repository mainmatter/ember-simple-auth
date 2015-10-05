export default function(instance, factoryName) {
  if (instance.lookup) {
    return instance.lookup(factoryName);
  } else {
    return instance.container.lookup(factoryName);
  }
}
