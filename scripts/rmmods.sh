#!/usr/bin/env bash
set -eu
trap 'echo Error at Line $LINENO "$@"' ERR

packages="./red-agate-util ./red-agate-svg-canvas ./red-agate-math ./red-agate ./red-agate-barcode ./red-agate-react-host ./_debug_app"

cd ./packages

for p in $packages; do
    cd $p
    rm -rf ./node_modules
    cd ..
done

echo Done!!
