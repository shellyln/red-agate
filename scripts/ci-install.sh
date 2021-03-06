#!/usr/bin/env bash
set -eu
trap 'echo Error at Line $LINENO "$@"' ERR

packages="./red-agate-util ./red-agate-svg-canvas ./red-agate-math ./red-agate ./red-agate-barcode ./red-agate-react-host ./_debug_app ./_lib-dist"

flags="--legacy-peer-deps"
currentver="$(npm -v)"
requiredver="7.0.0"
if [ "$(printf '%s\n' "$requiredver" "$currentver" | sort -V | head -n1)" = "$requiredver" ]; then 
    echo "Greater than or equal to ${requiredver}"    
    flags="--legacy-peer-deps"
else
    echo "Less than ${requiredver}"
fi

cd ./packages

for p in $packages; do
    cd $p
    npm ci $flags
    cd ..
done

echo Done!!
