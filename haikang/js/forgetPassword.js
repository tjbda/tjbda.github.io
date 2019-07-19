;
! function() {
	var layer = layui.layer,
		form = layui.form;

	// 发送短信验证码
	var InterValObj_forget; // 定时器变量
	var count_forget = 60; // 间隔函数，1秒执行
	var curCount_forget; // 当前剩余秒数
	var msg_send_count_forget = 0;
	// 发送验证码
	$(document).on('click','#msg-btn-forget',function(){
		if($(this).prop("disabled") != "disabled") {
			if(!/^1[34578]\d{9}$/.test($("#phone-forget").val())) {
				layer.msg("请先输入正确的手机号", {
					icon: 5
				});
				return false;
			}
			if($("#password-forget").val().length<8){
				layer.msg("密码长度不能少于8位", {
					icon: 5
				});
				return false;
			}
			if(!/^(\w){8,20}$/.test($("#password-forget").val())){
				layer.msg("密码只能包含字母、数字或下划线", {
					icon: 5
				});
				return false;
			}
			if($("#password-forget-confirm").val() != $("#password-forget").val()){
				layer.msg("两次输入的密码不一致", {
					icon: 5
				});
				return false;
			}
			
			msg_send_count_forget++;
			curCount_forget = count_forget;
			// 设置button效果，开始计时
			$("#msg-btn-forget").addClass("layui-btn-disabled");
			$("#msg-btn-forget").prop("disabled", "disabled"); // 设置按钮为禁用状态
			$("#msg-btn-forget").text("正在发送..."); // 更改按钮文字
			// 向后台发送处理数据
			$.ajax({
				url: $("#ctx").val()+"bd/member/sendSMS",
				type: "post",
				data: {
					"account": $("#phone-forget").val(),
					"type": "forget",
					"code":$("#code-forget").val()
				},
				success: function(result) {
					if(result.status) {
						$("#msg-btn-forget").text(curCount_forget + "秒后再次获取"); // 更改按钮文字
						InterValObj = setInterval(SetRemainTime_forget, 1000); // 启动计时器timer处理函数，1秒执行一次
					} else {
						layer.msg(result.message, {
							icon: 5
						});
						msg_send_count_forget = 0;
						$("#msg-btn-forget").text("获取验证码");
						$("#msg-btn-forget").removeClass("layui-btn-disabled");
						$("#msg-btn-forget").prop("disabled", false);// 移除禁用状态改为可用
					}
				}
			});
		}
	});

	// timer处理函数
	function SetRemainTime_forget() {
		if(curCount_forget == 0) {
			clearInterval(InterValObj_forget); // 停止计时器
			$("#msg-btn-forget").removeClass("layui-btn-disabled");
			$("#msg-btn-forget").removeAttr("disabled"); // 移除禁用状态改为可用
			$("#msg-btn-forget").text("重新发送验证码");
		} else {
			curCount_forget--;
			$("#msg-btn-forget").text(curCount_forget + "秒后再次获取");
		}
	}


	// 自定义验证规则
	form.verify({
		pwd_forget: function(value) {
			if(value.length < 8) {
				return "密码长度不能少于8位";
			} else if(!/^(\w){8,20}$/.test(value)) {
				return "密码只能包含字母、数字或下划线";
			}
		},
		rePwd_forget: function(value) {
			if(value != $("#password-forget").val()) {
				return "两次输入的密码不一致";
			}
		},
		msgcode_forget: function(value) {
			if(value.trim().length != 6) {
				return "短信验证码错误";
			} else if(msg_send_count_forget == 0) {
				return "请点击获取验证码";
			}
		}
	});

	//监听提交  
	form.on("submit(forgetPassword)", function() {
	    if(msg_send_count_forget == 0) {
			layer.msg("请点击获取验证码");
		} else {
			$.ajax({
				url: $("#ctx").val()+"bd/member/forgetUser",
				type: "post",
				data: {
					"phone": $("#phone-forget").val(),
					"code":$("#code-forget").val(),
					"password": $("#password-forget").val(),
					"ms_code":$("#msg-code-forget").val()
				},
				success: function(result) {
					if(result.status) {
						layer.msg("找回成功", {
							icon: 6
						});
						setTimeout("location='"+$("#ctx").val()+"bd/member/index'", 2000);
					} else {
						layer.msg(result.message, {
							icon: 5
						});
					}
				}
			});
		}
		return false;
	});
}();