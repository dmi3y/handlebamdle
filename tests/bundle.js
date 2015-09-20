hamdb = require("../lib/index.js");

hamdb({
	path: "templates-raw/*.hbs",
	base: "templates",
	out: "out"
});