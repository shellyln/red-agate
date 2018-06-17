#!/usr/bin/env bash
set -eu
trap 'echo Error at Line $LINENO "$@"' ERR

packages="./red-agate-barcode ./red-agate-react-host"

cd ./packages

for p in $packages; do
    cd $p
    npm install
    cd ..
done

echo Done!!
