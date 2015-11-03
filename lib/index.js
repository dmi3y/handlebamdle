"use strict";

var fs = require("fs");
var path = require("path");

var Handlebars = require("handlebars");
var glob = require("glob");
var debug = require("debug")("handlebamdle");
var mkdirp = require("mkdirp");

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
				var ast = Handlebars.parse(str);
				var body = ast.body;
				var uparts = new Set();

				for ( var i = 0; i < body.length; i += 1 ) {
					if ( body[i].type === "PartialStatement" ) {
						uparts.add(body[i].name.original);
					}
				}

				var parts = [];
				for ( var v of uparts ) {
					parts.push(path.join(opts.base, v));
				}

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
			"[",
				"\"" + runtime + "\"",
				dependencies,
			"],",
			"function(Handlebars) {",
				"Handlebars = Handlebars.default;",
				"var template = Handlebars.template;",
				"var templates = Handlebars.templates = Handlebars.templates || {};",
				"Handlebars.partials = templates;",
				"return templates[\"" + name + "\"] = template(",
					d.source,
				");",
			"}",
		");"
	];

	return out.join("");
}

function check(d, opts) {
	var fullpath = path.join(opts.out, opts.base);
	var pr = new Promise(function(resolve, reject) {
		mkdirp(path.resolve(fullpath), function(er) {
			if ( !er ) {
				resolve(d);
			} else {
				reject("Could not create outptu directory: " + fullpath);
			}
		});
	});


	return pr;
}

function write(d, opts) {
	var parsed = path.parse(d.path);
	var name = parsed.name + ".js";
	var fullpath = path.join(opts.out, opts.base, name);
	var pr = new Promise(function(resolve, reject) {
		fs.writeFile(path.resolve(fullpath), d.bundle, function(er) {
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

	read(filePath, opts) // read the file and

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
		.then( // check output directories
			function(data) {
				return check(data, opts);
			}
		)
		.then( // write
			function(data) {
				return write(data, opts);
			},
			debug
		)
		.then ( // give some feedback
			console.log, // good
			console.log  // or bad
		);
}

/**
 *	opts {Object}
 *  	path {String} - glob pattern/path for templates
 *      base {String} - AMD root
 *	out {String} - output directory, default to cwd
 *      runtime - runtime AMD path, default to handlebars.runtime
 *
 */
module.exports = function build(opts) {

	glob(opts.path, function(er, fileNames) {
		var len = fileNames.length;
		var fileName, data, filePath;
		opts.out = opts.out || "./"; 
		for (; len --> 0 ;) {
			fileName = fileNames[len];
			filePath = path.resolve(fileName);
			proceedWithCaution(filePath, opts);
		}
	});
};
