export default function setupSessionStore(registry) {
  registry.injection('service:session', 'session', 'session:main');
}
