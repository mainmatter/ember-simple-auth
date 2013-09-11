require 'rubygems'
require 'bundler'

Bundler.require

run Proc.new { |env|
  request = Rack::Request.new(env)
  puts request.path.inspect
  puts (request.path =~ /js$/).inspect
  if request.get? && request.path == '/'
    Rack::File.new(File.join(File.dirname(__FILE__), 'index.html')).call(env)
  elsif request.get? && request.path =~ /js$/
    Rack::File.new(File.join(File.dirname(__FILE__), '../../dist')).call(env)
  elsif request.post?
    payload = request.body.read
    puts payload.inspect
    json = Oj.load(payload)
    if json['session']['identification'] == 'letme' && json['session']['password'] == 'in'
      [200, { 'Content-Type' => 'application/json' }, ['{ session: { authToken: "secret token!" } }']]
    else
      [422, { 'Content-Type' => 'application/json' }, ['{ error: "invalid credentials" }']]
    end
  else
    [422, { 'Content-Type' => 'application/json' }, ['{ error: "invalid request" }']]
  end
}
