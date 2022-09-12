>[`Handlebars.partials = Handlebars.templates`](https://stackoverflow.com/a/21173410https://stackoverflow.com/a/21173410)

## Prefrase

Handlebars partials oficially treated as separate class citizents, while they are templates just the same way as others. Days come by and developers figured out "magic formula" `Handlebars.partials = Handlebars.templates`, which works fine if all the precompiled templates being downloaded as a one file.
But what about getting more efficiency from power of requirejs? That's the ultimate goal for this package.

##Handle-b-AMD-le [/ˈhandl·bandl/]

AMD (requirejs) bundler for handlebars templates. It treats partials as a templates, and includes partials-templates (if any) as a main module dependency.

## Examples

From nodejs script:

````js
var hamdb = require("handlebamdle");
var fs = require("fs");

var templateSrc = fs.readFileSync(__dirname + "templates-raw/template.hbs");

var templateAmd = hamdb(templateSrc.toString())

fs.writeFileSync(templateAmd, __dirname + "templates-compiled/template.hbs.js");

````

From command line:

> mkdir ./tests/templates-bundled

To bundle all templates from the folder and keep filenames.

> find ./tests/templates-raw/ -name '*.hbs' -exec sh -c '"./bin/handlebamdle.js" < "${1}" > "./tests/templates-bundled/$(basename ${1/hbs/js})"' -- {} \;

Or single one, which is less daunting, less functional and less interesting overall.

> cat ./tests/templates-raw/test.hbs | ./bin/handlebamdle.js > ./tests/templates-bundled/test.js

## Build from source

Build - `npm run build`  
Test - `npm run test`

## Develop

Build - `npm run build`  
Watch for scripts - `npm run watch-scripts`  
Test - `npm run test`
