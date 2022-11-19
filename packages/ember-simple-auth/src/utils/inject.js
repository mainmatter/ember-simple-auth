export default function(registry, factoryNameOrType, property, injectionName) {
  const inject = registry.inject || registry.injection;
  inject.call(registry, factoryNameOrType, property, injectionName);
}
