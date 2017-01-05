#!/bin/bash
# cat \
# bower_components/normalize-css/normalize.css \
# > build/styles/vendor.css

cat \
bower_components/jquery/dist/jquery.slim.js \
bower_components/fetch/fetch.js \
bower_components/mustache.js/mustache.js \
bower_components/typeahead.js/dist/typeahead.jquery.js \
> build/scripts/vendor.js
