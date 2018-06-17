#!/usr/bin/env bash
set -eu
trap 'echo Error at Line $LINENO "$@"' ERR

packages="./red-agate-util ./red-agate-svg-canvas ./red-agate-math"

cd ./packages

for p in $packages; do
    cd $p
    npm install
    cd ..
done

echo Done!!
