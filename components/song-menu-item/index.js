// components/song-menu-item/index.js
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
    handleMenuClick() {
      const id = this.data.itemInfo.id;
      wx.navigateTo({
        url: `/pages/detail-songs/index?id=${id}&type=menu`,
      })
    },
  }
})
