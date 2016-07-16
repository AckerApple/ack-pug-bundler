var assert = require('assert')
var ack = require('ack-node')
var path = require('path')
var index = require('../../index')

describe('ack-pug-monitor',function(){
  it('#crawlFolders:common',function(done){
    var folderPath = path.join(__dirname,'../')   
    var outPath = path.join(folderPath,'result-js-files')
    var PugOne = ack.file(outPath).join('pug-one.pug.js')
    var PugTwo = ack.file(outPath).join('pug-two.pug.js')

    
    index.crawlFolders(folderPath, outPath, {outType:'common'})
    .then(()=>PugOne.exists())
    .then(yesNo=>{
      assert.equal(yesNo, true)
    })
    .then(()=>PugTwo.exists())
    .then(yesNo=>{
      assert.equal(yesNo, true)
    })
    .then(done).catch(done)
  })
})