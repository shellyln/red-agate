#!/usr/bin/env bash
set -eu
trap 'echo Error at Line $LINENO "$@"' ERR

packages="./red-agate-util ./red-agate-svg-canvas ./red-agate-math ./red-agate ./red-agate-barcode"

cd ./packages

for p in $packages; do
    cd $p
    npm --no-git-tag-version version $1
    cd ..
done

echo Done!!
