$(function(){
    $('#loading_imgs3').hide();
    $('#loading_imgs2').hide();
    $('#toSearch').click(function(){
        $(this).addClass('active');
        $('#toSearchByPhone').removeClass('active');
        $('#searchDiv').show();
        $('#toSearchByPhoneDiv').hide();
        $('.breadcrumb li.active').text('根据订单号查询历史数据');
    });
    $('#toSearchByPhone').click(function(){
        $(this).addClass('active');
        $('#toSearch').removeClass('active');
        $('#toSearchByPhoneDiv').show();
        $('#searchDiv').hide();
        $('.breadcrumb li.active').text('根据手机号查询所有物流');
    });

    $('#searchBtn').click(function(){ //查询数据
        $('#loading_imgs3').show();
        search();
    });
    $('#searchBtnByPhone').click(function(){ //查询数据
        $('#loading_imgs2').show();
        searchByPhone();
    });

})
function searchByPhone(){
    var phoneNumber = $('input[name=phoneNumber]').val();
    $.get('/salesterminal/getvalue',{'phoneNumber':phoneNumber},function(result){
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
    $.get('/salesterminal/gethistory',{'assertId':assertId},function(result){
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
            console.log(o.MsgDate.photo);
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
    $('#loading_imgs3').hide();

    });
}