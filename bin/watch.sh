#!/bin/bash
rm -rf build
mkdir -p build
mkdir -p build/styles
mkdir -p build/scripts

bin/build_html.sh
bin/build_css.sh
bin/build_js.sh
bin/build_vendor.sh
cp -r app/data -t build

concurrently --raw --kill-others \
	"chokidar 'app/templates/*.html' -c 'bin/build_html.sh'" \
	"chokidar 'app/index.html' -c 'bin/build_html.sh'" \
	"chokidar 'app/styles/*.less' -c 'bin/build_css.sh'" \
	"chokidar 'app/scripts/**/*.js' -c 'bin/build_js.sh'" \
	"chokidar 'app/vendor/*.less' -c 'bin/build_css.sh'" \
	"chokidar 'app/vendor/*.js' -c 'bin/build_js.sh'" \
	"ecstatic --root build --port 9000 --cache 0"
