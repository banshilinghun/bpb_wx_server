// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部', '待收货', '待评价'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
        })
      }
    })
  },

  tabClick(e) {
    const { offsetLeft, dataset } = e.currentTarget
    const { id } = dataset

    this.setData({
      sliderOffset: offsetLeft,
      activeIndex: id,
    })
  }

})