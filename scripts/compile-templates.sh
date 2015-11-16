#!/usr/bin/env bash -x

handlebars -e "hbs" lib/require.hbs > dist/require.hbs.js
echo "module.exports = Handlebars.templates.require" >> dist/require.hbs.js 
