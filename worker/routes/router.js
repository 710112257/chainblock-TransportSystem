var express = require('express');
var router = express.Router();
var dairyfarm = require('../model/dairyfarm');
var multer = require('multer');
var upload = multer({
   dest: __dirname + '/../public/imgs/'
});
//寄件录入数据
router.post('/dairyfarm/putvalue',upload.array('photo'), async function(req, res, next) {
   var rehash=await dairyfarm.putIpfs(req);
   req.body.photo=rehash;
   req.body.place='上海';
   req.body.Type='寄件';
   var result=await dairyfarm.putValue(req.body);
   if(result!=false){
      res.json({'success':true,'result':result});
   }else{
      res.json({'success':false,'result':""});
   }
});
//更新数据
router.post('/dairyfarm/upDate',upload.array('photo'), async function(req, res, next) {
   var rehash=await dairyfarm.putIpfs(req);
   req.body.photo=rehash;
   req.body.place='广州';
   req.body.Type='交接';
   var result=await dairyfarm.upDate(req.body);
   if(result!=false){
      res.json({'success':true,'result':result});
   }else{
      res.json({'success':false,'result':""});
   }
});
//根据手机号查物流
router.get('/dairyfarm/getvalue', async function(req, res, next) {
   var phoneNumber = req.query.phoneNumber;
   var result = await dairyfarm.getValue(phoneNumber);
   if(result!=false){
      res.json({'success':true,'result':result});
   }else{
      res.json({'success':false,'result':""});
   }
   
});
//查询数据
router.get('/dairyfarm/gethistory', async function(req, res, next) {
   var assertId = req.query.assertId;
   var result = await dairyfarm.getHistory(assertId);
   if(result!=false){
      var json = JSON.parse(result);
      res.json({'success':true,'result':json});
   }else{
      res.json({'success':false,'result':""});
   }
   
});


module.exports = router;
