$(function(){
    $('#loading_imgs').hide();
    $('#loading_imgs2').hide();
    $('#toSearch').click(function(){
        $(this).addClass('active');
        $('#todelDate').removeClass('active');
        $('#toworkers').removeClass('active');
        $('#searchDiv').show();
        $('#delDateDiv').hide();
        $('#workersDiv').hide();
        $('.breadcrumb li.active').text('查询数据');
    });
    $('#todelDate').click(function(){
        $(this).addClass('active');
        $('#toSearch').removeClass('active');
        $('#toworkers').removeClass('active');
        $('#delDateDiv').show();
        $('#searchDiv').hide();
        $('#workersDiv').hide();
        $('.breadcrumb li.active').text('删除订单');
    });
    $('#toworkers').click(function(){
        $(this).addClass('active');
        $('#toSearch').removeClass('active');
        $('#todelDate').removeClass('active');
        $('#workersDiv').show();
        $('#searchDiv').hide();
        $('#delDateDiv').hide();
        $('.breadcrumb li.active').text('人员管理');
    });
    $('#searchBtn').click(function(){ //查询数据
        $('#loading_imgs').show();
        search();
    });
    $('#delDateBtn').click(function(){ //删除订单
        delDate();
    });

})
async function delDate(){
    $('#delDateBtn').attr('disabled','disabled');
    var paramarr=$('#delDateForm').serialize();
    console.log(paramarr);

    $.ajax({
        url: '/salesterminal/delDate',
        type: 'POST',
        cache: false, //上传文件不需要缓存
        data: paramarr,
        success: function (result) {
            if(result.success){
                        alert('删除成功');
                        $('#delDateForm')[0].reset();
                        $('#delDateBtn').removeAttr('disabled');
            }else{
                        alert('删除失败');
                        $('#delDateBtn').removeAttr('disabled');
            }
                
        }
    });
    
}

function search(){
    var assertId = $('#assertId').val();
    $.get('/salesterminal/gethistory',{'assertId':assertId},function(result){
        $('#resultList tbody').empty();
        $.each(result.result,function(i,o){
            console.log(o);
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
        $('#loading_imgs').hide();

    });
}