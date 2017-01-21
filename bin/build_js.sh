#!/bin/bash
uglifyjs \
	app/scripts/_init.js \
	app/scripts/data.js \
	app/scripts/views.js \
	--compress \
	--lint \
	--source-map build/scripts/app.js.map \
	--output build/scripts/app.js
