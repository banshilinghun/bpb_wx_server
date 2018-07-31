TODO

待办事项
  1、根据类型判断上传图片数量

//隐藏使用指南
      {
        "pagePath": "pages/guide/guide",
        "iconPath": "image/icon_guide.png",
        "selectedIconPath": "image/icon_guide_HL.png",
        "text": "使用指南"
      },


      <view class='b-task-search' wx:if='{{ tabIndex != 2 }}'>
      <view class='b-search-container'>
        <view class='b-search-wrapper'>
          <image class='b-search-icon' src='../../image/search_icon.png'></image>
          <!-- 输入车牌号查询 -->
          <block wx:if='{{ usePlate }}'>
            <input id="carcode" name="carcode" disabled="{{disabled}}" class="track-input" maxlength='20' type="text" placeholder="请输入车牌号" value='{{textValue}}' bindtap="bindFocus" />
          </block>
          <!-- 输入手机号查询 -->
          <block wx:else>
            <input id="carPhone" name="carPhone" type='number' class="track-input" maxlength='20' type="text" placeholder="请输入手机号" value='{{textValue}}' />
          </block>
          <image class='b-search-clean' src='../../image/close-gray.png'></image>
        </view>
      </view>
      <view class='b-switch-btn' bindtap='handleSwitchSearch'>
        <image class='b-switch-icon' src='../../image/search-switch.png'></image>
        <view class='b-switch-text'>
          <text>{{ switchStr }}</text>
        </view>
      </view>
    </view>
      