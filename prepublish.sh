#!/usr/bin/env bash

set -e

rm -rf ./es/ ./lib/ ./types/

rm -rf ./build
./node_modules/.bin/tsc
mv ./build/src/index.js ./index.lib.js

rm -rf ./build
./node_modules/.bin/tsc --module ES6
mv ./build/src/index.js ./index.es.js

mv ./build/types/src/index.d.ts ./index.d.ts
