export default function setupSessionStore(registry) {
  const inject = registry.inject || registry.injection;
  inject.call(registry, 'service:session', 'session', 'session:main');
}
