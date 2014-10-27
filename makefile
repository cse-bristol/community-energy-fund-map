all: clean-bin bin;

.PHONY: clean clean-bin clean-tiles tiles

clean: ; rm -rf ./bin; rm -rf node_modules;
clean-tiles: ; rm -rf ./tiles;

node_modules: ; npm install;
bin: node_modules; mkdir -p bin; browserify map.js -o ./bin/map.js; browserify search.js -o ./bin/search.js;

tiles: ; mkdir -p tiles; python ./generate_tiles.py;
