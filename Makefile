NODE ?= node
BIN = ./node_modules/.bin/

test:
	@${NODE} ${BIN}mocha \
		--require should \
		--reporter spec

clean:
	@rm -rf node_modules

.PHONY: test clean