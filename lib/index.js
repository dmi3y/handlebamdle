"use strict";

var fs = require("fs");
var path = require("path");

var handlebars = require("handlebars");
var glob = require("glob");
var debug = require("debug")("handlebamdle");
/**
 * This is one to one compalation
 *
 * before wrapping module up as amd (requirejs)
 * script walk through the source and pick up partials
 * if any found they will be treated as a dependencies
 * and will be included into dependecy list for this template
 *
 */
function readPartials(filePath) {
	fs.readFile(filePath, function(er, fileData) {
		if ( !er ) {
			var str = fileData.toString();

			// strip out comments 
			str = str.replace(/\{\{\![^\}]*\}\}/g, "");
			// figure out partials includes
			var parts = str.match(/\{\{\s*\>[^\}]*\}\}/g);
			parts = parts.map(function(part) {
				// and extract partial name
				return part.split(/\b/)[1];
			});

			return {
				path: filePath,
				data: fileData,
				parts: parts
			};

		} else {
			debug("File could not be read: " + filePath);
		}
	});	
}

function read(pattern) {
	glob(pattern, function(er, fileNames) {
		var len = fileNames.length;
		var fileName, data, filePath;

		for (; len --> 0 ;) {
			fileName = fileNames[len];
			filePath = path.resolve(fileName);
			data = readPartials(filePath);

		}
	});
}
