all: clean-bin bin tiles;

.PHONY: clean clean-bin clean-tiles tiles

clean: clean-bin clean-tiles;
clean-bin: ; rm -rf ./bin;
clean-tiles: ; rm -rf ./tiles;

node_modules: ; npm install;
bin: node_modules; mkdir -p bin; browserify glue.js -o ./bin/main.js;

tiles: ; mkdir -p tiles; python ./generate_tiles.py;
