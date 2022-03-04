// components/music-item-v3/index.js
import { playerStore } from "../../store/index"

Component({
  properties: {
    itemInfo: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    songItemPlayClick() {
      const id = this.data.itemInfo.id;
      wx.navigateTo({
        url: '/pages/music-player/index?id=' + id,
      })
      playerStore.dispatch("playSongAction");
    },
    songItemDeleteClick() {
      this.triggerEvent('click');
    }
  }
})
