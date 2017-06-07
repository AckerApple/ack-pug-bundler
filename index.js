"use strict";

const ackPath = require('ack-path')

var jade = require('pug')
var fs = require('fs')
var isPugFile = require('./watch-filter')
var watch = require('watch')

module.exports.crawlPath = crawlPath
module.exports.crawlFolders = crawlPath//deprecated alias
module.exports.watchPath = watchPath
module.exports.writeFile = writeFile
module.exports.createMonitor = createMonitor
module.exports.monitorFileDelete = monitorFileDelete

//watch function filter to only watch pug||jade files
var watchOptions = {
  filter: function(f){
    const res = f.search(/(\.(pug|jade)$|[\\/][^\\/.]+$)/)>=0
    return res ? true : false
  }
}

function watchPath(folderPath, outPath, searchOps){
  if(outPath && typeof outPath!='string'){
    searchOps = outPath
    outPath = path
  }


  searchOps = paramPathSearchOps(folderPath, searchOps)
  var loader = monitorLoader(folderPath, outPath, searchOps)
  watch.createMonitor((folderPath||'.'), watchOptions, loader)
}

/**
  f - file to write
  outPath - folder to write to
  @searchOps {
    outFileExt:'js'
    basePath:compare path used to build sub-pathing
    outType:'ecma6'||'common'//controls output js file for export versus module.exports
  }
*/
function writeFile(f, outPath, searchOps){
  if(outPath && typeof outPath!='string'){
    searchOps = outPath
    outPath = path
  }

  var meta = pugRequestToMeta(f, outPath, searchOps)

  return writeFileByMeta(meta)
}

function monitorLoader(folderPath, outPath, searchOps){
  if(searchOps.asOneFile || searchOps.asJsonFile){
    return function(monitor){
      createOneFileMonitor(monitor, folderPath, outPath, searchOps)
    }
  }

  return function(monitor){
    createMonitor(monitor, outPath, searchOps)
  }
}

function monitorFileChange(f, outPath, searchOps) {
  if(isPugFile(f)){    
    outPath = outPath || ackPath(f).removeFileName().path

    return writeFile(f, outPath, searchOps).then(function(){
      console.log('\x1b[36m[ack-pug-bundler]: wrote: \x1b[0m'+f)
    })
  }
}

function monitorFileDelete(filePath, outPath) {
  var jadeF = filePath+'.js'

  var name = ackPath(filePath).getName()
  outPath = outPath ? ackPath(outPath).join(name).path : f

  if(isPugFile(jadeF)){
    fs.unlink(outPath)
    console.log('\x1b[31m[ack-pug-bundler]\x1b[0m: deleted: '+filePath)
  }
}

function createOneFileMonitor(monitor, folderPath, outPath, searchOps){
  var metaOb = {}

  return getMetaArrayByPathing(folderPath, outPath, searchOps)
  .then(function(ma){
    metaOb = metaArrayToOb(ma)
  
    var save = function(){
      writeMetaOb(metaOb, outPath, searchOps)
      .then(function(res){
        console.log('\x1b[36m[ack-pug-bundler]:\x1b[0m wrote single file')
      })
      .catch( console.log.bind(console) )
    }

    var onChange = function(f){
      try{
        var meta = pugRequestToMeta(f, outPath, searchOps)
        var key = '.'+ackPath(meta.key).removeExt().path
        metaOb[ key ] = meta.string
        save()
      }catch(e){
        console.log('\x1b[36m[ack-pug-bundler]:\x1b[0m \x1b[31m Failed to render:\x1b[0m '+f)
        console.error(e)
      }
    }

    monitor.on("created", onChange)
    
    monitor.on("changed", onChange)
    
    monitor.on("removed", function(f){
      try{
        var meta = pugRequestToMeta(f, outPath, searchOps)
        var key = '.'+ackPath(meta.key).removeExt().path
        delete metaOb[ key ]
        save()
      }catch(e){
        console.error(e)
      }
    })
  })
  .catch( console.log.bind(console) )
  
  /*
  process.on('exit',()=>{
    monitor.stop();// Stop watching
  })*/  
}

function createMonitor(monitor, outPath, searchOps) {
  monitor.on("created", function(f){
    monitorFileChange(f, outPath, searchOps)
  })
  
  monitor.on("changed", function(f){
    monitorFileChange(f, outPath, searchOps)
  })
  
  monitor.on("removed", function(f){
    monitorFileDelete(f, outPath)
  })
  /*
  process.on('exit',()=>{
    monitor.stop();// Stop watching
  })*/
}

function escapePugString(html){
  html = html.replace(/"/g, '\\\"')//escape(html)
  html = html.replace(/(\n)/g, '"+$1"\\n')//escape linefeeds
  html = html.replace(/(\r)/g, '"+$1"\\r')//escape linereturns
  return html
}

function reduceBasePath(path, basePath){
  var rx = new RegExp('^'+basePath, 'i')
  return ackPath(path).path.replace(rx,'')
}

function pugPathToMeta(path, basePath, options){
  var meta = {
    string: jade.renderFile(path,options),
    path: ackPath(path).removeFileName().path,
    filePath: path,
    key: basePath ? reduceBasePath(path, basePath) : path
  }

  meta.keyPath = ackPath(meta.key).removeFileName().path

  return meta
}

function pugRequestToMeta(f, outPath, searchOps){
  var meta = pugPathToMeta(f, searchOps.basePath, searchOps)

  meta.outPath = outPath || f
  meta.searchOps = searchOps || {}

  return meta
}

module.exports.stringToFile = stringToFile
module.exports.markdownToFile = markdownToFile

//assumes file name
function myStringToFile(string, path, options){
  var AOutPath = ackPath(path)
  if(options.outFileExt){
    var dotArray = ackPath(path).getName().split('.')
    dotArray.pop()//remove last dot notation aka file extension
    var fileName = dotArray.join('.')+'.'+options.outFileExt
  }else{
    var fileName = ackPath(path).getName()+'.js'
  }
  var outFilePath = AOutPath.removeFileName().join(fileName).path//append file name

  return stringToFile(outFilePath, path, options)
}

//does not make out file assumptions
function stringToFile(string, path, options){
  options = options || {}
  
  let output = ''
  switch(options.outType){
    case 'string':break;

    case 'common':
      output = 'module.exports='
      break;

    case 'ts':
      output = 'export const string = '
      break;

    default:output = 'export default '
  }

  if(options.outType=='string'){
    output += string
  }else{
    output += '"' + escapePugString(string) + '"'
  }

  return ackPath(path).removeFileName().paramDir()
  .callback(function(callback){
    fs.writeFile(path, output, callback)
  })
}

const mdToHtml = require("marked")
function markdownToFile(string, path, options){
  return stringToFile(mdToHtml(string), path, options)
}

function writeFileByMeta(meta){
  var AOutPath = ackPath(meta.outPath)

  if(meta.keyPath!=meta.key){
    AOutPath.join( meta.keyPath )//replication of folder depth
  }

  AOutPath.join( ackPath(meta.filePath).getName() )//replication of folder depth

  return myStringToFile(meta.string, AOutPath.path, meta.searchOps)
}



function writeRepeater(f, outPath, searchOps){
  if(f.path.search(/\.(pug|jade)\.js$/)>=0){
    deleteRepeater(f)
    return
  }

  var meta = pugRequestToMeta(f.path, outPath, searchOps)
  return writeFileByMeta(meta)
}

function outRepeater(outPath, searchOps, resultArray){
  return function(f){
    resultArray.push( pugRequestToMeta(f.path, outPath, searchOps) )
    //return writeRepeater(f, outPath, searchOps)
  }
}

function deleteRepeater(f){
  const F = ackPath(f.path).file()
  return F.Join().removeExt().exists().if(false,()=>F.delete())
}

/**
  @searchOps{includeHtmls:false}
*/
function paramPathSearchOps(path, searchOps){
  searchOps = searchOps || {}
  if(!searchOps.filter){
    searchOps.filter = ['**/**.pug','**/**.jade','**.pug','**.jade']//['**/**.pug','**/**.jade']
    
    if(searchOps.includeHtmls){
      searchOps.filter.push('**/**.html')
      searchOps.filter.push('**.html')
    }
  }

  searchOps.basePath = path
  return searchOps
}

function metaArrayToOb(metaArray){
  var bodyOb = {timestamp:Date.now()}
  for(let x=metaArray.length-1; x >= 0; --x){
    var meta = metaArray[x]
    var key = '.'+ackPath(meta.key).removeExt().path
    bodyOb[key] = meta.string
  }

  return bodyOb
}

//method used to write a single file
function writeMetaOb(bodyOb, outPath, searchOps){
  var body = JSON.stringify(bodyOb, null, 2)
  
  if(searchOps.asJsonFile){
    //true to default file name
    searchOps.asJsonFile = typeof searchOps.asJsonFile!='string' ? 'templates.json' : searchOps.asJsonFile
    var fileName = searchOps.asJsonFile
  }else if(searchOps.asOneFile){
    //true to default file name
    searchOps.asOneFile = typeof searchOps.asOneFile!='string' ? 'templates.js' : searchOps.asOneFile
    var fileName = searchOps.asOneFile

    if(searchOps.outType=='common'){
      var header = 'module.exports='
    }else{
      var header = 'export default '
    }

    //add get function that throw errors on templates
    body = body.substring(0, body.length-2)+',\n'
    body = body + "  get:function(p){if(this[p]){return this[p]}var ne=new Error('Template not found: '+p+'. Available-Templates: '+Object.keys(this).join());ne.code=404;throw ne}\n}"

    body = header + body
  }
 

  var Path = ackPath(outPath)

  return Path.paramDir()
  .then(function(){
    return Path.join(fileName).writeFile(body)
  })
}

function metaArrayToOneFile(metaArray, outPath, searchOps){
  var bodyOb = metaArrayToOb(metaArray)
  return writeMetaOb(bodyOb, outPath, searchOps)
}

function getMetaArrayByPathing(path, outPath, searchOps){
  outPath = outPath || path
  const fPath = ackPath(path)
  searchOps = paramPathSearchOps(path, searchOps)
  var resultArray = []
  return fPath.recurFilePath( outRepeater(outPath,searchOps,resultArray), searchOps )
  .then(()=>resultArray)
}

/**
  @searchOps {
    outType:'ecma6'||'common'//controls output js file for export versus module.exports
    filter:[
      'folder1/**~/*.pug',//example 1, !You have to replace **~ with **
      'folder2/**~/*.jade'//example 2, !You have to replace **~ with **
    ]
  }
*/
function crawlPath(path, outPath, searchOps){
  if(outPath && typeof outPath!='string'){
    searchOps = outPath
    outPath = path
  }

  return getMetaArrayByPathing(path, outPath, searchOps)
  .then(function(resultArray){
    var promises = []

    if(searchOps && (searchOps.asOneFile || searchOps.asJsonFile)){
      promises.push( metaArrayToOneFile(resultArray,outPath,searchOps) )
    }else{
      for(let x=resultArray.length-1; x >= 0; --x){
        var meta = resultArray[x]
        promises.push( writeFileByMeta(meta) )
      }
    }

    return promises
  })
  .all()
  .catch( console.log.bind(console) )
}