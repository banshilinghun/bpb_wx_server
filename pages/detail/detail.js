
let timer;
const viewUtil = require("../../utils/common/viewUtil.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    designList: [],
    scrollHeight: 0,
    isInstall: false,
    startTime: 0, //计时开始时间
    time_process: '00:00',
    minute: 0,
    second: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 60
        })
      }
    });
    that.setDesignImageHeight();
  },

  setDesignImageHeight() {
    let that = this;
    viewUtil.getViewHeight("#effect-image").then(rect => {
      that.setData({
        designHeight: rect.width * 9 / 16
      })
    })
  },

  requestInstallDetail() {
    const that = this;
    let requestData = {
      url: ApiConst.QUERY_RESERVE_DETAIL_INFO,
      data: {
        reserve_id: ''
      },
      success: res => {
        //广告效果图
        res.design_list.forEach(element => {
          let effect_list = [];
          let left = {
            img: element.left_img,
            desc: '车身左侧'
          };
          let right = {
            img: element.right_img,
            desc: '车身右侧'
          };
          let inner = {
            img: element.inner_img,
            desc: '车内'
          };
          effect_list.push(left);
          effect_list.push(right);
          effect_list.push(inner);
          //过滤空值
          effect_list = effect_list.filter((item) => {
            return Boolean(item.img.trim()) === true;
          })
          console.log(effect_list);
          element.effect = effect_list;
        });
        that.setData({
          designList: res.design_list
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /** 预览设计效果图 */
  handlePreviewDesign(event) {
    let effect = event.currentTarget.dataset.effect;
    if (!effect || effect.length === 0) {
      return;
    }
    let imageList = [];
    effect.forEach(element => {
      imageList.push(element.img);
    });
    wx.previewImage({
      current: event.currentTarget.dataset.current,
      urls: imageList
    })
  },

  handleInstall() {
    let that = this
    if (!that.data.isInstall) {
      that.startinstall();
    } else {

      that.endInstall();
    }
  },

  /**
   * 开始安装
   */
  startinstall() {
    let that = this;
    that.setData({
      isInstall: true
    });
    //开始计时
    let start_time = that.data.startTime;
    timer = setInterval(() => {
      start_time++;
      let minute = Math.floor(start_time / 60);
      let second = start_time % 60;
      console.log(minute);
      console.log(second);
      that.setData({
        minute: minute,
        second: second,
        time_process: that.fixedTwoNumber(minute) + ":" + that.fixedTwoNumber(second)
      })
    }, 1000);
  },

  /**
   * 取两位
   */
  fixedTwoNumber(param) {
    return String(param).length <= 1 ? "0" + param : param;
  },

  /**
   * 结束安装
   */
  endInstall() {
    let that = this;
    clearInterval(timer);
    setTimeout(() => {
      let totalInstallTip = '本次安装共用时: ' + that.data.minute + '分' + that.data.second + '秒，超过80%的安装次数，继续加油！'
      wx.showModal({
        title: '提示',
        content: totalInstallTip,
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#ff555c',
        success: res => {

        }
      });
    }, 1000);
  }

})