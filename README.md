# ack-pug-bundler
Watch and bundle pug/jade files into .js files for importing into Javascript web-apps

This package converts .pug and .jade files into .pug.js or .jade.js files and also comes with file watching functionality to compile template files, when changes occur to them.

### Table of Contents
- [Pre-Compiled Approach to Including Templates](#pre-compiled-approach-to-including-templates)
- [Recommended Installation](#recommended-installation)
- [Functionality Overview](#functionality-overview)
- [CLI](#cli)
  - [Supported Commands](#supported-commands)
  - [Command Examples](#command-examples)
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
```bash
$ npm install ack-pug-bundler --save-dev
```

## Functionality Overview
Not examples, more like documentation on what does what

```javascript
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
- @options:
```javascript
{
  asJsonFile,//controls output as being just one json file (this should deprecate into outType=json)
  asOneFile,//controls output style and file name of single bundling mode. In most cases, asJsonFile, is the best way to go.
  outType:'ecma6',//string, common or ecma6
  outFileExt:'js',
  pretty:false//useful true when outType=string
}
```

## CLI
The following command will recursivily compile all .pug|.jade files into one templates.js
```bash
ack-pug-bundler src/ src/templates.js
```

### Supported Commands

- watch
  - specifies to watch files for changes and rerender at that time
- outFileExt
  - default = js
  - override output file extension
  - not applicable when --oneHtmlFile or --oneFile
- outType
  - determine flat html string OR import/export OR module.exports syntax
  - ecma6 || common || string || ts
    - ts mode will `export const string`
- pretty
  - resulting html strings can maintain readability
- oneToOne
  - when argument is present, in file names will be used to output file names
- oneFile
  - a convenience option to simply output one pug to one output file
  - An .html file is converted to a string
  - An .md file is converted to html and then to a string
- skipRender
  - indicates that file(s) being read are already compiled
- oneHtmlFile
  - a convenience option to simply output one pug to one html file
- includeHtmls
  - An option to not only bundle pug/jade files but also cast HTML to js/ts file(s)

### Command Examples
Open a command prompt terminal and execute the following commands

#### Compile Htmls to Typescript files
```bash
ack-pug-bundler src/htmls/ src/templates/ --oneToOne --includeHtmls --outType ts
```

#### Extended Example
```bash
ack-pug-bundler pugs/ templates/ --outType ts --oneToOne
```
> The above example will cast ./pugs/template.pug to ./templates/template.pug.ts
>> ./templates/template.pug.ts : `export const string = "..."`

#### File Ext Example
```bash
ack-pug-bundler pugs/ templates/ --outFileExt .ts --outType ts --oneToOne
```
> The above example will cast ./pugs/template.pug to ./templates/template.ts
>> ./templates/template.ts : `export const string = "..."`

### CLI Script Conveniences
Recommended to include the following in your package.json scripts for your convenience

```javascript
"scripts":{
  "build:index": "ack-pug-bundler src/index.pug www/index.html --oneHtmlFile",
  "build:pug": "ack-pug-bundler src/pugs/ src/templates/",
  "watch:pug": "ack-pug-bundler src/pugs/ src/templates/ --watch --pretty",
  "build:pug:for-nodejs": "ack-pug-bundler src/pugs/ src/templates/ --outType common"
  "build:htmls": "ack-pug-bundler src/htmls src/templates --oneToOne --includeHtmls --outType ts"
}
```

Script Descriptions

- build:index
    - Converts a single pug file into one html file
- build:pug
    - Converts multiple pug files into one .js file with import/export ecma6 like syntax
- watch:pug
    - Watches multiple pug files to convert into one .js file with import/export ecma6 like syntax
- build:pug:for-nodejs
    - Converts multiple pug files into one .js file with module.exports commonjs like syntax




## Examples

### Example Single File
A great place to start. We will compile a .pug file to a .js file.

> Create a pug template file named: main.pug

```html
div Hello World
```

> Create file: write-pug.js

```javascript
var ackPug = require("ack-pug-bundler")
var filePath = require("path").join(__dirname,"main.pug")

//main.pug.js file is written with ecma6 export syntax
ackPug.writeFile(writeFile)
```

> Now, in a command terminal, run the following

```bash
node write-pug.js
```

> The result of the above command, created the file main.pug.js
>> Below is the file main.pug.js

```javascript
export default "<div>Hello World</div>"
```


### Example Multi File
A more robust use case. Let's take two files and write three.

> Create a pug/jade template file named: main.pug

```html
div Hello World
```

> Create another pug/jade template file named: other-main.pug

```html
div Hello Other World
```

> Create file: write-pugs.js

```javascript
var ackPug = require("ack-pug-bundler")
var filePath = __dirname

//main.pug.js and other-main.pug.js file is written with ecma6 export syntax
ackPug.crawlPath(filePath, {outType:'common'})
```

> Now, in a command terminal, run the following

```bash
node write-pugs.js
```

> The result of the above command, created several files

>> Below is the file main.pug.js

```javascript
module.exports= "<div>Hello World</div>"
```

>> Below is the file other-main.pug.js

```javascript
module.exports = "<div>Hello Other World</div>"
```


### Example asJsonFile
Produce one JSON file that has all your template files

> TIP: If you are using [JSPM](https://www.npmjs.com/package/jspm) to bundle web architectures, you will most likely want to use the attribute "asOneFile" because [JSPM](https://www.npmjs.com/package/jspm) does not natively import JSON files.

> Create file: write-pugs.js

```javascript
var ackPug = require("ack-pug-bundler")

//templates.js file is written with ecma6 export syntax
ackPug.crawlPath(__dirname, {asJsonFile:'templates.js'})
```

> Now, in a command terminal, run the following

```bash
node write-pugs.js
```

> The result of the above command, created templates.json
>> Below is the file templates.json

```javascript
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

```javascript
var ackPug = require("ack-pug-bundler")

//templates.js file is written with ecma6 export syntax
ackPug.crawlPath(__dirname, {asOneFile:'templates.js'})
```

> Now, in a command terminal, run the following

```bash
node write-pugs.js
```

> The result of the above command, created templates.js
>> Below is the file templates.js

```javascript
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

```javascript
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

```javascript
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

```javascript
{
  "scripts": {
    "watch:pug": "node watch-pug",
    "build:pug": "node build-pug"
  }
}
```

Now you can watch pug files for changes and output js file versions
```bash
$ npm run watch:pug
```

Now you can vuild pug files and output js file versions for application use
```bash
$ npm run build:pug
```
