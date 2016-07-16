const ack = require('ack-node')

var jade = require('jade')
var fs = require('fs')
var isPugFile = require('./watch-filter')

module.exports.crawlFolders = crawlFolders
module.exports.writeFile = writeFile
module.exports.createMonitor = createMonitor
module.exports.monitorFileDelete = monitorFileDelete

function monitorFileChange(f) {
  if(isPugFile(f)){
    writeFile(f)
    console.log('\x1b[34m[ack-pug-monitor]:wrote template to js: \x1b[0m'+f)
  }else{
    console.log('\x1b[33mignored changes to: \x1b[0m'+f)
  }
}

function monitorFileDelete(filePath) {
  var jadeF = filePath+'.js'

  if(isPugFile(jadeF)){
    fs.unlink(jadeF)
    console.log('\x1b[31mdeleted: \x1b[0m'+filePath)
  }else{
    console.log('\x1b[33mignored delete: \x1b[0m'+filePath)
  }
}

function createMonitor(monitor) {
  monitor.on("created", monitorFileChange)
  monitor.on("changed", monitorFileChange)
  monitor.on("removed", monitorFileDelete)

  process.on('exit',()=>{
    monitor.stop();// Stop watching
    console.log('monitor closed')
  })

  console.log('monitor on')
}

/**
  @searchOps {
    outType:'ecma6'||'common'//controls output js file for export versus module.exports
  }
*/
function writeFile(f, outPath, searchOps){
  searchOps = searchOps || {}
  outPath = ack.path(outPath).join(ack.path(f).getName()).path || f

  var html = jade.renderFile(f)
  var target = outPath+'.js'
  html = html.replace(/"/g, '\\\"')//escape(html)
  html = html.replace(/(\n)/g, '"+$1"\\n')//escape linefeeds
  html = html.replace(/(\r)/g, '"+$1"\\r')//escape linereturns
  
  console.log('searchOps.outType',searchOps.outType)
  if(searchOps.outType=='common'){
    var output = 'module.exports="'+html+'"'
  }else{
    var output = 'export default "'+html+'"'
  }

  fs.writeFile(target, output,function(err){
    if(err){
      console.log('err',err)
    }
  });
}



function repeater(f, outPath, searchOps){
  if(f.path.search(/\.jade\.js$/)>=0){
    deleteRepeater(f)
    return
  }
  writeFile(f.path, outPath, searchOps)
}

function outRepeater(outPath, searchOps){
  return function(f){
    return repeater(f, outPath, searchOps)
  }
}

function deleteRepeater(f){
  const F = ack.file(f.path)
  return F.Join().removeExt().exists().if(false,()=>F.delete())
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
function crawlFolders(path, outPath, searchOps){
  outPath = outPath || path
  const fPath = ack.path(path)
  searchOps = searchOps || {}
  searchOps.filter = searchOps.filter || ['**/*.pug','**/*.jade']

  return fPath.recurFilePath(outRepeater(outPath,searchOps), searchOps)
  .catch(e=>console.log(e))
  console.log('\x1b[34mWriting all template files\x1b[0m')
}