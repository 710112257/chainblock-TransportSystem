var express = require('express');
var router = express.Router();
var salesterminal = require('../model/salesterminal');
//根据手机号查物流
router.get('/salesterminal/getvalue', async function(req, res, next) {
   var phoneNumber = req.query.phoneNumber;
   var result = await salesterminal.getValue(phoneNumber);
   console.log(result);
   if(result!=false){
      res.json({'success':true,'result':result});
   }else{
      res.json({'success':false,'result':""});
   }
   
});
//销售终端和消费者查询数据
router.get('/salesterminal/gethistory', async function(req, res, next) {
   var assertId = req.query.assertId;
   var result = await salesterminal.getHistory(assertId);
   console.log(result)
   if(result!=false){
      var json = JSON.parse(result);
      res.json({'success':true,'result':json});
   }else{
      res.json({'success':false,'result':""});
   }
});

module.exports = router;
