"use strict";

var assert = require('assert')
var ack = require('ack-node')
var path = require('path')
var index = require('../../index')

describe('ack-pug-monitor',function(){
  it('#crawlFolders:common',function(done){
    var folderPath = path.join(__dirname,'../','src')   
    var outPath = path.join(folderPath,'../','result-js-files')
    var PugOne = ack.file(outPath).join('pug-one.pug.js')
    var PugTwo = ack.file(outPath).join('pug-two.pug.js')
    var SubPug = ack.file(outPath).join('sub-folder','sub-folder-test.pug.js')

    index.crawlFolders(folderPath, outPath, {outType:'common'})
    .delay(10)
    .then(()=>PugOne.exists())
    .then(yesNo=>{
      assert.equal(yesNo, true)
    })
    .then(()=>PugTwo.exists())
    .then(yesNo=>{
      assert.equal(yesNo, true)
    })
    .then(()=>SubPug.exists())
    .then(yesNo=>{
      assert.equal(yesNo, true)
    })
    .then(done).catch(done)
  })
})