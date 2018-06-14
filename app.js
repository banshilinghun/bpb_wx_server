//app.js
const app = getApp()
//app.userInfo={};
App({
	onLaunch: function() {
		
	},
	globalData: {
		userInfo: null,
    //服务网点id
    server_id: '0', 
    //baseUrl: 'http://192.168.1.141:8000/',
    baseUrl:'https://wxapi.benpaobao.com/',
    //baseUrl: 'https://wxapi2.benpaobao.com/',
	}
})