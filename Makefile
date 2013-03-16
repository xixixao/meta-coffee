default: all

SRCDIR         = src
LIBDIR         = lib/metacoffee

COFFEES = $(shell find $(SRCDIR) -name "*.coffee" -type f | sort)
METACOFFEES = $(shell find $(SRCDIR) -name "*.mc" -type f | sort)
CLIBS = $(COFFEES:$(SRCDIR)/%.coffee=$(LIBDIR)/%.js)
MCLIBS = $(METACOFFEES:$(SRCDIR)/%.mc=$(LIBDIR)/%.js)
ROOT = $(shell pwd)

COFFEE = node_modules/coffee-script/bin/coffee
METACOFFEE = bin/metacoffee

all: $(CLIBS) $(MCLIBS)
build: all

$(LIBDIR): lib
	mkdir -p $(LIBDIR)/

$(LIBDIR)/%.js: $(SRCDIR)/%.coffee $(LIBDIR)
	$(COFFEE) -c -o $(LIBDIR)/ $<

$(LIBDIR)/%.js: $(SRCDIR)/%.mc $(LIBDIR)
	$(METACOFFEE) $(LIBDIR)/ $<

.PHONY: install loc clean

install:
	npm install -g .

web: build
	node r.js -o build.js
	cp lib/metacoffee/errorhandler.js extras/errorhandler.js

loc:
	wc -l src/*

clean:
	rm -rf lib
