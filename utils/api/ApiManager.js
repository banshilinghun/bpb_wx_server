
/**
 * API 接口管理
 */
const domainAttr = ['release', 'release2', 'test', 'debug']
//api 1
const domain = domainAttr[3];//1

let domainStrategy = {
  release: function(){
    return 'https://wxapi.benpaobao.com/';
  },
  release2: function(){
    return 'https://wxapi2.benpaobao.com/';
  },
  test: function(){
    return 'https://adapi.benpaobao.com/';
  },
  debug: function(){
    return 'http://192.168.2.172:8000/';
  }
}

/**
 * 加载域名
 */
function getBaseUrl() {
  console.log('domin--------->' + domainStrategy[domain]());
  return domainStrategy[domain]();
}

class uploadInfo {
  constructor(object) {
    this.url = object.url;
    this.filePath = object.filePath;
    this.fileName = object.fileName;
    this.formData = object.formData;
    this.success = object.success;
    this.fail = object.fail;
    this.complete = object.complete;
  }
}

class requestInfo {
  constructor(object) {
    this.url = object.url;
    this.data = object.data;
    this.success = object.success;
    this.fail = object.fail;
    this.complete = object.complete;
  }
}

/**
 * 上传文件 uploadInfo为 uploadInfo class 对象
 */
function uploadFile(uploadInfo) {
  if (!uploadInfo) {
    return;
  }
  wx.uploadFile({
    url: uploadInfo.url,
    filePath: uploadInfo.filePath,
    name: uploadInfo.fileName,
    formData: uploadInfo.formData,
    header: getApp().globalData.header,
    success: function (res) {
      if (res.statusCode == 200) {
        let dataBean = res.data;
        //json格式错误，解析对象失败，这时候手动parse
        if (typeof (dataBean) == 'string') {
          dataBean = JSON.parse(dataBean);
        }
        if (dataBean.code == 1000) {
          uploadInfo.success && uploadInfo.success(dataBean.data);
        } else {
          showModel(res.data.msg);
          uploadInfo.fail && uploadInfo.fail(res);
        }
      } else {
        uploadInfo.fail && uploadInfo.fail(res);
        showModel(res.data.msg);
      }
    },

    fail: function (res) {
      uploadInfo.fail && uploadInfo.fail(res);
      showModel();
    },

    complete: function (res) {
      uploadInfo.complete && uploadInfo.complete(res);
    }
  })
}

/**
 * request请求 requestInfo为 requestInfo class 对象
 */
function sendRequest(requestInfo) {
  if (!requestInfo) {
    return;
  }
  console.log(getApp().globalData.header);
  wx.request({
    url: requestInfo.url,
    data: requestInfo.data,
    header: getApp().globalData.header,
    success: function (res) {
      if (res.statusCode == 200) {
        let dataBean = res.data;
        //json格式错误，解析对象失败，这时候手动parse
        if (typeof (dataBean) == 'string') {
          dataBean = JSON.parse(dataBean);
        }
        if (dataBean.code == 1000) {
          requestInfo.success && requestInfo.success(dataBean.data);
        } else {
          showModel(res.data.msg);
          requestInfo.fail && requestInfo.fail(res);
        }
      } else {
        requestInfo.fail && requestInfo.fail(res);
        showModel(res.data.msg);
      }
    },

    fail: function (res) {
      requestInfo.fail && requestInfo.fail(res);
      showModel();
    },

    complete: function (res) {
      requestInfo.complete && requestInfo.complete(res);
    }
  })
}

function showModel(content) {
  if (!content) {
    content = '✈️服务器开小差了🌔\n\r~~~~(>_<)~~~~';
  }
  wx.showModal({
    content: content,
    showCancel: false
  })
}

module.exports = {
  getBaseUrl: getBaseUrl,
  uploadFile: uploadFile,
  uploadInfo: uploadInfo,
  sendRequest: sendRequest,
  requestInfo: requestInfo,
}