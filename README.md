# ack-pug-bundler
Watch and bundle pug/jade files into .js files for importing into Javascript web-apps

This package converts .pug and .jade files into .pug.js or .jade.js files and also comes with file watching functionality to compile template files, when changes occur to them.

> The intended use of this package, is to be used during front-end aka client-side code development where the bundling process is performed in NodeJs.

Have you heard or used any of the following?
- pug-loader or jade-loader
- plugin-pug or plugin-jade

The above mentioned packages, all compile pug/jade files during the js build process. This approach isn't always ideal and sometimes .js file extensions are needed to be present BEFORE the js build process.

> TIP: ack-pug-bundler watch/build processes should run synchronous(before) any other watch/build processes that require the produced pug/jade .js compiled files.

## Recommended Installation
This package is only needed during the development of another package, install for development use only
```
$ npm install ack-pug-bundler --save-dev
```

## Example Watch
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

//pug files written with require() syntax
ackPug.watchPath(folderPath, outPath1, {outType:'common'})

console.log('[ack-pug-bundler]:watching', folderPath)
```

## Example Build All
Use this example to compile all pug/jade files and then write the compile results elsewhere

> Create file: build-pug.js
```
var ackPug = require("ack-pug-bundler")
var path = require("path")
var folderPath = path.join(__dirname,"src")
var outPath0 = path.join(__dirname,"result-js-files","commonJs")
var outPath1 = path.join(__dirname,"result-js-files","ecma6")

console.log('[ack-pug-bundler]:building', folderPath)

//pug files written with ecma6 export syntax
ackPug.crawlFolders(folderPath, outPath0)
.then(function(){
  console.log('[ack-pug-bundler]:ecma6 completed', folderPath)
})

//pug files written with require() syntax
ackPug.crawlFolders(folderPath, outPath1, {outType:'common'})
.then(function(){
  console.log('[ack-pug-bundler]:commonJs completed', folderPath)
})
```


## Example NPM Script
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
