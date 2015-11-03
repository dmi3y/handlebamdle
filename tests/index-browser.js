// test starter

define(function(require) {
	var tmplTest = require("templates-bundled/test");
	var test = require("test");
	var body = document.querySelector("body");

	var html = tmplTest();

	try {

		test(html);
		body.className = "no-error";
	} catch(e) {
		body.className = "error";
	}
});