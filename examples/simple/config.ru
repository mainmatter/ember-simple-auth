require 'rubygems'
require 'bundler'

Bundler.require

run Proc.new { |env|
  request = Rack::Request.new(env)
  if request.post?
    json = Oj.load(request.body.read)
    if json['session']['identification'] == 'letme' && json['session']['password'] == 'in'
      [200, { 'Content-Type' => 'application/json' }, ['{ session: { authToken: "secret token!" } }']]
    else
      [422, { 'Content-Type' => 'application/json' }, ['{ error: "invalid credentials" }']]
    end
  else
    [422, { 'Content-Type' => 'application/json' }, ['{ error: "invalid request method" }']]
  end
}
