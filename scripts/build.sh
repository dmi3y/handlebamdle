#!/usr/bin/env bash

rm -rf dist
mkdir dist
npm run compile-templates
npm run compile-scripts
