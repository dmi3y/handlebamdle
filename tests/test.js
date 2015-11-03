// do tests

define(function(require) {

	return function(tmpl) {

		console.log("Start testing");
		console.time("End testing");

		var isStr = typeof tmpl === "string";
		console.assert(isStr, "Template has to be string");
		var hasSubTmpl = tmpl.indexOf("<div>another template: arrrrrr</div>") > -1;
		console.assert(hasSubTmpl, "Has to have sub-template divtext");
		var hasSubTmplData = tmpl.indexOf("this is partial as template") > -1;
		console.assert(hasSubTmplData, "Has to have sub-template data");

		if ( !(isStr && hasSubTmpl && hasSubTmplData) ) {
			throw new Error("Tests failed.");
		}
	
		console.timeEnd("End testing");
	};
});