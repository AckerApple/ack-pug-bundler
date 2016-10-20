#!/usr/bin/env node

var argv = process.argv.slice(2)

var isAsOneFile = argv.length>1 && argv[1].substring(0, 1)!='-'

var path = require('path')
var startPath = process.cwd()
var folderPath = path.join(startPath, argv[0])
var watch = argv.indexOf('--watch')>1
var ackPug = require("ack-pug-bundler")
var path = require("path")
var options = {
  pretty:argv.indexOf('--pretty')>1
}

var outTypeTest=argv.filter(v=>v.search(/--outType/)>=0)
if(outTypeTest.length>0){
  options.outType = outTypeTest[0].split('=').pop()
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: output type is '+options.outType)
}

var fileExtTest=argv.filter(v=>v.search(/--outFileExt/)>=0)
if(fileExtTest.length>0){
  options.outFileExt = fileExtTest[0].split('=').pop()
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: output file ext is '+options.outFileExt)
}

if(isAsOneFile){
  var outPath0 = path.join(startPath, argv[1], '../')
  var outFileName = argv[1].split(/(\\|\/)/g).pop()
  options.asOneFile = outFileName
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: Mode is build as '+outFileName)
}else{
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: File mode is write inplace')
}

if(watch){
  ackPug.watchPath(folderPath, outPath0, options)
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:Watching', folderPath)
}else{
  console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:Building', folderPath)
  //pug files written with ecma6 export syntax
  ackPug.crawlPath(folderPath, outPath0, options)
  .then(()=>{
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:built', folderPath)
  })
  .catch(console.log.bind(console))
}