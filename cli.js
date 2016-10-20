#!/usr/bin/env node

var argv = process.argv.slice(2)
var watch = argv.indexOf('--watch')>1
var path = require('path')
var ackPug = require("ack-pug-bundler")
var path = require("path")
var startPath = process.cwd()
var folderPath = path.join(startPath, argv[0])
var outFileName = argv[1].split(/(\\|\/)/g).pop()
var outPath0 = path.join(startPath, argv[1], '../')

if(watch){
  ackPug.watchPath(folderPath, outPath0, {asOneFile:outFileName})
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:Watching', folderPath)
}else{
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:Building', folderPath)
  //pug files written with ecma6 export syntax
  ackPug.crawlPath(folderPath, outPath0, {asOneFile:outFileName})
  .then(()=>{
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:built', folderPath)
  })
  .catch(console.log.bind(console))
}