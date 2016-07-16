var ackPug = require("../index")
var path = require("path")
var folderPath = path.join(__dirname,"src")
var outPath0 = path.join(__dirname,"result-js-files","ecma6")
var outPath1 = path.join(__dirname,"result-js-files","commonJs")

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
