export default function setupAuthorizers(registry) {
  registry.injection('authorizer', 'session', 'session:main');
}
