default: all

SRCDIR         = src
LIBDIR         = lib/metacoffee

all:
	node_modules/.bin/grunt

build: all

.PHONY: install loc clean

install:
	npm install -g .

web: build
	node r.js -o build.js
	cp lib/metacoffee/errorhandler.js extras/errorhandler.js

loc:
	wc -l $(SRCDIR)/*

clean:
	rm -rf $(LIBDIR)
