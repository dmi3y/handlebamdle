#!/usr/bin/env node
"use strict";

var bundler = require("./index");
var glob = require("glob");
var mkdirp = require("mkdirp");
var debug = require("debug")("handlebamdle");

var path = require("path");
var fs = require("fs");


function read(d, opts) {
	var pr = new Promise(function(resolve, reject) {

		fs.readFile(d.fpath, (er, data) => {
			if ( !er ) {
				var str = data.toString();
				d.str = str;
				resolve(d);

			} else {

				reject("File could not be read: " + path);
			}
		});
	});

	return pr;	
}

function checker(d, opts) {
	var pr = new Promise(function(resolve, reject) {
		mkdirp(path.resolve(opts.out), er => {
			if ( !er ) {
				resolve(d);
			} else {
				reject("Could not create outpt directory: " + fullpath);
			}
		});
	});

	return pr;
}

function writer(d, opts) {
	var parsed = path.parse(d.fpath);
	var name = parsed.name + ".js";
	var fullpath = path.join(opts.out, name);
	var pr = new Promise(function(resolve, reject) {
		fs.writeFile(path.resolve(fullpath), d.bundle, er => {
			if ( !er ) {
				resolve("Template successfully written: " + fullpath);
			} else {
				reject("Could not write template: " + fullpath);
			}
		});
	});

	return pr;
}

function chain(d, opts) {
	read(d, opts)
		.then(
			function bundle(d) {
				d.bundle = bundler(d.str, opts);
				return d;
			},
			debug
		)
		.then(
			function check(d) {
				return checker(d, opts);
			},
			debug
		)
		.then(
			function write(d) {
				return writer(d, opts);
			},
			debug
		);
}

module.exports = opts => {

	glob(opts.path, (er, fnames) => {
		var len = fnames.length;
		opts.out = opts.out || "./";

		for (; len --> 0 ;) {
			var fname = fnames[len];
			var fpath = path.resolve(fname);
			var d = {
				fpath
			};
			
			chain(d, opts);
		}
	});
};
