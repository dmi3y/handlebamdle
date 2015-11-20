#!/usr/bin/env bash -x

npm run build

cd tests
node bundle.js
node index-node.js