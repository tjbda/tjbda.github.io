$(document).ready(function() {
       if($("#login").val() != ""){
    	   if (window != top) {top.location.href = location.href; }
    	   showBox();
       }
});

function deleteFilter(){
	var register_box=document.getElementById("register_box");
	var forget_box=document.getElementById("forget_box");
	var login_box=document.getElementById("login_box");
	
	var bg_reg_filter=document.getElementById("bg_reg_filter");
	var bg_forget_filter=document.getElementById("bg_forget_filter");
	var bg_filter=document.getElementById("bg_filter");
	
	register_box.style.display="none";
	forget_box.style.display="none";
	login_box.style.display="none";
	
	bg_reg_filter.style.display="none";
	bg_forget_filter.style.display="none";
	bg_filter.style.display="none";
}

function showBox(){
	deleteFilter();
	myReload();
	var show=document.getElementById("login_box");
	var bg_filter=document.getElementById("bg_filter");
	show.style.display="block";
	bg_filter.style.display="block";
}


function showRegister(){
	deleteFilter();
	myRegisterReload();
	var show=document.getElementById("register_box");
	var bg_reg_filter=document.getElementById("bg_reg_filter");
	bg_reg_filter.style.display="block";
	show.style.display="block";
}




function showForget(){
	deleteFilter();
	myForgetReload();
	var show=document.getElementById("forget_box");
	var bg_reg_filter=document.getElementById("bg_forget_filter");
	bg_reg_filter.style.display="block";
	show.style.display="block";
}


function ajaxLogin(){
	if($("#username").val() == ""){
		layer.msg("请填写用户名", {
			icon: 5
		});
	}else if($("#userpwd").val() == ""){
		layer.msg("请填写密码", {
			icon: 5
		});
	}else if($("#validcode").val() == ""){
		layer.msg("请填写验证码", {
			icon: 5
		});
	}else{
		$.post($("#ctx").val()+"bd/member/loginAjax",{"loginname":$("#username").val(),"password":$("#userpwd").val(),"validcode":$("#validcode").val()},function(data){
			if(data.status==true){
					$("#login-error").html("");
					$("form[name=loginForm]").submit();
			}else{
				layer.msg(data.message, {
					icon: 5
				});
			}
		},"json");
	}
}
