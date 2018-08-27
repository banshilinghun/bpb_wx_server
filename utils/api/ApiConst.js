/** api 常量类以及 url 调用 */

let ApiManager = require('../api/ApiManager.js');
let baseUrl = ApiManager.getBaseUrl();


/**
 * 广告教程列表
 */
export const GET_GUIDE_URL = baseUrl + 'server/query/query_ad_course';

/**
 * 登录
 */
export const GET_LOGIN_URL = baseUrl + 'server/user/login';

/**
 * 查询车牌号
 */
export const GET_SEARCH_URL = baseUrl + 'server/query/user_info';

/**
 * 预约列表
 */
export const GET_SUBSCRIBE_URL = baseUrl + 'server/query/server_subscribe';

/**
 * 登记列表
 */
export const GET_ACTIVE_URL = baseUrl + 'server/query/server_regist';

/**
 * 普通登记上传图片
 */
export const GET_UPLOAD_URL = baseUrl + 'server/upload/ad_image';

/**
 * 普通登记确认
 */
export const GET_CONFIRM_URL = baseUrl + 'server/upload/ad_regist_info';

/**
 * 普通检测
 */
export const GET_CHECK_INFO_URL = baseUrl + 'server/upload/ad_check_info';

/**
 * 全租上传图片
 */
export const GET_LEASE_UPLOAD_URL = baseUrl + 'leaseServer/upload/regist_img';

/**
 * 全租确认登记
 */
export const GET_LEASE_CONFIRM_URL = baseUrl + 'leaseServer/commit/regist_info';

/**
 * 全租检测
 */
export const GET_LEASE_CHECK_INFO_URL = baseUrl + 'leaseServer/commit/check_info';

/**
 * 查询车行广告登记统计信息
 */
export const QUERY_REGIST_STATISTIC_INFO_URL = baseUrl + 'server/query/query_regist_statistic_info';

/**
 * 根据广告ID查询车行广告登记列表 
 */
export const QUERY_SERVER_AD_REGIST_URL = baseUrl + 'server/query/query_server_ad_regist_list';

/**
 * 根据广告ID查询车行广告登记列表  
 */
export const QUERY_SERVER_AD_CHECK_URL = baseUrl + 'server/query/query_server_check_list';

//------------------------------------------V2----------------------------------------------

/**
 * 获取当日车行预约用户列表
 */
export const GET_TODAY_RESERVE_LIST = baseUrl + 'server/get/today_reserve_list';

/**
 * 查询预约详细信息
 */
export const QUERY_RESERVE_DETAIL_INFO = baseUrl + 'server/get/reserve_detail_info';

/**
 * 提交预约安装进程
 */
export const COMMIT_RESERVE_INSTALL = baseUrl + 'server/commit/reserve_install';

/**
 * 获取所有预约信息列表
 */
export const GET_ALL_RESERVE_LIST = baseUrl + 'server/get/all_reserve_list';

/**
 * 获取车行预约统计信息
 */
export const GET_RESERVE_STATISTICS = baseUrl + 'server/get/reserve_statistics';

/**
 * 获取车行用户信息
 */
export const GET_SERVER_USER_INFO = baseUrl + 'server/get/server_userinfo';

/**
 * 查询车行已安装广告列表
 */
export const GET_INSTALL_AD_LIST = baseUrl + 'server/get/install_ad_list';

/**
 * 查询车行单个广告安装详细列表
 */
export const INSTALL_AD_DETAIL_LIST = baseUrl + 'server/get/install_ad_detail_list';