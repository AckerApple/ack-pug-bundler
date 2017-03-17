#!/usr/bin/env node

var argv = process.argv.slice(2)

var isAsOneFile = argv.length>1 && argv[1].substring(0, 1)!='-'

var path = require('path')
var startPath = process.cwd()
var folderPath = path.join(startPath, argv[0])
var watch = argv.indexOf('--watch')>0
var ackPug = require("ack-pug-bundler")
var path = require("path")
var options = {
  pretty:argv.indexOf('--pretty')>0
}

var oneHtmlFile = argv.indexOf('--oneHtmlFile')>0
const oneToOne = argv.indexOf('--oneToOne')>0
var fs = require('fs')

const stats = fs.statSync(folderPath)
const isDir = stats.isDirectory()

readArguments()

if(oneToOne || oneHtmlFile){
  activateOneHtmlFileMode()
}else{
  activateFolderMode()
}

function readArguments(){
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
    options.outPath = path.join(startPath, argv[1])
    
    if(!isDir){
      options.outPath = path.join(options.outPath, '../')
    }
    
    var outFileName = argv[1].split(/(\\|\/)/g).pop()
    options.asOneFile = outFileName
    options.outFilePath = path.join(options.outPath, options.asOneFile)
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: Mode is build as '+outFileName)
  }else{
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: File mode is write inplace')
  }
}

function activateFolderMode(){
  if(watch){
    ackPug.watchPath(folderPath, options.outPath, options)
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:Watching', folderPath)
  }else{
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:Building', folderPath)
    //pug files written with ecma6 export syntax
    ackPug.crawlPath(folderPath, options.outPath, options)
    .then(()=>{
      console.log('\x1b[36m[ack-pug-bundler]\x1b[0m:built', folderPath)
    })
    .catch(console.log.bind(console))
  }
}

function activateOneHtmlFileMode(){
  options.outFilePath = options.outFilePath || toHtmlFileName(folderPath)

  var pug = require('pug')

  function buildHtmlFile(from){
    const fileName = from.split(path.sep).pop()
    console.log('fileName', fileName)
    const htmlFileName = toHtmlFileName( fileName )
    console.log('htmlFileName', htmlFileName)

    const outTo = path.join(options.outFilePath, htmlFileName)
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: Build single html file')
    var html = pug.renderFile(from, options);
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: writing '+outTo)
    
    if(oneHtmlFile){
      fs.writeFileSync(outTo, html)
    }else{
      ackPug.stringToFile(html, outTo, options)
    }
  }

  if(watch){
    var watcher = require('watch')
    var parentFolder = isDir ? folderPath : path.join(folderPath,'../')
    var inFileName = folderPath.split(/(\\|\/)/g).pop()
    var watchOps = {
      filter: function(f){
        const res = f.search(inFileName)>=0
        return res ? true : false
      }
    }
    
    watcher.createMonitor(parentFolder, watchOps, monitor=>{
      monitor.on("created", buildHtmlFile)
      monitor.on("changed", buildHtmlFile)
      monitor.on("removed", ()=>fs.unlink(options.outFilePath))
    })
    console.log('\x1b[36m[ack-pug-bundler]\x1b[0m: Watching', parentFolder)
  }else{
    buildHtmlFile(folderPath)
  }
}

function getDefaultExt(){
  return options.outType == 'ts' ? '.ts' : '.js'
}

function toHtmlFileName(name, ext){
  ext = ext || (oneHtmlFile ? '.html' : getDefaultExt())
  return name.replace(/(\.[^.]*)$/g, ext)
}