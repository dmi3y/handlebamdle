"use strict";

var fs = require("fs");
var path = require("path");

var Handlebars = require("handlebars");
var glob = require("glob");
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
function read(fpath, opts) {
	var pr = new Promise(function(resolve, reject) {

		fs.readFile(fpath, function(er, data) {
			if ( !er ) {
				var str = data.toString();

				// strip out comments 
				str = str.replace(/\{\{\![^\}]*\}\}/g, "");
				// figure out partials includes or pass empty array if not
				var parts = str.match(/\{\{\s*\>[^\}]*\}\}/g) || [];

				parts = parts.map(function(part) {
					// and extract partial names
					part = part.split(/\b/)[1];
					// as a full AMD resolved paths
					part = path.join(opts.base, part);
					return part;
				});

				resolve({
					path: fpath,
					data: data,
					parts: parts
				});

			} else {

				reject("File could not be read: " + path);
			}
		});
	});

	return pr;	
}

function precompile(d, opts) {
	var tmplStr = d.data.toString();
	return Handlebars.precompile(tmplStr);
}

function bundle(d, opts) {
	var name = path.parse(d.path).name;
	var fullname = path.join(opts.base, name);
	var runtime = opts.runtime || "handlebars.runtime";
	var dependencies = d.parts.length ? (",\"" + d.parts.join("\",\"") + "\""): null;
	var out = [
		"define(",
			"\"" + fullname + "\",",
			"[",
				"\"" + runtime + "\"",
				dependencies,
			"],",
			"function(Handlebars) {",
				"Handlebars = Handlebars.default;",
				"var template = Handlebars.template;",
				"var templates = Handlebars.templates = Handlebars.templates || {};",
				"return templates[\"" + name + "\"] = template(",
					d.source,
				");",
			"}",
		");"
	];

	return out.join("");
}

function write(d, opts) {
	var name = path.parse(d.path).name + ".js";
	var fullpath = path.join(opts.out, opts.base, name);
	var pr = new Promise(function(resolve, reject) {
		fs.writeFile(path.resolve(name), d.bundle, function(er) {
			if ( !er ) {
				resolve("Template successfully written: " + fullpath);
			} else {
				reject("Could not write template: " + fullpath);
			}
		});
	});


	return pr;
}

function proceedWithCaution(filePath, opts) {

	read(filePath, opts)
		.then( // precompile
			function(data) {
				var tmplSrc = precompile(data, opts);
				data.source = tmplSrc;

				return data;
			},
			debug
		)
		.then( // bundle
			function(data) {
				var tmplAmdStr = bundle(data, opts);
				data.bundle = tmplAmdStr;
				
				return data;
			}
		)
		.then( // write
			function(data) {
				return write(data, opts);
			} 
		)
		.then ( // give some feedback
			debug, // good
			debug  // or bad
		);
}

/**
 *	opts {Object}
 *  	path {String} - glob pattern/path for templates
 *      base {String} - AMD root
 *		out {String} - output directory
 *      runtime - runtime AMD path, default to handlebars.runtime
 *
 */
module.exports = function build(opts) {

	glob(opts.path, function(er, fileNames) {
		var len = fileNames.length;
		var fileName, data, filePath;

		for (; len --> 0 ;) {
			fileName = fileNames[len];
			filePath = path.resolve(fileName);
			proceedWithCaution(filePath, opts);
		}
	});
};
