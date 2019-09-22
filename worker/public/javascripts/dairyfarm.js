$(function(){
    $('#loading_imgs').hide();
    $('#loading_imgs2').hide();
    $('#toInput').click(function(){
        $(this).addClass('active');
        $('#toSearch').removeClass('active');
        $('#toSearchByPhone').removeClass('active');
        $('#toupDate').removeClass('active');
        $('#inputDiv').show();
        $('#upDateDiv').hide();
        $('#searchDiv').hide();
        $('#toSearchByPhoneDiv').hide();
        $('.breadcrumb li.active').text('录入数据');
    });
    
    $('#toupDate').click(function(){
        $(this).addClass('active');
        $('#toSearch').removeClass('active');
        $('#toSearchByPhone').removeClass('active');
        $('#toInput').removeClass('active');
        $('#upDateDiv').show();
        $('#inputDiv').hide();
        $('#searchDiv').hide();
        $('#toSearchByPhoneDiv').hide();
        $('.breadcrumb li.active').text('更新物流');
    });
    $('#toSearch').click(function(){
        $(this).addClass('active');
        $('#toInput').removeClass('active');
        $('#toSearchByPhone').removeClass('active');
        $('#toupDate').removeClass('active');
        $('#searchDiv').show();
        $('#toSearchByPhoneDiv').hide();
        $('#inputDiv').hide();
        $('#upDateDiv').hide();
        $('.breadcrumb li.active').text('根据订单号查询历史数据');
    });
    $('#toSearchByPhone').click(function(){
        $(this).addClass('active');
        $('#toInput').removeClass('active');
        $('#toSearch').removeClass('active');
        $('#toupDate').removeClass('active');
        $('#toSearchByPhoneDiv').show();
        $('#searchDiv').hide();
        $('#inputDiv').hide();
        $('#upDateDiv').hide();
        $('.breadcrumb li.active').text('根据手机号查询所有物流');
    });

    $('#searchBtn').click(function(){ //查询数据
        $('#loading_imgs').show();
        search();
    });
    $('#searchBtnByPhone').click(function(){ //查询数据
        $('#loading_imgs2').show();
        searchByPhone();
    });
    $('#inputBtn').click(function(){  //录入数据
       input();
    });
    $('#upDateBtn').click(function(){  //更新数据
        upDate();
     });

})
async function upDate(){
    $('#upDateBtn').attr('disabled','disabled');
    var paramarr=$('#upDateForm').serializeArray();
    var input=$('#lefile2')[0];
    var files = input.files;
    var formData = new FormData(); 
    for(i=0;i<files.length;i++){
        formData.append('photo', files[i]);
    }
    for(i=0;i<paramarr.length;i++){
        formData.append(paramarr[i].name, paramarr[i].value);
    }
    $.ajax({
        url: '/dairyfarm/upDate',
        type: 'POST',
        cache: false, //上传文件不需要缓存
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function (result) {
            if(result.success){
                        alert('录入成功');
                        $('#upDateForm')[0].reset();
                        $('#upDateBtn').removeAttr('disabled');
            }else{
                        alert('录入失败');
                        $('#upDateBtn').removeAttr('disabled');
            }
                
        }
    });
    
}
function searchByPhone(){
    var phoneNumber = $('input[name=phoneNumber]').val();
    $.get('/dairyfarm/getvalue',{'phoneNumber':phoneNumber},function(result){
        $('#resultList2 tbody').empty();
        if(result.success){
        $.each(result.result,function(i,o){
            console.log(o);
            var tr = '<tr>';
            tr += '<td>'+(i+1)+'</td>';
            tr += '<td style="color:green">'+o.Type+'</td>';
            tr += '<td>'+o.assertId+'</td>';
            tr += '<td style="color:green">'+o.place+'</td>';
            tr += '<td>'+o.senderCustomer+':'+o.senderPhone+'</td>';
            tr += '<td style="color:green">'+o.senderAddress+'</td>';
            tr += '<td>'+o.guaranteeMoney+'</td>';
            tr += '<td style="color:green">*****</td>';
            tr += '<td>'+o.receiveName+':'+o.receivePhone+'</td>';
            tr += '<td style="color:green">'+o.receiveAddress+'</td>';
            tr += '<td>'+o.operator+':'+o.operatorPhone+'</td>';
            tr += '<td>';
            if(o.hasOwnProperty('photo')){
                for(k=0;k<o.photo.length;k++){
                    tr+='<a href="http://localhost:8080/ipfs/'+o.photo[k]+'"target="view_window">物件图 '+k +' </a>'
                }
            }else{
                tr+='照片不存在'
            };
            tr += '</td>';
            tr += '<td  style="color:green">'+o.remark+'</td>';
            tr += '<td>XXX</td>';
            tr += '</tr>';
            $('#resultList2 tbody').append(tr);
        });
           
    }else{
        alert('获取失败，请核对输入信息');
    }
    $('#loading_imgs2').hide();
    });
}
function search(){
    var assertId = $('input[name=assertId]').val();
    $.get('/dairyfarm/gethistory',{'assertId':assertId},function(result){
        $('#resultList tbody').empty();
        if(result.success){
         
        $.each(result.result,function(i,o){
            var tr = '<tr>';
            tr += '<td>'+(i+1)+'</td>';
            tr += '<td style="color:green">'+o.MsgDate.Type+'</td>';
            tr += '<td>'+o.MsgDate.assertId+'</td>';
            tr += '<td style="color:green">'+o.MsgDate.place+'</td>';
            tr += '<td>'+o.MsgDate.senderCustomer+':'+o.MsgDate.senderPhone+'</td>';
            tr += '<td style="color:green">'+o.MsgDate.senderAddress+'</td>';
            tr += '<td>'+o.MsgDate.guaranteeMoney+'</td>';
            tr += '<td style="color:green">'+o.TxId.substring(0,10)+'*****</td>';
            tr += '<td>'+o.MsgDate.receiveName+':'+o.MsgDate.receivePhone+'</td>';
            tr += '<td style="color:green">'+o.MsgDate.receiveAddress+'</td>';
            tr += '<td>'+o.MsgDate.operator+':'+o.MsgDate.operatorPhone+'</td>';
            tr += '<td>';
            if(o.MsgDate.photo!=null){
                for(k=0;k<o.MsgDate.photo.length;k++){
                    tr+='<a href="http://localhost:8080/ipfs/'+o.MsgDate.photo[k]+'"target="view_window">物件图 '+k +' </a>'
                }
            }else{
                tr+='照片不存在'
            };
            tr += '</td>';
            tr += '<td  style="color:green">'+o.MsgDate.remark+'</td>';
            tr += '<td>'+o.TxTime+'</td>';
            tr += '</tr>';
            $('#resultList tbody').append(tr);
        });
           
    }else{
        alert('获取失败，请核对输入信息');
    }
    $('#loading_imgs').hide();
    });
}
async function input(){

    $('#inputBtn').attr('disabled','disabled');
    var paramarr=$('#inputForm').serializeArray();
    var input=$('input[name=photo]')[0];
    var files = input.files;
    var formData = new FormData(); 
    for(i=0;i<files.length;i++){
        formData.append('photo', files[i]);
    }
    for(i=0;i<paramarr.length;i++){
        formData.append(paramarr[i].name, paramarr[i].value);
    }
    $.ajax({
        url: '/dairyfarm/putvalue',
        type: 'POST',
        cache: false, //上传文件不需要缓存
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function (result) {
            if(result.success){
                        alert('录入成功');
                        $('#inputForm')[0].reset();
                        $('#inputBtn').removeAttr('disabled');
            }else{
                        alert('录入失败');
                        $('#inputBtn').removeAttr('disabled');
            }
                
        }
    });
    
}
