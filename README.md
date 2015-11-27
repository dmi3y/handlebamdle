>`Handlebars.partials = Handlebars.templates`

##Prefrase

Handlebars partials oficially treated as separate class citizents, while they are templates just the same way as others. Days come by and developers figured out "magic formula" `Handlebars.partials = Handlebars.templates`, which works fine if all the precompiled templates being downloaded as a one file.
But what about getting more efficiency from power of AMD? That's the ultimate goal for this package.

##Handle-b-AMD-le [/ˈhandl·bandl/]

AMD (requirejs) bundler for handlebars templates. It treats partials as a templates, and includes partials-templates (if any) as a main module dependency.

##Build from source

Build - `npm run build`
Test - `npm run test`

##Develop

Build - `npm run build`
Watch for scripts - `npm run watch-scripts`
Test - `npm run test`
