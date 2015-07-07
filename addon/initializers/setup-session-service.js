export default function setupSessionStore(registry) {
  // TODO: this should actually only inject into the session service
  registry.injection('service', 'session', 'simple-auth-session:main');
}
