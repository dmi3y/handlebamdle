#!/usr/bin/env bash -x

echo "var Handlebars = require(\"handlebars\");" > dist/require.hbs.js
handlebars -e "hbs" src/require.hbs >> dist/require.hbs.js
echo "module.exports = Handlebars.templates.require;" >> dist/require.hbs.js 
