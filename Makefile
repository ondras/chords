TSC := $(shell npm bin)/tsc

all: src/*.ts
	$(TSC)

watch: all
	while inotifywait -e MODIFY -r src; do make $^ ; done
