var assert = require('assert')
var ack = require('ack-node')
var path = require('path')
var index = require('../../index')

describe('ack-pug-monitor',function(){
  it('#crawlFolders:common',function(done){
    var folderPath = path.join(__dirname,'../')   
    var outPath = path.join(folderPath,'js-files')
    var PugOne = ack.file(outPath).join('pug-one.pug.js')
    var PugTwo = ack.file(outPath).join('pug-two.pug.js')

    
    index.crawlFolders(folderPath, outPath, {outType:'common'})
    .then(()=>[PugTwo.exists(),PugOne.exists(),PugTwo.exists(),PugOne.exists(),PugTwo.exists()])
    .map(i=>i)//array of promises to array of values
    .then(yesNos=>{
      console.log(yesNos)
      //assert.equal(yesNos[0], true)
      //assert.equal(yesNos[1], true)
    })
    .then(done).catch(done)
  })
})