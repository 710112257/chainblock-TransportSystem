$('#login-button').click(function (event) {
	var paramarr=$('.formlogin').serialize();
	$.ajax({
        url: '/salesterminal/login',
        type: 'POST',
        data: paramarr,
        success: function (result) {
            if(result.success){
				//event.preventDefault();
				$('form').fadeOut(500);
				//$('.wrapper').addClass('form-success');
				setTimeout(function(){
					window.location.href="./salesterminal.html";
				},2000);
            }else{
                alert("Wrong Password");
            }
        }
    });
});

function requestFullScreen(element) {
	var element=document.documentElement;
	var requestMethod = element.requestFullScreen || //W3C
	element.webkitRequestFullScreen || //Chrome等
	element.mozRequestFullScreen || //FireFox
	element.msRequestFullScreen; //IE11
	if (requestMethod) {
		requestMethod.call(element);
	}
	else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
		 wscript.SendKeys("{F11}");
		}
	}
}
