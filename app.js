//app.js
const app = getApp()
//切换域名
const release = false;
const releaseDemain = 'https://wxapi.benpaobao.com/'

App({
	onLaunch: function() {
    this.globalData.baseUrl = this.getBaseUrl();
	},
	globalData: {
		userInfo: null,
    //服务网点id
    server_id: '0', 
    baseUrl: releaseDemain,
	},

  getBaseUrl: function(){
    if(release){
      return 'https://wxapi.benpaobao.com/';
    }else{
      return 'https://wxapi2.benpaobao.com/';
    }
  }
})