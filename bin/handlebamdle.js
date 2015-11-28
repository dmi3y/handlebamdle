#!/usr/bin/env node

/* jshint esversion: 5 */

process.stdin.resume();
process.stdin.setEncoding("ascii");

var hbamd = require("../dist/index");

var _data = "";

process.stdin.on("data", function(data) {
	_data += data;
});

process.stdin.on("end", function() {
	process.stdout.write(hbamd(_data));
});
