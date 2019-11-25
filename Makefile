TSC := $(shell npm bin)/tsc

app.js: src/*.ts
	$(TSC)
