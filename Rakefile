require 'bundler/setup'
require 'ember-dev/tasks'

directory 'tmp'

task :clean          => 'ember:clean'
task :dist           => 'ember:dist'
task :test, [:suite] => 'ember:test'
task :default        => [:dist, :test]

task :docs do
  `yuidoc -c docs/yuidoc.json -T simple -o docs/build packages`
end
