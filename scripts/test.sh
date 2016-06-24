#!/usr/bin/env bash

cd ./tests
find ./templates-raw/ -name '*.hbs' -exec sh -c '"../bin/handlebamdle.js" < "${1}" > "./templates-bundled/$(basename ${1/hbs/js})"' -- {} \;
node ./index-node.js
