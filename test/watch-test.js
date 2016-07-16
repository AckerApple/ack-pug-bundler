var ackPug = require("../index")
var path = require("path")
var folderPath = path.join(__dirname,"src")
var outPath0 = path.join(__dirname,"result-js-files","ecma6")
var outPath1 = path.join(__dirname,"result-js-files","commonJs")

//pug files written with ecma6 export syntax
ackPug.watchPath(folderPath, outPath0)

//pug files written with require() syntax
ackPug.watchPath(folderPath, outPath1, {outType:'common'})

console.log('[ack-pug-bundler]:watching', folderPath)
