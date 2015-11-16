"use strict";

var path = require("path");
var fs = require("fs");

var Handlebars = require("handlebars");
var wrapper = require("./require.hbs");
var debug = require("debug")("handlebamdle");

/**
 * This is one to one compilation
 *
 * before wrapping module up as amd (requirejs)
 * script walk through the source and pick up partials
 * if any found they will be treated as a dependencies
 * and will be included into dependecy list for this template
 *
 */
 // cat {} | hbstorequire > $(basename {} .hbs).js

function getDependencies(ast, base) {
	var body = ast.body;
	var uparts = new Set();

	for ( var i = 0; i < body.length; i += 1 ) {
		if ( body[i].type === "PartialStatement" ) {
			uparts.add(body[i].name.original);
		}
	}

	var parts = [];
	for ( var v of uparts ) {
		parts.push(v);
	}

	return parts;
}

module.exports = function(tmplStr, opts) {
	var str = tmplStr.toString();
	var ast = Handlebars.parse(str);
	opts = opts || {};

	return wrapper({
		runtime: opts.runtime || "handlebars.runtime",
		dependencies: getDependencies(ast),
		source: Handlebars.precompile(ast)
	});
};
