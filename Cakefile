fs            = require 'fs'
path          = require 'path'
{spawn, exec} = require 'child_process'


# ANSI Terminal Colors.
bold  = '\033[0;1m'
red   = '\033[0;31m'
green = '\033[0;32m'
reset = '\033[0m'

log = (message, color, explanation) ->
	console.log color + message + reset + ' ' + (explanation or '')


task 'watch', 'Continuously build library from src/*.coffee to lib/*.js', ->
	spawn 'coffee', ['-bcw', '-o', '.', 'src/'], customFds: [0..2]


task 'deploy', 'Deploy the library to local environment', ->
	exec 'cp *.* ~/Sites/touchpaint/', (err, stdout, stderr) ->
		if err then console.log stderr.trim() else log 'Deployed to localhost', bold
		
			
task 'deploy:dev', 'Deploy the library to the dev environment', ->
	exec 'scp *.* mm:~/creatives/touchpaint/', (err, stdout, stderr) ->
		if err then console.log stderr.trim() else log 'Deployed to waptag', bold


task 'serve', 'Start a local web server on 8080.', ->
	exec ["nohup python -m SimpleHTTPServer 8080;"].join("&&"), (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
