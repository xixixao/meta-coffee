Coffee     = node_modules/coffee-script/bin/coffee
MetaCoffee = bin/metacoffee

all: build

# 1. compile coffee into js
# 2. compile metacoffee into js
build: buildmc buidlcoffee

buidlcoffee:
	$(Coffee) -c -o bin/metacoffee/ src/*.coffee

buildmc:
	$(MetaCoffee) bin/metacoffee/ src/*.mc

# 1. build
# 2. compile metacoffee into js AGAIN
rebuild: buildmc build

.phony: build, buildmc, rebuil



default: all

SRCDIR         = src
BINDIR         = bin/metacoffee

COFFEES = $(shell find $(SRCDIR) -name "*.coffee" -type f | sort)
METACOFFEES = $(shell find $(SRCDIR) -name "*.mc" -type f | sort)
LIB = $(COFFEES:$(SRCDIR)/%.coffee=$(BINDIR)/%.js)
ROOT = $(shell pwd)

COFFEE = node_modules/coffee-script/bin/coffee
METACOFFEE = bin/metacoffee

all: $(LIB)
build: all

$(BINDIR): lib
	mkdir -p $(BINDIR)/

$(BINDIR)/%.js: $(SRCDIR)/%.coffee $(BINDIR)
#	$(COFFEE) -i "$<" >"$(@:%=%.tmp)" && mv "$(@:%=%.tmp)" "$@"
	$(COFFEE) -c -o $(BINDIR)/ $<

$(BINDIR)/%.js: $(SRCDIR)/%.mc $(BINDIR)
	$(METACOFFEE) $(BINDIR)/ $<

.PHONY: install loc clean

install:
	npm install -g .

loc:
	wc -l src/*

clean:
	rm -rf lib
