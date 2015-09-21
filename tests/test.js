// do tests

define(function(require) {

	return function(tmpl) {

		console.log("Start testing");
		console.time("End testing");

		console.assert(typeof tmpl === "string", "Template has to be string");
		console.assert(tmpl.indexOf("<div>another template: arrrrrr</div>") > -1, "Has to have sub-template divtext");
		console.assert(tmpl.indexOf("this is partial as template") > -1, "Has to have sub-template data");
	
		console.timeEnd("End testing");
	};
});