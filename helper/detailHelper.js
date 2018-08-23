

let statusStrategy = {
  0: function(){
    return '已预约';
  },

  1: function(){
    return '已签到';
  },

  2: function(){
    return '已完成';
  }
}

/**
 * 预约状态
 */
export function getSubscribeStatus(status){
  return statusStrategy[status]();
}