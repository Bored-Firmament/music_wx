// components/music-item-v2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    },
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
    handleItemClick() {
      wx.navigateTo({
        url: '/pages/music-player/index?id=' + this.data.itemInfo.id,
      })
    }
  }
})
