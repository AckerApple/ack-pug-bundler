#!/usr/bin/env node

var argv = process.argv.slice(2)

var isAsOneFile = argv.length>1 && argv[1].substring(0, 1)!='-'

var path = require('path')
const ackPath = require('ack-path')
var startPath = process.cwd()
var folderPath = path.join(startPath, argv[0])
var watch = argv.indexOf('--watch')>0
var ackPug = require("./index")//require("ack-pug-bundler")
var path = require("path")
const log = require("./log.function")
var options = {
  pretty:argv.indexOf('--pretty')>0
}

const fileExts = ['pug','jade']
options.includeHtmls = argv.indexOf('--includeHtmls')>=0
if(options.includeHtmls){
  fileExts.push('html')
}

const regx = new RegExp('(\.('+fileExts.join('|')+')$|[\\/][^\\/.]+$)', 'gi')

const skipRender = process.argv.indexOf('--skipRender')>0
const oneHtmlFile = argv.indexOf('--oneHtmlFile')>0
const oneFile = argv.indexOf('--oneFile')>0
const oneToOne = argv.indexOf('--oneToOne')>0
var fs = require('fs')

const stats = fs.statSync(folderPath)
const isDir = stats.isDirectory()

readArguments()

if(oneFile || oneToOne || oneHtmlFile){
  activateOneFileMode()
}else{
  activateFolderMode()
}

function readArguments(){
  var outTypeTest = argv.indexOf('--outType')
  if(outTypeTest>0){
    options.outType = argv[outTypeTest+1]
    log('output type is '+options.outType)
  }

  const fileExtTest = argv.indexOf('--outFileExt')
  if(fileExtTest>0){
    options.outFileExt = argv[ fileExtTest+1 ]
    log('output file ext is', options.outFileExt)
  }

  if(isAsOneFile){
    options.outPath = path.join(startPath, argv[1])
    
    if(!isDir){
      options.outPath = path.join(options.outPath, '../')
    }
    
    var outFileName = argv[1].split(/(\\|\/)/g).pop()
    options.asOneFile = outFileName
    options.outFilePath = path.join(options.outPath, options.asOneFile)
    if(outFileName)log('Mode is build as',outFileName)
  }else{
    log('File mode is write inplace')
  }
}

function activateFolderMode(){
  if(watch){
    ackPug.watchPath(folderPath, options.outPath, options)
    log('Watching', folderPath.substring(parentFolder.length, folderPath.length))
  }else{
    log('Building', folderPath)
    //pug files written with ecma6 export syntax
    ackPug.crawlPath(folderPath, options.outPath, options)
    .then(()=>{
      log('built', folderPath)
    })
    .catch(log.bind(console))
  }
}

function activateOneFileMode(){
  options.outFilePath = options.outFilePath || toFileName(folderPath)

  var pug = require('pug')

  function fromToOutPath(from){
    const fileName = from.split(path.sep).pop()
    return path.join(options.outFilePath, toFileName(fileName))
  }

  function buildFile(from){
    const outTo = fromToOutPath(from)
    const isHtml = skipRender || from.search(/\.html$/)>=0
    const isMarkdown = skipRender || from.search(/\.md$/)>=0

    try{
      var html = isHtml ? fs.readFileSync(from).toString() : pug.renderFile(from, options);
      //var html = pug.renderFile(from, options)
      //log('writing '+outTo)
      
      if(oneHtmlFile){
        fs.writeFileSync(outTo, html)
      }else if(isMarkdown){
        ackPug.markdownToFile(html, outTo, options)
      }else{
        ackPug.stringToFile(html, outTo, options)
      }
    }catch(e){
      log.error(e)
    }
  }

  function onFileChange(from){
    log(getServerTime(), from.substring(parentFolder.length, from.length))
    const outTo = path.join(options.outPath, fromToOutPath(from).split(path.sep).pop())
    log(getServerTime(), 'built', outTo.substring(startPath.length, outTo.length))
    buildFile(from)
  }

  if(watch){
    var watcher = require('watch')
    var parentFolder = isDir ? folderPath : path.join(folderPath,'../')
    var inFileName = folderPath.split(/(\\|\/)/g).pop()
    var watchOps = {
      filter: function(f){
        const res = f.search(inFileName)>=0 && f.search(regx)>=0
        return res ? true : false
      }
    }
    
    watcher.createMonitor(parentFolder, watchOps, monitor=>{
      monitor.on("created", onFileChange)
      monitor.on("changed", onFileChange)
      monitor.on("removed", from=>fs.unlink(fromToOutPath(from),e=>e))
      process.once('SIGINT', ()=>monitor.stop())
    })
    log('Watching', parentFolder.substring(startPath.length, parentFolder.length))
  }else{
    const aPath = ackPath(folderPath)

    aPath.isFile()
    .if(true, ()=>[folderPath])
    .if(false, ()=>aPath.recurFiles(File=>File.path).then(filterResults))
    .past( ()=>log('Building',folderPath) )
    .map( filePath=>buildFile(filePath) )
    .then( ()=>log('Compiled',options.outFilePath) )
    .catch(e=>console.error(e))
  }
}

function getDefaultExt(){
  return options.outType=='ts' ? '.ts' : '.js'
}

function filterResults(results){
  return results.filter(v=>v.search(regx)>=0)
}

function toFileName(name, ext){
  ext = ext || (oneHtmlFile?'.html':getDefaultExt())

  if(options.outFileExt || oneHtmlFile){
    name = name.replace(/(\.[^.]*)$/g, '')
  }

  return name + ext
}

function getServerTime(d){
  d = d || new Date()
  var h=d.getHours(),t='AM',m=d.getMinutes();m=m<10?'0'+m:m;h=h>=12?(t='PM',h-12||12):h==0?12:h;return ('0'+h).slice(-2)+':'+m+':'+('0'+d.getSeconds()).slice(-2)+' '+t
}