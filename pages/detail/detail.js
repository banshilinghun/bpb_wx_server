const viewUtil = require("../../utils/common/viewUtil.js");
const DetailHelper = require("../../helper/DetailHelper.js");
const LoadingHelper = require("../../helper/LoadingHelper.js");
const ModalHelper = require('../../helper/ModalHelper')
const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require('../../utils/api/ApiConst');

let timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    designList: [],
    scrollHeight: 0,
    time_process: '00:00',
    minute: 0,
    second: 0,
    detailInfo: null,
    reserve_id: '',
    operation: 'BEGIN', //操作类型
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
    that.setData({
      reserve_id: options.reserve_id
    })
    that.requestInstallDetail();
  },

  requestInstallDetail() {
    const that = this;
    LoadingHelper.showLoading();
    let requestData = {
      url: ApiConst.QUERY_RESERVE_DETAIL_INFO,
      data: {
        reserve_id: that.data.reserve_id
      },
      success: res => {
        //广告效果图
        that.formatDesignList(res);
        //预约状态
        res.reserveStatus = DetailHelper.getSubscribeStatus(res.status);
        that.setData({
          detailInfo: res,
          designList: res.design_list,
          operation: res.install_info ? 'END' : 'BEGIN'
        })
        //安装中，继续计时
        if (res.install_info) {
          if (!res.install_info.end_time) {
            that.initTimer(res.install_info.begin_time);
          } else {
            that.setInstallTime(res.install_info.end_time - res.install_info.begin_time);
          }
        }
        that.setDesignImageHeight();
      },
      complete: res => {
        LoadingHelper.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  formatDesignList(res) {
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
  },

  setDesignImageHeight() {
    let that = this;
    viewUtil.getViewHeight("#effect-image").then(rect => {
      console.log(rect);
      that.setData({
        designHeight: rect.width * 9 / 16
      })
    })
  },

  initTimer(begin_time) {
    let nowTime = new Date().getTime();
    let startTime = Math.floor(nowTime / 1000 - begin_time);
    this.setInstallTime(startTime);
    this.startTimer(startTime);
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
    const that = this;
    if(Number(that.data.detailInfo.status) === 0){
      ModalHelper.showWxModal('提示', "车主还未签到，暂不能开始安装", "我知道了", false);
      return;
    }
    //把安装完成过滤
    if (that.data.operation === 'END' && that.data.detailInfo.install_info.end_time) {
      return;
    }
    if (that.data.operation === 'END') {
      ModalHelper.showWxModalShowAllWidthCallback('结束安装提示', `车牌号: ${ that.data.detailInfo.plate_no }\n确认该车辆已经安装完毕吗？`, '结束安装', '继续安装', true, res => {
        if (res.confirm) {
          clearInterval(timer);
          that.commitInstallRequest();
        }
      })
    } else {
      ModalHelper.showWxModalUseConfirm('开始安装提示', '确定准备好开始安装吗？', '开始安装', true, res => {
        if (res.confirm) {
          that.commitInstallRequest();
        }
      })
    }
  },

  commitInstallRequest() {
    const that = this;
    LoadingHelper.showLoading();
    let requestData = {
      url: ApiConst.COMMIT_RESERVE_INSTALL,
      data: {
        reserve_id: that.data.detailInfo.reserve_id,
        operation: that.data.operation
      },
      success: res => {
        if (that.data.operation === 'BEGIN') {
          that.setData({
            operation: 'END'
          })
          that.startTimer(0);
          that.requestInstallDetail();
        } else {
          that.endInstall();
        }
      },
      complete: res => {
        LoadingHelper.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  startTimer(start_time) {
    //开始计时
    const that = this;
    timer = setInterval(() => {
      start_time++;
      that.setInstallTime(start_time);
    }, 1000);
  },

  setInstallTime(time) {
    let that = this;
    let minute = Math.floor(time / 60);
    let second = time % 60;
    that.setData({
      minute: minute,
      second: second,
      time_process: that.fixedTwoNumber(minute) + ":" + that.fixedTwoNumber(second)
    })
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
    let totalInstallTip = `本次安装共用时: ${ that.data.minute  }分${ that.data.second }秒！`;
    ModalHelper.showWxModalUseConfirm('安装完成', totalInstallTip, '我知道了', false, res => {
      wx.switchTab({
        url: '../register/register'
      })
    });
  },

  callPhoneListener: function(event) {
    console.log(event);
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone
    })
  },
})