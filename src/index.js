"use strict";
require("babel-polyfill");

var Handlebars = require("handlebars");
var wrapper = require("./require.hbs");

/**
 * This is one to one compilation
 *
 * before wrapping module up as amd (requirejs)
 * script walk through the source and pick up partials
 * if any found they will be treated as a dependencies
 * and will be included into dependecy list for this template
 *
 */

var getDependencies = ast => {
	var body = ast.body;
	var parts = [];

	for ( var i = 0; i < body.length; i += 1 ) {
		if ( body[i].type === "PartialStatement" ) {
			parts.push(body[i].name.original);
		}
	}

	return [...new Set(parts)];
};

module.exports = function(tmplStr, opts) {
	var str = tmplStr.toString();
	var ast = Handlebars.parse(str);
	opts = opts || {};
	var runtime = opts.runtime || "handlebars.runtime";
	var dependencies = getDependencies(ast);
	var source = Handlebars.precompile(ast, opts);

	return wrapper({
		runtime,
		dependencies,
		source
	});
};
