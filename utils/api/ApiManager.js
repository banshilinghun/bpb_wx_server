
/**
 * API 接口管理
 */
const domainAttr = ['release', 'release2', 'debug']
const domain = domainAttr[1];//1

const releaseDomain = 'https://wxapi.benpaobao.com/';
const releaseDomain2 = 'https://wxapi2.benpaobao.com/';
const debugDomain = 'http://192.168.1.142:8000/';

/**
 * 加载域名
 */
function getBaseUrl() {
  switch (domain) {
    case domainAttr[0]:
      return releaseDomain;
    case domainAttr[1]:
      return releaseDomain2;
    case domainAttr[2]:
      return debugDomain;
    default:
      return releaseDomain;
  }
}

/**
 * 广告教程列表
 */
function getGuideUrl() {
  return getBaseUrl() + 'server/query/query_ad_course';
}

/**
 * 登录
 */
function getLoginUrl() {
  return getBaseUrl() + 'server/user/login';
}

/**
 * 查询车牌号
 */
function getSearchUrl() {
  return getBaseUrl() + 'server/query/user_info';
}

/**
 * 预约列表
 */
function getSubscribeUrl() {
  return getBaseUrl() + 'server/query/server_subscribe';
}

/**
 * 登记列表
 */
function getActiveUrl() {
  return getBaseUrl() + 'server/query/server_regist';
}

/**
 * 普通登记上传图片
 */
function getUploadUrl() {
  return getBaseUrl() + 'server/upload/ad_image';
}

/**
 * 普通登记确认
 */
function getConfirmUrl() {
  return getBaseUrl() + 'server/upload/ad_regist_info';
}

/**
 * 普通检测
 */
function getCheckInfoUrl() {
  return getBaseUrl() + 'server/upload/ad_check_info';
}

/**
 * 全租上传图片
 */
function getLeaseUploadUrl() {
  return getBaseUrl() + 'leaseServer/upload/regist_img';
}

/**
 * 全租确认登记
 */
function getLeaseConfirmUrl() {
  return getBaseUrl() + 'leaseServer/commit/regist_info';
}

/**
 * 全租检测
 */
function getLeaseCheckInfoUrl() {
  return getBaseUrl() + 'leaseServer/commit/check_info';
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
      showModel(res.data.msg);
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
  wx.request({
    url: requestInfo.url,
    data: requestInfo.data,
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
      showModel(res.data.msg);
    },

    complete: function (res) {
      requestInfo.complete && requestInfo.complete(res);
    }
  })
}

function showModel(content) {
  if (content == null) {
    content = '✈️服务器开小差了🌔\n\r~~~~(>_<)~~~~';
  } else {
    content = dataBean.msg;
  }
  wx.showModal({
    content: content,
    showCancel: false
  })
}

module.exports = {
  getGuideUrl: getGuideUrl,
  uploadFile: uploadFile,
  uploadInfo: uploadInfo,
  sendRequest: sendRequest,
  requestInfo: requestInfo,
  getLoginUrl: getLoginUrl,
  getSearchUrl: getSearchUrl,
  getUploadUrl: getUploadUrl,
  getConfirmUrl: getConfirmUrl,
  getSubscribeUrl: getSubscribeUrl,
  getActiveUrl: getActiveUrl,
  getLeaseUploadUrl: getLeaseUploadUrl,
  getLeaseConfirmUrl: getLeaseConfirmUrl,
  getCheckInfoUrl: getCheckInfoUrl,
  getLeaseCheckInfoUrl: getLeaseCheckInfoUrl
}