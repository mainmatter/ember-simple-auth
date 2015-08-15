export default function setupAuthorizers(registry) {
  registry.injection('authorizer', 'session', 'simple-auth-session:main');
}
