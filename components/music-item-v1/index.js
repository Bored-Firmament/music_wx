// components/music-item-v1/index.js
import { playerStore } from "../../store/index"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      value: {}
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
    handleItemClick() {
      const id = this.data.itemInfo.id;
      wx.navigateTo({
        url: '/pages/music-player/index?id=' + id,
      })
      playerStore.dispatch("playSongAction", { id });
      this.triggerEvent('click');
    }
  }
})
