var ackPug = require("../index")
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

//pug files compiled into one json file
ackPug.crawlPath(folderPath, outPath1, {asJsonFile:'templates.json'})
.then(function(){
  console.log('[ack-pug-bundler]:single-json-file completed', folderPath)
})
.catch(console.log.bind(console))
