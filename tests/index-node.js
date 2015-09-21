requirejs = require("requirejs");

requirejs.config({
    paths: {
    	"handlebars.runtime": "assets/handlebars.runtime"
    }
});

requirejs([
	"templates-bundled/test",
	"test"
],

function(tmplTest, test) {

	var html = tmplTest();
	test(html);
});
