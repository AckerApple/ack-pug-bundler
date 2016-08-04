"use strict";

var assert = require('assert')
var ackPath = require('ack-path')
var path = require('path')
var index = require('../../index')

describe('ack-pug-monitor',()=>{
  describe('#crawlPath',()=>{
    it('asJsonFile',done=>{
      var folderPath = path.join(__dirname,'../','src')   
      var outPath = path.join(folderPath,'../','result-js-files')
      var tPath = ackPath(outPath).join('templates.json')
      
      index.crawlPath(folderPath, outPath, {asJsonFile:true})
      .delay(10)
      .then(()=>tPath.exists())
      .then(yesNo=>{
        assert.equal(yesNo, true)
      })
      .then(()=>require(tPath.path))
      .then(contents=>{
        assert.equal(typeof contents['./watch-test'], 'string')
        assert.equal(typeof contents['./pug-two'], 'string')
        assert.equal(typeof contents['./pug-one'], 'string')
        assert.equal(typeof contents['./sub-folder/sub-folder-test'], 'string')
      })
      .then(done).catch(done)
    })

    it('asOneFile',done=>{
      var folderPath = path.join(__dirname,'../','src')   
      var outPath = path.join(folderPath,'../','result-js-files')
      var tPath = ackPath(outPath).join('templates.js')
      
      index.crawlPath(folderPath, outPath, {outType:'common', asOneFile:true})
      .delay(10)
      .then(()=>tPath.exists())
      .then(yesNo=>{
        assert.equal(yesNo, true)
      })
      .then(()=>require(tPath.path))
      .then(contents=>{
        assert.equal(typeof contents['./watch-test'], 'string')
        assert.equal(typeof contents['./pug-two'], 'string')
        assert.equal(typeof contents['./pug-one'], 'string')
        assert.equal(typeof contents['./sub-folder/sub-folder-test'], 'string')
        assert.equal(typeof contents.get, 'function')

        contents.get('nothing')//causes 404
      })
      .catch(404,e=>{
        assert.equal(e.code, 404)
      })
      .then(done).catch(done)
    })

    it('seperateFiles',done=>{
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
})