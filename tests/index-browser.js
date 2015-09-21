// test starter

define(function(require) {
	var tmplTest = require("templates-bundled/test");
	var test = require("test");

	var html = tmplTest();
	test(html);
});