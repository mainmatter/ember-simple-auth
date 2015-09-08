export default function setupAuthorizers(registry) {
  const inject = registry.inject || registry.injection;
  inject.call(registry, 'authorizer', 'session', 'session:main');
}
