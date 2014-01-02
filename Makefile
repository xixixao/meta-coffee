default: all

SRCDIR = src
LIBDIR = lib/metacoffee

all:
	node_modules/.bin/grunt

build: all

.PHONY: install loc clean

install:
	npm install -g .

web:
	node_modules/.bin/grunt web

loc:
	wc -l $(SRCDIR)/*

clean:
	rm -rf $(LIBDIR)
