#!/bin/bash
uglifyjs \
	bower_components/jquery/dist/jquery.slim.js \
	bower_components/fetch/fetch.js \
	bower_components/mustache.js/mustache.js \
	bower_components/typeahead.js/dist/typeahead.jquery.js \
	bower_components/natural-compare-lite/index.js \
	--compress \
	--mangle \
	--source-map build/scripts/vendor.js.map \
	--output build/scripts/vendor.js
