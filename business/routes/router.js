var express = require('express');
var router = express.Router();
var salesterminal = require('../model/salesterminal');
//登陆验证
router.post('/salesterminal/login', async function(req, res, next) {
   var result = await salesterminal.login(req);
   console.log(result);
   if(result){
      res.json({'success':true,'result':""});
   }else{
      res.json({'success':false,'result':""});
   }
});
//根据订单号删除订单
router.post('/salesterminal/delDate', async function(req, res, next) {
   console.log(req.body);
   var assertId = req.body.assertId;
   var result = await salesterminal.delDate(assertId);
   if(result!=false){
      res.json({'success':true,'result':result});
   }else{
      res.json({'success':false,'result':""});
   }
});
//销售终端和消费者查询数据
router.get('/salesterminal/gethistory', async function(req, res, next) {
   console.log(req.query.assertId);
   var assertId = req.query.assertId;
   var result = await salesterminal.getHistory(assertId);
   if(result!=false){
      var json = JSON.parse(result);
      res.json({'success':true,'result':json});
   }else{
      res.json({'success':false,'result':""});
   }
});

module.exports = router;
