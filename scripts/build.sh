#!/usr/bin/env bash

packages="./red-agate-util ./red-agate-svg-canvas ./red-agate-math ./red-agate ./red-agate-barcode ./_debug_app"

cd ./packages

for p in $packages; do
    cd $p
    npm run clean && npm run build && npm test
    cd ..
done
