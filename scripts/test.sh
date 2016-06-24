#!/usr/bin/env bash

pushd ./tests
  mkdir -p ./templates-bundled
  find ./templates-raw/ -name '*.hbs' -exec sh -c '"../bin/handlebamdle.js" < "${1}" > "./templates-bundled/$(basename ${1/hbs/js})"' -- {} \;
  node ./index-node.js
popd
