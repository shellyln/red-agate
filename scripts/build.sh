#!/usr/bin/env bash
set -eu
trap 'echo Error at Line $LINENO "$@"' ERR

packages="./red-agate-util ./red-agate-svg-canvas ./red-agate-math ./red-agate ./red-agate-barcode ./red-agate-react-host ./_debug_app ./_lib-dist"

cd ./packages

for p in $packages; do
    cd $p
    npm run clean && npm run build && npm test
    cd ..
done

echo Done!!
