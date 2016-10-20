console.log('xxxx')

var argv = process.argv.slice(2)

console.log(argv)


console.log('---------')
/*
var ackPug = require("ack-pug-bundler")
var path = require("path")
var folderPath = path.join(__dirname,"../","src","app")
var outPath0 = path.join(__dirname,"../","src","app")

console.log('[ack-pug-bundler]:Building', folderPath)

//pug files written with ecma6 export syntax
ackPug.crawlPath(folderPath, outPath0, {asOneFile:'templates.js'})
.then(()=>{
  console.log('[ack-pug-bundler]:built', folderPath)
})
.catch(console.log.bind(console))
*/