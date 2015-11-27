#!/usr/bin/env node -x
var fs = require("fs");
var path = require("path");
var Handlebars = require("handlebars");

var cwd = process.cwd();
var source = fs.readFileSync(path.join(cwd, "src/require.hbs"));

var template = Handlebars.precompile(source.toString(), {
	noEscape: true
});

template = [
	"var Handlebars = require(\"handlebars\");",
	"module.exports = Handlebars.template(" + template + ");"
].join("\n");


fs.writeFileSync("dist/require.hbs.js", template); 
