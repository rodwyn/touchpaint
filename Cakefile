fs            = require 'fs'
path          = require 'path'
{spawn, exec} = require 'child_process'

# Paths
BUILD_PATH = "lib/"

# ANSI Terminal Colors.
bold  = '\033[0;1m'
red   = '\033[0;31m'
green = '\033[0;32m'
reset = '\033[0m'

log = (message, color, explanation) ->
	console.log color + message + reset + ' ' + (explanation or '')



HEADER_TEMPLATE = """
	/**
	* Millennial Media SDK Library (MMSDK.js)
	* http://waptag.net/ads/rich/common/js/mmisdk/docs/mmsdk.html
	*
	* Copyright 2011, Millennial Media
	*
	* Built on {{timestamp}}.
	*/
"""

#APP_FILES = ['mmsdk', 'mmsdk.min']
apply_header = (js_files) ->
	for js_file in js_files
		contents = """
			#{fs.readFileSync "#{BUILD_PATH}#{js_file}.js"}
		"""
		if contents.indexOf("/**") isnt 0
			timestamp = (new Date()).toLocaleString()
			header = HEADER_TEMPLATE.replace("{{timestamp}}", timestamp)
			fs.writeFileSync "#{BUILD_PATH}#{js_file}.js", "#{header}\n\n#{contents}"
			log "Applied header to #{js_file}.js.", green
		else
			console.log("Skipping, header has already been applied.")

#option '-f', '--file [DIR]', 'set the installation prefix for `cake install`'

task 'build', 'Build library from src/*.coffee to lib/*.js', (options) ->
	exec 'coffee -bc -o lib/ src/', (err, stdout, stderr) ->
		if err then console.log stderr.trim() else log "Compiled mmsdk.js.", green
		apply_header ['mmsdk']

	invoke "minify"


task 'watch', 'Continuously build library from src/*.coffee to lib/*.js', ->
	spawn 'coffee', ['-bcw', '-o', 'lib/', 'src/'], customFds: [0..2]

task 'deploy:dev', 'Deploy the library to the dev environment', ->
	exec 'scp lib/mmsdk*.js advdemo.millennialmedia.com:/home/advdemo/ads/labs/projects/SDK/test/mshafrir/mmsdk/.', (err, stdout, stderr) ->
		if err then console.log stderr.trim() else log 'Deployed to Dev', bold


task 'serve', 'Start a local web server on 8080.', ->
	exec ["nohup python -m SimpleHTTPServer 8080;"].join("&&"), (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
