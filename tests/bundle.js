var hamdb = require("../dist/bundler.js");

hamdb({
	path: "templates-raw/*.hbs",
	out: "templates-bundled"
});
