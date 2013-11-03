require 'bundler/setup'
require 'ember-dev/tasks'

directory 'tmp'

task :clean          => 'ember:clean'
task :dist           => 'ember:dist'
task :test, [:suite] => 'ember:test'
task :default        => [:dist, :test]

task :docs do
  `yuidoc -c docs/yuidoc.json -o docs/build -p packages`
  `docs/theme/build docs/build/data.json docs/build/html`
end
