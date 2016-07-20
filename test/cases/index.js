"use strict";

var assert = require('assert')
var ackPath = require('ack-path')
var path = require('path')
var index = require('../../index')

describe('ack-pug-monitor',function(){
  it('#crawlPath:common',function(done){
    var folderPath = path.join(__dirname,'../','src')   
    var outPath = path.join(folderPath,'../','result-js-files')
    var PugOne = ackPath(outPath).file().join('pug-one.pug.js')
    var PugTwo = ackPath(outPath).file().join('pug-two.pug.js')
    var SubPug = ackPath(outPath).file().join('sub-folder','sub-folder-test.pug.js')

    index.crawlPath(folderPath, outPath, {outType:'common'})
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