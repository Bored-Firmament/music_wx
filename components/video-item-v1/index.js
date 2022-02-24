// components/video-item-v1/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      default: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleVideoItemClick(event) {
      const id = this.properties.itemInfo.id;
      wx.navigateTo({
        url: `/pages/detail-video/index?id=${id}`,
      })
    }
  }
})
