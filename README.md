# ack-pug-bundler
Watch and bundle pug/jade files into .js files for importing into Javascript web-apps

This package converts .pug and .jade files into .pug.js or .jade.js files and also comes with file watching functionality to compile template files, when changes occur to them.

### Table of Contents
- [Pre-Compiled Approach to Including Templates](#pre-compiled-approach-to-including-templates)
- [Recommended Installation](#recommended-installation)
- [Functionality Overview](#functionality-overview)
- [CLI](#cli)
- [Examples](#examples)
    - [Example Single File](#example-single-file)
    - [Example Multi File](#example-multi-file)
    - [Example asJsonFile](#example-asjsonfile)
    - [Example asOneFile](#example-asonefile)
    - [Example Watch](#example-watch)
    - [Example Build All](#example-build-all)
    - [Example NPM Script](#example-npm-script)

> The intended use of this package, is to be used during front-end aka client-side code development where the bundling process is performed in NodeJs.

## Pre-Compiled Approach to Including Templates
This package is built on the principle, that templates should be pre-compiled BEFORE any javascript bundling processes.

Have you heard or used any of the following?
- pug-loader or jade-loader
- plugin-pug or plugin-jade

The above mentioned packages, all compile pug/jade files DURING the js build process. This approach isn't always ideal and sometimes it is better to just have templates compiled into importable .js files BEFORE any script building process.

> TIP: ack-pug-bundler watch/build processes should run synchronous(before) any other watch/build processes that require the produced pug/jade .js compiled files.

## Recommended Installation
This package is only needed during the development of another package, install for development use only
```
$ npm install ack-pug-bundler --save-dev
```

## Functionality Overview
Not examples, more like documentation on what does what

```
var ackPug = require('ack-pug-bundler')

//compile and write just one file
ackPug.writeFile(pugFilePath[, (outputPath||options), options])

//compile and write multiple files
ackPug.crawlPath(pugFilePath[, (outputPath||options), options])

//compile and write multiple files on file change events
ackPug.watchPath(pugFilePath[, (outputPath||options), options])
```

- @pugFilePath: read path source
- @outputPath: file path to write to. default=pugFilePath
- @options:{asJsonFile, asOneFile, outType}
> asJsonFile: controls output as being just one json file (! this is where the money is !)
> asOneFile: controls output style and file name of single bundling mode. In most cases, asJsonFile, is the best way to go.
> outType: common or ecma6. default=ecma6

## CLI
The following command will recursivily compile all .pug|.jade files into one templates.js
```
ack-pug-bundler src/ src/templates.js
```

> Recommended to include the following in your package.json scripts
```
"scripts":{
  "build:pug": "ack-pug-bundler src/ src/",
  "watch:pug": "ack-pug-bundler src/ src/ --watch",
}
```


## Examples

### Example Single File
A great place to start. We will compile a .pug file to a .js file.

> Create a pug template file named: main.pug

```
div Hello World
```

> Create file: write-pug.js

```
var ackPug = require("ack-pug-bundler")
var filePath = require("path").join(__dirname,"main.pug")

//main.pug.js file is written with ecma6 export syntax
ackPug.writeFile(writeFile)
```

> Now, in a command terminal, run the following

```
node write-pug.js
```

> The result of the above command, created the file main.pug.js
>> Below is the file main.pug.js

```
export default "<div>Hello World</div>"
```


### Example Multi File
A more robust use case. Let's take two files and write three.

> Create a pug/jade template file named: main.pug

```
div Hello World
```

> Create another pug/jade template file named: other-main.pug

```
div Hello Other World
```

> Create file: write-pugs.js

```
var ackPug = require("ack-pug-bundler")
var filePath = __dirname

//main.pug.js and other-main.pug.js file is written with ecma6 export syntax
ackPug.crawlPath(filePath, {outType:'common'})
```

> Now, in a command terminal, run the following

```
node write-pugs.js
```

> The result of the above command, created several files

>> Below is the file main.pug.js

```
module.exports= "<div>Hello World</div>"
```

>> Below is the file other-main.pug.js

```
module.exports= "<div>Hello Other World</div>"
```


### Example asJsonFile
Produce one JSON file that has all your template files

> TIP: If you are using [JSPM](https://www.npmjs.com/package/jspm) to bundle web architectures, you will most likely want to use the attribute "asOneFile" because [JSPM](https://www.npmjs.com/package/jspm) does not natively import JSON files.

> Create file: write-pugs.js

```
var ackPug = require("ack-pug-bundler")

//templates.js file is written with ecma6 export syntax
ackPug.crawlPath(__dirname, {asJsonFile:'templates.js'})
```

> Now, in a command terminal, run the following

```
node write-pugs.js
```

> The result of the above command, created templates.json
>> Below is the file templates.json

```
{
  "timestamp": 1470005320783,
  "./main" : "<div>Hello World</div>",
  "./other-main" : "<div>Hello Other World</div>"
}
```


### Example asOneFile
Bundles all templates into just one file. Also includes handy get(templateName) function in output file.

> TIP: If you are using [JSPM](https://www.npmjs.com/package/jspm) to bundle web architectures, you will most likely want to use the attribute "asOneFile" because [JSPM](https://www.npmjs.com/package/jspm) does not natively import JSON files.

> Create file: write-pugs.js

```
var ackPug = require("ack-pug-bundler")

//templates.js file is written with ecma6 export syntax
ackPug.crawlPath(__dirname, {asOneFile:'templates.js'})
```

> Now, in a command terminal, run the following

```
node write-pugs.js
```

> The result of the above command, created templates.js
>> Below is the file templates.js

```
export default {
  "timestamp": 1470005320783,
  "./main" : "<div>Hello World</div>",
  "./other-main" : "<div>Hello Other World</div>",
  get:function(templateName){...gets template or throws error..}
}
```


### Example Watch
Use this example to watch pug/jade files for changes and then write the compile results elsewhere

> Create file: watch-pug.js

```
var ackPug = require("ack-pug-bundler")
var path = require("path")
var folderPath = path.join(__dirname,"src")
var outPath0 = path.join(__dirname,"result-js-files","ecma6")
var outPath1 = path.join(__dirname,"result-js-files","commonJs")

//pug files written with ecma6 export syntax
ackPug.watchPath(folderPath, outPath0)

//pug files written with module.exports syntax
ackPug.watchPath(folderPath, outPath1, {outType:'common'})

//pug files written as one file with module.exports syntax
ackPug.watchPath(folderPath, outPath1, {outType:'common', asOneFile:'templates.js'})

console.log('[ack-pug-bundler]:watching', folderPath)
```

### Example Build All
Use this example to compile all pug/jade files and then write the compile results elsewhere

> Create file: build-pug.js

```
var ackPug = require("ack-pug-bundler")
var path = require("path")
var folderPath = path.join(__dirname,"src")
var outPath0 = path.join(__dirname,"result-js-files","ecma6")
var outPath1 = path.join(__dirname,"result-js-files","commonJs")

console.log('[ack-pug-bundler]:building', folderPath)

//pug files compled and written with ecma6 export syntax
ackPug.crawlPath(folderPath, outPath0)
.then(function(){
  console.log('[ack-pug-bundler]:ecma6 completed', folderPath)
})
.catch(console.log.bind(console))

//pug files compiled written with module.exports syntax
ackPug.crawlPath(folderPath, outPath1, {outType:'common'})
.then(function(){
  console.log('[ack-pug-bundler]:commonJs completed', folderPath)
})
.catch(console.log.bind(console))

//pug files compiled into one file and written with module.exports syntax
ackPug.crawlPath(folderPath, outPath1, {outType:'common', asOneFile:'templates.js'})
.then(function(){
  console.log('[ack-pug-bundler]:commonJs single-file completed', folderPath)
})
.catch(console.log.bind(console))
```

### Example NPM Script
Based on example usages above, you can create a quick command script

> Edit package.json and save

```
{
  "scripts": {
    "watch:pug": "node watch-pug",
    "build:pug": "node build-pug"
  }
}
```

Now you can watch pug files for changes and output js file versions
```
$ npm run watch:pug
```

Now you can vuild pug files and output js file versions for application use
```
$ npm run build:pug
```
