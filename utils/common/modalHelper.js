

/**
 * 只有确认按钮，没有自定义回调功能模态弹窗
 */
export function showWxModal(title, content, confirmText, showCancel){
  wx.showModal({
    title: title,
    content: content,
    confirmText: confirmText,
    showCancel: showCancel,
    confirmColor: '#ff555c'
  })
}

/**
 * 文字自定义，没有自定义回调功能模态弹窗
 */
export function showWxModalAllBtn(title, content, confirmText,cancelText, showCancel){
  wx.showModal({
    title: title,
    content: content,
    confirmText: confirmText,
    cancelText: cancelText,
    showCancel: showCancel,
    confirmColor: '#ff555c'
  })
}

/**
 * 不定义取消按钮文字，自定义回调功能模态弹窗
 */
export function showWxModalCallback(title, content, confirmText, showCancel, callbabck){
  wx.showModal({
    title: title,
    content: content,
    confirmText: confirmText,
    cancelText: cancelText,
    success: callbabck,
    showCancel: showCancel,
    confirmColor: '#ff555c'
  })
}

/**
 * 不定义取消按钮文字，自定义回调功能模态弹窗
 */
export function showWxModalCallbackNoCancel(title, content, confirmText, showCancel, callbabck){
  wx.showModal({
    title: title,
    content: content,
    confirmText: confirmText,
    success: callbabck,
    showCancel: showCancel,
    confirmColor: '#ff555c'
  })
}