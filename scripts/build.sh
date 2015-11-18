#!/usr/bin/env bash -x

rm -rf dist
mkdir dist
npm run compile-templates
npm run compile-scripts
