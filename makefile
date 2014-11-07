all: clean-bin bin;

.PHONY: clean clean-bin clean-tiles clean-node tiles

clean: clean-bin clean-node;
clean-bin: ; rm -rf ./bin;
clean-tiles: ; rm -rf ./tiles;
clean-node: ; rm -rf ./node_modules;

node_modules: ; npm install;
bin: node_modules; mkdir -p bin; browserify map.js -o ./bin/map.js;

tiles: ; mkdir -p tiles; python ./generate_tiles.py;
