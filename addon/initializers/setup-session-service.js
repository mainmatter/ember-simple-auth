export default function setupSessionStore(registry) {
  registry.injection('service:session', 'session', 'simple-auth-session:main');
}
