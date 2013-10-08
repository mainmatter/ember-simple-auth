Ember.SimpleAuth
================

Ember.SimpleAuth is a simple authentication module for implementing a token based authentication
pattern with ember.js applications. It only has minimal requirements with respect to the server
part of the application.

Usage
-----

Installation
------------

Building
--------

In order to build ember-simple-auth yourself you need to have Ruby and the
[bundler gem](http://bundler.io) installed. If you have that, building is
as easy as running:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth
bundle
bundle exec rake dist
```

After running that you find the compiled source file (including a minified
version) in the ```dist``` directory.
