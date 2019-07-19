;
! function() {
	var layer = layui.layer,
		form = layui.form;

	// 当勾选不同意协议按钮后禁止注册
//	form.on("checkbox(agreen-checkbox)", function(data) {
//		if(!data.elem.checked) {
//			$("#reg").addClass("layui-btn-disabled");
//			$("#reg").prop("disabled", "disabled");
//		} else {
//			$("#reg").removeClass("layui-btn-disabled");
//			$("#reg").removeAttr("disabled");
//		}
//	});

	// 验证码值存储变量
	var vailCode;

	// 发送短信验证码
	var InterValObj; // 定时器变量
	var count = 60; // 间隔函数，1秒执行
	var curCount; // 当前剩余秒数
	var msg_send_count = 0;
	// 发送验证码
	$(document).on('click','#msg-btn',function(){
		if($(this).prop("disabled") != "disabled") {
			if(!/^1[34578]\d{9}$/.test($("#phone").val())) {
				layer.msg("请先输入正确的手机号", {
					icon: 5
				});
				return false;
			}
			
			if($("#password").val().length<8){
				layer.msg("密码长度不能少于8位", {
					icon: 5
				});
				return false;
			}
			if(!/^(\w){8,20}$/.test($("#password").val())){
				layer.msg("密码只能包含字母、数字或下划线", {
					icon: 5
				});
				return false;
			}
			if($("#password-confirm").val() != $("#password").val()){
				layer.msg("两次输入的密码不一致", {
					icon: 5
				});
				return false;
			}
			
			msg_send_count++;
			curCount = count;
			// 设置button效果，开始计时
			$("#msg-btn").addClass("layui-btn-disabled");
			$("#msg-btn").prop("disabled", "disabled"); // 设置按钮为禁用状态
			$("#msg-btn").text("正在发送..."); // 更改按钮文字
			// 向后台发送处理数据
			$.ajax({
				url: $("#ctx").val()+"bd/member/sendSMS",
				type: "post",
				data: {
					"account": $("#phone").val(),
					"type": "register",
					"code":$("#code").val()
				},
				success: function(result) {
					if(result.status) {
						$("#msg-btn").text(curCount + "秒后再次获取"); // 更改按钮文字
						InterValObj = setInterval(SetRemainTime, 1000); // 启动计时器timer处理函数，1秒执行一次
					} else {
						layer.msg(result.message, {
							icon: 5
						});
						msg_send_count = 0;
						$("#msg-btn").text("获取验证码");
						$("#msg-btn").removeClass("layui-btn-disabled");
						$("#msg-btn").prop("disabled", false);// 移除禁用状态改为可用
					}
				}
			});
		}
	});

	// timer处理函数
	function SetRemainTime() {
		if(curCount == 0) {
			clearInterval(InterValObj); // 停止计时器
			$("#msg-btn").removeClass("layui-btn-disabled");
			$("#msg-btn").removeAttr("disabled"); // 移除禁用状态改为可用
			$("#msg-btn").text("重新发送验证码");
		} else {
			curCount--;
			$("#msg-btn").text(curCount + "秒后再次获取");
		}
	}


	// 自定义验证规则
	form.verify({
		pwd: function(value) {
			if(value.length < 8) {
				return "密码长度不能少于8位";
			} else if(!/^(\w){8,20}$/.test(value)) {
				return "密码只能包含字母、数字或下划线";
			}
		},
		rePwd: function(value) {
			if(value != $("#password").val()) {
				return "两次输入的密码不一致";
			}
		},
		msgcode: function(value) {
			if(value.trim().length != 6) {
				return "短信验证码错误";
			} else if(msg_send_count == 0) {
				return "请点击获取验证码";
			}
		}
	});

	//监听提交  
	form.on("submit(register)", function() {
	    if(msg_send_count == 0) {
			layer.msg("请点击获取验证码");
		} else {
			$.ajax({
				url: $("#ctx").val()+"bd/member/regUser",
				type: "post",
				data: {
					"phone": $("#phone").val(),
					"code":$("#code").val(),
					"password": $("#password").val(),
					"ms_code":$("#msg-code").val()
				},
				success: function(result) {
					if(result.status) {
						layer.msg("注册成功", {
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