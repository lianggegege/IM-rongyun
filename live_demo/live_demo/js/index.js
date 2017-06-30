
//获取信息；
//$.ajax({
//	type:"get",
//	url:"http://api.yiketalks.com/V3/Live/play",
//	async:true,
//	success:function(data){
//		console.log(data);
//		var token=data.content.liveToken;
//		localStorage.setItem("token",token);
//	},
//	error:function(){
//		
//	}
//});
var isOk = false;
var demo = new Object;
//初始化
RongIMLib.RongIMClient.init('pvxdm17jpgqvr');
//var token=localStorage.getItem("token");
var token = "133k0yULVVvSJZRqinP7SFPTrLSTFCKjWvTWmlIFKdCsHAmcLtiLQo/JhMidRGTcRW4NYGv9eK9QfvmZ3qvbrg==";
//自定义消息类型
RongIMClient.registerMessageType("PersonMessage", "s:person", new RongIMLib.MessageTag(true, true), ["name", "age"]);
//进入直播间消息注册
RongIMClient.registerMessageType("welcome", "welcome", new RongIMLib.MessageTag(false, false), ['user']);
//初始化表情包
RongIMLib.RongIMEmoji.init();
//获取全部表情；
var emojis = RongIMLib.RongIMEmoji.emojis;
$("#bQ").html(emojis);
// 连接融云服务器。
RongIMClient.connect(token, {
	onSuccess: function(userId) {
		console.log("Login successfully." + userId);
		isOk = true;
		//加入聊天室；
		demo.joinChatRoot();
		//获取聊天室信息
		demo.getCRMessage();
	},
	onTokenIncorrect: function() {
		console.log('token无效');
	},
	onError: function(errorCode) {
		var info = '';
		switch(errorCode) {
			case RongIMLib.ErrorCode.TIMEOUT:
				info = '超时';
				break;
			case RongIMLib.ErrorCode.UNKNOWN_ERROR:
				info = '未知错误';
				break;
			case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
				info = '不可接受的协议版本';
				break;
			case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
				info = 'appkey不正确';
				break;
			case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
				info = '服务器不可用';
				break;
		}
		console.log(errorCode);
	}
});
// 设置连接监听状态 （ status 标识当前连接状态）
// 连接状态监听器
RongIMClient.setConnectionStatusListener({
	onChanged: function(status) {
		switch(status) {
			//链接成功
			case RongIMLib.ConnectionStatus.CONNECTED:
				console.log('链接成功');
				break;
				//正在链接
			case RongIMLib.ConnectionStatus.CONNECTING:
				console.log('正在链接');
				break;
				//重新链接
			case RongIMLib.ConnectionStatus.DISCONNECTED:
				console.log('断开连接');
				break;
				//其他设备登陆
			case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
				console.log('其他设备登陆');
				break;
				//网络不可用
			case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
				console.log('网络不可用');
				break;
		}
	}
});
//创建消息列表；
demo.createMessage = function(receive) {
	var html = "<li>小李子：<span>" + receive + "</span></li>"
	$("#container").append(html);
	if($('#container')[0].scrollHeight) {
		$('#container').scrollTop($('#container')[0].scrollHeight);
	}
}
//创建礼物；
demo.createGift = function(receive) {
	var html = "<li class='active'>我送了个<span>" + receive + "</span></li>"
	$("#live_gift").append(html);
	if($("#live_gift").find("li").hasClass("active")){
		$("#live_gift").find("li.active").animate({"width":"150px"},"slow");
	}
	if($('#live_gift')[0].scrollHeight) {
		$('#live_gift').scrollTop($('#live_gift')[0].scrollHeight);
	}
}
// 消息监听器
RongIMClient.setOnReceiveMessageListener({
	// 接收到的消息
	onReceived: function(message) {
		//超出50条删除前边的；
		if($("#container").find("li").length > 50) {
			var eq = parseInt($("#container").find("li").length) - 49;
			$("#container").find("li").eq(eq).prevAll().remove();
		}
		if($("#live_gift").find("li").length > 1) {
			var eq = parseInt($("#live_gift").find("li").length);
			$("#live_gift").find("li").eq(eq).prevAll().remove();
		}		
		//		console.log(message);
		// 判断消息类型
		switch(message.messageType) {
			case RongIMClient.MessageType.TextMessage:
				//				console.log(message.content.content);
				if(message.content.content) {
					var receive = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content);
					demo.createMessage(receive);
				} else {
					var receive = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content);
					demo.createMessage("发表内容为空");
				}
				//发送的消息内容将会被打印
				break;
				//自定义的消息
			case RongIMClient.MessageType.PersonMessage:
				var receive = message.content.name;
				demo.createGift(receive);
				//移除动画
				if($("#live_gift").find("li").hasClass("active")) {
					$("#live_gift").find("li.active").removeClass("active");
				}
				setTimeout(function(){
					$("#live_gift").find("li").remove();
				},1000)
				//dosomething...
			case RongIMClient.MessageType.ImageMessage:
				// do something...
				break;
			case RongIMClient.MessageType.welcome:
				console.log(message.content.user);
				if(message.content.user) {
					var html = "<li>" + message.content.user.name + "进入了直播间</li>"
					$("#container").append(html);
					if($('#container')[0].scrollHeight) {
						$('#container').scrollTop($('#container')[0].scrollHeight);
					}
				}
				// do something...
				break;
			case RongIMClient.MessageType.DiscussionNotificationMessage:
				// do something...
				break;
			case RongIMClient.MessageType.LocationMessage:
				// do something...
				break;
			case RongIMClient.MessageType.RichContentMessage:
				// do something...
				break;
			case RongIMClient.MessageType.DiscussionNotificationMessage:
				// do something...
				break;
			case RongIMClient.MessageType.InformationNotificationMessage:
				// do something...
				break;
			case RongIMClient.MessageType.ContactNotificationMessage:
				// do something...
				break;
			case RongIMClient.MessageType.ProfileNotificationMessage:
				// do something...
				break;
			case RongIMClient.MessageType.CommandNotificationMessage:
				// do something...
				break;
			case RongIMClient.MessageType.CommandMessage:
				// do something...
				break;
			case RongIMClient.MessageType.UnknownMessage:

				// do something...
				break;
			case RongIMClient.MessageType.RegisterMessage:
				console.log("自定义");
			default:
				// 自定义消息
				// do something...               
		}
	}
});
//发送消息
demo.sendMessage = function() {
	// 定义消息类型,文字消息使用 RongIMLib.TextMessage
	var str1 = $("#message").val();
	//区分设备文字转化成表情；
	if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
		var str = RongIMLib.RongIMEmoji.symbolToEmoji(str1);
		str1 = str1;
	} else if(/(Android)/i.test(navigator.userAgent)) { //判断Android
		var str = str1;
		str1 = RongIMLib.RongIMEmoji.emojiToSymbol(str1);
	} else { //pc
		var str = str1;
		str1 = RongIMLib.RongIMEmoji.emojiToSymbol(str1);
	};
	demo.createMessage(str);
	var msg = new RongIMLib.TextMessage({
		content: str1,
		extra: "附加信息"
	});
	//或者使用RongIMLib.TextMessage.obtain 方法.具体使用请参见文档
	//var msg = RongIMLib.TextMessage.obtain("hello");
	var conversationtype = 4; // 聊天室
	var targetId = "7"; // 目标 Id
	RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
		// 发送消息成功
		onSuccess: function(message) {
			//message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
			console.log("Send successfully");
		},
		onError: function(errorCode, message) {
			var info = '';
			switch(errorCode) {
				case RongIMLib.ErrorCode.TIMEOUT:
					info = '超时';
					break;
				case RongIMLib.ErrorCode.UNKNOWN_ERROR:
					info = '未知错误';
					break;
				case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
					info = '在黑名单中，无法向对方发送消息';
					break;
				case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
					info = '不在讨论组中';
					break;
				case RongIMLib.ErrorCode.NOT_IN_GROUP:
					info = '不在群组中';
					break;
				case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
					info = '不在聊天室中';
					break;
				default:
					info = x;
					break;
			}
			console.log('发送失败:' + info);
		}
	});
}
//自定义消息类型；
demo.userDefined = function(gift) {
	if($('#live_gift')[0].scrollHeight) {
		$('#live_gift').scrollTop($('#live_gift')[0].scrollHeight);
	}	
	demo.createGift(gift);
	//发送消息；
	var conversationType = 4; //聊天室,其他会话选择相应的消息类型即可。
	var targetId = "7"; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
	var msg = new RongIMClient.RegisterMessage.PersonMessage({
		name: gift,
		age: 12
	});
	RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
		onSuccess: function(message) {
			console.log("自定义消息发送成功");
			console.log(message);
		},
		onError: function(errorCode) {
			console.log(errorCode);
		}
	});
	//接收消息
	//接收消息与其他内置消息一致，在上文中提到的 setOnReceiveMessageListener 中增加 case 将消息予以展示即可。例如：case RongIMClient.MessageType.RegisterMessage : dosomething...
}
//加入聊天室
demo.joinChatRoot = function() {
	var chatRoomId = "7"; // 聊天室 Id。
	var count = 10; // 拉取最近聊天最多 50 条。
	RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
		onSuccess: function() {
			// 加入聊天室成功。
			console.log("加入聊天室成功");
		},
		onError: function(error) {
			console.log("加入聊天室失败");
		}
	});
}
//退出聊天室；
demo.exitChatRoot = function() {
	var chatRoomId = "7"; // 聊天室 Id。
	RongIMClient.getInstance().quitChatRoom(chatRoomId, {
		onSuccess: function() {
			// 退出聊天室成功。
		},
		onError: function(error) {
			// 退出聊天室失败。
		}
	});
}
//获取聊天室信息
demo.getCRMessage = function() {
	var chatRoomId = "7"; // 聊天室 Id。
	var count = 10; // 获取聊天室人数 （范围 0-20 ）
	var order = RongIMLib.GetChatRoomType.REVERSE; // 排序方式。

	RongIMClient.getInstance().getChatRoomInfo(chatRoomId, count, order, {
		onSuccess: function(chatRoom) {
			console.log(chatRoom.userInfos);// chatRoom.userInfos => 返回聊天室成员。
			console.log(chatRoom.userTotalNums);// chatRoom.userTotalNums => 当前聊天室总人数。
			// chatRoom => 聊天室信息。			
		},
		onError: function(error) {
			// 获取聊天室信息失败。
			console.log(error);
		}
	});
}
demo.is_weixn = function() { //判断是不是微信端
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		demo.share();
	} else {
		return false;
	}
}
demo.share = function() {
		$.ajax({
			type: "get",
			url: "http://api.yiketalks.com/share/sharesign",
			data: {
				"url": encodeURIComponent(location.href.split('#')[0])
			},
			async: true,
			dataType: 'json',
			success: function(data) {
				var wxObj = data.content;
				wx.config({
					debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: wxObj.appId, // 必填，公众号的唯一标识
					timestamp: wxObj.timestamp, // 必填，生成签名的时间戳
					nonceStr: wxObj.nonceStr, // 必填，生成签名的随机串
					signature: wxObj.signature, // 必填，签名，见附录1
					jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline", "onMenuShareQQ", "onMenuShareQZone", "onMenuShareWeibo"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				wx.ready(function() {
					function fenxiang() {
						var fenxiang = {
							title: "你丑你先睡，我美我直播", // 分享标题		
							link: 'http://m.yiketalks.com/html/enroll3.html?id=',
							desc: "激发正见与正念，连接思想与创，见表达创见 、分享新知、 探索乐趣！",
							imgUrl: "http://m.yiketalks.com/img/share.jpg" // 分享图标				
						}
						return fenxiang;
					}
					//分享给朋友
					wx.onMenuShareAppMessage(
						fenxiang()
					);
					//分享到朋友圈
					wx.onMenuShareTimeline({
						title: tit, // 分享标题		
						link: 'http://m.yiketalks.com/html/enroll3.html?id=',
						imgUrl: "http://m.yiketalks.com/img/share.jpg" // 分享图标						
					});
					//分享到qq		
					wx.onMenuShareQQ(
						fenxiang()
					);
					//分享到qq空间
					wx.onMenuShareQZone(
						fenxiang()
					);
					//分享到微博
					wx.onMenuShareWeibo(
						fenxiang()
					);
				})
			}
		});
}
// 获取聊天室历史信息
//demo.getLatestChatRoomMessages=function(room_id){
//}
//微信自定义分享
demo.is_weixn();
//显示表情
$("#message").focus(function() {
	$("#bQ").css("display", "block");
})
//输入表情
$("#bQ").find("span").on("click", function() {
	var bq = $(this).attr('name');
	//文字转化成表情；
	//区分设备；
	if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
	} else if(/(Android)/i.test(navigator.userAgent)) { //判断Android
		bq = RongIMLib.RongIMEmoji.symbolToEmoji(bq);
	} else { //pc
		bq = RongIMLib.RongIMEmoji.symbolToEmoji(bq);
	};
	$("#message").val($("#message").val() + bq);
	$("#bQ").css("display", "none");
	return false;
});
//发送消息
$("#send").on("click", function() {
	if(!!isOk) {
		//发送消息
		demo.sendMessage();
		$("#message").val("");
		$("#message").focus();
	}
});
//发送礼物；
$("#sendGift").find("li").on("click", function() {
	var gift = $(this).attr("data-gift");
	console.log(gift);
	//自定义消息类型；
	demo.userDefined(gift);
})
//点击播放
$(".play_icon").bind("click", function() {
	$(this).css({
		"display": "none"
	});
	if($("#video").hasClass('play')) {
		$("#video").trigger("pause");
		$("#video").removeClass('play');
		$("#video").addClass('pause');
	} else {
		$("#video").trigger("play");
		$("#video").removeClass('pause');
		$("#video").addClass('play');
	}
});